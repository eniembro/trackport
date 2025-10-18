# 👥 GUÍA: Crear Usuarios Iniciales en TrackPort
## Panel de Supabase - Authentication

### 📋 **RESUMEN DE USUARIOS A CREAR**

| Email | Contraseña | Rol | Descripción |
|-------|------------|-----|-------------|
| `lrazo@track-port.com` | `123456` | `main_admin` | Administrador |
| `fanny@track-port.com` | `123456` | `main_admin` | Administrador |
| `ventas1@track-port.com` | `123456` | `sales` | Ventas 1 |
| `ventas2@track-port.com` | `123456` | `sales` | Ventas 2 |
| `sac1@track-port.com` | `123456` | `customer_service` | Atención al Cliente 1 |
| `sac2@track-port.com` | `123456` | `customer_service` | Atención al Cliente 2 |
| `aduana_lzo@track-port.com` | `123456` | `customs_broker` | Agente Aduanal |
| `admin@track-port.com` | `123456` | `main_admin` | Administrador Principal |

---

### 🔧 **PASOS PARA CREAR USUARIOS**

#### **Paso 1: Acceder a Supabase Dashboard**
1. Ir a: https://app.supabase.com
2. Seleccionar proyecto TrackPort
3. Ir a **Authentication** > **Users** en el menú lateral

#### **Paso 2: Crear cada usuario**
Para cada usuario en la tabla anterior:

1. **Clic en "Add User"**
2. **Email**: Introducir el email exacto
3. **Password**: Introducir la contraseña
4. **Confirm Email**: ✅ Marcado (para que no necesiten verificar email)
5. **Clic en "Create User"**

#### **Paso 3: Configurar Roles (Después de crear todos)**
1. Ir a **SQL Editor** en Supabase
2. **Copiar y pegar el siguiente script:**

```sql
-- Configurar roles para usuarios TrackPort

-- Administradores
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"main_admin"') WHERE email = 'lrazo@track-port.com';
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"main_admin"') WHERE email = 'fanny@track-port.com';
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"main_admin"') WHERE email = 'admin@track-port.com';

-- Ventas
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"sales"') WHERE email = 'ventas1@track-port.com';
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"sales"') WHERE email = 'ventas2@track-port.com';

-- Atención a Cliente
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"customer_service"') WHERE email = 'sac1@track-port.com';
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"customer_service"') WHERE email = 'sac2@track-port.com';

-- Agente Aduanal
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"customs_broker"') WHERE email = 'aduana_lzo@track-port.com';
```

3. **Ejecutar el script** (botón "Run")

#### **Paso 4: Verificar usuarios creados**
```sql
-- Verificar que los usuarios fueron creados correctamente
SELECT 
    email, 
    raw_user_meta_data->>'role' as role, 
    created_at,
    email_confirmed_at
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

---

### 🔐 **CREDENCIALES PARA ENVIAR A USUARIOS**

#### **ADMINISTRADORES**
```
Luis Razo - lrazo@track-port.com
Contraseña temporal: 123456
Rol: Administrador

Fanny - fanny@track-port.com  
Contraseña temporal: 123456
Rol: Administrador

Admin Principal - admin@track-port.com
Contraseña temporal: 123456
Rol: Administrador Principal
```

#### **VENTAS**
```
Ventas 1 - ventas1@track-port.com
Contraseña temporal: 123456
Rol: Ventas

Ventas 2 - ventas2@track-port.com
Contraseña temporal: 123456
Rol: Ventas
```

#### **ATENCIÓN AL CLIENTE**
```
SAC 1 - sac1@track-port.com
Contraseña temporal: 123456
Rol: Atención al Cliente

SAC 2 - sac2@track-port.com
Contraseña temporal: 123456
Rol: Atención al Cliente
```

#### **AGENTE ADUANAL**
```
Aduana LZO - aduana_lzo@track-port.com
Contraseña temporal: 123456
Rol: Agente Aduanal
```

---

### 📱 **PERMISOS POR ROL**

#### **main_admin (Luis, Fanny, Admin)**
- ✅ Crear/editar/eliminar contenedores
- ✅ Gestionar instruction letters
- ✅ Administrar pagos y recibos
- ✅ Panel administrativo completo
- ✅ Gestión de usuarios
- ✅ Reportes y métricas
- ✅ Configuración del sistema

#### **sales (Ventas1, Ventas2)**
- ✅ Ver contenedores
- ✅ Crear instruction letters
- ✅ Gestión de clientes
- ✅ Configuración de tarifas
- ✅ Reportes de ventas
- ❌ Panel administrativo general
- ❌ Gestión de usuarios

#### **customer_service (SAC1, SAC2)**
- ✅ Ver contenedores
- ✅ Validar documentos
- ✅ Gestión de cuentas de cliente
- ✅ Soporte al cliente
- ✅ Reportes básicos
- ❌ Crear/eliminar contenedores
- ❌ Panel administrativo

#### **customs_broker (Aduana_LZO)**
- ✅ Ver contenedores
- ✅ Upload documentos aduanales
- ✅ Gestionar clearance
- ✅ Seguimiento aduanal
- ✅ Reportes especializados
- ❌ Gestión de usuarios
- ❌ Configuración general

---

### 🔔 **MENSAJE PARA ENVIAR A USUARIOS**

```
¡TrackPort está disponible!

Su acceso al sistema de gestión de contenedores:

🌐 URL: https://www.track-port.com
📧 Email: [su-email]
🔑 Contraseña: [su-contraseña]

Características:
✅ Tracking de contenedores en tiempo real
✅ Gestión de instruction letters  
✅ Manejo de pagos y recibos
✅ Dashboard personalizado
✅ Instalable como app desde el navegador

Para soporte: [tu-email-de-contacto]

Nota: Las contraseñas temporales deben cambiarse en el primer login.
```

---

### ✅ **CHECKLIST DE VERIFICACIÓN**

- [ ] 8 usuarios creados en Supabase Auth
- [ ] Roles asignados correctamente 
- [ ] Verificación SQL ejecutada
- [ ] Credenciales enviadas a usuarios
- [ ] Primer login de prueba realizado
- [ ] Cambio de contraseñas temporales (recomendado)

**¡Los usuarios ya pueden acceder a TrackPort en www.track-port.com!**