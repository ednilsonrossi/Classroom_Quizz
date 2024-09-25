from flask import Blueprint, render_template, redirect, url_for
from forms import Pagina_Insercao_Codigo
from flask_login import login_required


home = Blueprint('home', __name__)

@home.route('/teacher')
@login_required
def teacher_home():
    return render_template('home_teacher.html', title='Home')

@home.route('/student')
@login_required
def student_home():
    return render_template('home_student.html', title='Home')

@home.route('/codigo_sala', methods=['GET', 'POST'])
@login_required
def codigo_sala():
    form = Pagina_Insercao_Codigo()
    if form.validate_on_submit():
        return redirect(url_for('jogo.sala_espera'))

    return render_template('codigo.html', title='Código da sala', form=form)