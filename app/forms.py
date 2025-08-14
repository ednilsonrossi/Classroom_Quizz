from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, EmailField, IntegerField, RadioField, SelectField, DateField, TextAreaField, FieldList, FormField
from wtforms.validators import DataRequired, NumberRange, Length, Email, EqualTo, ValidationError
from models.users import Users

#Formulário do Código da Turma
class Pagina_Insercao_Codigo(FlaskForm):
    codigo = StringField('Código da sala',
                        render_kw={"placeholder": "Digite o código da sala", "autofocus": True, "autocomplete": "off"},
                        validators=[DataRequired(), Length(min=6, max=6)])
    submit = SubmitField('Jogar')

#Formulário do cadastro
class Cadastro_Formulario_Pagina1(FlaskForm):
    def validate_email(self, check_email):
        email = Users.query.filter_by(email=check_email.data).first()
        if email:
            raise ValidationError('E-mail já existente! Tente outro.')
        
    email = StringField('E-mail',
                            validators=[DataRequired(), Email(), Length(max=256)])
    senha = PasswordField('Senha',
                          validators=[DataRequired(), Length(min=8, max=50)])
    confirm_senha = PasswordField('Confirme a senha',
                          validators=[DataRequired(), EqualTo('senha')])
    submit = SubmitField('Continuar')
    
class Cadastro_Formulario_Pagina2(FlaskForm):
    tipo_conta = RadioField(choices=[('aluno', 'Aluno'), ('professor', 'Professor')])
    submit = SubmitField('Continuar')
    
class Cadastro_Formulario_Pagina3(FlaskForm):
    nascimento = DateField('Nascimento', format='%Y-%m-%d', 
                          validators=[DataRequired()])
    submit = SubmitField('Continuar')
    
class Cadastro_Formulario_Pagina4(FlaskForm):
    def validate_usuario(self, check_user):
        usuario = Users.query.filter_by(usuario=check_user.data).first()
        if usuario:
            raise ValidationError('Usuário já existente! Tente outro.')
        
    usuario = StringField('Usuário',
                            validators=[DataRequired(), Length(min=2, max=26)])
    nome = StringField('Nome',
                          validators=[DataRequired(), Length(min=2, max=50)])
    submit = SubmitField('Enviar')
    
#FORMULÁRIO DO LOGIN
class Login_Formulario(FlaskForm):
    email = EmailField('E-mail',
                            validators=[DataRequired(), Email(), Length(max=256)])
    senha = PasswordField('Senha',
                          validators=[DataRequired(), Length(min=8, max=50)])
    remember = BooleanField('Lembrar da senha')
    submit = SubmitField('Entrar')

# SOLICITAÇÃO DE REDEFINIÇÃO DE SENHA
class RequestResetForm(FlaskForm):
    email = EmailField('E-mail',
                        validators=[DataRequired(), Email(), Length(max=256)])
    submit = SubmitField('Redefinição de Senha')
    
    #USADO SOMENTE PARA TESTE, EM UMA APLICAÇÃO FUNCIONAL, DEVERÁ SER RETIRADO
    def validate_email(self, check_email):
        email = Users.query.filter_by(email=check_email.data).first()
        if email is None: 
            raise ValidationError('Não existe uma conta com esse email. Registre-se primeiro.')
        
class ResetPasswordForm(FlaskForm):
    senha = PasswordField('Senha',
                          validators=[DataRequired(), Length(min=8, max=50)])
    confirm_senha = PasswordField('Confirme a senha',
                          validators=[DataRequired(), EqualTo('senha')])
    
    submit = SubmitField('Redefinir Senha')




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
    
    
