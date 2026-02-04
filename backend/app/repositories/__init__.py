from app.repositories.user_repo import UserRepository
from app.repositories.quiz_repo import QuizRepository

#Uma única instância para todas as rotas
user_repo = UserRepository()
quiz_repo = QuizRepository()