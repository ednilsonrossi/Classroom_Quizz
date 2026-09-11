from app.models import PastaMateria
from app.utils.db import db

class FolderService:
    def __init__(self, folder_repo):
        self.folder_repo = folder_repo

    def create_folder(self, folder_schema, user_id: int):
        try:
            new_folder = PastaMateria(
            nome=folder_schema.nome,
            descricao=folder_schema.descricao,
            usuario_id=int(user_id)
            )

            self.folder_repo.create(new_folder)

            db.session.commit()
            return new_folder

        except Exception as e:
            db.session.rollback()
            if 'uq_usuario_nome_pasta' in str(e):
                raise ValueError("Você já possui uma pasta com este nome.")
            raise e
        
    def get_user_folders(self, user):
        return self.folder_repo.get_all_by_user(user)
    
    def update_folder(self, folder_id: int, user_id: int, folder_schema):
        folder = self.folder_repo.get_by_id(folder_id)
        
        if not folder or folder.usuario_id != user_id:
            raise PermissionError("Pasta não encontrada ou acesso negado.")
            
        data_folder = folder_schema.model_dump(exclude={'id', 'quizzes_count'})
        self.folder_repo.update(folder, data_folder)
        
        db.session.commit()
        return folder
    
    def delete_folder(self, folder_id:int, user_id:int):
        folder = self.folder_repo.get_by_id(folder_id)
        if not folder or folder.usuario_id != user_id:
            raise PermissionError("Permissão negada para excluir")
        
        self.folder_repo.delete(folder)
        db.session.commit()