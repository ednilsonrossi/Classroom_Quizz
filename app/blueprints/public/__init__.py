from flask import Blueprint

public = Blueprint('public', __name__, template_folder='templates')

from . import routes