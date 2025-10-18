# Configuración de Supabase para TrackPort

## Configuración Inicial

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Anota la URL del proyecto y la clave anónima

### 2. Configurar Variables de Entorno

Copia `.env.example` a `.env` y completa con tus valores:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
```

### 3. Ejecutar Scripts de Base de Datos

#### Crear Schema
En el panel de Supabase > SQL Editor, ejecuta el contenido de:
```
supabase/schema.sql
```

#### Insertar Datos de Ejemplo
Luego ejecuta:
```
supabase/seed.sql
```

### 4. Configurar Storage Buckets

En el panel de Supabase > Storage, crear los siguientes buckets:

- `documents` (privado) - Para documentos de instrucciones
- `receipts` (privado) - Para recibos de pago
- `avatars` (público) - Para fotos de perfil

### 5. Configurar Autenticación

En Authentication > Settings:

- Habilitar email/password
- Configurar redirects si es necesario
- Configurar templates de email

## Estructura de Base de Datos

### Tablas Principales

1. **users** - Perfiles de usuario
2. **containers** - Información de contenedores
3. **instruction_letters** - Cartas de instrucción
4. **instruction_documents** - Documentos adjuntos
5. **payments** - Pagos y facturación
6. **payment_receipts** - Recibos de pago

### Políticas RLS (Row Level Security)

- Los clientes solo pueden ver sus propios datos
- El staff puede ver/modificar según su rol
- Los admins tienen acceso completo

## Funciones Implementadas

### Autenticación
- Login/logout
- Registro de usuarios
- Recuperación de contraseña
- Gestión de sesiones

### CRUD Operations
- Contenedores: `containers.getAll()`, `create()`, `update()`, etc.
- Instrucciones: `instructionLetters.getAll()`, `create()`, etc.
- Pagos: `payments.getAll()`, `create()`, etc.

### Tiempo Real
- Suscripciones a cambios en contenedores
- Notificaciones de nuevas instrucciones
- Actualizaciones de estado de pagos

### Storage
- Subida de documentos
- URLs públicas/privadas
- Eliminación de archivos

## Desarrollo Local

La aplicación funciona en modo offline con datos mock si Supabase no está configurado. Los usuarios de desarrollo son:

- `admin@track-port.com` / `123456` (main_admin)
- `cliente@track-port.com` / `123456` (client)
- `servicio@track-port.com` / `123456` (customer_service)
- `agente@track-port.com` / `123456` (customs_broker)
- `ventas@track-port.com` / `123456` (sales)

## Testing

Para probar la integración:

1. Configurar variables de entorno
2. Ejecutar scripts SQL
3. Intentar login con usuarios reales
4. Verificar que los datos se sincronicen

## Troubleshooting

### Error de conexión
- Verificar URL y keys en `.env`
- Comprobar que el proyecto Supabase esté activo

### Errores de RLS
- Verificar que las políticas estén habilitadas
- Comprobar que el usuario tenga los permisos correctos

### Problemas de Auth
- Verificar configuración de Authentication
- Comprobar que el email esté confirmado

## Producción

Para producción:

1. Configurar variables de entorno en el servicio de hosting
2. Configurar backups automáticos
3. Monitorear logs y métricas
4. Configurar alertas para errores