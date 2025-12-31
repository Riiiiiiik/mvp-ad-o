from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import models, schemas, database, auth_utils
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
import os

# OAuth2 setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS configuration (allow all for MVP)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Startup event to seed admin user
@app.on_event("startup")
def seed_admin():
    print("STARTUP: Running seeder...")
    db = database.SessionLocal()
    try:
        # Seed default admin
        admin_email = os.getenv("ADMIN_EMAIL", "admin@crm.com")
        admin = db.query(models.User).filter(models.User.email == admin_email).first()
        if not admin:
            print(f"STARTUP: Seeding admin user: {admin_email}")
            admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
            hashed_password = auth_utils.get_password_hash(admin_password)
            new_admin = models.User(email=admin_email, senha_hash=hashed_password, role="admin")
            db.add(new_admin)
            db.commit()

        # Seed requested user
        new_user_email = os.getenv("SECONDARY_ADMIN_EMAIL", "santosrik75@gmail.com")
        user = db.query(models.User).filter(models.User.email == new_user_email).first()
        if not user:
            print(f"STARTUP: Seeding requested user: {new_user_email}")
            admin_password = os.getenv("ADMIN_PASSWORD", "anjos777") # Reusing admin password or specific one
            hashed_password = auth_utils.get_password_hash(admin_password)
            new_user = models.User(email=new_user_email, senha_hash=hashed_password, role="admin") # Giving admin role for CRM access
            db.add(new_user)
            db.commit()
            print(f"STARTUP: User {new_user_email} seeded successfully!")
        else:
            print(f"STARTUP: User {new_user_email} already exists.")

        # Seed default SiteConfig
        config = db.query(models.SiteConfig).first()
        if not config:
            print("STARTUP: Seeding default site configuration...")
            default_config = models.SiteConfig(
                hero_title="ADÃO SILVA",
                hero_subtitle="Imóveis de Luxo & Investimentos Exclusivos",
                footer_phone="64 3671-3590",
                footer_whatsapp="556436713590",
                footer_address="Rua Rio Verde, esq. Rua Serra Dourada, Qd. 71, Lt. 01 - St. Montes Belos - São Luís de Montes Belos - GO",
                footer_hours="Seg - Sex: 08:00 - 18:00",
                footer_email="adaocandidosilva@hotmail.com"
            )
            db.add(default_config)
            db.commit()
            print("STARTUP: Site configuration seeded successfully!")
    except Exception as e:
        print(f"STARTUP ERROR: {e}")
    finally:
        db.close()

