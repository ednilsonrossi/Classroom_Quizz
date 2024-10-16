from utils.db import db

class BancoQuestoes(db.Model):
    __tablename__ = 'banco_questoes'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pergunta = db.Column(db.String(500), nullable=False)
    tipo_pergunta = db.Column(db.String(20), nullable=False)
    descricao = db.Column(db.String(200), nullable=False)

    #Relacionamentos com as outras tabelas
    perguntas = db.relationship('Pergunta', backref='bancoQuestoes', lazy=True)

    def __init__(self, user_id, pergunta, tipo_pergunta, descricao):
        self.user_id = user_id
        self.pergunta = pergunta
        self.tipo_pergunta = tipo_pergunta
        self.descricao = descricao