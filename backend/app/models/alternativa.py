from app.utils.db import db

class Alternativa(db.Model):
    __tablename__ = 'alternativa'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    questao_id = db.Column(db.Integer, db.ForeignKey('questao.id'), nullable=False)
    texto = db.Column(db.String(255), nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False, default=False)

    #Relacionamento com as outras tabelas
    questao = db.relationship('Questao', back_populates='alternativas', lazy='select')

    def __init__(self, questao_id, texto, is_correct):
        self.questao_id = questao_id
        self.texto = texto
        self.is_correct = is_correct