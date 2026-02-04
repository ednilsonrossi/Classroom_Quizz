from flask import render_template, redirect, url_for
from app.forms import Pagina_Insercao_Codigo
from flask_login import login_required
from app.blueprints.home import home

@home.route('/')
@login_required
def homepage():
    return render_template('home.html', title='Home')

@home.route('/criar')
@login_required
def create_quiz_form():
    return(render_template('create_quiz.html', title='Criar Quiz'))

@home.route('/codigo_sala', methods=['GET', 'POST'])
@login_required
def codigo_sala():
    form = Pagina_Insercao_Codigo()
    if form.validate_on_submit():
        return redirect(url_for('jogo.sala_espera'))

    return render_template('codigo.html', title='Código da sala', form=form)

