from utils.db import db

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(30), nullable=False)
    usuario_id = db.Column(db.String(15), nullable=False)

# class Respostas(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     slide_id = db.Column(db.Integer, db.ForeignKey('slide.id'), nullable=False)
#     text = db.Column(db.String(200), nullable=False)
#     is_correct = db.Column(db.Boolean, default=False)  # Para marcar se é a resposta correta

# class Slide(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
#     pergunta = db.Column(db.String(500), nullable=False)
#     tipo_pergunta = db.Column(db.String(20), nullable=False)
#     tempo = db.Column(db.Integer, nullable=False)
#     pontos = db.Column(db.Integer, nullable=False)
#     order = db.Column(db.Integer, nullable=False)
#     respostas = db.relationship('Respostas', backref='slide', lazy=True)


# class Questions(db.Model):
#     id = db.Collumn(db.Integer, primary_key=True)
#     quiz_id = models.ForeignKey("app.Model", verbose_name=_(""), on_delete=models.CASCADE)
#     ordem = 
#     pergunta =
#     respostas =  
#     correta = 
#     tempo = 
#     pontos = 
#     tipo = 
    