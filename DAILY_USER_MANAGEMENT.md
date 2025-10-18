# 👥 SISTEMA DE USUARIOS ESCALABLE - TrackPort

## 🎯 **USUARIOS PARA OPERACIÓN DIARIA**

### **📋 ROLES DISPONIBLES EN EL SISTEMA**

#### **1. `main_admin` - Administrador Principal**
- ✅ **Acceso total** al sistema
- ✅ **Crear/editar/eliminar** todos los elementos
- ✅ **Gestión de usuarios** y permisos
- ✅ **Panel administrativo** completo
- ✅ **Reportes y métricas** avanzadas
- ✅ **Configuración del sistema**

#### **2. `sales` - Ventas**
- ✅ **Gestión de clientes** y prospectos
- ✅ **Configuración de tarifas** y precios
- ✅ **Crear instruction letters** para clientes
- ✅ **Reportes de ventas** y comisiones
- ✅ **Ver contenedores** asignados
- ❌ **No puede eliminar** contenedores
- ❌ **No acceso** a panel administrativo

#### **3. `customer_service` - Atención al Cliente**
- ✅ **Validar documentos** cargados
- ✅ **Gestión de cuentas** de cliente
- ✅ **Soporte y seguimiento** de casos
- ✅ **Ver contenedores** y estados
- ✅ **Reportes básicos** de actividad
- ❌ **No puede crear/eliminar** contenedores
- ❌ **No acceso** a configuración

#### **4. `customs_broker` - Agente Aduanal**
- ✅ **Upload documentos** aduanales
- ✅ **Gestionar clearance** y trámites
- ✅ **Seguimiento aduanal** especializado
- ✅ **Reportes de aduana** y tiempos
- ✅ **Actualizar estados** aduanales
- ❌ **No gestión** de usuarios
- ❌ **No configuración** general

#### **5. `client` - Cliente Final**
- ✅ **Ver sus contenedores** únicamente
- ✅ **Tracking en tiempo real** de sus envíos
- ✅ **Descargar documentos** autorizados
- ✅ **Crear instruction letters** básicas
- ✅ **Ver pagos y recibos** propios
- ❌ **No ver** contenedores de otros
- ❌ **No acceso** administrativo

---

## 🔧 **PROCESO PARA CREAR NUEVOS USUARIOS DIARIAMENTE**

### **Método A: Panel Supabase (Recomendado)**

#### **Paso 1: Acceso al Panel**
```
1. Ir a: https://app.supabase.com
2. Proyecto: TrackPort
3. Authentication > Users
4. Clic "Add User"
```

#### **Paso 2: Datos del Usuario**
```
Email: [email-del-nuevo-usuario]
Password: [contraseña-temporal-123456]
✅ Confirm Email: Marcado
Clic "Create User"
```

#### **Paso 3: Asignar Rol**
```
1. SQL Editor en Supabase
2. Ejecutar:

UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"[ROL_AQUI]"'
)
WHERE email = '[EMAIL_AQUI]';

-- Ejemplo:
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"client"'
)
WHERE email = 'nuevo@track-port.com';
```

### **Método B: Script Automatizado (Para múltiples usuarios)**

#### **Template para Nuevos Usuarios**
```sql
-- PLANTILLA PARA AGREGAR USUARIOS NUEVOS
-- Copiar, modificar y ejecutar en SQL Editor

-- 1. Crear usuario en Authentication > Users primero
-- 2. Luego ejecutar este script con los datos correctos

-- NUEVO USUARIO [NOMBRE]
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"[ROL]"'  -- client, sales, customer_service, customs_broker, main_admin
)
WHERE email = '[EMAIL]';

-- Verificar creación
SELECT email, raw_user_meta_data->>'role' as role, created_at 
FROM auth.users 
WHERE email = '[EMAIL]';
```

---

## 📊 **USUARIOS INICIALES (CREADOS HOY)**

### **🏢 EQUIPO INTERNO (7 usuarios)**
1. **lrazo@track-port.com** - `main_admin` - Luis Razo
2. **fanny@track-port.com** - `main_admin` - Fanny
3. **admin@track-port.com** - `main_admin` - Administrador Principal
4. **ventas1@track-port.com** - `sales` - Ventas 1
5. **ventas2@track-port.com** - `sales` - Ventas 2
6. **sac1@track-port.com** - `customer_service` - SAC 1
7. **sac2@track-port.com** - `customer_service` - SAC 2
8. **aduana_lzo@track-port.com** - `customs_broker` - Agente Aduanal

### **👥 CLIENTES (Se crearán según demanda)**
```
Ejemplos de clientes que se irán agregando:
- cliente1@empresa.com - role: client
- cliente2@logistica.com - role: client  
- importador@comercial.mx - role: client
```

---

## 🚀 **FLUJO DE ONBOARDING DIARIO**

### **Para Nuevos Clientes:**
1. **Ventas** contacta al cliente
2. **Admin** crea cuenta en Supabase (role: client)
3. **SAC** envía credenciales y tutorial
4. **Cliente** hace primer login y cambia contraseña
5. **SAC** verifica acceso y configura preferencias

### **Para Nuevo Personal:**
1. **Admin** crea cuenta con rol correspondiente
2. **Admin** envía credenciales temporales
3. **Usuario** hace primer login obligatorio
4. **Admin** verifica permisos y accesos
5. **Capacitación** según el rol asignado

---

## 📱 **MENSAJE TIPO PARA NUEVOS USUARIOS**

### **Para Clientes:**
```
¡Bienvenido a TrackPort!

Su cuenta está lista:
🌐 URL: https://www.track-port.com
📧 Email: [su-email]
🔑 Contraseña temporal: 123456

Con TrackPort puede:
✅ Rastrear sus contenedores en tiempo real
✅ Descargar documentos importantes
✅ Ver el estado de sus envíos
✅ Gestionar instruction letters

IMPORTANTE: Cambie su contraseña en el primer login.

¿Necesita ayuda? Contacte: sac1@track-port.com
```

### **Para Personal Interno:**
```
Acceso a TrackPort - Equipo Interno

Su cuenta de trabajo:
🌐 URL: https://www.track-port.com
📧 Email: [su-email]
🔑 Contraseña temporal: 123456
👤 Rol: [su-rol]

Funciones de su rol: [descripción específica]

Cambie su contraseña inmediatamente.
Soporte técnico: admin@track-port.com
```

---

## 🎯 **PRÓXIMOS PASOS**

1. **✅ Crear 8 usuarios iniciales** (equipo interno)
2. **✅ Probar login y funcionalidades** por rol
3. **📋 Documentar proceso** de onboarding
4. **🔄 Establecer rutina** de creación diaria
5. **📊 Monitorear** uso y performance

**TrackPort está listo para escalar usuarios día a día.**