from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.repositories import user_repo, quiz_repo
from app.services import DashboardService
from app.serializers import DashboardSummarySchema

dashboard = Blueprint('dashboard', __name__)

@dashboard.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    user_id = get_jwt_identity()
    user = user_repo.get_by_id(user_id)
    
    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 404
    
    try:
        service = DashboardService(user_repo, quiz_repo)

        data = service.get_summary(user_id)
        summary_validated = DashboardSummarySchema(**data)

        return jsonify(summary_validated.model_dump(by_alias=True)), 200
    
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": "Erro interno ao processar o dashboard", "details": str(e)}), 500


