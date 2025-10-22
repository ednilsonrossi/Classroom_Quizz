from flask import render_template, redirect, url_for
from forms import Pagina_Insercao_Codigo
from . import public

@public.route('/')
def home():
    form = Pagina_Insercao_Codigo()
    if form.validate_on_submit():
        return redirect(url_for(''))
    return render_template('index.html', title='Início', form=form)