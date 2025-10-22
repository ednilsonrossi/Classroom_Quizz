from flask import redirect, render_template,  url_for, flash, jsonify, request
from flask_login import current_user, login_required
from repositories import quiz_repo
from models import Alternativa, Questao, Quiz
from . import quiz

#Serialização (Conversão de Objeto python para JSON - Usado quando retorna os dados para o frontend)
def serialize_alternativa(alternativa:Alternativa):
    return{
        'id': alternativa.id,
        'texto': alternativa.texto,
        'is_correct': alternativa.is_correct
    }
def serialize_questao(questao:Questao):
    return{
        'id': questao.id,
        "texto": questao.texto,
        "tipo_pergunta": questao.tipo_pergunta.value, 
        "ponto": questao.ponto,
        "tempo": questao.tempo,
        "ordem": questao.ordem,
        "descricao": questao.descricao,
        "correcao_txt": questao.correcao_txt,
        "alternativas": [serialize_alternativa(i) for i in questao.alternativas] 
    }
def serialize_quiz(quiz:Quiz):
    return{
        "id": quiz.id,
        "titulo": quiz.titulo,
        "publico": quiz.publico,
        "data_criacao": quiz.data_criacao.isoformat() if quiz.data_criacao else None,
        "usuario_id": quiz.usuario_id,
        "pasta_id": quiz.pasta_id,
        "questoes": [serialize_questao(q) for q in quiz.questoes] 
    }

@quiz.route('/')
@login_required
def listar_quizzes():
    try:
        quizzes = quiz_repo.listar_quizzes_do_usuario(current_user.id)
        data = [serialize_quiz(q) for q in quizzes]
        return jsonify(data), 200
    except Exception:
        # Se ocorrer um erro no repositório/DB
        return jsonify({"erro": "Falha ao carregar a lista de quizzes."}), 500

@quiz.route('/create', methods=['POST', 'GET'])
@login_required
def create_quiz():

    data = request.get_json()
    usuario_id = current_user.id
    pasta_id = data.pop('pasta_id', None)

    if not data:
        return jsonify({'erro':'Nenhum JSON fornecido'
                        }), 400

    try:
        novo_quiz = quiz_repo.create_quiz_json(data, usuario_id, pasta_id)
        return jsonify({'mensagem':'Quiz criado com sucesso',
                        'quiz': serialize_quiz(novo_quiz)
                        }), 201
    except ValueError as e:
        return jsonify({"erro": str(e)
                        }), 400 
    except Exception:
        return jsonify({"erro": "Ocorreu um erro ao criar o Quiz."
                        }), 500
    
    

