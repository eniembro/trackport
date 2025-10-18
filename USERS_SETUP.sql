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

-- 3. ADMIN - Webmaster
-- Email: admin@track-port.com  
-- Password: PNegras8% (permanente)
-- Role: main_admin (con todos los permisos)

-- 4. STARK - Ventas
-- Email: stark@track-port.com
-- Password: 123456 (temporal)
-- Role: sales (permisos de ventas)

-- NOTA: Los usuarios deben crearse desde el panel de Supabase Authentication
-- Este script solo sirve como referencia para los roles

-- Una vez creados los usuarios en Auth, ejecutar:

-- Actualizar roles en la tabla de perfiles (si existe)
-- O insertar en auth.users metadata

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

UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"sales"'
)
WHERE email = 'stark@track-port.com';

-- Verificar usuarios creados
SELECT email, raw_user_meta_data->>'role' as role, created_at 
FROM auth.users 
WHERE email IN (
    'lrazo@track-port.com',
    'fanny@track-port.com', 
    'admin@track-port.com',
    'stark@track-port.com'
);