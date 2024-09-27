from flask import Blueprint, render_template, redirect, url_for, flash
from forms import Login_Formulario
from models.users import Users
from flask_login import login_user, logout_user

login = Blueprint('login', __name__)

@login.route('/', methods=['GET', 'POST'])
def login_usuario():
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
