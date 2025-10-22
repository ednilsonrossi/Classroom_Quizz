from utils.db import db

class Quiz(db.Model):
    __tablename__ = 'quiz'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    criador_original_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    pasta_id = db.Column(db.Integer, db.ForeignKey('pasta_materias.id', ondelete='set null'))

    titulo = db.Column(db.String(255), nullable=False)
    publico = db.Column(db.Boolean, default=False)
    data_criacao = db.Column(db.DateTime, nullable=False, default=db.func.now())

    #Relacionamentos com as outras tabelas
    dono = db.relationship('Usuario', foreign_keys=[usuario_id], back_populates='quizzes_gerenciados', lazy='select')
    criador_original = db.relationship('Usuario', foreign_keys=[criador_original_id], back_populates='quizzes_originais', lazy='select')
   
    pasta_materia = db.relationship('PastaMateria', back_populates='quizzes', lazy='select')
    questoes = db.relationship('Questao', back_populates='quiz', lazy='dynamic', cascade='all, delete-orphan')

    def __init__(self, titulo, publico, usuario_id, criador_original_id=None, pasta_id=None):
        self.titulo = titulo 
        self.publico = publico
        self.usuario_id = usuario_id 

        # Caso o criador_original_id seja vazio, logo o criador original é o próprio usuario_id
        self.criador_original_id = criador_original_id if criador_original_id is not None else usuario_id
        
        self.pasta_id = pasta_id #opcional
