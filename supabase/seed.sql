-- Datos de ejemplo para TrackPort
-- Ejecutar después de crear el schema

-- Insertar usuarios de ejemplo
INSERT INTO users (id, email, name, role, company, phone, status) VALUES 
    ('11111111-1111-1111-1111-111111111111', 'admin@track-port.com', 'Administrador Principal', 'main_admin', 'TrackPort', '+1234567890', 'active'),
    ('22222222-2222-2222-2222-222222222222', 'soporte@track-port.com', 'Servicio al Cliente', 'customer_service', 'TrackPort', '+1234567891', 'active'),
    ('33333333-3333-3333-3333-333333333333', 'aduana@track-port.com', 'Agente Aduanal', 'customs_broker', 'TrackPort', '+1234567892', 'active'),
    ('44444444-4444-4444-4444-444444444444', 'ventas@track-port.com', 'Director de Ventas', 'sales', 'TrackPort', '+1234567893', 'active'),
    ('55555555-5555-5555-5555-555555555555', 'cliente1@empresa.com', 'Juan Pérez', 'client', 'Empresa ABC', '+1234567894', 'active'),
    ('66666666-6666-6666-6666-666666666666', 'cliente2@import.com', 'María García', 'client', 'Importadora XYZ', '+1234567895', 'active'),
    ('77777777-7777-7777-7777-777777777777', 'cliente3@trading.com', 'Carlos López', 'client', 'Trading 123', '+1234567896', 'active');

-- Insertar contenedores de ejemplo
INSERT INTO containers (id, number, type, size, status, origin_port, destination_port, arrival_date, client_id) VALUES 
    ('aaaa1111-bbbb-cccc-dddd-eeeeeeeeeeee', 'TCLU1234567', 'dry', '40', 'in_port', 'Shanghai, China', 'Long Beach, USA', '2024-01-15 08:00:00+00', '55555555-5555-5555-5555-555555555555'),
    ('aaaa2222-bbbb-cccc-dddd-eeeeeeeeeeee', 'TCLU2345678', 'reefer', '20', 'customs_pending', 'Hamburg, Germany', 'New York, USA', '2024-01-16 14:30:00+00', '66666666-6666-6666-6666-666666666666'),
    ('aaaa3333-bbbb-cccc-dddd-eeeeeeeeeeee', 'TCLU3456789', 'dry', '40', 'delivered', 'Rotterdam, Netherlands', 'Miami, USA', '2024-01-10 10:00:00+00', '77777777-7777-7777-7777-777777777777'),
    ('aaaa4444-bbbb-cccc-dddd-eeeeeeeeeeee', 'TCLU4567890', 'open_top', '45', 'in_transit', 'Yokohama, Japan', 'Los Angeles, USA', '2024-01-20 16:00:00+00', '55555555-5555-5555-5555-555555555555'),
    ('aaaa5555-bbbb-cccc-dddd-eeeeeeeeeeee', 'TCLU5678901', 'tank', '20', 'customs_approved', 'Antwerp, Belgium', 'Houston, USA', '2024-01-18 12:00:00+00', '66666666-6666-6666-6666-666666666666');

-- Insertar cartas de instrucción de ejemplo
INSERT INTO instruction_letters (id, container_id, client_id, title, description, status, priority, shipment_info, cargo_info, special_instructions) VALUES 
    ('bbbb1111-cccc-dddd-eeee-ffffffffffff', 'aaaa1111-bbbb-cccc-dddd-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 'Importación Productos Electrónicos', 'Carta de instrucción para importación de productos electrónicos desde Shanghai', 'approved', 'high', 
     '{"shipper": "Tech Manufacturing Co.", "consignee": "Empresa ABC", "vessel": "MAERSK DENVER", "voyage": "424W", "bl_number": "MAEU123456789"}',
     '{"description": "Productos electrónicos", "weight": "18500 kg", "volume": "65 m3", "packages": 245, "hs_code": "8517.12.00"}',
     'Productos frágiles - Manejar con cuidado. Requiere inspección de calidad.'),
    ('bbbb2222-cccc-dddd-eeee-ffffffffffff', 'aaaa2222-bbbb-cccc-dddd-eeeeeeeeeeee', '66666666-6666-6666-6666-666666666666', 'Importación Alimentos Congelados', 'Carta de instrucción para productos alimenticios congelados', 'in_process', 'urgent', 
     '{"shipper": "Fresh Foods GmbH", "consignee": "Importadora XYZ", "vessel": "HAPAG EXPRESS", "voyage": "298E", "bl_number": "HLCU987654321"}',
     '{"description": "Alimentos congelados", "weight": "12800 kg", "volume": "28 m3", "packages": 128, "hs_code": "0303.14.00", "temperature": "-18°C"}',
     'Mantener cadena de frío. Inspección sanitaria requerida.'),
    ('bbbb3333-cccc-dddd-eeee-ffffffffffff', 'aaaa3333-bbbb-cccc-dddd-eeeeeeeeeeee', '77777777-7777-7777-7777-777777777777', 'Importación Maquinaria Industrial', 'Equipos industriales desde Rotterdam', 'completed', 'medium', 
     '{"shipper": "Industrial Equipment BV", "consignee": "Trading 123", "vessel": "MSC OSCAR", "voyage": "142W", "bl_number": "MSCU456789123"}',
     '{"description": "Maquinaria industrial", "weight": "22000 kg", "volume": "85 m3", "packages": 8, "hs_code": "8479.89.97"}',
     'Equipos pesados - Requiere grúa especializada para descarga.');

