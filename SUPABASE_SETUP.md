# 🚀 Configuración de Supabase para TrackPort

## Paso 1: Crear proyecto en Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Haz clic en "New project"
3. Elige tu organización
4. Llena los detalles:
   - **Project name**: `trackport`
   - **Database password**: Crea una contraseña segura
   - **Region**: Elige la más cercana a tu ubicación
5. Haz clic en "Create new project"

## Paso 2: Ejecutar el schema de base de datos

1. Una vez creado el proyecto, ve a la sección **SQL Editor**
2. Copia todo el contenido del archivo `supabase-schema.sql`
3. Pégalo en el editor SQL
4. Haz clic en **Run** para ejecutar el script
5. Verifica que todas las tablas se crearon correctamente en la sección **Table Editor**

## Paso 3: Obtener las credenciales

1. Ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL**: `https://tu-proyecto.supabase.co`
   - **anon public key**: La clave que empieza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Paso 4: Actualizar la configuración de la app

1. Abre el archivo `src/lib/supabase.ts`
2. Reemplaza las variables:
   ```typescript
   const supabaseUrl = 'https://tu-proyecto.supabase.co';
   const supabaseAnonKey = 'tu-clave-publica-anon';
   ```

## Paso 5: Configurar autenticación (opcional)

### Email/Password Authentication
1. Ve a **Authentication** > **Settings**
2. En **User Signups**, asegúrate de que esté habilitado
3. Configura las URLs de redirección si es necesario

### Providers adicionales (Google, GitHub, etc.)
1. Ve a **Authentication** > **Providers**
2. Habilita los providers que desees
3. Configura las credenciales OAuth según el provider

## Paso 6: Configurar Storage (para imágenes de perfil)

1. Ve a **Storage**
2. Crea un bucket llamado `avatars`
3. Configura las políticas de acceso según tus necesidades

## Paso 7: Verificar la configuración

1. Ejecuta la app: `npm start`
2. Intenta registrar un nuevo usuario
3. Verifica que se cree automáticamente:
   - Registro en `auth.users`
   - Perfil en `public.profiles`
   - Portfolio por defecto en `public.portfolios`

## 🔧 Troubleshooting

### Error: "Invalid API key"
- Verifica que copiaste correctamente la clave anon
- Asegúrate de que no hay espacios extra

### Error: "Failed to fetch"
- Verifica la URL del proyecto
- Revisa tu conexión a internet

### Error: "Row Level Security policy violation"
- Verifica que las políticas RLS se crearon correctamente
- Revisa los logs en Supabase Dashboard > Logs

### Los triggers no funcionan
- Verifica que todas las funciones se crearon
- Revisa los logs de la base de datos

## 📊 Estructura de datos creada

### Tablas principales:
- `profiles`: Perfiles de usuario extendidos
- `portfolios`: Portfolios de inversión de cada usuario
- `investments`: Inversiones individuales en cada portfolio
- `price_history`: Historial de precios para tracking

### Vistas:
- `portfolio_summary`: Resumen calculado de cada portfolio

### Funciones:
- `handle_new_user()`: Crea perfil y portfolio automáticamente
- `handle_updated_at()`: Actualiza timestamp automáticamente

## 🔐 Seguridad configurada

- **Row Level Security (RLS)** habilitado en todas las tablas
- **Políticas de acceso** que aseguran que los usuarios solo vean sus datos
- **Triggers automáticos** para mantener datos consistentes
- **Validaciones** a nivel de base de datos

¡Listo! Tu proyecto TrackPort ahora tiene una base de datos completa y segura. 🎉