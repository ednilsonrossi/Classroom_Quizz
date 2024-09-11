from flask import Blueprint, render_template, flash, redirect, url_for, session
from forms import Cadastro_Formulario_Pagina1, Cadastro_Formulario_Pagina2, Cadastro_Formulario_Pagina3, Cadastro_Formulario_Pagina4
from models.users import Users
from utils.db import db

cadastro = Blueprint('cadastro', __name__)

@cadastro.route('/', methods=['GET', 'POST'])
def cadastro_01():
    form = Cadastro_Formulario_Pagina1()
    if form.validate_on_submit():
        session['email'] = form.email.data
        session['senha'] = form.senha.data
        
        flash(f'Conta criada por {form.email.data}')
        return redirect(url_for('cadastro.cadastro_02'))
    
    return render_template('form/cadastro_01.html', title='Cadastre-se', form= form)

@cadastro.route('/ocupacao', methods=['GET', 'POST'])
def cadastro_02():
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
    form = Cadastro_Formulario_Pagina3()
    if form.validate_on_submit():
        session['nascimento'] = form.nascimento.data

        return redirect(url_for('cadastro.cadastro_04'))
    return render_template('form/cadastro_03.html', title='Cadastre-se', form= form)

@cadastro.route('/ocupacao/idade/info', methods=['GET', 'POST'])
def cadastro_04():
    form = Cadastro_Formulario_Pagina4()
    if form.validate_on_submit():
        dados_usuario = {
            'email': session.get('email'),
            'senha': session.get('senha'),
            'tipo_conta': session.get('tipo_conta'),
            'nome': form.nome.data,
            'usuario': form.usuario.data,
            'nascimento': session.get('nascimento')
        }

        user = Users(**dados_usuario)
        db.session.add(user)
        db.session.commit()
        session.clear()
        
        return redirect(url_for('init.home'))   
    return render_template('form/cadastro_04.html', title='Cadastre-se', form= form)