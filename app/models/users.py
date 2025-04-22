from itsdangerous import URLSafeTimedSerializer
from datetime import datetime, timezone
from flask import current_app #Usado para pegar os dados de onde a aplicação flask foi instanciada, no caso app.py
from utils.db import db
from utils.extensions import bcrypt, login_manager
from flask_login import UserMixin
import pytz

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
    # Mostra em que horário o último token foi enviado
    token_enviado_em = db.Column(db.DateTime, nullable=True)

    #Relacionamentos com as outras tabelas
    quiz = db.relationship('Quiz', backref='users', lazy=True)
    bancoQuestoes = db.relationship('BancoQuestoes', backref='bq_users', lazy=True)
    relatorios = db.relationship('RelatorioGeral', backref='relatorio_users', lazy=True)
    
    def get_reset_token(self, expire_sec=1800):
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])

        tz_brasilia = pytz.timezone('America/Sao_Paulo')
        hora_brasil = datetime.now(tz_brasilia)
        #Horário em que o ultimo token foi solicitado
        timestamp = int(hora_brasil.timestamp())
        self.token_enviado_em = hora_brasil

        db.session.commit()

        return s.dumps({'user_id': self.id, 'timestamp': timestamp})
    
    @staticmethod # não precisa de um objeto (instância). Útil para funções relacionadas à classe, mas que não usam 'self'. Pertence à classe, mas não depende de nenhuma instância específica dela, como se fosse uma função de fora do objeto basicamente.
    def verify_reset_token(token, expires_sec=1800):
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        try:
             dados = s.loads(token, max_age=expires_sec)
             user_id = dados['user_id']
             timestamp = int(dados['timestamp'])
        except:
            return None
        
        #Pegar o id do usuario que solicitou a redefinição
        user= Users.query.get(user_id)

        if user is None or user.token_enviado_em is None:
            return None

        if int(dados['timestamp']) != int(user.token_enviado_em.timestamp()):
            return None

        return user

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