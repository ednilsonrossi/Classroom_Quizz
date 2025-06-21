from flask import Blueprint, render_template, flash, redirect, url_for, session
from datetime import datetime, timezone
from forms import (Cadastro_Formulario_Pagina1, Cadastro_Formulario_Pagina2,
                    Cadastro_Formulario_Pagina3, Cadastro_Formulario_Pagina4)
from models.users import Users
from utils.db import db
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
        session.clear()
        
        login_user(user)
        flash(f'Conta criada com sucesso para {form.nome.data}!', 'success' )
        return redirect(url_for('home.homepage')) 

            
    return render_template('form/cadastro_04.html', title='Cadastre-se', form= form)