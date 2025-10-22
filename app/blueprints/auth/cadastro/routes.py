from flask import Blueprint, render_template, flash, redirect, url_for, session, request
from flask_login import login_user
from blueprints.auth.forms import (Cadastro_Formulario_Pagina1, Cadastro_Formulario_Pagina2,
                    Cadastro_Formulario_Pagina3, Cadastro_Formulario_Pagina4)
from repositories import user_repo
from utils.mail import send_confirm_email
from models import Usuario
from datetime import datetime
from . import cadastro

@cadastro.route('/', methods=['GET', 'POST'])
def cadastro_01():
    form = Cadastro_Formulario_Pagina1()

    if request.method == 'GET' and session.get('email') is not None:
        form.email.data = session['email']

    if form.validate_on_submit():
        session['email'] = form.email.data
        session['senha'] = form.senha.data
        
        return redirect(url_for('cadastro.cadastro_02'))
    
    return render_template('cadastro_01.html', title='Cadastre-se', form= form)

@cadastro.route('/ocupacao', methods=['GET', 'POST'])
def cadastro_02():

    if ('email' not in session) or ('senha' not in session):
        flash(f'Por favor preencha os dados!', 'warning' )
        return redirect(url_for('cadastro.cadastro_01'))

    form = Cadastro_Formulario_Pagina2()

    if request.method == 'GET' and session.get('tipo_conta') is not None:
        form.tipo_conta.data = session['tipo_conta']

    if request.method == 'POST':
        selected_value = request.form.get('tipo_conta')
        if selected_value:
             form.tipo_conta.data = selected_value

    if form.validate_on_submit():
        session['tipo_conta'] = form.tipo_conta.data
        return redirect(url_for('cadastro.cadastro_03'))

    return render_template('cadastro_02.html', title='Cadastre-se', form= form)

@cadastro.route('/ocupacao/idade', methods=['GET', 'POST'])
def cadastro_03():

    if ('email' not in session) or ('senha' not in session) or ('tipo_conta' not in session):
        flash(f'Por favor preencha os dados!', 'warning' )
        return redirect(url_for('cadastro.cadastro_01'))
     
    tipo_conta_selecionada = session.get('tipo_conta')
    form = Cadastro_Formulario_Pagina3()
    form.tipo_conta_data = tipo_conta_selecionada #criando um novo atributo na classe para o validator saber o tipo de conta.

    if request.method == 'GET' and session.get('nascimento') is not None:
        form.nascimento.data = datetime.strptime(session['nascimento'], '%a, %d %b %Y %H:%M:%S GMT').date()

    if form.validate_on_submit():
        session['nascimento'] = form.nascimento.data
        return redirect(url_for('cadastro.cadastro_04'))
    return render_template('cadastro_03.html', title='Cadastre-se', form= form)

@cadastro.route('/ocupacao/idade/info', methods=['GET', 'POST'])
def cadastro_04():

    if ('email' not in session) or ('senha' not in session) or ('tipo_conta' not in session) or ('nascimento' not in session):
        flash(f'Por favor preencha os dados!', 'warning' )
        return redirect(url_for('cadastro.cadastro_01'))
    
    form = Cadastro_Formulario_Pagina4()

    if request.method == 'GET':
        if session.get('nome_completo') is not None:
            form.nome.data = session['nome_completo']
            
        if session.get('username') is not None:
            form.usuario.data = session['username']

    if form.validate_on_submit():
        session['nome_completo'] = form.nome.data
        session['username'] = form.usuario.data

        dados_usuario = {
            'email': session.get('email'),
            'senha': session.get('senha'),
            'tipo_conta': session.get('tipo_conta'),
            'nome_completo': session.get('nome_completo'),
            'username': session.get('username'),
            'nascimento': session.get('nascimento')
        }
        try:
            user = user_repo.create_user(user_data=dados_usuario)

            session.clear() #Limpa toda sessão
            session['email'] = user.email #Armazenar apenas o email na sessão

            send_confirm_email(user) #Chama a função de enviar o email
            flash(f'Um email foi enviado para confirmação. Caso não encontre, verifique a caixa de SPAM', 'warning' )
            return redirect(url_for('cadastro.confirm_email_request'))

        except Exception as e:
            flash('Ocorreu um erro ao finalizar seu cadastro. Tente novamente.', 'danger')
            print(e)
            return redirect(url_for('cadastro.cadastro_01'))
            
    
    return render_template('cadastro_04.html', title='Cadastre-se', form= form)

@cadastro.route('/confirmar_email')
def confirm_email_request():
    return render_template('confirm_email_request.html', title='Confirmação de E-mail')

@cadastro.route('/confirmar_email/<token>')
def confirm_token(token):

    user = Usuario.verify_confirmation_token(token)

    if not user:
        flash('O link de confirmação é inválido ou expirou', 'danger')
        return redirect(url_for('cadastro.resent_confirm'))
    
    if user.confirm_user:
        flash('E-mail já confirmado. Faça login.', 'info')
        return redirect(url_for('login.login_usuario'))
    
    #Confirma o email e atualiza no banco como verdadeiro
    user_repo.confirm_user_account(usuario=user)
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
    
    user = user_repo.get_by_email(email=email)

    if not user:
        flash('Usuário não encontrado', 'danger')
        return redirect(url_for('cadastro.cadastro_01'))
    
    if user.confirm_user:
        flash('Este e-mail já foi confirmado. Faça login.', 'info')
        return redirect(url_for('login.login_usuario'))
    
    send_confirm_email(user)
    flash('E-mail de confirmação reenviado com sucesso.', 'success')
    return redirect(url_for('cadastro.confirm_email_request'))


