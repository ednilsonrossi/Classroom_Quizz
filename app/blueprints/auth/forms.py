from flask_wtf import FlaskForm
from wtforms import StringField, RadioField, DateField, PasswordField, SubmitField, EmailField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from models import Usuario
from datetime import date, timedelta

#FORMULÁRIO DO LOGIN
class Login_Formulario(FlaskForm):
    email = EmailField('E-mail',
                            validators=[DataRequired(), Email(), Length(max=100)])
    senha = PasswordField('Senha',
                          validators=[DataRequired(), Length(min=8, max=50)])
    submit = SubmitField('Entrar')

# SOLICITAÇÃO DE REDEFINIÇÃO DE SENHA
class RequestResetForm(FlaskForm):
    email = EmailField('E-mail',
                        validators=[DataRequired(), Email(), Length(max=100)])
    submit = SubmitField('Redefinição de Senha')
    
    #USADO SOMENTE PARA TESTE, EM UMA APLICAÇÃO FUNCIONAL, DEVERÁ SER RETIRADO
    # def validate_email(self, check_email):
    #     email = Users.query.filter_by(email=check_email.data).first()
    #     if email is None: 
    #         raise ValidationError('Não existe uma conta com esse email. Registre-se primeiro.')
        
class ResetPasswordForm(FlaskForm):
    senha = PasswordField('Senha',
                          validators=[DataRequired(), Length(min=8, max=255)])
    confirm_senha = PasswordField('Confirme a senha',
                          validators=[DataRequired(), EqualTo('senha')])
    
    submit = SubmitField('Redefinir Senha')

#FORMULÁRIO DO CADASTRO
class Cadastro_Formulario_Pagina1(FlaskForm):
    def validate_email(self, check_email):
        email = Usuario.query.filter_by(email=check_email.data).first()
        if email:
            raise ValidationError('E-mail já existente! Tente outro.')
        
    email = StringField('E-mail',
                            validators=[DataRequired(), Email(), Length(max=100)])
    senha = PasswordField('Senha',
                          validators=[DataRequired(), Length(min=8, max=255)])
    confirm_senha = PasswordField('Confirme a senha',
                          validators=[DataRequired(), EqualTo('senha')])
    submit = SubmitField('Continuar')
    
class Cadastro_Formulario_Pagina2(FlaskForm):
    tipo_conta = RadioField(choices=[('Aluno', 'Aluno'), ('Professor', 'Professor')])
    submit = SubmitField('Continuar')
    
#Data de nascimento máxima permitida (hoje)    
DATA_MAXIMA_HOJE = date.today().isoformat()
#Data de nascimento mínima permitida (100 anos atrás) 
DATA_MINIMA_100_ANOS = date.today().replace(year=date.today().year - 100).isoformat()

class Cadastro_Formulario_Pagina3(FlaskForm):
    def validate_nascimento(self, field):
        data_nascimento = field.data
        tipo_conta = self.tipo_conta_data

        if data_nascimento >= date.today():
            raise ValidationError('A data de nascimento não pode ser hoje ou no futuro.')
        
        if data_nascimento <= date.today().replace(year=date.today().year - 100):
            raise ValidationError('A data de nascimento parece ser muito antiga. Por favor verifique.')
        
        if tipo_conta == 'Professor':
            limite_professor = date.today().replace(year=date.today().year - 18)

            if data_nascimento > limite_professor:
                raise ValidationError('Professores devem ter pelo menos 18 anos.')
        else:
            #Para se ter um email o mínimo exigido é ter 13 anos, então a idade mínima permitida é de 13 anos.
            limite_aluno = date.today().replace(year=date.today().year - 13)
        
            if data_nascimento > limite_aluno:
                raise ValidationError('Alunos devem ter pelo menos 13 anos para criar uma conta.')
        
    nascimento = DateField('Nascimento', format='%Y-%m-%d', 
                          validators=[DataRequired()],
                          render_kw={'max':DATA_MAXIMA_HOJE,
                                     'min':DATA_MINIMA_100_ANOS})
    submit = SubmitField('Continuar')
    
class Cadastro_Formulario_Pagina4(FlaskForm):
    def validate_usuario(self, check_user):
        usuario = Usuario.query.filter_by(username=check_user.data).first()
        if usuario:
            raise ValidationError('Usuário já existente! Tente outro.')
        
    usuario = StringField('Usuário',
                            validators=[DataRequired(), Length(min=2, max=100)])
    nome = StringField('Nome',
                          validators=[DataRequired(), Length(min=2, max=200)])
    submit = SubmitField('Enviar')
    
