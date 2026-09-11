from app.models import PastaMateria, Quiz, Usuario
from app.utils.db import db
from typing import List, Optional

class FolderRepository:

    #Métodos de Busca
    def get_by_id(self, folder_id: int) -> Optional[PastaMateria]:
        return PastaMateria.query.get(folder_id)

    def get_all_by_user(self, user: Usuario) -> List[PastaMateria]:
        return user.pastas.all()
    
    #Métodos de Create, Update e Delete
    def create(self, folder: PastaMateria) -> None:
        db.session.add(folder)

    def update(self, folder: PastaMateria, new_folder: dict) -> PastaMateria:
        for key, value in new_folder.items():
            setattr(folder, key, value)
        return folder
    
    def delete(self, folder: PastaMateria) -> None:
        db.session.delete(folder)
