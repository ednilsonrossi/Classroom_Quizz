from flask import jsonify
from app.utils.extensions import jwt
from app.repositories import token_repo, user_repo

# Load User
@jwt.user_lookup_loader
def user_lookup_callback(jwt_headers, jwt_payload):
    identity = int(jwt_payload['sub'])
    user = user_repo.get_by_id(identity)

    return user

# Additional Claims
@jwt.additional_claims_loader
def make_additional_claims(identity):
    user = user_repo.get_by_id(int(identity))
    if not user:
        return {'username': None, 'is_admin': False}
        
    is_admin = (user.email == 'samuelfernandesfilho2007@gmail.com')
    return {'username': user.username, 'is_admin': is_admin}

#Fresh Token
@jwt.needs_fresh_token_loader
def token_not_fresh_callback(jwt_header, jwt_payload):
    return jsonify({
        "error": "fresh_token_required",
        "message": "Token precisa ser renovado."
    }), 401

# Revoked token check
@jwt.token_in_blocklist_loader
def token_in_blocklist_callback(jwt_headers, jwt_payload):
    jti = jwt_payload["jti"]
    return token_repo.is_revoked(jti=jti)

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return jsonify({
        "error": "token_revoked",
        "message": "Token foi revogado."
    }), 401

# JWT Error Handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": "token_expired", "message": "O token expirou."}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({"error": "invalid_token", "message": "Assinatura do token inválida."}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({"error": "authorization_required", "message": "Token não fornecido."}), 401

