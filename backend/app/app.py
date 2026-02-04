# from flask import Flask, render_template, session, flash, redirect, url_for, request
# import os
# from dotenv import load_dotenv
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from utils.extensions import bcrypt, login_manager
# from utils.dump import gerar_dump_usuarios
# from blueprints.auth.cadastro import cadastro
# from blueprints.auth.login import login
# from blueprints.public import public
# from blueprints.home import home
# from blueprints.quiz import quiz
# from utils.db import db

# load_dotenv()
# app = Flask(__name__)
# #Chaves de configuração armazenadas em um arquivo especial .env
# app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
# app.config["SQLALCHEMY_DATABASE_URI"] = os.environ['DATABASE_URL']
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER')
# app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT'))
# app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
# app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

# #Inicializando o banco de dados
# db.init_app(app)
# migrate = Migrate(app, db)

# from models import Usuario, TipoConta, Quiz, Questao, TipoQuestao, Alternativa

# #Inicializando as extenções
# bcrypt.init_app(app)
# login_manager.init_app(app)

# #Identificação da página de login, caso não esteja logado será redirecionado a pagina de login
# login_manager.login_view = 'login.login_usuario'
# login_manager.login_message = 'Por favor, realize o login!'
# login_manager.login_message_category = 'danger'

# #Liga os arquivos de routes ao programa principal, colocando um prefixo na url
# app.register_blueprint(public)
# app.register_blueprint(cadastro, url_prefix='/cadastro')
# app.register_blueprint(login, url_prefix='/login')
# app.register_blueprint(home, url_prefix='/home')
# app.register_blueprint(quiz, url_prefix='/api/quizzes')

# #backup do banco de dados
# @app.route('/gerar-dump', methods=['GET'])
# def gerar_dump():
#     gerar_dump_usuarios('../backups')
#     return "Dump gerado com sucesso!"

# @app.route('/limpar-sessao')
# def limpar_sessao():
#     session.clear()
#     flash('Sessão de cadastro limpa. Você pode começar de novo.', 'info')
#     return redirect(url_for('cadastro.cadastro_01'))