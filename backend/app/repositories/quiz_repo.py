from app.models import Quiz, Questao, TipoQuestao, Alternativa
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from app.utils.db import db
import json

class QuizRepository:
    def create_quiz_json(self, json_data, usuario_id, pasta_id=None):
        titulo = json_data.get('titulo')
        publico = json_data.get('publico', False)
        questoes_data = json_data.get('questoes', [])

        if not titulo or not questoes_data:
            raise ValueError("Título e Questões são obrigatórios para a criação do Quiz.")
        
        try:
            #QUIZ - Entidade pai

            novo_quiz = Quiz(titulo=titulo, 
                             usuario_id=usuario_id, 
                             criador_original_id=usuario_id, 
                             publico=publico, 
                             pasta_id=pasta_id)
            
            db.session.add(novo_quiz)
            db.session.flush() #Sincroniza o estado da sessão com o banco de dados, sem finalizar a transação

            #QUESTAO - Entidade filha
            for indice, q_data in enumerate(questoes_data, start=1):
                tipo_questao_str = q_data.get('tipo_pergunta')
                tipo_enum = TipoQuestao.from_string(tipo_questao_str)

                nova_questao = Questao(quiz_id=novo_quiz.id,
                                       usuario_id=usuario_id,
                                       texto=q_data.get('texto'),
                                       tipo_pergunta=tipo_enum,
                                       descricao=q_data.get('descricao'),
                                       ponto=q_data.get('ponto', 10),
                                       tempo=q_data.get('tempo', 60),
                                       ordem=q_data.get('ordem', indice),
                                       correcao_txt=q_data.get('correcao_txt'),
                                       correcao_img=q_data.get('correcao_img'))
                
                db.session.add(nova_questao)
                db.session.flush()

                #ALTERNATIVA - Entidade neta
                for a_data in q_data.get('alternativas', []):
                    nova_alternativa = Alternativa(questao_id=nova_questao.id,
                                                   texto=a_data.get('texto'),
                                                   is_correct=a_data.get('is_correct', False))
                    
                    db.session.add(nova_alternativa)

            db.session.commit()
            return novo_quiz
        
        except ValueError as e:
            db.session.rollback()
            raise ValueError(f'Erro de validação ao criar o quiz: {e}')
        
        except SQLAlchemyError as e:
            raise Exception(f'Erro no banco de dados ao criar o quiz - {e}')
        