# Auth Helpers
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth_utils.SECRET_KEY, algorithms=[auth_utils.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

def log_action(db: Session, user: models.User, acao: str, recurso_tipo: str, recurso_id: int, detalhes: str):
    log = models.AuditLog(
        user_id=user.id,
        user_email=user.email,
        acao=acao,
        recurso_tipo=recurso_tipo,
        recurso_id=recurso_id,
        detalhes=detalhes
    )
    db.add(log)
    db.commit()

# Auth Endpoints
@app.post("/api/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth_utils.verify_password(form_data.password, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth_utils.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/leads", response_model=schemas.Lead, status_code=status.HTTP_201_CREATED)
def create_lead(lead: schemas.LeadCreate, db: Session = Depends(get_db)):
    db_lead = models.Lead(
        nome=lead.nome,
        whatsapp=lead.whatsapp,
        email=lead.email,
        origem=lead.origem,
        anotacoes=lead.anotacoes
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    
    # Alert (Mocked)
    print(f"ALERT: Novo Lead! Nome: {lead.nome}, WhatsApp: {lead.whatsapp}")
    
    return db_lead

@app.get("/api/leads", response_model=List[schemas.Lead])
def read_leads(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.Lead)
    
    # RBAC: Vendedores só veem seus próprios leads
    if current_user.role == "vendedor":
        query = query.filter(models.Lead.usuario_id == current_user.id)
        
    leads = query.order_by(models.Lead.created_at.desc()).offset(skip).limit(limit).all()
    return leads

@app.patch("/api/leads/{lead_id}", response_model=schemas.Lead)
def update_lead_status(lead_id: int, lead_update: schemas.LeadUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    if lead_update.status:
        db_lead.status = lead_update.status
    if lead_update.anotacoes:
        db_lead.anotacoes = lead_update.anotacoes
        
    db.commit()
    db.refresh(db_lead)
    return db_lead

# Property Endpoints
@app.post("/api/properties", response_model=schemas.Property, status_code=status.HTTP_201_CREATED)
def create_property(prop: schemas.PropertyCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Extrair imagens do schema
    images_data = prop.images if prop.images else []
    
    # Criar o dicionário removendo 'images' pois o modelo Property não tem esse campo como coluna direta
    prop_dict = prop.dict()
    if 'images' in prop_dict:
        del prop_dict['images']
        
    db_prop = models.Property(**prop_dict)
    db.add(db_prop)
    db.commit()
    db.refresh(db_prop)
    
    # Salvar as imagens vinculadas
    for img in images_data:
        db_img = models.PropertyImage(
            property_id=db_prop.id,
            image_url=img.image_url,
            thumb_url=img.thumb_url,
            ordem=img.ordem
        )
        db.add(db_img)
    
    db.commit()
    db.refresh(db_prop)
    return db_prop

@app.get("/api/properties", response_model=List[schemas.Property])
def read_properties(search: Optional[str] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.Property)
    if search:
        query = query.filter(
            (models.Property.titulo.ilike(f"%{search}%")) | 
            (models.Property.localizacao.ilike(f"%{search}%"))
        )
    properties = query.offset(skip).limit(limit).all()
    return properties

@app.get("/api/properties/{prop_id}", response_model=schemas.Property)
def read_property(prop_id: int, db: Session = Depends(get_db)):
    db_prop = db.query(models.Property).filter(models.Property.id == prop_id).first()
    if db_prop is None:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Increment view count (traditional counter)
    db_prop.views_count += 1
    
    # Record detailed view for analytics
    new_view = models.PropertyView(property_id=prop_id)
    db.add(new_view)
    
    db.commit()
    db.refresh(db_prop)
    return db_prop

@app.patch("/api/properties/{prop_id}", response_model=schemas.Property)
def update_property(prop_id: int, prop_update: schemas.PropertyUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_prop = db.query(models.Property).filter(models.Property.id == prop_id).first()
    if db_prop is None:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Track critical changes (e.g. Price)
    old_price = db_prop.preco
    
    # Extract images if present
    update_data = prop_update.dict(exclude_unset=True)
    images_data = None
    if 'images' in update_data:
        images_data = update_data.pop('images')

    for key, value in update_data.items():
        setattr(db_prop, key, value)
    
    # Handle Images Update
    if images_data is not None:
        # Remove old images
        db.query(models.PropertyImage).filter(models.PropertyImage.property_id == prop_id).delete()
        
        # Add new images with order
        for img in images_data:
            db_img = models.PropertyImage(
                property_id=prop_id,
                image_url=img['image_url'],
                thumb_url=img.get('thumb_url'),
                ordem=img.get('ordem', 0)
            )
            db.add(db_img)

    if prop_update.preco and prop_update.preco != old_price:
        log_action(db, current_user, "UPDATE_PRICE", "PROPERTY", prop_id, f"Preço alterado de {old_price} para {prop_update.preco}")
    else:
        log_action(db, current_user, "UPDATE_PROPERTY", "PROPERTY", prop_id, f"Imóvel '{db_prop.titulo}' atualizado")
        
    db.commit()
    db.refresh(db_prop)
    return db_prop

@app.delete("/api/properties/{prop_id}")
def delete_property(prop_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # RBAC: Apenas Admins podem apagar
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Apenas administradores podem excluir imóveis")
        
    db_prop = db.query(models.Property).filter(models.Property.id == prop_id).first()
    if db_prop is None:
        raise HTTPException(status_code=404, detail="Property not found")
    
    log_action(db, current_user, "DELETE_PROPERTY", "PROPERTY", prop_id, f"Imóvel '{db_prop.titulo}' excluído")
    
    db.delete(db_prop)
    db.commit()
    return {"detail": "Property deleted"}

# Dashboard Stats Endpoint
from datetime import datetime, timedelta

@app.get("/api/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    now = datetime.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=7)
    
    leads_today = db.query(models.Lead).filter(models.Lead.created_at >= today_start).count()
    leads_week = db.query(models.Lead).filter(models.Lead.created_at >= week_start).count()
    
    active_properties = db.query(models.Property).filter(models.Property.status == "ATIVO").count()
    
    total_views_result = db.query(func.sum(models.Property.views_count)).scalar()
    total_views = total_views_result if total_views_result is not None else 0
    
    return {
        "leads_today": leads_today,
        "leads_week": leads_week,
        "active_properties": active_properties,
        "total_views": total_views
    }

@app.get("/api/analytics/stats")
def get_analytics_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    try:
        now = datetime.now()
        
        # Get views per day for the last 7 days
        views_stats = []
        for i in range(7):
            day = (now - timedelta(days=i)).date()
            day_start = datetime.combine(day, datetime.min.time())
            day_end = datetime.combine(day, datetime.max.time())
            
            count = db.query(models.PropertyView).filter(
                models.PropertyView.timestamp >= day_start,
                models.PropertyView.timestamp <= day_end
            ).count()
            
            views_stats.append({
                "date": day.strftime("%d/%m"),
                "views": count
            })
        
        # Reverse to show chronological order
        views_stats.reverse()
        
        # Get most viewed properties (top 5)
        top_properties = db.query(
            models.Property.titulo, 
            models.Property.views_count
        ).order_by(models.Property.views_count.desc()).limit(5).all()
        
        formatted_top = []
        for p in top_properties:
            formatted_top.append({
                "titulo": p[0] if p[0] else "Sem Título",
                "views": p[1] if p[1] is not None else 0
            })
        
        # Simple conversion rate (leads / total views)
        total_leads = db.query(models.Lead).count()
        total_views_all = db.query(models.PropertyView).count()
        
        conversion_rate = 0
        if total_views_all > 0:
            conversion_rate = (total_leads / total_views_all) * 100
        
        return {
            "views_chart": views_stats,
            "top_properties": formatted_top,
            "conversion_rate": round(conversion_rate, 2),
            "total_leads": total_leads,
            "total_views": total_views_all
        }
    except Exception as e:
        print(f"ANALYTICS ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erro interno ao processar analítica: {str(e)}")

# CMS Endpoints
@app.get("/api/public/config", response_model=schemas.SiteConfig)
def get_site_config(db: Session = Depends(get_db)):
    config = db.query(models.SiteConfig).first()
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return config

@app.patch("/api/admin/config", response_model=schemas.SiteConfig)
def update_site_config(config_update: schemas.SiteConfigUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    config = db.query(models.SiteConfig).first()
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    
    for key, value in config_update.dict(exclude_unset=True).items():
        setattr(config, key, value)
        
    db.commit()
    db.refresh(config)
    return config

# Admin: User Management
@app.get("/api/admin/users", response_model=List[schemas.User])
def list_users(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")
    return db.query(models.User).all()

@app.post("/api/admin/users", response_model=schemas.User)
def create_user(user_in: schemas.UserCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    existing_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
        
    hashed_password = auth_utils.get_password_hash(user_in.password)
    new_user = models.User(
        email=user_in.email,
        senha_hash=hashed_password,
        role=user_in.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    log_action(db, current_user, "CREATE_USER", "USER", new_user.id, f"Novo usuário criado: {new_user.email} ({new_user.role})")
    
    return new_user

# Admin: Audit Logs
@app.get("/api/admin/audit-logs", response_model=List[schemas.AuditLog])
def list_audit_logs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")
    return db.query(models.AuditLog).order_by(models.AuditLog.timestamp.desc()).limit(100).all()
