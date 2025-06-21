import smtplib
from email.message import EmailMessage
from flask import current_app, url_for
from models.users import Users
from datetime import datetime
import pytz

def send_reset_email(user):
    token = user.get_reset_token()

    tz_brasilia = pytz.timezone('America/Sao_Paulo')
    hora_brasil = datetime.now(tz_brasilia)
    date = hora_brasil.strftime("%d/%m/%Y - %H:%M:%S")

    msg = EmailMessage()
    msg['Subject'] = f'Redefinição de Senha {date} - Classroom Quiz'
    msg['From'] = f"Samuel Fernandes <{current_app.config['MAIL_USERNAME']}>"
    msg['To'] = user.email
    msg.set_content(
        f''' Olá {user.nome}!
    
Para redefinir sua senha, acesse o link: 
        
{url_for('login.reset_token', token=token, _external=True)}

        
Se você não solicitou isso, ignore este e-mail.
''')
    
    #Tipo de email alternativo, caso o dispositivo aceite arquivo html
    msg.add_alternative(f"""
<html>
  <body>
    <p>Olá <strong>{user.nome}</strong>!</p>

    <p>Para redefinir sua senha, clique no link abaixo:</p>

    <p><a href="{url_for('login.reset_token', token=token, _external=True)}">Redefinir senha</a></p>

    <p>Se você não solicitou isso, ignore este e-mail.</p>
  </body>
</html>
""", subtype='html')
    
    EMAIL = current_app.config['MAIL_USERNAME']
    SENHA = current_app.config['MAIL_PASSWORD']

    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
        smtp.starttls()                     
        smtp.login(EMAIL, SENHA)         
        smtp.send_message(msg)          

    print('E-mail enviado com sucesso!')

