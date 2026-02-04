from flask import Flask
from config import config_dict
from flask_migrate import Migrate
from app.utils.extensions import bcrypt, login_manager
from app.utils.db import db

def create_app(config_name='default'):
    app = Flask(__name__)

    app.config.from_object(config_dict[config_name]) # por que nao from_pyfile como na documentação?

    #Inicializando o banco de dados
    db.init_app(app)
    migrate = Migrate(app, db)

    #Inicializando as extenções
    bcrypt.init_app(app)
    login_manager.init_app(app)

    #Identificação da página de login, caso não esteja logado será redirecionado a pagina de login
    login_manager.login_view = 'login.login_usuario'
    login_manager.login_message = 'Por favor, realize o login!'
    login_manager.login_message_category = 'danger'

    from app.blueprints.auth.cadastro import cadastro
    from app.blueprints.auth.login import login
    from app.blueprints.public import public
    from app.blueprints.home import home
    from app.blueprints.quiz import quiz

    #Liga os arquivos de routes ao programa principal, colocando um prefixo na url
    app.register_blueprint(public)
    app.register_blueprint(cadastro, url_prefix='/cadastro')
    app.register_blueprint(login, url_prefix='/login')
    app.register_blueprint(home, url_prefix='/home')
    app.register_blueprint(quiz, url_prefix='/api/quizzes')

    return app









