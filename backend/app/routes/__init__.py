from app.routes.auth import auth
from app.routes.dashboard import dashboard
from app.routes.quiz import quiz
from app.routes.folder import folder

def register_blueprint(app):
    app.register_blueprint(auth, url_prefix='/api/auth')
    app.register_blueprint(dashboard, url_prefix='/api/dashboard')
    app.register_blueprint(quiz, url_prefix='/api/quiz')
    app.register_blueprint(folder, url_prefix='/api/folder')