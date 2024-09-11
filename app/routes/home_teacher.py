from flask import Blueprint, render_template, redirect, url_for


home_teacher = Blueprint('home_teacher', __name__)

@home_teacher.route('/')
def home():
    return render_template('home_teacher.html', title='Home')