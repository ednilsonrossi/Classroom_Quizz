from app.models import Usuario, TipoConta
from datetime import datetime
from app.utils.db import db

class UserRepository:

    #Métodos de Busca

    def get_by_id(self, user_id: int) -> Usuario | None:
        return Usuario.query.get(user_id)
    
    def get_by_email(self, email: str) -> Usuario | None:
        return Usuario.query.filter_by(email=email).first()
    
    def get_by_username(self, username: str) -> Usuario | None:
        return Usuario.query.filter_by(username=username).first()
    
    
    #Métodos de Cadastro e Edição
    def update_password(self, user: Usuario, new_password: str):
        user.cripto_pwd = new_password
        db.session.commit()

    def update_and_commit(self, usuario:Usuario):
        db.session.commit()

    def create_user(self, user_data: dict) -> Usuario:

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

    def confirm_user_account(self, usuario: Usuario):
        usuario.confirm_user = True
        db.session.commit()



       