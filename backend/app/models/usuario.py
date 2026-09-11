from flask import current_app
from flask_login import UserMixin
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from app.utils.extensions import bcrypt
from app.utils.db import db
from datetime import datetime, timezone
import enum

class TipoConta(enum.Enum):
    aluno = 'aluno'
    professor = 'professor'

class Usuario(db.Model, UserMixin):
    __tablename__ = 'usuario'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)
    nome_completo = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    tipo_conta = db.Column(db.Enum(TipoConta), default=TipoConta.aluno, nullable=False)
    nascimento = db.Column(db.Date, nullable=False)
    confirm_user = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())

    #Relacionamentos com as outras tabelas
    used_tokens = db.relationship('UsedToken', back_populates='user', lazy='dynamic', cascade='all, delete-orphan')
    revoked_tokens = db.relationship('RevokedToken', back_populates='user', lazy='dynamic', cascade='all, delete-orphan')

    quizzes_gerenciados = db.relationship('Quiz', foreign_keys='Quiz.usuario_id', back_populates='dono', cascade='all, delete-orphan', lazy='dynamic')
    quizzes_originais = db.relationship('Quiz', foreign_keys='Quiz.criador_original_id', back_populates='criador_original', lazy='dynamic')

    questoes_criadas = db.relationship('Questao', back_populates='usuario', cascade='all, delete-orphan', lazy='dynamic')
    pastas = db.relationship('PastaMateria', back_populates='usuario', cascade='all, delete-orphan', lazy='dynamic')

    CONFIRM_SALT = 'email-confirm'
    RESET_SALT = 'password-reset'

    def _get_serializer(self):
        return URLSafeTimedSerializer(current_app.config['SECRET_KEY'])

    def _generate_token(self, purpose, salt):
        s = self._get_serializer()

        payload = {
            'user_id': self.id,
            'purpose': purpose
        }

        return s.dumps(payload, salt=salt)

    @staticmethod
    def _verify_token(token, expires_sec, expected_purpose, salt):
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])

        try:
            data = s.loads(token, max_age=expires_sec, salt=salt)
        except (BadSignature, SignatureExpired):
            return None
        
        if data.get('purpose') != expected_purpose:
            return None
        
        user_id = data.get('user_id')
        if not user_id:
            return None
        
        user = Usuario.query.get(user_id)
        if user is None:
            return None

        return user

    def generate_confirmation_token(self):
        return self._generate_token(
            purpose='confirm_email',
            salt=self.CONFIRM_SALT
        )
    
    @staticmethod # não precisa de um objeto (instância). Útil para funções relacionadas à classe, mas que não usam 'self'. Pertence à classe, mas não depende de nenhuma instância específica dela, como se fosse uma função de fora do objeto basicamente.
    def verify_confirmation_token(token, expires_sec=86400):
        return Usuario._verify_token(
            token=token, 
            expires_sec=expires_sec,
            expected_purpose='confirm_email',
            salt=Usuario.CONFIRM_SALT
        )

    def generate_reset_token(self):
        return self._generate_token(
            purpose='reset_password', 
            salt=self.RESET_SALT)
    
    @staticmethod 
    def verify_reset_token(token, expires_sec=1800):
       return Usuario._verify_token(
           token=token,
           expires_sec=expires_sec,
           expected_purpose='reset_password',
           salt=Usuario.RESET_SALT
       )

    @property
    def cripto_pwd(self):
        return self.senha
    
    @cripto_pwd.setter
    def cripto_pwd(self, senha_texto):
        self.senha = bcrypt.generate_password_hash(senha_texto).decode('utf-8')

    def conversor_pwd(self, senha_descripto):
        return bcrypt.check_password_hash(self.senha, senha_descripto)

    def __init__(self, email, senha, tipo_conta, nome_completo, username, nascimento):
        self.email = email
        self.cripto_pwd = senha
        self.tipo_conta = tipo_conta
        self.nome_completo = nome_completo
        self.username = username
        self.nascimento = nascimento