-- Insertar documentos de ejemplo
INSERT INTO instruction_documents (id, instruction_id, name, type, file_url, file_size, mime_type, status, uploaded_by) VALUES 
    ('cccc1111-dddd-eeee-ffff-gggggggggggg', 'bbbb1111-cccc-dddd-eeee-ffffffffffff', 'Factura Comercial.pdf', 'invoice', '/documents/invoice_001.pdf', 2048576, 'application/pdf', 'approved', '55555555-5555-5555-5555-555555555555'),
    ('cccc2222-dddd-eeee-ffff-gggggggggggg', 'bbbb1111-cccc-dddd-eeee-ffffffffffff', 'Lista de Empaque.pdf', 'packing_list', '/documents/packing_001.pdf', 1024768, 'application/pdf', 'approved', '55555555-5555-5555-5555-555555555555'),
    ('cccc3333-dddd-eeee-ffff-gggggggggggg', 'bbbb2222-cccc-dddd-eeee-ffffffffffff', 'Certificado Sanitario.pdf', 'certificate', '/documents/health_cert_001.pdf', 512384, 'application/pdf', 'pending', '66666666-6666-6666-6666-666666666666');

-- Insertar pagos de ejemplo
INSERT INTO payments (id, container_id, client_id, instruction_id, type, amount, currency, status, priority, due_date, description) VALUES 
    ('dddd1111-eeee-ffff-gggg-hhhhhhhhhhhh', 'aaaa1111-bbbb-cccc-dddd-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 'bbbb1111-cccc-dddd-eeee-ffffffffffff', 'port_fees', 850.00, 'USD', 'paid', 'high', '2024-01-20 23:59:59+00', 'Tarifas portuarias - Contenedor TCLU1234567'),
    ('dddd2222-eeee-ffff-gggg-hhhhhhhhhhhh', 'aaaa1111-bbbb-cccc-dddd-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 'bbbb1111-cccc-dddd-eeee-ffffffffffff', 'customs_duties', 2750.50, 'USD', 'pending', 'urgent', '2024-01-25 23:59:59+00', 'Aranceles aduaneros - Productos electrónicos'),
    ('dddd3333-eeee-ffff-gggg-hhhhhhhhhhhh', 'aaaa2222-bbbb-cccc-dddd-eeeeeeeeeeee', '66666666-6666-6666-6666-666666666666', 'bbbb2222-cccc-dddd-eeee-ffffffffffff', 'storage_fees', 450.00, 'USD', 'overdue', 'high', '2024-01-22 23:59:59+00', 'Almacenaje refrigerado - 5 días'),
    ('dddd4444-eeee-ffff-gggg-hhhhhhhhhhhh', 'aaaa3333-bbbb-cccc-dddd-eeeeeeeeeeee', '77777777-7777-7777-7777-777777777777', 'bbbb3333-cccc-dddd-eeee-ffffffffffff', 'handling_charges', 1200.00, 'USD', 'paid', 'medium', '2024-01-15 23:59:59+00', 'Manejo de carga pesada - Maquinaria'),
    ('dddd5555-eeee-ffff-gggg-hhhhhhhhhhhh', 'aaaa4444-bbbb-cccc-dddd-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', NULL, 'demurrage', 675.00, 'USD', 'pending', 'medium', '2024-01-28 23:59:59+00', 'Demoras en puerto - 3 días adicionales');

-- Insertar recibos de pago de ejemplo
INSERT INTO payment_receipts (id, payment_id, receipt_number, amount, currency, payment_method, reference, status, notes) VALUES 
    ('eeee1111-ffff-gggg-hhhh-iiiiiiiiiiii', 'dddd1111-eeee-ffff-gggg-hhhhhhhhhhhh', 'REC-2024-001', 850.00, 'USD', 'Transferencia Bancaria', 'TXN789456123', 'verified', 'Pago verificado - Transferencia recibida'),
    ('eeee2222-ffff-gggg-hhhh-iiiiiiiiiiii', 'dddd4444-eeee-ffff-gggg-hhhhhhhhhhhh', 'REC-2024-002', 1200.00, 'USD', 'Cheque', 'CHK654321987', 'verified', 'Cheque procesado correctamente'),
    ('eeee3333-ffff-gggg-hhhh-iiiiiiiiiiii', 'dddd3333-eeee-ffff-gggg-hhhhhhhhhhhh', 'REC-2024-003', 450.00, 'USD', 'Tarjeta de Crédito', 'CC98765432', 'pending', 'Esperando validación bancaria');

-- Actualizar fechas de pago para los pagos completados
UPDATE payments SET paid_date = '2024-01-19 15:30:00+00' WHERE id = 'dddd1111-eeee-ffff-gggg-hhhhhhhhhhhh';
UPDATE payments SET paid_date = '2024-01-14 11:45:00+00' WHERE id = 'dddd4444-eeee-ffff-gggg-hhhhhhhhhhhh';