from flask import Blueprint, render_template, flash, redirect, url_for, session
from datetime import datetime, timezone
from forms import (Cadastro_Formulario_Pagina1, Cadastro_Formulario_Pagina2,
                    Cadastro_Formulario_Pagina3, Cadastro_Formulario_Pagina4)
from models.users import Users
from utils.db import db
from utils.mail import send_confirm_email
from flask_login import login_user

cadastro = Blueprint('cadastro', __name__)

@cadastro.route('/', methods=['GET', 'POST'])
def cadastro_01():
    form = Cadastro_Formulario_Pagina1()
    if form.validate_on_submit():
        session['email'] = form.email.data
        session['senha'] = form.senha.data
        
        return redirect(url_for('cadastro.cadastro_02'))
    
    return render_template('form/cadastro_01.html', title='Cadastre-se', form= form)

@cadastro.route('/ocupacao', methods=['GET', 'POST'])
def cadastro_02():

    if ('email' not in session) or ('senha' not in session):
        flash(f'Por favor preencha os dados!', 'warning' )
        return redirect(url_for('cadastro.cadastro_01'))

    form = Cadastro_Formulario_Pagina2()
    if form.validate_on_submit():
        session['tipo_conta'] = form.tipo_conta.data

        if form.tipo_conta.data == 'professor':
            return redirect(url_for('cadastro.cadastro_04'))
        else:
            return redirect(url_for('cadastro.cadastro_03'))
        
    return render_template('form/cadastro_02.html', title='Cadastre-se', form= form)

@cadastro.route('/ocupacao/idade', methods=['GET', 'POST'])
def cadastro_03():

    if ('email' not in session) or ('senha' not in session) or ('tipo_conta' not in session):
        flash(f'Por favor preencha os dados!', 'warning' )
        return redirect(url_for('cadastro.cadastro_01'))
     
    form = Cadastro_Formulario_Pagina3()
    if form.validate_on_submit():
        session['nascimento'] = form.nascimento.data
        print(form.nascimento.data)
        return redirect(url_for('cadastro.cadastro_04'))
    return render_template('form/cadastro_03.html', title='Cadastre-se', form= form)

@cadastro.route('/ocupacao/idade/info', methods=['GET', 'POST'])
def cadastro_04():

    if session.get('tipo_conta') == 'aluno':
        if ('email' not in session) or ('senha' not in session) or ('tipo_conta' not in session) or ('nascimento' not in session):
            flash(f'Por favor preencha os dados!', 'warning' )
            return redirect(url_for('cadastro.cadastro_01'))
    
    form = Cadastro_Formulario_Pagina4()
    if form.validate_on_submit():
        dados_usuario = {
            'email': session.get('email'),
            'senha': session.get('senha'),
            'tipo_conta': session.get('tipo_conta'),
            'nome': form.nome.data,
            'usuario': form.usuario.data,
            'nascimento': session.get('nascimento'),
            'created_at': datetime.now(timezone.utc)
        }
        #Esta parte irá transformar o dado nascimento de String em um formato de Date
        dados_usuario['nascimento'] = datetime.strptime(dados_usuario['nascimento'], "%a, %d %b %Y %H:%M:%S %Z")if dados_usuario['nascimento'] else None
        #Irá ajustar o objeto datetime em uma string no formato desejado no caso ano-mês-dia.
        dados_usuario['nascimento'] = datetime.strftime(dados_usuario['nascimento'], "%Y-%m-%d")if dados_usuario['nascimento'] else None
        
        user = Users(**dados_usuario)
        db.session.add(user)
        db.session.commit()

        session.clear() #Limpa toda sessão
        session['email'] = user.email #Armazenar apenas o email na sessão
        
        send_confirm_email(user) #Chama a função de enviar o email
        flash(f'Um email foi enviado para confirmação. Caso não encontre, verifique a caixa de SPAM', 'warning' )
        return redirect(url_for('cadastro.confirm_email_request'))
    
    return render_template('form/cadastro_04.html', title='Cadastre-se', form= form)

@cadastro.route('/confirmar_email')
def confirm_email_request():
    return render_template('form/confirm_email_request.html', title='Confirmação de E-mail')

@cadastro.route('/confirmar_email/<token>')
def confirm_token(token):

    user = Users.verify_confirmation_token(token)

    if not user:
        flash('O link de confirmação é inválido ou expirou', 'danger')
        return redirect(url_for('cadastro.resent_confirm'))
    
    if user.confirm_user:
        flash('E-mail já confirmado. Faça login.', 'info')
        return redirect(url_for('login.login_usuario'))
    
    #Confirma o email e atualiza no banco como verdadeiro
    user.confirm_user = True
    db.session.commit()

    session.clear()

    flash('E-mail confirmado com sucesso! Você já pode acessar sua conta.', 'success')
    login_user(user)
    # return redirect(url_for('login.login'))
    return redirect(url_for('home.homepage'))
 
@cadastro.route('/reenviar_email/', methods=['GET', 'POST'])
def resent_confirm():
    email = session.get('email')
    
    if not email:
        flash('Sessão expirada ou email não encontrado.', 'warning')
        return redirect(url_for('cadastro.cadastro_01'))
    
    user = Users.query.filter_by(email=email).first()

    if not user:
        flash('Usuário não encontrado', 'danger')
        return redirect(url_for('cadastro.cadastro_01'))
    
    if user.confirm_user:
        flash('Este e-mail já foi confirmado. Faça login.', 'info')
        return redirect(url_for('login.login_usuario'))
    
    send_confirm_email(user)
    flash('E-mail de confirmação reenviado com sucesso.', 'success')
    return redirect(url_for('cadastro.confirm_email_request'))


