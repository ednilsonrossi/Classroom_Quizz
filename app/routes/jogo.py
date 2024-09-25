from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required

jogo = Blueprint('jogo', __name__)

@jogo.route('/')
def sala_espera():
    return(render_template('sala_espera.html'))