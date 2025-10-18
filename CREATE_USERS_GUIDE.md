# 👥 GUÍA: Crear Usuarios Iniciales en TrackPort
## Panel de Supabase - Authentication

### 📋 **RESUMEN DE USUARIOS A CREAR**

| Email | Contraseña | Rol | Descripción |
|-------|------------|-----|-------------|
| `lrazo@track-port.com` | `123456` | `main_admin` | Administrador principal |
| `fanny@track-port.com` | `123456` | `main_admin` | Administrador principal |
| `admin@track-port.com` | `PNegras8%` | `main_admin` | Webmaster (contraseña permanente) |
| `stark@track-port.com` | `123456` | `sales` | Usuario de ventas |

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
    'admin@track-port.com',
    'stark@track-port.com'
)
ORDER BY created_at;
```

---

### 🔐 **CREDENCIALES PARA ENVIAR A USUARIOS**

#### **1. Luis Razo (lrazo@track-port.com)**
```
Acceso a TrackPort:
URL: https://www.track-port.com
Email: lrazo@track-port.com
Contraseña temporal: 123456
Rol: Administrador Principal
```

#### **2. Fanny (fanny@track-port.com)**
```
Acceso a TrackPort:
URL: https://www.track-port.com
Email: fanny@track-port.com
Contraseña temporal: 123456
Rol: Administrador Principal
```

#### **3. Admin/Webmaster (admin@track-port.com)**
```
Acceso a TrackPort:
URL: https://www.track-port.com
Email: admin@track-port.com
Contraseña: PNegras8%
Rol: Webmaster (todos los permisos)
```

#### **4. Stark (stark@track-port.com)**
```
Acceso a TrackPort:
URL: https://www.track-port.com
Email: stark@track-port.com
Contraseña temporal: 123456
Rol: Ventas
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

#### **sales (Stark)**
- ✅ Ver contenedores
- ✅ Crear instruction letters
- ✅ Gestión de clientes
- ✅ Configuración de tarifas
- ✅ Reportes de ventas
- ❌ Panel administrativo general
- ❌ Gestión de usuarios

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

- [ ] 4 usuarios creados en Supabase Auth
- [ ] Roles asignados correctamente 
- [ ] Verificación SQL ejecutada
- [ ] Credenciales enviadas a usuarios
- [ ] Primer login de prueba realizado
- [ ] Cambio de contraseñas temporales (recomendado)

**¡Los usuarios ya pueden acceder a TrackPort en www.track-port.com!**