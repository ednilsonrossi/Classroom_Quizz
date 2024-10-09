from utils.db import db

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(30), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    slide = db.relationship('Slide', backref='quiz_slide', lazy=True)

    def __init__(self, titulo, usuario_id):
        self.titulo = titulo 
        self.usuario_id = usuario_id 

class Slide(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    ordem = db.Column(db.Integer, nullable=False)
    pergunta = db.Column(db.String(500), nullable=False)
    tipo_pergunta = db.Column(db.String(20), nullable=False)
    tempo = db.Column(db.Integer, nullable=False)
    pontos = db.Column(db.Integer, nullable=False)
    respostas = db.relationship('Respostas', backref='slide_respostas', lazy=True)

    def __init__(self, quiz_id, ordem, pergunta, tipo_pergunta, tempo, pontos):
        self.quiz_id = quiz_id
        self.ordem = ordem
        self.pergunta = pergunta
        self.tipo_pergunta =tipo_pergunta 
        self.tempo = tempo
        self.pontos = pontos

class Respostas(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    slide_id = db.Column(db.Integer, db.ForeignKey('slide.id'), nullable=False)
    resposta = db.Column(db.String(200), nullable=False)
    correta = db.Column(db.Boolean, default=False)

    def __init__(self, slide_id, resposta, correta):
        self.id = id
        self.slide_id = slide_id
        self.resposta = resposta
        self.correta = correta