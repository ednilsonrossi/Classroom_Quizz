from pydantic import BaseModel, EmailStr, ConfigDict, Field, field_validator, model_validator
from datetime import date
from typing import Optional
import enum

class UserRole(str, enum.Enum):
    aluno = 'aluno'
    professor = 'professor'

class UserSchema(BaseModel):
    #Integração com ORM's (SQLAlchemy)
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True, #permite utilizar o alias
        use_enum_values=True
    )

    id: Optional[int] = None
    email: EmailStr
    full_name: str = Field(..., alias="nome_completo", min_length=3, max_length=100)
    username: str = Field(..., min_length=3, max_length=100)
    account_type: UserRole = Field(UserRole.aluno, alias="tipo_conta")
    birth_date: Optional[date] = Field(None, alias="nascimento")

    @field_validator('birth_date')
    @classmethod
    def validar_limites_nascimento(cls, v: Optional[date]):
        if v is None:
            return v
            
        hoje = date.today()
        limite_100_anos = hoje.replace(year=hoje.year - 100)

        if v >= hoje:
            raise ValueError("A data de nascimento não pode ser hoje ou no futuro.")
        if v <= limite_100_anos:
            raise ValueError("A data de nascimento parece ser muito antiga. Por favor verifique.")
            
        return v
    
    @model_validator(mode='after')
    def validar_idade_por_tipo(self) -> 'UserSchema':
        if not self.birth_date:
            # Se a data de nascimento não for obrigatória no momento, pula a validação.
            return self

        hoje = date.today()
        nascimento = self.birth_date
        
        idade = hoje.year - nascimento.year - ((hoje.month, hoje.day) < (nascimento.month, nascimento.day))

        if self.account_type == UserRole.professor and idade < 18:
            raise ValueError("Professores devem ter pelo menos 18 anos.")
            
        if self.account_type == UserRole.aluno and idade < 13:
            raise ValueError("Alunos devem ter pelo menos 13 anos para criar uma conta.")

        return self
