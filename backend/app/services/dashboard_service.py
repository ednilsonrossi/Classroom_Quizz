from app.models import Quiz

class DashboardService:
    def __init__(self, user_repo, quiz_repo):
        self.user_repo = user_repo
        self.quiz_repo = quiz_repo

    def get_summary(self, user_id: int):
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise ValueError("Usuário não encontrado")

        if user.tipo_conta.value == 'professor':
            return self.build_professor_dashboard(user)
        else:
            return self.build_student_dashboard(user)
    
    def build_professor_dashboard(self, user):
        recent_quizzes = user.quizzes_gerenciados.order_by(Quiz.data_criacao.desc()).limit(5).all()

        return {
            "user": {
                "fullName": user.nome_completo, 
                "accountType": user.tipo_conta
            },
            "stats": {
                "contentCount": user.quizzes_gerenciados.count(),
                "classCount": 0,
                "questionActiveCount": user.questoes_criadas.count()
            },
            "recentQuizzes": recent_quizzes
        }
        
    def build_student_dashboard(self, user):
        return {
            "user": {
                "fullName": user.nome_completo,
                "accountType": "aluno"
            },
            "stats": {
                "contentCount": 0,
                "classCount": 0,
                "questionCount": 0
            },
            "recentQuizzes": []
        }
    