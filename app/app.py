from flask import Flask, render_template, flash, redirect, url_for
from forms import Cadastro_Formulario_Pagina1, Cadastro_Formulario_Pagina2, Cadastro_Formulario_Pagina3, Cadastro_Formulario_Pagina4, Login_Formulario, Pagina_Insercao_Codigo

app = Flask(__name__)

app.config['SECRET_KEY'] = 'c647d91a97a43c55737237d104d621f6b3ef8b2f'

@app.route('/')
def home():
    form = Pagina_Insercao_Codigo()
    if form.validate_on_submit():
        return redirect(url_for(''))
    return render_template('index.html', title='Home', form=form)

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    form = Cadastro_Formulario_Pagina1()
    #Irá mostrar se o cadastro foi valido (validate_on_submit)- As mensagens flash fazem jus ao nome, se recarregar a página desaparecem
    if form.validate_on_submit():
        flash(f'Conta criada por {form.email.data}')
        #if form.xxxxxx.xxxx == 'professor' - redirecione para a area do professor, uma ideia plauzivel
        return redirect(url_for('cadastro_02'))
        
    return render_template('form/cadastro_01.html', title='Cadastre-se', form= form)

@app.route('/cadastro/ocupacao', methods=['GET', 'POST'])
def cadastro_02():
    form = Cadastro_Formulario_Pagina2()
    if form.validate_on_submit():
        #if form.xxxxxx.xxxx == 'professor' - redirecione para a area do professor, uma ideia plauzivel
        return redirect(url_for('cadastro_03'))
        
    return render_template('form/cadastro_02.html', title='Cadastre-se', form= form)

@app.route('/cadastro/ocupacao/idade', methods=['GET', 'POST'])
def cadastro_03():
    form = Cadastro_Formulario_Pagina3()
    if form.validate_on_submit():
        return redirect(url_for('cadastro_04'))
    return render_template('form/cadastro_03.html', title='Cadastre-se', form= form)

@app.route('/cadastro/ocupacao/idade/info', methods=['GET', 'POST'])
def cadastro_04():
    form = Cadastro_Formulario_Pagina4()
    if form.validate_on_submit():
        return redirect(url_for('home'))   
    return render_template('form/cadastro_04.html', title='Cadastre-se', form= form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = Login_Formulario()
    if form.validate_on_submit():
        return redirect(url_for('home'))
    return render_template('form/login.html', title='Login', form= form)

