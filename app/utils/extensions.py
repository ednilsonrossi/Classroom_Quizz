from flask_bcrypt import Bcrypt
from flask_login import LoginManager

#Criptografia do Banco de Dados
bcrypt = Bcrypt()
#Login de usuarios
login_manager = LoginManager()