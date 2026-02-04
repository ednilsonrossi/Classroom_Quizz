from flask import Blueprint

quiz = Blueprint('quiz', __name__, template_folder='templates')

from app.blueprints.quiz import routes