import os
from app.repositories import user_repo, quiz_repo, folder_repo
from app.models import Quiz, Questao, Alternativa, PastaMateria, TipoQuestao
from app.utils.image_handler import save_image
from app.utils.db import db
from sqlalchemy.exc import SQLAlchemyError

class QuizService:
    def __init__(self, user_repo, quiz_repo, folder_repo):
        self.user_repo = user_repo
        self.quiz_repo = quiz_repo
        self.folder_repo = folder_repo
    
    def get_user_library(self, user_id:int):
        user = self.user_repo.get_by_id(user_id)

        folders = self.folder_repo.get_all_by_user(user)
        unorganized_quizzes = self.quiz_repo.get_unorganized_by_user(user_id)

        return {
        "folders": folders,
        "unorganized_quizzes": unorganized_quizzes
    }
    
    def get_quiz(self, quiz_id:int, user_id:int):
        quiz = self.quiz_repo.get_by_id(quiz_id)

        if not quiz:
            raise ValueError("Quiz não encontrado")

        if quiz.usuario_id != user_id:
            raise PermissionError("Acesso negado")

        return quiz
    
    def get_question_bank(self, user_id:int):
        user = self.user_repo.get_by_id(user_id)
        return self.quiz_repo.get_questions_by_user(user)
    
    def get_quizzes_from_folder(self, folder_id: int, user_id: int):
        folder = self.folder_repo.get_by_id(folder_id)
        if not folder or folder.usuario_id != user_id:
            raise PermissionError("Pasta não encontrada ou acesso negado.")

        return folder.quizzes.all()

    def create_quiz(self, quiz_schema, user_id, files):
        try:
            folder_id = quiz_schema.pasta_id
            
            if folder_id:
                folder = self.folder_repo.get_by_id(folder_id)
                if not folder or folder.usuario_id != user_id:
                    raise ValueError("A pasta selecionada é inválida ou não pertence ao seu usuário.")
                
            #QUIZ - Entidade pai
            data_quiz = quiz_schema.model_dump(exclude={'id', 'questoes', 'data_criacao', 'criador_original'}, by_alias=False)
            new_quiz = Quiz(**data_quiz,
                            usuario_id=user_id, 
                            criador_original_id=user_id,)
            
            self.quiz_repo.create(new_quiz)
            db.session.flush() #Sincroniza o estado da sessão com o banco de dados, sem finalizar a transação

            #QUESTAO - Entidade filha
            for index, q_schema in enumerate(quiz_schema.questoes, start=1):
                question_img_key = q_schema.image_path #Veio do frontend ex: img_question_1
                correction_img_key = q_schema.correction_img
                question_uuid = q_schema.id #UUID da questão vindo do frontend, para renomear as imagens com ids únicos

                if isinstance(q_schema.tipo_pergunta, TipoQuestao):
                    tipo_enum = q_schema.tipo_pergunta
                else:
                    tipo_enum = TipoQuestao.from_string(q_schema.tipo_pergunta)

                data_q = q_schema.model_dump(exclude={'tipo_pergunta', 'alternativas', 'image_path', 'correction_img', 'id'}, by_alias=False)

                new_question = Questao(**data_q,
                                       quiz_id=new_quiz.id,
                                       usuario_id=user_id,
                                       tipo_pergunta=tipo_enum)
                
                self.quiz_repo.create(new_question)
                db.session.flush()

                if files:
                    if (question_img_key and question_img_key in files):
                        path_question = save_image(
                            file=files[question_img_key],
                            filename_base=f'q_{question_uuid}',
                            subfolders=[user_id, new_quiz.id, new_question.id]
                        )

                        if path_question:
                            new_question.image_path = path_question
                    
                    if (correction_img_key and correction_img_key in files):
                        path_correction = save_image(
                            file=files[correction_img_key],
                            filename_base=f'correction_{question_uuid}',
                            subfolders=[user_id, new_quiz.id, new_question.id]
                        )

                        if path_correction:
                            new_question.correction_img = path_correction

                #ALTERNATIVA - Entidade neta
                for a_schema in q_schema.alternativas:
                    data_a = a_schema.model_dump(exclude={'id'}, by_alias=False)
                    new_alternative = Alternativa(**data_a,
                                                  questao_id=new_question.id)
                    
                    self.quiz_repo.create(new_alternative)

            db.session.commit()
            return new_quiz
        
        except ValueError as e:
            db.session.rollback()
            raise ValueError(f'Erro de validação ao criar o quiz: {e}')
        
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f'Erro de integridade ao criar o quiz - {e}')
        
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Erro inesperado no servidor: {e}")
        
    def move_quiz_to_folder(self, quiz_id: int, folder_id: int, user_id: int):
        quiz = self.quiz_repo.get_by_id(quiz_id)
        if not quiz or quiz.usuario_id != user_id:
            raise PermissionError("Quiz não encontrado ou acesso negado.")
        
        if folder_id is not None:
            folder = self.folder_repo.get_by_id(folder_id)
            if not folder or folder.usuario_id != user_id:
                raise PermissionError('Pasta de destino não encontrada ou acesso negado.')
            
        quiz.pasta_id = folder_id
        db.session.commit()

        return quiz
            
    def delete_quiz(self, quiz_id: int, user_id: int):
        quiz = self.quiz_repo.get_by_id(quiz_id)
        if not quiz or quiz.usuario_id != user_id:
            raise PermissionError("Permissão negada para excluir")

        self.quiz_repo.delete(quiz)
        db.session.commit()