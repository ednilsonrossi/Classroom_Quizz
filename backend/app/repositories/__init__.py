from app.repositories.user_repo import UserRepository
from app.repositories.quiz_repo import QuizRepository
from app.repositories.token_repo import TokenRepository
from app.repositories.folder_repo import FolderRepository

#Uma única instância para todas as rotas
user_repo = UserRepository()
quiz_repo = QuizRepository()
token_repo = TokenRepository()
folder_repo = FolderRepository()