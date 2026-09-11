from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.serializers import FolderSchema, QuizLibrarySchema
from app.services import FolderService, QuizService
from app.repositories import user_repo, folder_repo, quiz_repo
from pydantic import ValidationError

folder = Blueprint('folder', __name__)
folder_service = FolderService(folder_repo)
quiz_service = QuizService(user_repo, quiz_repo, folder_repo)

@folder.get('')
@jwt_required()
def list_folders():
    user_id = get_jwt_identity()
    user = user_repo.get_by_id(user_id) 
    
    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 404

    folders = folder_service.get_user_folders(user)
    
    return jsonify([
        FolderSchema.model_validate(f).model_dump(by_alias=True) 
        for f in folders
    ]), 200

@folder.get('/library/<int:folder_id>/quizzes')
@jwt_required()
def get_folder_contents(folder_id):
    user_id = int(get_jwt_identity())
    
    try:    
        folder_obj = folder_repo.get_by_id(folder_id)
        if not folder_obj or folder_obj.usuario_id != user_id:
            return jsonify({"error": "Pasta não encontrada"}), 404
        
        quizzes = quiz_service.get_quizzes_from_folder(folder_id, user_id) 
        
        return jsonify({
            'folderName': folder_obj.nome,
            'folderDescription': folder_obj.descricao,
            'quizzes':[
            QuizLibrarySchema.model_validate(q).model_dump(by_alias=True) 
            for q in quizzes
        ]}), 200
        
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:

        import traceback
        traceback.print_exc()
        return jsonify({"error": "Erro ao carregar conteúdo da pasta"}), 500
    
@folder.post('/create')
@jwt_required()
def create_folder():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    try:
        folder_schema = FolderSchema(**data)
        
        new_folder = folder_service.create_folder(folder_schema, user_id)
        
        return jsonify({
            "message": "Pasta criada com sucesso!",
            "id": new_folder.id
        }), 201

    except ValidationError as e:
        return jsonify({"error": "Dados inválidos", "details": e.errors()}), 400
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Erro interno no servidor"}), 500

@folder.delete('/delete/<int:folder_id>')
@jwt_required()
def delete_folder(folder_id):
    user_id = int(get_jwt_identity())
    
    try:
        folder_service.delete_folder(folder_id, user_id)
        return jsonify({"message": "Pasta excluída com sucesso"}), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": "Erro ao excluir pasta"}), 500