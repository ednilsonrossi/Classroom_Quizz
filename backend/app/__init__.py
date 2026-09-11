from flask import Flask
from config import config_dict
from flask_migrate import Migrate
from flask_cors import CORS
from app.utils.extensions import bcrypt, jwt
from app.utils import jwt_handlers
from app.utils.db import db


def create_app(config_name='default'):
    app = Flask(__name__)

    app.config.from_object(config_dict[config_name])

    CORS(app, 
        supports_credentials=True, 
        origins=app.config.get('CORS_ORIGINS', []),
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )
    db.init_app(app)
    Migrate(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    from app.routes import register_blueprint
    register_blueprint(app)

    # #backup do banco de dados
    # @app.route('/gerar-dump', methods=['GET'])
    # def gerar_dump():
    #     gerar_dump_usuarios('../backups')
    #     return "Dump gerado com sucesso!"

    # @app.route('/limpar-sessao')
    # def limpar_sessao():
    #     session.clear()
    #     flash('Sessão de cadastro limpa. Você pode começar de novo.', 'info')
    #     return redirect(url_for('cadastro.cadastro_01'))

    return app









