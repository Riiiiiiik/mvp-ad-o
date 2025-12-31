-- SUPABASE SCHEMA V2 (Serverless / Native)
-- WARNING: This script drops existing tables to ensure clean slate with UUIDs. Only run if you are okay losing local data or on a fresh project.

-- 1. Reset (Optional, comment out if you want to keep data but it might conflict with type changes)
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS site_config;
DROP TABLE IF EXISTS property_analytics;
DROP TABLE IF EXISTS property_images;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS usuarios;

-- 2. Create Tables with RLS and Policies

-- Trigger to create a public profile when a user signs up via Supabase Auth
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'vendedor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 3. LEADS (Linked to UUID users)
CREATE TABLE IF NOT EXISTS public.leads (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    whatsapp VARCHAR(20) NOT NULL,
    origem VARCHAR(50),
    status VARCHAR(20) DEFAULT 'NOVO',
    usuario_id UUID REFERENCES public.usuarios(id), -- Changed to UUID
    anotacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. PROPERTIES (Properties are largely public read, admin write)
CREATE TABLE IF NOT EXISTS public.properties (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco VARCHAR(50),
    condominio VARCHAR(50),
    iptu VARCHAR(50),
    localizacao VARCHAR(100),
    tipo VARCHAR(50),
    quartos INTEGER DEFAULT 0,
    banheiros INTEGER DEFAULT 0,
    vagas INTEGER DEFAULT 0,
    area VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ATIVO',
    video_url VARCHAR(255),
    main_image_url TEXT,
    thumb_image_url TEXT,
    is_destaque INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- 5. PROPERTY IMAGES
CREATE TABLE IF NOT EXISTS public.property_images (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT,
    thumb_url TEXT,
    ordem INTEGER DEFAULT 0
);
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- 6. ANALYTICS
CREATE TABLE IF NOT EXISTS public.property_analytics (
    id SERIAL PRIMARY KEY,
    property_id INTEGER, 
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.property_analytics ENABLE ROW LEVEL SECURITY;

-- 7. SITE CONFIG
CREATE TABLE IF NOT EXISTS public.site_config (
    id SERIAL PRIMARY KEY,
    hero_title VARCHAR(255),
    hero_subtitle TEXT,
    hero_image_url TEXT,
    footer_phone VARCHAR(50),
    footer_whatsapp VARCHAR(50),
    footer_address TEXT,
    footer_hours VARCHAR(255),
    footer_email VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- 8. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.usuarios(id), -- Changed to UUID
    user_email VARCHAR(100),
    acao VARCHAR(50),
    recurso_tipo VARCHAR(50),
    recurso_id INTEGER,
    detalhes TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- --- RLS POLICIES ---

-- USERS (Profiles)
-- Readable by owner and admins
CREATE POLICY "Users can view own profile" ON public.usuarios FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.usuarios FOR SELECT USING (
  exists (select 1 from public.usuarios where id = auth.uid() and role = 'admin')
);
-- Only Admins can update roles (or self update basic info if needed)
CREATE POLICY "Admins can update profiles" ON public.usuarios FOR UPDATE USING (
  exists (select 1 from public.usuarios where id = auth.uid() and role = 'admin')
);

-- LEADS
-- Normal users see only their leads, Admins see all
CREATE POLICY "Vendedores see own leads" ON public.leads FOR SELECT USING (
  auth.uid() = usuario_id OR 
  exists (select 1 from public.usuarios where id = auth.uid() and role = 'admin')
);
CREATE POLICY "Vendedores insert leads" ON public.leads FOR INSERT WITH CHECK (
  auth.uid() = usuario_id OR 
  exists (select 1 from public.usuarios where id = auth.uid() and role = 'admin')
);
CREATE POLICY "Vendedores update own leads" ON public.leads FOR UPDATE USING (
  auth.uid() = usuario_id OR 
  exists (select 1 from public.usuarios where id = auth.uid() and role = 'admin')
);

-- PROPERTIES & IMAGES
-- Public Read, Admin Write
CREATE POLICY "Public read properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Admin write properties" ON public.properties FOR ALL USING (
  exists (select 1 from public.usuarios where id = auth.uid() and role = 'admin')
);
CREATE POLICY "Public read property images" ON public.property_images FOR SELECT USING (true);
CREATE POLICY "Admin write property images" ON public.property_images FOR ALL USING (
  exists (select 1 from public.usuarios where id = auth.uid() and role = 'admin')
);

-- SITE CONFIG
-- Public Read, Admin Write
CREATE POLICY "Public read config" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Admin write config" ON public.site_config FOR ALL USING (
  exists (select 1 from public.usuarios where id = auth.uid() and role = 'admin')
);

-- ANALYTICS (Insert public/anon for tracking, Read Admin only)
CREATE POLICY "Public insert analytics" ON public.property_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read analytics" ON public.property_analytics FOR SELECT USING (
  exists (select 1 from public.usuarios where id = auth.uid() and role = 'admin')
);

-- AUDIT LOGS
-- Admin Read Only, Insert managed by triggers/functions usually, but allowing app to write for MVP
CREATE POLICY "Admin read audit" ON public.audit_logs FOR SELECT USING (
  exists (select 1 from public.usuarios where id = auth.uid() and role = 'admin')
);
CREATE POLICY "Auth users insert audit" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);


-- --- TRIGGER FOR NEW USERS ---
-- Automatically create a profile in public.usuarios when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, role)
  VALUES (new.id, new.email, 'vendedor'); -- Default role
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- SEED CONFIG (Default)
INSERT INTO public.site_config (
    hero_title, hero_subtitle, footer_phone, footer_whatsapp, footer_address, footer_hours, footer_email
) VALUES (
    'ADÃO SILVA',
    'Imóveis de Luxo & Investimentos Exclusivos',
    '64 3671-3590',
    '556436713590',
    'Rua Rio Verde, esq. Rua Serra Dourada, Qd. 71, Lt. 01 - St. Montes Belos - São Luís de Montes Belos - GO',
    'Seg - Sex: 08:00 - 18:00',
    'adaocandidosilva@hotmail.com'
);
