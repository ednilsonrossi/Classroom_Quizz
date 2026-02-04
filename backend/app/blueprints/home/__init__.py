from flask import Blueprint

home = Blueprint('home', __name__, template_folder='templates')

from app.blueprints.home import routes