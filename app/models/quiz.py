from utils.db import db

class Quiz(db.Model):
    __tablename__ = 'quiz'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    titulo = db.Column(db.String(30), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    #Relacionamentos com as outras tabelas
    perguntas = db.relationship('Pergunta', backref='quiz', lazy=True)
    relatorios = db.relationship('RelatorioGeral', backref='relatorio_quiz', lazy=True)

    def __init__(self, titulo, usuario_id):
        self.titulo = titulo 
        self.usuario_id = usuario_id 

class Pergunta(db.Model):
    __tablename__ = 'pergunta'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    bq_id = db.Column(db.Integer, db.ForeignKey('banco_questoes.id'), nullable=False)
    ordem = db.Column(db.Integer, nullable=False)
    tempo = db.Column(db.Integer, nullable=False)
    pontos = db.Column(db.Integer, nullable=False)

    #Relacionamentos com as outras tabelas
    respostas = db.relationship('Resposta', backref='pergunta', lazy=True)
    correcoes = db.relationship('Correcao', backref='correcao_pergunta', lazy=True)
    relatorio_perguntas = db.relationship('RelatorioPerguntas', backref='relatorio_pergunta', lazy=True)

    def __init__(self, quiz_id, bq_id, ordem, tempo, pontos):
        self.quiz_id = quiz_id
        self.ordem = ordem
        self.bq_id = bq_id
        self.tempo = tempo
        self.pontos = pontos

class Resposta(db.Model):
    __tablename__ = 'resposta'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pergunta_id = db.Column(db.Integer, db.ForeignKey('pergunta.id'), nullable=False)
    resposta = db.Column(db.String(300), nullable=False)
    correta = db.Column(db.Boolean, default=False)

    def __init__(self, pergunta_id, resposta, correta):
        self.pergunta_id = pergunta_id
        self.resposta = resposta
        self.correta = correta

class Correcao(db.Model):
    __tablename__ = 'correcao'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pergunta_id = db.Column(db.Integer, db.ForeignKey('pergunta.id'), nullable=False)
    correcao = db.Column(db.String(800), nullable=False)

    def __init__(self, pergunta_id, correcao):
        self.pergunta_id = pergunta_id
        self.correcao = correcao
