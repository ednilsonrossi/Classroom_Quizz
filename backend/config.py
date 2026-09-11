import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config():
    #Secret Keys
    SECRET_KEY = os.environ['SECRET_KEY']
    JWT_SECRET_KEY = os.environ['JWT_SECRET_KEY']

    #Database
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    CORS_ORIGINS = []
    
    #URLs base do sistema (API e Frontend) - variam conforme a conexão de rede
    API_URL = os.environ['API_URL']
    FRONTEND_URL = os.environ['FRONTEND_URL']

    #JWT
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=10)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)
    JWT_TOKEN_LOCATION = ["cookies", "headers"]
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_SAMESITE = 'Lax'
    JWT_COOKIE_PATH = "/"

    #E-mail
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True #Ações do BD no terminal

    SESSION_COOKIE_SECURE = False
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_CSRF_IN_COOKIES = False
    

    CORS_ORIGINS = [
        Config.FRONTEND_URL, 
        'http://localhost:3000', 
        'http://127.0.0.1:3000'
    ]

class TestingConfig(Config):
    TESTING = True

    JWT_COOKIE_SECURE = False
    JWT_COOKIE_CSRF_PROTECT = False

class ProductionConfig(Config):
    DEBUG = False

    JWT_COOKIE_SECURE = True #Só envia via HTTPS
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_CSRF_IN_COOKIES = True

    CORS_ORIGINS = [Config.FRONTEND_URL]

config_dict = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}








