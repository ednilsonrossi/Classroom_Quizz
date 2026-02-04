from flask import Blueprint

cadastro = Blueprint('cadastro', __name__, template_folder='templates')

from app.blueprints.auth.cadastro import routes