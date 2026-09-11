from flask import Blueprint, request, jsonify, current_app
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError
from app.models import Usuario
from app.repositories import user_repo, token_repo
from app.serializers import UserSchema
from app.utils.mail import  send_confirm_email, send_reset_email
from app.utils.db import db
from flask_jwt_extended import (jwt_required, 
                                create_access_token, 
                                create_refresh_token,
                                set_refresh_cookies,
                                set_access_cookies,
                                unset_jwt_cookies,
                                decode_token,
                                get_jwt_identity, 
                                get_jwt)

auth = Blueprint('auth', __name__)

@auth.get('/me')
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = user_repo.get_by_id(user_id)
    
    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 404

    user_data = UserSchema.model_validate(user)

    return jsonify({
        "user": user_data.model_dump(by_alias=False)
    }), 200

@auth.route("/check-email", methods=["GET"])
def check_email():
    email = request.args.get("email")
    if not email:
        return jsonify({"message": "Email não enviado"}), 400

    user = user_repo.get_by_email(email=email)
    return jsonify({"exists": bool(user)}), 200

@auth.route("/check-username", methods=["GET"])
def check_username():
    username = request.args.get("username")
    if not username:
        return jsonify({"message": "Username não enviado"}), 400

    user = user_repo.get_by_username(username=username)
    return jsonify({"exists": bool(user)}), 200

@auth.post('/register')
def register():
    data = request.get_json() or {}

    if not data:
        return jsonify({"error": "Requisição vazia"}), 400
    if not data.get('password'):
        return jsonify({'error': 'Senha é obrigatória'}), 400

    try:
        user_schema = UserSchema(**data)
    except ValidationError as e:
        return jsonify({
            "error": "Dados inválidos",
            "details": [
                {
                    "field": err["loc"][0] if err["loc"] else "geral",
                    "msg": err["msg"],
                    "code": err["type"]
                }
                for err in e.errors()
            ]
        }), 400

    if user_repo.get_by_email(user_schema.email):
        return jsonify({'error': 'E-mail já existente. Tente outro.'}), 409
    
    if user_repo.get_by_username(user_schema.username):
        return jsonify({'error': 'Nome de usuário já existente. Tente outro.'}), 409
    
    try:
        new_user = user_repo.create_user(user_schema, data.get('password'))
        db.session.flush()

        try:
            send_confirm_email(new_user)
            
        except Exception as e:
            current_app.logger.error(f"Erro ao enviar email: {e}")

        db.session.commit()
        return jsonify({"message": "Cadastro realizado. Verifique seu e-mail para confirmar a conta."}), 201
    
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Erro ao salvar no banco'}), 500

@auth.post('/confirm-email')
def confirm_email():
    data = request.get_json() or {}
    token = data.get('token')

    if not token:
        return jsonify({'error': 'Token é obrigatório.'}), 400
    
    user = Usuario.verify_confirmation_token(token=token)
    if not user:
        return jsonify({'error':"Token inválido ou expirado"}), 400
    
    if token_repo.is_token_used(token, purpose='confirm_email'):
        return jsonify({'error': 'Token já utilizado.'}), 400
    
    if user.confirm_user:
        return jsonify({'message': 'Usuário já confirmado'}), 400
    
    try:
        user_repo.confirm_user_account(user)
        token_repo.mark_token_as_used(token, 'confirm_email', user.id)
        db.session.commit()

        return jsonify({'message': 'E-mail confirmado com sucesso!'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erro ao atualizar status no banco'}), 500 
    
@auth.post('/resend-confirmation')
def resend_confirmation():
    data = request.get_json() or {}
    email = data.get('email')

    if not email:
        return jsonify({'error': 'E-mail é obrigatório.'}), 400
    
    user = user_repo.get_by_email(email=email)

    if user and not user.confirm_user:
        try:
            send_confirm_email(user)
        except Exception as e:
            return jsonify({'error': 'Erro ao enviar e-mail.'}), 500
        
    return jsonify({'message': 'Se o e-mail existir e não estiver confirmado, um novo link foi enviado.'}), 200
        
@auth.post('/login')
def login():
    data = request.get_json() or {}

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Credenciais incompletas"}), 400

    user = user_repo.get_by_email(email=data.get('email'))

    if user and user.conversor_pwd(data.get('password')):

         #Para debug é interessante, porém para casos reais é bom colocar uma mensagem genérica.
        if not user.confirm_user:
            return jsonify({
                'message': 'E-mail não confirmado. Verifique sua caixa de entrada.',
                'error_code': 'EMAIL_NOT_CONFIRMED'}), 403
                
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        user_data = UserSchema.model_validate(user)

        response = jsonify(
            {
                "message": "Login realizado com sucesso",
                "user": user_data.model_dump(by_alias=False),
                'access_token': access_token,
            })
        
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token) #httpOnly
        return response, 200

    else:
        return jsonify({'message': 'Credenciais inválidas.'}), 401

@auth.post('/refresh')
@jwt_required(refresh=True, locations=['cookies'])
def refresh_access():
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)

    response = jsonify({'access_token':new_access_token})
    set_access_cookies(response, new_access_token)

    return response, 200

@auth.post('/logout')
@jwt_required(verify_type=False, optional=True)
def logout():
    jwt = get_jwt()
    if jwt:
        jti = jwt['jti']
        identity = get_jwt_identity()

        token_repo.revoke_token(jti=jti, user_id=identity)
        db.session.commit()


    refresh_cookie = request.cookies.get('refresh_token_cookie')
    if refresh_cookie:
        try:
            refresh_jwt = decode_token(refresh_cookie)
            refresh_jti = refresh_jwt['jti']
            refresh_identity = int(refresh_jwt['sub'])
            
            token_repo.revoke_token(jti=refresh_jti, user_id=refresh_identity)
        except Exception as e:
            current_app.logger.warning(f"Aviso ao decodificar refresh no logout: {e}")

    db.session.commit()
    
    response = jsonify({'message': 'Logout efetuado com sucesso.'})
    unset_jwt_cookies(response) #remove os cookies
    return response, 200

@auth.post('/forgot-password')
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email')

    if not email:
        return jsonify({"error": "E-mail obrigatório"}), 400

    user = user_repo.get_by_email(email=email)

    if user:
        try:
            send_reset_email(user=user)
        except Exception as e:
            return jsonify({'error': 'Erro ao enviar e-mail.'}), 500

    return jsonify({'message':'Se o e-mail existir, as instruções foram enviadas.'}), 200

@auth.post('/reset-password')
def reset_password():
    data = request.get_json() or {}
    token = data.get('token')
    new_password = data.get('new_password')

    if not token or not new_password or len(new_password) < 6:
        return jsonify({'error': 'Token e nova senha (min 6 caracteres) são obrigatórios.'}), 400
    
    user = Usuario.verify_reset_token(token=token)
    if not user:
        return jsonify({"error": "Token inválido ou expirado."}), 400
    
    if token_repo.is_token_used(token, purpose='reset_password'):
        return jsonify({'error': 'Token já utilizado.'}), 400
    
    try:
        user_repo.update_password(user, new_password)
        token_repo.mark_token_as_used(token, 'reset_password', user.id)
        db.session.commit()
        return jsonify({'message': 'Senha alterada com sucesso!'}), 200
    
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Erro ao alterar a senha'}), 500