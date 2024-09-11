from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, EmailField, IntegerField, RadioField, SelectField, DateField
from wtforms.validators import DataRequired, Length, Email, EqualTo, NumberRange

#Formulário do Código da Turma
class Pagina_Insercao_Codigo(FlaskForm):
    codigo = StringField('codigo',
                          validators=[DataRequired(), Length(min=6, max=6)])
    submit = SubmitField('Entrar')

#Formulário do cadastro
class Cadastro_Formulario_Pagina1(FlaskForm):
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
    nome = StringField('Nome',
                          validators=[DataRequired(), Length(min=2, max=60)])
    usuario = StringField('Usuário',
                            validators=[DataRequired(), Length(min=2, max=26)])
    submit = SubmitField('Enviar')
    
#FORMULÁRIO DO LOGIN
class Login_Formulario(FlaskForm):
    email = EmailField('E-mail',
                            validators=[DataRequired(), Email(), Length(max=256)])
    senha = PasswordField('Senha',
                          validators=[DataRequired(), Length(min=8, max=50)])
    remember = BooleanField('Lembrar da senha')
    submit = SubmitField('Entrar')
    
    
