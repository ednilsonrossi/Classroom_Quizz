from models.usuario import Usuario, TipoConta
from datetime import datetime
from utils.db import db

class UserRepository:

    #Métodos de Busca

    @staticmethod
    def get_by_id(user_id: int) -> Usuario | None:
        return Usuario.query.get(user_id)
    
    @staticmethod
    def get_by_email(email: str) -> Usuario | None:
        return Usuario.query.filter_by(email=email).first()
    
    @staticmethod
    def get_by_username(username: str) -> Usuario | None:
        return Usuario.query.filter_by(username=username).first()
    
    
    #Métodos de Cadastro e Edição
    @staticmethod
    def update_password(user: Usuario, new_password: str):
        user.cripto_pwd = new_password
        db.session.commit()

    @staticmethod
    def update_and_commit(usuario:Usuario):
        db.session.commit()

    @staticmethod
    def create_user(user_data: dict) -> Usuario:

        #Converte a string aluno ou professor para o objeto ENUM
        user_data['tipo_conta'] = TipoConta(user_data['tipo_conta'])

        data_nascimento = user_data.get('nascimento')
        if data_nascimento and isinstance(data_nascimento, str):
            try:
                #Converte string para o objeto datetime.date
                date_object = datetime.strptime(data_nascimento, "%a, %d %b %Y %H:%M:%S %Z")
                user_data['nascimento'] = date_object.date()
            except ValueError:
                user_data['nascimento'] = None

        user = Usuario(**user_data)
        db.session.add(user)
        db.session.commit()

        return user

    @staticmethod
    def confirm_user_account(usuario: Usuario):
        usuario.confirm_user = True
        db.session.commit()

#Uma única instância para todas as rotas
user_repo = UserRepository()

       