from app.models import Quiz, Questao, TipoQuestao, Alternativa, Usuario
from app.utils.db import db
from sqlalchemy import func
from typing import List

class QuizRepository:
    #Métodos de Busca
    def get_by_id(self, quiz_id: int) -> Quiz | None:
        return Quiz.query.get(quiz_id)
        
    def get_all_quizzes_by_user(self, user: Usuario) -> List[dict]:
        return user.quizzes_gerenciados.all()
       
    def get_questions_by_user(self, user: Usuario) -> List[dict]:
        subquery = (
            user.questoes_criadas
            .with_entities(
                func.max(Questao.id).label("id"))
            .group_by(Questao.texto)
            .subquery()
        )

        return (db.session.query(Questao).join(subquery, Questao.id == subquery.c.id).all())
    
    def get_unorganized_by_user(self, user_id: int):
        return Quiz.query.filter_by(usuario_id=user_id, pasta_id=None).all()

    #Métodos de Cadastro e Edição
    def create(self, entity) -> None:
        db.session.add(entity)

    def flush(self) -> None:
        db.session.flush()

    def delete(self, entity) -> None:
        db.session.delete(entity)

    #Método de Exclusão
    def delete_by_id(self, quiz: Quiz) -> None:   
        db.session.delete(quiz)






