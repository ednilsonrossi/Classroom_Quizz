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

    def create_user(self, user_schema, password) -> Usuario:
        serialize_data =  user_schema.model_dump(by_alias=True, exclude={'id'})

        user = Usuario(**serialize_data, senha=password)
        db.session.add(user)

        return user

    def confirm_user_account(self, usuario: Usuario):
        usuario.confirm_user = True



       