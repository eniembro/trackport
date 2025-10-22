# 🚀 PASO 1: CREAR 8 USUARIOS EN SUPABASE

## 📋 **INSTRUCCIONES PASO A PASO**

### **🔗 1. Acceder al Panel Supabase**
1. Ir a: https://app.supabase.com
2. Login con tu cuenta
3. Seleccionar proyecto TrackPort
4. Ir a **Authentication** > **Users** (menú lateral)

### **👥 2. Crear los 8 Usuarios**

#### **USUARIO 1: LUIS RAZO**
- Clic "Add User"
- Email: `lrazo@track-port.com`
- Password: `123456`
- ✅ Confirm Email: Marcado
- Clic "Create User"

#### **USUARIO 2: FANNY**
- Clic "Add User"
- Email: `fanny@track-port.com`
- Password: `123456`
- ✅ Confirm Email: Marcado
- Clic "Create User"

#### **USUARIO 3: ADMIN PRINCIPAL**
- Clic "Add User"
- Email: `admin@track-port.com`
- Password: `123456`
- ✅ Confirm Email: Marcado
- Clic "Create User"

#### **USUARIO 4: VENTAS 1**
- Clic "Add User"
- Email: `ventas1@track-port.com`
- Password: `123456`
- ✅ Confirm Email: Marcado
- Clic "Create User"

#### **USUARIO 5: VENTAS 2**
- Clic "Add User"
- Email: `ventas2@track-port.com`
- Password: `123456`
- ✅ Confirm Email: Marcado
- Clic "Create User"

#### **USUARIO 6: SAC 1**
- Clic "Add User"
- Email: `sac1@track-port.com`
- Password: `123456`
- ✅ Confirm Email: Marcado
- Clic "Create User"

#### **USUARIO 7: SAC 2**
- Clic "Add User"
- Email: `sac2@track-port.com`
- Password: `123456`
- ✅ Confirm Email: Marcado
- Clic "Create User"

#### **USUARIO 8: ADUANA LZO**
- Clic "Add User"
- Email: `aduana_lzo@track-port.com`
- Password: `123456`
- ✅ Confirm Email: Marcado
- Clic "Create User"

### **🔧 3. Asignar Roles (SQL Editor)**
1. Ir a **SQL Editor** en Supabase
2. Copiar y pegar este script:

```sql
-- Asignar roles a usuarios TrackPort
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"main_admin"') WHERE email = 'lrazo@track-port.com';
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"main_admin"') WHERE email = 'fanny@track-port.com';
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"main_admin"') WHERE email = 'admin@track-port.com';
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"sales"') WHERE email = 'ventas1@track-port.com';
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"sales"') WHERE email = 'ventas2@track-port.com';
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"customer_service"') WHERE email = 'sac1@track-port.com';
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"customer_service"') WHERE email = 'sac2@track-port.com';
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"customs_broker"') WHERE email = 'aduana_lzo@track-port.com';
```

3. Clic "RUN" para ejecutar

### **✅ 4. Verificar Creación**
Ejecutar esta consulta para verificar:

```sql
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
```

Deberías ver 8 usuarios con sus roles asignados.

## ⏱️ **TIEMPO ESTIMADO: 5 MINUTOS**

Una vez completado, confirma y procederé con el Paso 2.