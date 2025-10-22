# 🚀 CREACIÓN DE PROYECTO SUPABASE PARA TRACKPORT

## 📋 **GUÍA PASO A PASO PARA CREAR SUPABASE**

### **🔗 PASO 1: Crear Cuenta y Proyecto**

1. **Ir a Supabase**:
   ```
   https://app.supabase.com
   ```

2. **Crear cuenta o iniciar sesión**:
   - Usar GitHub, Google, o email
   - Completar registro si es primera vez

3. **Crear nuevo proyecto**:
   - Clic en "New Project"
   - Nombre: `trackport`
   - Descripción: `Container Tracking & Customs Management`
   - Password de la base de datos: `TrackPortDB2024!`
   - Región: `East US (Ohio)` (recomendado)
   - Plan: `Free` (suficiente para empezar)
   - Clic "Create new project"

### **⏳ PASO 2: Esperar Configuración (2-3 minutos)**

Supabase configurará automáticamente:
- ✅ Base de datos PostgreSQL
- ✅ Autenticación
- ✅ APIs automáticas
- ✅ Dashboard

### **🔑 PASO 3: Obtener Credenciales**

Una vez creado el proyecto:

1. **Ir a Settings > API**:
   - URL del proyecto: `https://[tu-id].supabase.co`
   - Anon/Public key: `eyJ...` (clave larga)
   - Service role key: `eyJ...` (clave secreta)

### **📝 PASO 4: Configurar Esquema de Base de Datos**

1. **Ir a SQL Editor**
2. **Copiar y pegar este código**:

```sql
-- Crear tablas para TrackPort
CREATE TABLE IF NOT EXISTS public.containers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    container_number VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'received',
    client_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.instruction_letters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    container_id UUID REFERENCES public.containers(id),
    client_id UUID REFERENCES auth.users(id),
    status VARCHAR(50) DEFAULT 'draft',
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    container_id UUID REFERENCES public.containers(id),
    client_id UUID REFERENCES auth.users(id),
    amount DECIMAL(10,2),
    payment_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instruction_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de seguridad
CREATE POLICY "Users can view own containers" ON public.containers
    FOR SELECT USING (auth.uid() = client_id OR auth.jwt() ->> 'role' IN ('main_admin', 'customer_service', 'customs_broker'));

CREATE POLICY "Users can view own instruction letters" ON public.instruction_letters
    FOR SELECT USING (auth.uid() = client_id OR auth.jwt() ->> 'role' IN ('main_admin', 'customer_service', 'customs_broker', 'sales'));

CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = client_id OR auth.jwt() ->> 'role' IN ('main_admin', 'customer_service', 'sales'));
```

3. **Ejecutar el script** (clic "RUN")

### **🔐 PASO 5: Configurar Autenticación**

1. **Ir a Authentication > Settings**
2. **Configurar Email Templates** (opcional por ahora)
3. **Site URL**: `https://www.track-port.com`
4. **Redirect URLs**: Agregar:
   - `https://www.track-port.com`
   - `https://track-port.vercel.app`

### **📊 PASO 6: Proporcionar Credenciales**

**Una vez completado, necesito que me proporciones:**

1. **Project URL**: `https://[tu-id-único].supabase.co`
2. **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (pública)
3. **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (privada/secreta)

### **⚡ PASO 7: Una vez tengas las credenciales**

Te ayudaré a:
1. ✅ Actualizar el archivo `.env` con valores reales
2. ✅ Crear los 8 usuarios automáticamente
3. ✅ Verificar que el login funcione
4. ✅ Probar la aplicación completa

---

## 🎯 **RESUMEN DE ACCIONES**

1. **Tú**: Crear proyecto en Supabase (5-10 minutos)
2. **Tú**: Proporcionarme las 3 credenciales
3. **Yo**: Configurar automáticamente todo lo demás

**¿Listo para empezar? Ve a https://app.supabase.com y sigue los pasos!** 🚀