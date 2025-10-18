-- TrackPort - Script de Creación de Usuarios Iniciales
-- Para ejecutar en Supabase SQL Editor
-- Fecha: 18 Octubre 2025

-- 1. LRAZO - Administrador
-- Email: lrazo@track-port.com
-- Password: 123456 (temporal)
-- Role: main_admin

-- 2. FANNY - Administrador  
-- Email: fanny@track-port.com
-- Password: 123456 (temporal)
-- Role: main_admin

-- 3. VENTAS1 - Ventas
-- Email: ventas1@track-port.com
-- Password: 123456 (temporal)
-- Role: sales

-- 4. VENTAS2 - Ventas
-- Email: ventas2@track-port.com
-- Password: 123456 (temporal)
-- Role: sales

-- 5. SAC1 - Atención a Cliente
-- Email: sac1@track-port.com
-- Password: 123456 (temporal)
-- Role: customer_service

-- 6. SAC2 - Atención a Cliente
-- Email: sac2@track-port.com
-- Password: 123456 (temporal)
-- Role: customer_service

-- 7. ADUANA_LZO - Agente Aduanal
-- Email: aduana_lzo@track-port.com
-- Password: 123456 (temporal)
-- Role: customs_broker

-- 8. ADMIN - Administrador Principal
-- Email: admin@track-port.com  
-- Password: 123456 (temporal)
-- Role: main_admin

-- NOTA: Los usuarios deben crearse desde el panel de Supabase Authentication
-- Este script solo sirve como referencia para los roles

-- Una vez creados los usuarios en Auth, ejecutar:

-- Actualizar roles en la tabla de perfiles (si existe)
-- O insertar en auth.users metadata

-- Administradores
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"main_admin"'
)
WHERE email = 'lrazo@track-port.com';

UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"main_admin"'
)
WHERE email = 'fanny@track-port.com';

UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"main_admin"'
)
WHERE email = 'admin@track-port.com';

-- Ventas
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"sales"'
)
WHERE email = 'ventas1@track-port.com';

UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"sales"'
)
WHERE email = 'ventas2@track-port.com';

-- Atención a Cliente
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"customer_service"'
)
WHERE email = 'sac1@track-port.com';

UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"customer_service"'
)
WHERE email = 'sac2@track-port.com';

-- Agente Aduanal
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"customs_broker"'
)
WHERE email = 'aduana_lzo@track-port.com';

-- Verificar usuarios creados
SELECT email, raw_user_meta_data->>'role' as role, created_at 
FROM auth.users 
WHERE email IN (
    'lrazo@track-port.com',
    'fanny@track-port.com',
    'ventas1@track-port.com',
    'ventas2@track-port.com',
    'sac1@track-port.com',
    'sac2@track-port.com',
    'aduana_lzo@track-port.com',
    'admin@track-port.com'
)
ORDER BY raw_user_meta_data->>'role', email;