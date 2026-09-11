import os
from flask import Blueprint, jsonify, request, json
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.repositories import user_repo, quiz_repo, folder_repo
from app.serializers import QuizFullSchema, QuizLibrarySchema, LibraryResponseSchema, QuestionBankResponseSchema
from app.services import QuizService
from pydantic import ValidationError
import traceback

quiz = Blueprint('quiz', __name__)
quiz_service = QuizService(user_repo, quiz_repo, folder_repo)

@quiz.get('/library')
@jwt_required()
def get_library():
    try:
        user_id = get_jwt_identity()   
        library_data = quiz_service.get_user_library(user_id)
        
        return jsonify(LibraryResponseSchema.model_validate(library_data).model_dump(by_alias=True)), 200
    except Exception as e:
        return jsonify({'erro': f'Erro ao carregar biblioteca de quizzes - {e}'}), 500

@quiz.get('/questions-bank')
@jwt_required()
def get_question_bank():
    try:
        user_id = int(get_jwt_identity())

        questions_data = quiz_service.get_question_bank(user_id)
        question_serializer = QuestionBankResponseSchema(questions=questions_data)
        
        return jsonify(question_serializer.model_dump(by_alias=True)), 200
    
    except Exception as e:
        return jsonify({'erro': f'Erro ao carregar banco de questões - {e}'}), 500
    

@quiz.post('/create')
@jwt_required()
def create_quiz():
    user_id = get_jwt_identity()

    title = request.form.get('title')
    questions_raw = json.loads(request.form.get('questions', '[]'))
    folder_id = request.form.get('folder')
    public_value = request.form.get("public", "false").lower() == "true"

    print("--- DADOS RECEBIDOS ---")
    print("Title:", request.form.get('title'))
    print("Questions Raw String:", request.form.get('questions'))

    data = {
        "title": title,
        "questions": questions_raw,
        "folder": folder_id if folder_id and folder_id != 'null' else None,
        'public': public_value
    }

    try:
        quiz_schema = QuizFullSchema(**data)
        new_quiz = quiz_service.create_quiz(quiz_schema, user_id, files=request.files)
        
        return jsonify({
            'mensagem':'Quiz criado com sucesso',
            "id": new_quiz.id
            }), 201,
    
    except ValidationError as e:
        return jsonify({"error": "Dados inválidos", "details": e.errors()}), 400
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Erro interno no servidor"}), 500
    
@quiz.get('/<int:quiz_id>')
@jwt_required()
def get_quiz(quiz_id:int):
    try:
        user_id = int(get_jwt_identity())

        quiz_data = quiz_service.get_quiz(quiz_id, user_id)
        quiz_serializer = QuizFullSchema.model_validate(quiz_data)

        return jsonify(quiz_serializer.model_dump(by_alias=True)), 200

    except PermissionError as e:
        return jsonify({"error": str(e)}), 403

    except ValueError as e:
        return jsonify({"error": str(e)}), 404

    except Exception:
        return jsonify({"error": "Erro interno"}), 500

@quiz.patch('/<int:quiz_id>/folder')
@jwt_required()
def move_quiz(quiz_id:int):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    folder_id = data.get('folderId')

    try:
        quiz_service.move_quiz_to_folder(quiz_id, folder_id, user_id)

        return jsonify({
            "message": "Quiz movido com sucesso!",
            "quizId": quiz_id,
            "folderId": folder_id
        }), 200

    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        print(f"Erro ao mover quiz: {e}")
        return jsonify({"error": "Erro interno ao mover quiz"}), 500

    
@quiz.delete('/delete/<int:quiz_id>')
@jwt_required()
def delete_quiz(quiz_id):
    user_id = int(get_jwt_identity())

    try:
        quiz_service.delete_quiz(quiz_id, user_id)
        return jsonify({"message": "Quiz excluído com sucesso"}), 200
    except PermissionError:
        return jsonify({"error": "Acesso negado"}), 403
    except ValueError:
        return jsonify({"error": "Quiz não encontrado"}), 404
    except Exception:
        return jsonify({"error": "Erro ao excluir quiz"}), 500