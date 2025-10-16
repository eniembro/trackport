-- ============================================================
-- SCHEMA AVANZADO PARA SISTEMA DE ADMINISTRACIÓN MODULAR
-- ============================================================

-- Tabla de módulos del sistema
CREATE TABLE IF NOT EXISTS public.system_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de permisos específicos por módulo
CREATE TABLE IF NOT EXISTS public.module_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.system_modules(id) ON DELETE CASCADE,
  permission_code VARCHAR(100) NOT NULL,
  permission_name VARCHAR(200) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, permission_code)
);

-- Expandir tabla de roles de usuario
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES public.system_modules(id);
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Eliminar restricción de único user_id para permitir múltiples módulos
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_key;
-- Agregar restricción única por usuario y módulo
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_module_unique UNIQUE(user_id, module_id);

-- Tabla de permisos asignados a usuarios
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.module_permissions(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, permission_id)
);

-- Tabla para métodos de notificación de usuarios
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  preferred_method VARCHAR(20) DEFAULT 'email' CHECK (preferred_method IN ('email', 'whatsapp', 'sms')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para auditoría de creación de usuarios
CREATE TABLE IF NOT EXISTS public.user_creation_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_user_id UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  username VARCHAR(100),
  email VARCHAR(255),
  module VARCHAR(50),
  department VARCHAR(100),
  notification_method VARCHAR(20),
  notification_sent BOOLEAN DEFAULT false,
  temporary_password_hash TEXT,
  password_reset_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.system_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_creation_log ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLÍTICAS DE SEGURIDAD
-- ============================================================

-- Políticas para system_modules
CREATE POLICY "Anyone can view active modules" ON public.system_modules
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admin can manage modules" ON public.system_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para module_permissions
CREATE POLICY "Anyone can view active permissions" ON public.module_permissions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admin can manage permissions" ON public.module_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para user_permissions
CREATE POLICY "Users can view own permissions" ON public.user_permissions
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admin can manage user permissions" ON public.user_permissions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admin can update user permissions" ON public.user_permissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admin can delete user permissions" ON public.user_permissions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para user_notifications
CREATE POLICY "Users can view own notification settings" ON public.user_notifications
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own notification settings" ON public.user_notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all notification settings" ON public.user_notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para user_creation_log
CREATE POLICY "Only admin can view creation logs" ON public.user_creation_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admin can create logs" ON public.user_creation_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- INSERTAR DATOS INICIALES
-- ============================================================

-- Insertar módulos del sistema
INSERT INTO public.system_modules (name, display_name, description) VALUES
('CLIENTE', 'Gestión de Clientes', 'Módulo para administración de clientes y prospectos'),
('VENTAS', 'Ventas y Cotizaciones', 'Módulo para gestión de ventas, cotizaciones y seguimiento comercial'),
('SAC', 'Servicio al Cliente', 'Módulo para atención al cliente y soporte técnico'),
('A_ADUANAL', 'Agencia Aduanal', 'Módulo para gestión de trámites aduanales y comercio exterior'),
('ADMIN', 'Administración', 'Módulo de administración general del sistema')
ON CONFLICT (name) DO NOTHING;

-- Insertar permisos por módulo
INSERT INTO public.module_permissions (module_id, permission_code, permission_name, description)
SELECT 
  m.id,
  p.code,
  p.name,
  p.description
FROM public.system_modules m
CROSS JOIN (
  -- Permisos para CLIENTE
  SELECT 'CLIENTE' as module, 'view_clients' as code, 'Ver Clientes' as name, 'Visualizar lista de clientes' as description
  UNION ALL
  SELECT 'CLIENTE', 'create_clients', 'Crear Clientes', 'Registrar nuevos clientes'
  UNION ALL
  SELECT 'CLIENTE', 'edit_clients', 'Editar Clientes', 'Modificar información de clientes'
  UNION ALL
  SELECT 'CLIENTE', 'delete_clients', 'Eliminar Clientes', 'Eliminar clientes del sistema'
  UNION ALL
  SELECT 'CLIENTE', 'export_clients', 'Exportar Clientes', 'Exportar datos de clientes'
  
  -- Permisos para VENTAS
  UNION ALL
  SELECT 'VENTAS', 'view_sales', 'Ver Ventas', 'Visualizar ventas y cotizaciones'
  UNION ALL
  SELECT 'VENTAS', 'create_quotes', 'Crear Cotizaciones', 'Generar nuevas cotizaciones'
  UNION ALL
  SELECT 'VENTAS', 'approve_sales', 'Aprobar Ventas', 'Aprobar y finalizar ventas'
  UNION ALL
  SELECT 'VENTAS', 'view_reports', 'Ver Reportes', 'Acceder a reportes de ventas'
  UNION ALL
  SELECT 'VENTAS', 'manage_pricing', 'Gestionar Precios', 'Administrar precios y descuentos'
  
  -- Permisos para SAC
  UNION ALL
  SELECT 'SAC', 'view_tickets', 'Ver Tickets', 'Visualizar tickets de soporte'
  UNION ALL
  SELECT 'SAC', 'create_tickets', 'Crear Tickets', 'Crear nuevos tickets de soporte'
  UNION ALL
  SELECT 'SAC', 'resolve_tickets', 'Resolver Tickets', 'Resolver y cerrar tickets'
  UNION ALL
  SELECT 'SAC', 'escalate_tickets', 'Escalar Tickets', 'Escalar tickets a supervisores'
  UNION ALL
  SELECT 'SAC', 'view_satisfaction', 'Ver Satisfacción', 'Acceder a métricas de satisfacción'
  
  -- Permisos para A.ADUANAL
  UNION ALL
  SELECT 'A_ADUANAL', 'view_customs', 'Ver Trámites', 'Visualizar trámites aduanales'
  UNION ALL
  SELECT 'A_ADUANAL', 'create_customs', 'Crear Trámites', 'Iniciar nuevos trámites aduanales'
  UNION ALL
  SELECT 'A_ADUANAL', 'track_shipments', 'Rastrear Envíos', 'Seguimiento de mercancías'
  UNION ALL
  SELECT 'A_ADUANAL', 'manage_documents', 'Gestionar Documentos', 'Administrar documentación aduanal'
  UNION ALL
  SELECT 'A_ADUANAL', 'calculate_duties', 'Calcular Aranceles', 'Calcular impuestos y aranceles'
  
  -- Permisos para ADMIN
  UNION ALL
  SELECT 'ADMIN', 'manage_users', 'Gestionar Usuarios', 'Crear, editar y eliminar usuarios'
  UNION ALL
  SELECT 'ADMIN', 'manage_roles', 'Gestionar Roles', 'Asignar roles y permisos'
  UNION ALL
  SELECT 'ADMIN', 'view_audit_logs', 'Ver Auditoría', 'Acceder a logs de auditoría'
  UNION ALL
  SELECT 'ADMIN', 'system_config', 'Configuración', 'Configurar parámetros del sistema'
  UNION ALL
  SELECT 'ADMIN', 'backup_restore', 'Respaldo/Restauración', 'Realizar respaldos y restauraciones'
) p
WHERE m.name = p.module
ON CONFLICT (module_id, permission_code) DO NOTHING;

-- ============================================================
-- FUNCIONES AUXILIARES
-- ============================================================

-- Función para obtener permisos de usuario por módulo
CREATE OR REPLACE FUNCTION get_user_module_permissions(user_uuid UUID, module_name TEXT)
RETURNS TABLE(permission_code TEXT, permission_name TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT mp.permission_code, mp.permission_name
  FROM public.user_permissions up
  JOIN public.module_permissions mp ON up.permission_id = mp.id
  JOIN public.system_modules sm ON mp.module_id = sm.id
  WHERE up.user_id = user_uuid 
    AND sm.name = module_name 
    AND up.is_active = true 
    AND mp.is_active = true 
    AND sm.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si usuario tiene permiso específico
CREATE OR REPLACE FUNCTION user_has_permission(user_uuid UUID, permission_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  has_perm BOOLEAN := false;
BEGIN
  SELECT EXISTS(
    SELECT 1 
    FROM public.user_permissions up
    JOIN public.module_permissions mp ON up.permission_id = mp.id
    WHERE up.user_id = user_uuid 
      AND mp.permission_code = permission_code
      AND up.is_active = true 
      AND mp.is_active = true
  ) INTO has_perm;
  
  RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para asignar usuario a módulo con permisos
CREATE OR REPLACE FUNCTION assign_user_to_module(
  user_uuid UUID,
  module_name TEXT,
  user_role TEXT DEFAULT 'user',
  user_department TEXT DEFAULT NULL,
  permission_codes TEXT[] DEFAULT '{}'::TEXT[]
)
RETURNS BOOLEAN AS $$
DECLARE
  module_uuid UUID;
  perm_id UUID;
  perm_code TEXT;
BEGIN
  -- Obtener ID del módulo
  SELECT id INTO module_uuid 
  FROM public.system_modules 
  WHERE name = module_name AND is_active = true;
  
  IF module_uuid IS NULL THEN
    RAISE EXCEPTION 'Módulo % no encontrado', module_name;
  END IF;
  
  -- Asignar rol al usuario en el módulo
  INSERT INTO public.user_roles (user_id, role, module_id, department, created_by)
  VALUES (user_uuid, user_role, module_uuid, user_department, auth.uid())
  ON CONFLICT (user_id, module_id) 
  DO UPDATE SET 
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    updated_at = NOW();
  
  -- Asignar permisos específicos
  FOREACH perm_code IN ARRAY permission_codes
  LOOP
    SELECT id INTO perm_id 
    FROM public.module_permissions 
    WHERE permission_code = perm_code AND module_id = module_uuid;
    
    IF perm_id IS NOT NULL THEN
      INSERT INTO public.user_permissions (user_id, permission_id, granted_by)
      VALUES (user_uuid, perm_id, auth.uid())
      ON CONFLICT (user_id, permission_id) DO NOTHING;
    END IF;
  END LOOP;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;