from flask import Blueprint, render_template, redirect, url_for


home = Blueprint('home', __name__)

@home.route('/teacher')
def teacher_home():
    return render_template('home_teacher.html', title='Home')

@home.route('/student')
def student_home():
    return render_template('home_student.html', title='Home')