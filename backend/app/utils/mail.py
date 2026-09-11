from flask import current_app
import smtplib
from email.message import EmailMessage
from datetime import datetime
import pytz

def send_email(subject, recipient, text_body, html_body):
    EMAIL = current_app.config['MAIL_USERNAME']
    SENHA = current_app.config['MAIL_PASSWORD']
    SMTP_SERVER = current_app.config['MAIL_SERVER']
    SMTP_PORT = current_app.config['MAIL_PORT']

    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = f"Classroom Quizz <{EMAIL}>"
    msg['To'] = recipient
    msg.set_content(text_body)
    msg.add_alternative(html_body, subtype='html')

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:
            smtp.starttls()                     
            smtp.login(EMAIL, SENHA)         
            smtp.send_message(msg)  

    except Exception as e:
        current_app.logger.error(f"Erro ao enviar email: {e}")        

def send_confirm_email(user):
    token = user.generate_confirmation_token()
    BASE_URL = current_app.config['FRONTEND_URL']
    link = f"{BASE_URL}/auth/confirm-email?token={token}"

    send_email(subject='Confirmação de E-mail - Classroom Quizz',
               recipient=user.email,
               text_body=f'''
Olá {user.nome_completo}!

Para confirmar seu e-mail:
{link}

Se você não solicitou isso, ignore este e-mail.

''',
                html_body=f'''
<p>Olá <strong>{user.nome_completo}</strong>!</p>
<p>Para confirmar seu e-mail:</p>
<p><a href="{link}">Confirmar e-mail</a></p>
<p>Se você não solicitou isso, ignore este e-mail.</p>
'''
    )   

def send_reset_email(user):
    token = user.generate_reset_token()
    BASE_URL = current_app.config['FRONTEND_URL']
    link = f"{BASE_URL}/auth/reset-password?token={token}"

    tz_brasilia = pytz.timezone('America/Sao_Paulo')
    hora_brasil = datetime.now(tz_brasilia)
    date = hora_brasil.strftime("%d/%m/%Y - %H:%M:%S")

    send_email(
        subject=f'Redefinição de Senha {date} - Classroom Quizz',
        recipient=user.email,
        text_body=f'''
Olá {user.nome_completo}!
    
Para redefinir sua senha:    
{link}

Se você não solicitou isso, ignore este e-mail.
''',
        html_body=f'''
<p>Olá <strong>{user.nome_completo}</strong>!</p>
<p>Para redefinir sua senha:</p>
<p><a href="{link}">Redefinir senha</a></p>
<p>Se você não solicitou isso, ignore este e-mail.</p>
'''
    )
