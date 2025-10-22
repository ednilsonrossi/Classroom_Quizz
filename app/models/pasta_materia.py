from utils.db import db
from sqlalchemy import UniqueConstraint

class PastaMateria(db.Model):
    __tablename__='pasta_materias'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)

    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    criado_em = db.Column(db.DateTime, nullable=False, default=db.func.now())
    atualizado_em = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    __table_args__ = (
        UniqueConstraint('usuario_id', 'nome', name='uq_usuario_nome_pasta'),
    )

    # Relacionamentos
    usuario = db.relationship('Usuario', back_populates='pastas', lazy='select')
    quizzes = db.relationship('Quiz', back_populates='pasta_materia', lazy='dynamic')

    def __init__(self, nome, descricao, usuario_id):
        self.nome = nome
        self.descricao = descricao
        self.usuario_id = usuario_id
