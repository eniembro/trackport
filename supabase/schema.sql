-- TrackPort Database Schema
-- Este archivo contiene las definiciones de tablas para Supabase PostgreSQL

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('client', 'customer_service', 'customs_broker', 'sales', 'main_admin')),
    company VARCHAR(255),
    phone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de contenedores
CREATE TABLE IF NOT EXISTS containers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('dry', 'reefer', 'open_top', 'flat_rack', 'tank')),
    size VARCHAR(10) NOT NULL CHECK (size IN ('20', '40', '45')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_port', 'customs_pending', 'customs_approved', 'in_transit', 'delivered', 'returned', 'damaged', 'lost', 'on_hold', 'inspection_required', 'documentation_incomplete', 'payment_pending', 'released', 'archived')),
    origin_port VARCHAR(255) NOT NULL,
    destination_port VARCHAR(255) NOT NULL,
    arrival_date TIMESTAMP WITH TIME ZONE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cartas de instrucción
CREATE TABLE IF NOT EXISTS instruction_letters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    container_id UUID NOT NULL REFERENCES containers(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'in_process', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    shipment_info JSONB NOT NULL DEFAULT '{}',
    cargo_info JSONB NOT NULL DEFAULT '{}',
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de documentos de instrucciones
CREATE TABLE IF NOT EXISTS instruction_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instruction_id UUID NOT NULL REFERENCES instruction_letters(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('invoice', 'packing_list', 'bill_of_lading', 'certificate', 'permit', 'other')),
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    container_id UUID NOT NULL REFERENCES containers(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    instruction_id UUID REFERENCES instruction_letters(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('port_fees', 'customs_duties', 'storage_fees', 'handling_charges', 'documentation_fees', 'inspection_fees', 'demurrage', 'detention', 'transport_costs', 'other_charges')),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'overdue', 'cancelled', 'refunded')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    paid_date TIMESTAMP WITH TIME ZONE,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de recibos de pago
CREATE TABLE IF NOT EXISTS payment_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    receipt_number VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(100) NOT NULL,
    reference VARCHAR(255) NOT NULL,
    file_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    notes TEXT,
    processed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización de consultas
CREATE INDEX IF NOT EXISTS idx_containers_client_id ON containers(client_id);
CREATE INDEX IF NOT EXISTS idx_containers_status ON containers(status);
CREATE INDEX IF NOT EXISTS idx_containers_number ON containers(number);

CREATE INDEX IF NOT EXISTS idx_instruction_letters_container_id ON instruction_letters(container_id);
CREATE INDEX IF NOT EXISTS idx_instruction_letters_client_id ON instruction_letters(client_id);
CREATE INDEX IF NOT EXISTS idx_instruction_letters_status ON instruction_letters(status);

CREATE INDEX IF NOT EXISTS idx_instruction_documents_instruction_id ON instruction_documents(instruction_id);
CREATE INDEX IF NOT EXISTS idx_instruction_documents_status ON instruction_documents(status);

CREATE INDEX IF NOT EXISTS idx_payments_container_id ON payments(container_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);

CREATE INDEX IF NOT EXISTS idx_payment_receipts_payment_id ON payment_receipts(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_receipts_status ON payment_receipts(status);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_containers_updated_at BEFORE UPDATE ON containers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instruction_letters_updated_at BEFORE UPDATE ON instruction_letters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instruction_documents_updated_at BEFORE UPDATE ON instruction_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_receipts_updated_at BEFORE UPDATE ON payment_receipts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE instruction_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE instruction_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('main_admin', 'customer_service')
        )
    );

CREATE POLICY "Admins can manage users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'main_admin'
        )
    );

-- Políticas para containers
CREATE POLICY "Clients can view their own containers" ON containers
    FOR SELECT USING (
        client_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('main_admin', 'customer_service', 'customs_broker', 'sales')
        )
    );

CREATE POLICY "Staff can manage containers" ON containers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('main_admin', 'customer_service', 'customs_broker', 'sales')
        )
    );

-- Políticas para instruction_letters
CREATE POLICY "Clients can view their own instructions" ON instruction_letters
    FOR SELECT USING (
        client_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('main_admin', 'customer_service', 'customs_broker')
        )
    );

CREATE POLICY "Clients can create their own instructions" ON instruction_letters
    FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients can update their own draft instructions" ON instruction_letters
    FOR UPDATE USING (client_id = auth.uid() AND status = 'draft');

CREATE POLICY "Staff can manage instructions" ON instruction_letters
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('main_admin', 'customer_service', 'customs_broker')
        )
    );

-- Políticas para payments
CREATE POLICY "Clients can view their own payments" ON payments
    FOR SELECT USING (
        client_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('main_admin', 'customer_service', 'sales')
        )
    );

CREATE POLICY "Staff can manage payments" ON payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('main_admin', 'customer_service', 'sales')
        )
    );

-- Buckets de Storage para archivos
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('documents', 'documents', false),
    ('receipts', 'receipts', false),
    ('avatars', 'avatars', true);

-- Políticas de Storage
CREATE POLICY "Users can upload their own documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view their own documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can upload receipts" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'receipts' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view receipts" ON storage.objects
    FOR SELECT USING (bucket_id = 'receipts' AND auth.role() = 'authenticated');

CREATE POLICY "Public avatar access" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');