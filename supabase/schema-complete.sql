-- 📊 ESQUEMA COMPLETO DE BASE DE DATOS TRACKPORT
-- Ejecutar en Supabase SQL Editor después de crear el proyecto

-- =====================================================
-- 1. EXTENSIONES NECESARIAS
-- =====================================================

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. TABLAS PRINCIPALES
-- =====================================================

-- Tabla de contenedores
CREATE TABLE IF NOT EXISTS public.containers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    container_number VARCHAR(50) NOT NULL UNIQUE,
    client_name VARCHAR(255),
    client_email VARCHAR(255),
    origin_port VARCHAR(100),
    destination_port VARCHAR(100),
    status VARCHAR(50) DEFAULT 'received',
    estimated_arrival DATE,
    actual_arrival DATE,
    weight_kg DECIMAL(10,2),
    dimensions VARCHAR(100),
    cargo_description TEXT,
    bl_number VARCHAR(100),
    invoice_number VARCHAR(100),
    client_id UUID REFERENCES auth.users(id),
    assigned_broker UUID REFERENCES auth.users(id),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Tabla de cartas de instrucción
CREATE TABLE IF NOT EXISTS public.instruction_letters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    container_id UUID REFERENCES public.containers(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id),
    letter_number VARCHAR(100) UNIQUE,
    status VARCHAR(50) DEFAULT 'draft',
    document_url TEXT,
    document_name VARCHAR(255),
    special_instructions TEXT,
    customs_requirements TEXT,
    priority_level VARCHAR(20) DEFAULT 'normal',
    created_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    container_id UUID REFERENCES public.containers(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id),
    payment_type VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    receipt_url TEXT,
    receipt_number VARCHAR(100),
    payment_method VARCHAR(50),
    bank_reference VARCHAR(100),
    payment_date DATE,
    due_date DATE,
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    validated_by UUID REFERENCES auth.users(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de documentos adicionales
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    container_id UUID REFERENCES public.containers(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de actividades/log
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    container_id UUID REFERENCES public.containers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_containers_status ON public.containers(status);
CREATE INDEX IF NOT EXISTS idx_containers_client_id ON public.containers(client_id);
CREATE INDEX IF NOT EXISTS idx_containers_created_at ON public.containers(created_at);
CREATE INDEX IF NOT EXISTS idx_instruction_letters_container_id ON public.instruction_letters(container_id);
CREATE INDEX IF NOT EXISTS idx_payments_container_id ON public.payments(container_id);
CREATE INDEX IF NOT EXISTS idx_activities_container_id ON public.activities(container_id);

-- =====================================================
-- 4. FUNCIONES DE TRIGGER
-- =====================================================

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_containers_updated_at BEFORE UPDATE ON public.containers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instruction_letters_updated_at BEFORE UPDATE ON public.instruction_letters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instruction_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. POLÍTICAS DE SEGURIDAD
-- =====================================================

-- Políticas para containers
CREATE POLICY "Admin full access containers" ON public.containers
    FOR ALL USING (auth.jwt() ->> 'role' = 'main_admin');

CREATE POLICY "Sales can view containers" ON public.containers
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('sales', 'customer_service', 'customs_broker'));

CREATE POLICY "Customer service can update containers" ON public.containers
    FOR ALL USING (auth.jwt() ->> 'role' IN ('customer_service', 'customs_broker'));

CREATE POLICY "Clients can view own containers" ON public.containers
    FOR SELECT USING (auth.uid() = client_id OR auth.jwt() ->> 'role' = 'client');

-- Políticas para instruction letters
CREATE POLICY "Admin full access letters" ON public.instruction_letters
    FOR ALL USING (auth.jwt() ->> 'role' = 'main_admin');

CREATE POLICY "Staff can manage letters" ON public.instruction_letters
    FOR ALL USING (auth.jwt() ->> 'role' IN ('sales', 'customer_service', 'customs_broker'));

CREATE POLICY "Clients can view own letters" ON public.instruction_letters
    FOR SELECT USING (auth.uid() = client_id OR auth.jwt() ->> 'role' = 'client');

-- Políticas para payments
CREATE POLICY "Admin full access payments" ON public.payments
    FOR ALL USING (auth.jwt() ->> 'role' = 'main_admin');

CREATE POLICY "Staff can manage payments" ON public.payments
    FOR ALL USING (auth.jwt() ->> 'role' IN ('sales', 'customer_service'));

CREATE POLICY "Clients can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = client_id OR auth.jwt() ->> 'role' = 'client');

-- Políticas para documents
CREATE POLICY "Admin full access documents" ON public.documents
    FOR ALL USING (auth.jwt() ->> 'role' = 'main_admin');

CREATE POLICY "Staff can manage documents" ON public.documents
    FOR ALL USING (auth.jwt() ->> 'role' IN ('sales', 'customer_service', 'customs_broker'));

-- Políticas para activities
CREATE POLICY "All authenticated can view activities" ON public.activities
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert activities" ON public.activities
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- 7. DATOS INICIALES (OPCIONAL)
-- =====================================================

-- Insertar algunos estados predefinidos como referencia
-- Esto es opcional, solo para tener ejemplos

-- Estados de contenedores: received, in_transit, customs_review, customs_clearance, 
-- ready_for_pickup, delivered, on_hold, returned, cancelled, 
-- documentation_pending, payment_pending, inspection_required, 
-- customs_exam, port_storage, client_notified

-- Tipos de pago: freight, customs_duties, storage_fees, handling_fees, 
-- documentation_fee, inspection_fee, demurrage, detention, 
-- transport_fee, insurance_fee

-- =====================================================
-- 8. VERIFICACIÓN FINAL
-- =====================================================

-- Verificar que todas las tablas fueron creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Mensaje de confirmación
SELECT 'TrackPort Database Schema Created Successfully!' as status;