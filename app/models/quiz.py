from utils.db import db

class Quiz(db.Model):
    __tablename__ = 'quiz'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    titulo = db.Column(db.String(30), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    #Relacionamentos com as outras tabelas
    perguntas = db.relationship('Perguntas_Quiz', backref='quiz', lazy=True)
    relatorios = db.relationship('RelatorioGeral', backref='relatorio_quiz', lazy=True)

    def __init__(self, titulo, usuario_id):
        self.titulo = titulo 
        self.usuario_id = usuario_id 

class Perguntas(db.Model):
    __tablename__ = 'perguntas'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bq_id = db.Column(db.Integer, db.ForeignKey('banco_questoes.id'), nullable=False, unique=True)
    pergunta = db.Column(db.String(500), nullable=False)

    #Relacionamentos com as outras tabelas
    perguntas = db.relationship('Perguntas_Quiz', backref='perguntas')
    respostas = db.relationship('Resposta', backref='pergunta', lazy=True)

    def __init__(self, bq_id, pergunta):
        self.bq_id = bq_id
        self.pergunta = pergunta

class Perguntas_Quiz(db.Model):
    __tablename__ = 'perguntas_quiz'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    pergunta_id = db.Column(db.Integer, db.ForeignKey('perguntas.id'), nullable=False)
    ordem = db.Column(db.Integer, nullable=False)
    tempo = db.Column(db.Integer, nullable=False)
    pontos = db.Column(db.Integer, nullable=False)

    #Relacionamentos com as outras tabelas
    correcao = db.relationship('Correcao', uselist=False, backref='correcao_pergunta', lazy=True, )
    relatorio_perguntas = db.relationship('RelatorioPerguntas', backref='relatorio_pergunta', lazy=True)
    
class Resposta(db.Model):
    __tablename__ = 'resposta'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pergunta_id = db.Column(db.Integer, db.ForeignKey('perguntas.id'), nullable=False)
    resposta = db.Column(db.String(300), nullable=False)
    correta = db.Column(db.Boolean, default=False)

    def __init__(self, pergunta_id, resposta, correta):
        self.pergunta_id = pergunta_id
        self.resposta = resposta
        self.correta = correta

class Correcao(db.Model):
    __tablename__ = 'correcao'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    perguntaQuiz_id = db.Column(db.Integer, db.ForeignKey('perguntas_quiz.id'), nullable=False)
    correcao = db.Column(db.String(800), nullable=False)

    def __init__(self, perguntaQuiz_id, correcao):
        self.perguntaQuiz_id = perguntaQuiz_id
        self.correcao = correcao
