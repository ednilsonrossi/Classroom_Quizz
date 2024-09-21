from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, EmailField, IntegerField, RadioField, SelectField, DateField,DateTimeField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from models.users import Users

#Formulário do Código da Turma
class Pagina_Insercao_Codigo(FlaskForm):
    codigo = StringField('codigo',
                          validators=[DataRequired(), Length(min=6, max=6)])
    submit = SubmitField('Entrar')

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
                          validators=[DataRequired(), Length(min=2, max=60)])
    submit = SubmitField('Enviar')
    
#FORMULÁRIO DO LOGIN
class Login_Formulario(FlaskForm):
    email = EmailField('E-mail',
                            validators=[DataRequired(), Email(), Length(max=256)])
    senha = PasswordField('Senha',
                          validators=[DataRequired(), Length(min=8, max=50)])
    remember = BooleanField('Lembrar da senha')
    submit = SubmitField('Entrar')
    
    
