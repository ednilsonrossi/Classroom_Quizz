from pydantic import BaseModel, ConfigDict, Field, field_serializer, field_validator
from typing import List, Optional, Union
from datetime import datetime
from app.models import  TipoQuestao 

class BaseSchema(BaseModel):
    model_config = ConfigDict(
        from_attributes=True, 
        populate_by_name=True)

class AlternativeSchema(BaseSchema):
    id: Optional[Union[int, str]] = None
    texto: str = Field(..., alias='text')
    is_correct: bool

class QuestionSchema(BaseSchema):
    id: Optional[Union[int, str]] = None
    texto: str = Field(..., alias='text')
    image_path: Optional[str] = Field(None, alias='image')
    tipo_pergunta: TipoQuestao = Field(..., alias="typeQuestion")
    ponto: int = Field(10, alias='point')
    tempo: int = Field(60, alias='time')
    ordem: int = Field(..., alias='order')
    descricao: Optional[str] = Field(None, alias='description' )
    correction: Optional[str] = None 
    correction_img: Optional[str] = None 
    alternativas: List[AlternativeSchema] = Field(default_factory=list, alias='alternatives')

    @field_validator('tipo_pergunta', mode='before')
    @classmethod
    def validate_tipo_pergunta(cls, v):
        if isinstance(v, TipoQuestao):
            return v
        if isinstance(v, str):
            return TipoQuestao.from_string(v)
        return v

    @field_serializer("tipo_pergunta")
    def serialize_tipo_pergunta(self, value):
        return value.name

class QuestionBankResponseSchema(BaseSchema):
    questions: List[QuestionSchema]

class QuizBaseSchema(BaseSchema):
    id: Optional[Union[int, str]] = None
    titulo: str = Field(..., alias='title', max_length=255)
    data_criacao: Optional[datetime] = Field(None, alias="createdAt")
    criador_original: Optional[str] = Field(None, alias='originalAuthor')
    pasta_id: Optional[int] = Field(None, alias='folder')
    publico: bool = Field(False, alias='public')

    @field_validator('criador_original', mode='before')
    @classmethod
    def get_author_name(cls, v):
        if v and hasattr(v, 'nome_completo'):
            return v.nome_completo
        return v

    @field_serializer('data_criacao')
    def serialize_date(self, dt: datetime):
        return dt.strftime('%d/%m/%Y %H:%M') if dt else None

class QuizLibrarySchema(QuizBaseSchema):
    questions_count: int = Field(..., alias="questionsCount")

class QuizFullSchema(QuizBaseSchema):
    questoes: List[QuestionSchema] = Field(default_factory=list, alias='questions')

class FolderSchema(BaseSchema):
    id: Optional[Union[int, str]] = None
    nome: str = Field(..., alias="name")
    descricao: Optional[str] = Field(None, alias='description')
    quizzes_count: Optional[int] = Field(0, alias="quizzesCount")

class LibraryResponseSchema(BaseSchema):
    folders: List[FolderSchema]
    unorganized_quizzes: List[QuizLibrarySchema] = Field(..., alias="unorganizedQuizzes")