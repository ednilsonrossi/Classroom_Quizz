from flask import Flask, render_template, flash, redirect, url_for
import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from routes.cadastro import cadastro
from routes.home import init
from routes.login import login
from routes.home_teacher import home_teacher
from utils.db import db

load_dotenv()
app = Flask(__name__)
#Chaves de configuração armazenadas em um arquivo especial .env
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#Inicializando o banco de dados
db.init_app(app)
migrate = Migrate(app, db)

#Liga os arquivos de routes ao programa principal, colocando um prefixo na url
app.register_blueprint(init)
app.register_blueprint(cadastro, url_prefix='/cadastro')
app.register_blueprint(login, url_prefix='/login')
app.register_blueprint(home_teacher, url_prefix='/home')
