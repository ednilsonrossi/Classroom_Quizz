from utils.db import db

class RelatorioGeral(db.Model):
    __tablename__ = 'relatorioGeral'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    jogador_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    jogador = db.Column(db.String(26), nullable=True)
    pontuacao_total = db.Column(db.Integer, nullable=False)
    tempo_total = db.Column(db.Integer, nullable=False)
    feedback = db.Column(db.String(250), nullable=False)
    # feedback = db.Column(db.String(250), nullable=False)
    #Relacionamentos com as outras tabelas
    relatorio_perguntas = db.relationship('RelatorioPerguntas', backref='relatorio_geral', lazy=True)

    def __init__(self, quiz_id, pontuacao_total, tempo_total, feedback, jogador_id=None, jogador=None,):
        self.quiz_id = quiz_id
        self.pontuacao_total = pontuacao_total
        self.tempo_total = tempo_total
        self.feedback = feedback
        self.jogador_id = jogador_id
        self.jogador = jogador

class RelatorioPerguntas(db.Model):
    __tablename__ = 'relatorioPerguntas'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    relatorio_id = db.Column(db.Integer, db.ForeignKey('relatorioGeral.id'), nullable=False)
    perguntas_id = db.Column(db.Integer, db.ForeignKey('pergunta.id'), nullable=False)
    resposta = db.Column(db.String(300), nullable=False)
    correta = db.Column(db.Boolean, default=False)

    def __init__(self, relatorio_id, perguntas_id, resposta, correta):
        self.relatorio_id = relatorio_id
        self.perguntas_id = perguntas_id
        self.resposta = resposta
        self.correta = correta