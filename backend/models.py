from sqlalchemy import Column, Integer, String, Text, DateTime, TIMESTAMP, func, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100))
    whatsapp = Column(String(20), nullable=False)
    origem = Column(String(50))
    status = Column(String(20), server_default="NOVO")
    usuario_id = Column(Integer, nullable=True) # ID do corretor responsável
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class User(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    role = Column(String(20), server_default="vendedor")

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100), nullable=False)
    descricao = Column(Text)
    preco = Column(String(50))
    
    # Financials
    condominio = Column(String(50))
    iptu = Column(String(50))
    
    # Characteristics
    localizacao = Column(String(100))
    tipo = Column(String(50))
    quartos = Column(Integer, default=0)
    banheiros = Column(Integer, default=0)
    vagas = Column(Integer, default=0)
    area = Column(String(50)) # e.g., "120m2"
    
    # Media & Status
    status = Column(String(20), server_default="ATIVO")
    video_url = Column(String(255))
    main_image_url = Column(Text) # Base64 for now
    thumb_image_url = Column(Text) # Base64 for now (mobile version)
    is_destaque = Column(Integer, default=0) # 0 or 1
    
    views_count = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationship to images
    images = relationship("PropertyImage", back_populates="property", cascade="all, delete-orphan", order_by="PropertyImage.ordem")

class PropertyImage(Base):
    __tablename__ = "property_images"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    image_url = Column(Text) # Base64 WebP Desktop
    thumb_url = Column(Text) # Base64 WebP Mobile
    ordem = Column(Integer, default=0)

    property = relationship("Property", back_populates="images")

class PropertyView(Base):
    __tablename__ = "property_analytics"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, index=True)
    timestamp = Column(TIMESTAMP, server_default=func.now())

class SiteConfig(Base):
    __tablename__ = "site_config"

    id = Column(Integer, primary_key=True, index=True)
    hero_title = Column(String(255))
    hero_subtitle = Column(Text)
    hero_image_url = Column(Text) # Base64 WebP
    
    footer_phone = Column(String(50))
    footer_whatsapp = Column(String(50))
    footer_address = Column(Text)
    footer_hours = Column(String(255))
    footer_email = Column(String(100))
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    user_email = Column(String(100))
    acao = Column(String(50)) # Ex: UPDATE_PRICE, DELETE_PROPERTY
    recurso_tipo = Column(String(50)) # Ex: PROPERTY, LEAD
    recurso_id = Column(Integer, nullable=True)
    detalhes = Column(Text) # JSON ou descrição das mudanças
    timestamp = Column(TIMESTAMP, server_default=func.now())
