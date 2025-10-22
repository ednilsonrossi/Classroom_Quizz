from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, EmailField, IntegerField, RadioField, SelectField, DateField, TextAreaField, FieldList, FormField
from wtforms.validators import DataRequired, NumberRange, Length, Email, EqualTo, ValidationError
from models import Usuario

#Formulário do Código da Turma
class Pagina_Insercao_Codigo(FlaskForm):
    codigo = StringField('Código da sala',
                        render_kw={"placeholder": "Digite o código da sala", "autofocus": True, "autocomplete": "off"},
                        validators=[DataRequired(), Length(min=6, max=6)])
    submit = SubmitField('Jogar')


# FORMULÁRIO CRIAÇÃO DO QUIZ

class Respostas(FlaskForm):
    resposta = StringField('Resposta', validators=[DataRequired(), Length(min=2, max=300)])
    correta = BooleanField('Resposta Correta')

class Criacao_Quiz(FlaskForm):
    titulo = StringField('Título',
                         validators=[DataRequired(), Length(min=2, max=30)])
    tipo_pergunta = SelectField(choices=
                                [('escolha unica', 'Escolha única'), ('verdadeiro ou falso', 'Verdadeiro ou Falso'), ('correção', 'Correção')])
    tempo = IntegerField('Tempo',
                          default=30,
                          validators=[DataRequired(), NumberRange(min=30, max=480, message="O número deve estar entre 30 e 480 segundos.")])
    pontos = IntegerField('Pontos',
                          default=10,
                          validators=[DataRequired(), NumberRange(min=10, max=100, message="O número deve estar entre 10 e 100 pontos.")])
    descricao = TextAreaField('Descrição',
                               validators=[DataRequired(), Length(min=10, max=200, message="A mensagem deve ter entre 10 e 200 caracteres.")])
    pergunta = TextAreaField('Pergunta', 
                             validators=[DataRequired(), Length(min=2, max=500)])
    respostas = FieldList(FormField(Respostas), min_entries=2, max_entries=5)
    submit = SubmitField('Salvar e Sair')
    
    
