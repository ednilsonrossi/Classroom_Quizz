from flask import Blueprint, render_template, redirect, url_for
from forms import Login_Formulario

login = Blueprint('login', __name__)

@login.route('/', methods=['GET', 'POST'])
def login_user():
    form = Login_Formulario()
    if form.validate_on_submit():
        return redirect(url_for('home.teacher_home'))
    return render_template('form/login.html', title='Login', form= form)