from flask import Blueprint, render_template, redirect, url_for
from forms import Pagina_Insercao_Codigo, Criacao_Quiz
from flask_login import login_required


home = Blueprint('home', __name__)

@home.route('/')
@login_required
def homepage():
    return render_template('home.html', title='Home')

@home.route('/criar_quiz')
@login_required
def criar_quiz():
    form = Criacao_Quiz()
    if form.validate_on_submit():
        
        return redirect(url_for('home.conteudo'))

    return(render_template('criar_quiz.html', form=form))

@home.route('/codigo_sala', methods=['GET', 'POST'])
@login_required
def codigo_sala():
    form = Pagina_Insercao_Codigo()
    if form.validate_on_submit():
        return redirect(url_for('jogo.sala_espera'))

    return render_template('codigo.html', title='Código da sala', form=form)

