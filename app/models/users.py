from itsdangerous import URLSafeTimedSerializer as Serializer
from flask import current_app #Usado para pegar os dados de onde a aplicação flask foi instanciada, no caso app.py
from utils.db import db
from utils.extensions import bcrypt, login_manager
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))

class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(256), unique=True, nullable=False)
    senha = db.Column(db.String(128), nullable=False)
    tipo_conta = db.Column(db.String(15), nullable=False)
    nome = db.Column(db.String(60), nullable=False)
    usuario = db.Column(db.String(26), unique=True, nullable=False)
    nascimento = db.Column(db.Date, nullable=True)

    #Relacionamentos com as outras tabelas
    quiz = db.relationship('Quiz', backref='users', lazy=True)
    bancoQuestoes = db.relationship('BancoQuestoes', backref='bq_users', lazy=True)
    relatorios = db.relationship('RelatorioGeral', backref='relatorio_users', lazy=True)
    
    def get_reset_token(self, expire_sec=1800):
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps({'user_id': self.id})
    
    @staticmethod # não precisa de um objeto (instância). Útil para funções relacionadas à classe, mas que não usam 'self'. Pertence à classe, mas não depende de nenhuma instância específica dela.
    def verify_reset_token(token, expires_sec=1800):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
             user_id = s.loads(token, max_age=expires_sec)['user_id']
        except:
            return None
        return Users.query.get(user_id)
        
    @property
    def cripto_pwd(self):
        return self.senha
    
    @cripto_pwd.setter
    def cripto_pwd(self, senha_texto):
        self.senha = bcrypt.generate_password_hash(senha_texto).decode('utf-8')

    def conversor_pwd(self, senha_descripto):
        return bcrypt.check_password_hash(self.senha, senha_descripto)

    def __init__(self, email, senha, tipo_conta, nome, usuario, nascimento):
        self.email = email
        self.cripto_pwd = senha
        self.tipo_conta = tipo_conta
        self.nome = nome
        self.usuario = usuario
        self.nascimento = nascimento