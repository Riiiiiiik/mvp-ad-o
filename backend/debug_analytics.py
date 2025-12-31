import database, models
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

db = database.SessionLocal()
try:
    print("--- Testando Queries de Analítica ---")
    
    print("1. Contagem de PropertyView...")
    p_view_count = db.query(models.PropertyView).count()
    print(f"   Resultado: {p_view_count}")
    
    print("2. Listagem de Imóveis (titulo, views_count)...")
    props = db.query(models.Property.titulo, models.Property.views_count).limit(5).all()
    print(f"   Resultado: {props}")
    
    print("3. Contagem de Leads...")
    leads_count = db.query(models.Lead).count()
    print(f"   Resultado: {leads_count}")
    
    print("4. Teste de filtro por data...")
    now = datetime.now()
    day_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    d_count = db.query(models.PropertyView).filter(models.PropertyView.timestamp >= day_start).count()
    print(f"   Resultado: {d_count}")
    
    print("--- Todos os testes de banco completados com sucesso! ---")

except Exception as e:
    print("\n!!! ERRO DETECTADO !!!")
    print(f"Mensagem: {str(e)}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
