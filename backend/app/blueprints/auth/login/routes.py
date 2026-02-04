from flask import render_template, redirect, url_for, flash
from flask_login import login_user, logout_user, current_user
from app.blueprints.auth.forms import (Login_Formulario, RequestResetForm, ResetPasswordForm)
from app.repositories import user_repo
from app.models import Usuario
from app.utils.mail import send_reset_email
from app.utils.db import db
from app.blueprints.auth.login import login

@login.route('/', methods=['GET', 'POST'])
def login_usuario():
    if current_user.is_authenticated:
        return redirect(url_for('home.homepage'))

    form = Login_Formulario()
    if form.validate_on_submit():
        usuario_logado = user_repo.get_by_email(form.email.data)

        if usuario_logado and usuario_logado.conversor_pwd(senha_descripto=form.senha.data):

            if not usuario_logado.confirm_user:
                flash('Por favor, confirme seu e-mail antes de fazer login.', 'warning')
                return redirect(url_for('cadastro.confirm_email_request'))
         
            login_user(usuario_logado)
            flash(f'Sucesso! Seja bem-vindo {usuario_logado.nome_completo}', category='success')
            return redirect(url_for('home.homepage'))
        else:
            flash('Usuário ou senha inválidos!', category='danger')
    return render_template('login.html', title='Login', form=form)

@login.route('/logout')
def logout_usuario():
    logout_user()
    return redirect(url_for('public.home'))

@login.route('/reset_password', methods=['GET', 'POST'])
def reset_request():
    if current_user.is_authenticated:
        return redirect(url_for('home.homepage'))
    
    form = RequestResetForm()
    if form.validate_on_submit():

        user = user_repo.get_by_email(form.email.data)

        if user:
            send_reset_email(user)
            flash('Um email foi enviado com as instruções. Caso não encontre, verifique a caixa de SPAM', 'warning')
        else:
            flash('Se o e-mail existir, um link de redefinição foi enviado.', 'warning')

        return redirect(url_for('login.login_usuario'))
    return render_template('reset_request.html', title='Redefinição de Senha', form=form)

@login.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_token(token):
    if current_user.is_authenticated:
        return redirect(url_for('home.homepage'))
    
    user = Usuario.verify_reset_token(token)
    if user is None:
        flash('Este token expirou ou é inválido.', 'warning')
        return redirect(url_for('login.reset_request'))

    form = ResetPasswordForm()

    if form.validate_on_submit():
        user_repo.update_password(user=user, new_password=form.senha.data)
        
        flash(f'Sua senha foi alterada com sucesso!', 'success' )
        return redirect(url_for('login.login_usuario'))
    return render_template('reset_token.html', title='Redefinição de Senha', form=form)
