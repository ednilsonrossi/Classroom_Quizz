from utils.db import db
import enum

class TipoQuestao(enum.Enum):
    multipla_escolha = 'Múltipla Escolha'
    verdadeiro_falso = 'Verdadeiro ou Falso'

    @classmethod
    def from_string(cls, tipo_str):
        #Converterá uma STR em eENUM

        for membro in cls: #Membro são os valores da própria classe
            if membro.value.lower() == tipo_str.lower():
                return membro


class Questao(db.Model):
    __tablename__ = 'questao'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)

    texto = db.Column(db.Text, nullable=False)
    tipo_pergunta = db.Column(db.Enum(TipoQuestao), default=TipoQuestao.multipla_escolha, nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    ponto = db.Column(db.Integer, default=10, nullable=False)
    tempo = db.Column(db.Integer, default=60, nullable=False)
    ordem = db.Column(db.Integer, default=1, nullable=False)

    correcao_txt = db.Column(db.Text, nullable=True)
    correcao_img = db.Column(db.String(255), nullable=True)

    #Relacionamentos com as outras tabelas
    alternativas = db.relationship('Alternativa', back_populates='questao', lazy='dynamic', cascade='all, delete-orphan')
    usuario = db.relationship('Usuario', back_populates='questoes_criadas', lazy='select')
    quiz = db.relationship('Quiz', back_populates='questoes', lazy='select')

    def __init__(self, usuario_id, quiz_id, texto, tipo_pergunta, descricao=None, ponto=10, tempo=60, ordem=1, correcao_txt=None, correcao_img=None):
        self.usuario_id = usuario_id
        self.quiz_id = quiz_id
        self.texto = texto
        self.tipo_pergunta = tipo_pergunta
        self.descricao = descricao
        self.ponto = ponto
        self.tempo = tempo
        self.ordem = ordem
        self.correcao_txt = correcao_txt
        self.correcao_img = correcao_img