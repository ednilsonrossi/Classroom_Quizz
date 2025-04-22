from flask import Blueprint, render_template, redirect, url_for, flash
from forms import (Login_Formulario, RequestResetForm, ResetPasswordForm)
from models.users import Users
from utils.db import db
from utils.mail import send_reset_email
from flask_login import login_user, logout_user, current_user

login = Blueprint('login', __name__)

@login.route('/', methods=['GET', 'POST'])
def login_usuario():
    if current_user.is_authenticated:
        return redirect(url_for('home.homepage'))

    form = Login_Formulario()
    if form.validate_on_submit():
        usuario_logado = Users.query.filter_by(email = form.email.data).first()
        if usuario_logado and usuario_logado.conversor_pwd(senha_descripto=form.senha.data):
            login_user(usuario_logado)
            flash(f'Sucesso! Seja bem-vindo {usuario_logado.nome}', category='success')
            return redirect(url_for('home.homepage'))
        else:
            flash('Usuário ou senha inválidos!', category='danger')
    return render_template('form/login.html', title='Login', form= form)

@login.route('/logout')
def logout_usuario():
    logout_user()
    flash(f'Você fez o logout!', category='info')
    return redirect(url_for('init.home'))

@login.route('/reset_password', methods=['GET', 'POST'])
def reset_request():
    if current_user.is_authenticated:
        return redirect(url_for('home.homepage'))
    
    form = RequestResetForm()
    if form.validate_on_submit():
        user = Users.query.filter_by(email=form.email.data).first()
        send_reset_email(user)
        flash('Um email foi enviado com as instruções. Caso não encontre, verifique a caixa de SPAM', 'warning')
        return redirect(url_for('login.login_usuario'))
    return render_template('form/reset_request.html', title='Redefinição de Senha', form=form)

@login.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_token(token):
    if current_user.is_authenticated:
        return redirect(url_for('home.homepage'))
    
    user = Users.verify_reset_token(token)
    if user is None:
        flash('Este token expirou ou é inválido.', 'warning')
        return redirect(url_for('login.reset_request'))

    form = ResetPasswordForm()

    if form.validate_on_submit():
        senha = form.senha.data
        user.cripto_pwd = senha
        db.session.commit()
        
        flash(f'Sua senha foi alterada com sucesso!', 'success' )
        return redirect(url_for('login.login_usuario'))
    return render_template('form/reset_token.html', title='Redefinição de Senha', form=form)
