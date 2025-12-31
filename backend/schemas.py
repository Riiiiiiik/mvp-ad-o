from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class LeadBase(BaseModel):
    nome: str
    whatsapp: str
    email: Optional[EmailStr] = None
    origem: Optional[str] = None
    usuario_id: Optional[int] = None
    anotacoes: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class LeadUpdate(BaseModel):
    status: Optional[str] = None
    anotacoes: Optional[str] = None
    usuario_id: Optional[int] = None

class Lead(LeadBase):
    id: int
    status: str
    usuario_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "vendedor"

class User(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True

class PropertyImageBase(BaseModel):
    image_url: str
    thumb_url: Optional[str] = None
    ordem: Optional[int] = 0

class PropertyImage(PropertyImageBase):
    id: int
    property_id: int

    class Config:
        from_attributes = True

class PropertyBase(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    preco: Optional[str] = None
    condominio: Optional[str] = None
    iptu: Optional[str] = None
    localizacao: Optional[str] = None
    tipo: Optional[str] = None
    quartos: Optional[int] = 0
    banheiros: Optional[int] = 0
    vagas: Optional[int] = 0
    area: Optional[str] = None
    status: Optional[str] = "ATIVO"
    video_url: Optional[str] = None
    main_image_url: Optional[str] = None
    thumb_image_url: Optional[str] = None
    is_destaque: Optional[int] = 0
    images: Optional[List[PropertyImageBase]] = []

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    preco: Optional[str] = None
    condominio: Optional[str] = None
    iptu: Optional[str] = None
    localizacao: Optional[str] = None
    tipo: Optional[str] = None
    quartos: Optional[int] = None
    banheiros: Optional[int] = None
    vagas: Optional[int] = None
    area: Optional[str] = None
    status: Optional[str] = None
    video_url: Optional[str] = None
    main_image_url: Optional[str] = None
    thumb_image_url: Optional[str] = None
    is_destaque: Optional[int] = None
    images: Optional[List[PropertyImageBase]] = None

class Property(PropertyBase):
    id: int
    views_count: int
    images: List[PropertyImage] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    leads_today: int
    leads_week: int
    active_properties: int
    total_views: int

class SiteConfigBase(BaseModel):
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_image_url: Optional[str] = None
    footer_phone: Optional[str] = None
    footer_whatsapp: Optional[str] = None
    footer_address: Optional[str] = None
    footer_hours: Optional[str] = None
    footer_email: Optional[str] = None

class SiteConfigUpdate(SiteConfigBase):
    pass

class SiteConfig(SiteConfigBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True

class AuditLogBase(BaseModel):
    user_id: int
    user_email: str
    acao: str
    recurso_tipo: str
    recurso_id: Optional[int] = None
    detalhes: Optional[str] = None

class AuditLog(AuditLogBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
