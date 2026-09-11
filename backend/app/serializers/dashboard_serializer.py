from app.serializers import UserRole
from pydantic import BaseModel, Field, ConfigDict, field_serializer
from typing import List, Optional
from datetime import datetime

class DashboardUserSchema(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        use_enum_values=True
    )

    nome_completo: str = Field(..., alias="fullName")
    tipo_conta: UserRole = Field(..., alias="accountType")
class DashboardStatsSchema(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    contentCount: int = 0
    classCount: int = 0
    questionActiveCount: int = 0

class RecentQuizSchema(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        use_enum_values=True
    )

    id: Optional[int] = None
    titulo: str = Field(..., alias="title")
    data_criacao: Optional[datetime] = Field(None, alias="createdAt")

    @field_serializer('data_criacao') 
    def serialize_date(self, dt: Optional[datetime]): 
        if dt is None:
            return None
        return dt.strftime('%d/%m/%Y')

class DashboardSummarySchema(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        use_enum_values=True
    )

    user: DashboardUserSchema
    stats: DashboardStatsSchema
    recent_quizzes: List[RecentQuizSchema] = Field(..., alias="recentQuizzes")