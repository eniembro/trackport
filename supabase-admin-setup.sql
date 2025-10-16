-- Agregar columna de rol a auth.users (metadata)
-- Esto se hace en Supabase Dashboard > Authentication > Settings > User Metadata

-- Crear tabla de roles y permisos
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Política para que solo el admin y el propio usuario puedan ver sus roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Política para que solo admin pueda modificar roles
CREATE POLICY "Only admin can modify roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Función para obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID DEFAULT auth.uid())
RETURNS VARCHAR(50) AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.user_roles 
    WHERE user_id = user_uuid 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si es admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM public.user_roles 
    WHERE user_id = user_uuid 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear rol por defecto al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role, permissions)
  VALUES (
    NEW.id, 
    CASE 
      WHEN NEW.email = 'eniembro@icloud.com' THEN 'admin'
      ELSE 'user'
    END,
    CASE 
      WHEN NEW.email = 'eniembro@icloud.com' THEN '["create_users", "manage_roles", "view_all_data", "export_data", "manage_system"]'::jsonb
      ELSE '["view_own_data", "manage_own_portfolio"]'::jsonb
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Actualizar políticas RLS para portfolios (solo admin puede ver todos)
DROP POLICY IF EXISTS "Users can view own portfolios" ON public.portfolios;
CREATE POLICY "Users can view portfolios" ON public.portfolios
  FOR SELECT USING (
    auth.uid() = user_id OR 
    public.is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert own portfolios" ON public.portfolios;
CREATE POLICY "Users can insert portfolios" ON public.portfolios
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    public.is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own portfolios" ON public.portfolios;
CREATE POLICY "Users can update portfolios" ON public.portfolios
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    public.is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete own portfolios" ON public.portfolios;
CREATE POLICY "Users can delete portfolios" ON public.portfolios
  FOR DELETE USING (
    auth.uid() = user_id OR 
    public.is_admin(auth.uid())
  );

-- Similarmente para investments
DROP POLICY IF EXISTS "Users can view own investments" ON public.investments;
CREATE POLICY "Users can view investments" ON public.investments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE id = portfolio_id AND (user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Users can insert own investments" ON public.investments;
CREATE POLICY "Users can insert investments" ON public.investments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE id = portfolio_id AND (user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Users can update own investments" ON public.investments;
CREATE POLICY "Users can update investments" ON public.investments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE id = portfolio_id AND (user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Users can delete own investments" ON public.investments;
CREATE POLICY "Users can delete investments" ON public.investments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE id = portfolio_id AND (user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

-- Crear vista para información de usuarios (solo admin)
CREATE OR REPLACE VIEW public.admin_users_view AS
SELECT 
  u.id,
  u.email,
  u.created_at as user_created_at,
  ur.role,
  ur.permissions,
  ur.created_at as role_created_at,
  (SELECT COUNT(*) FROM public.portfolios WHERE user_id = u.id) as portfolio_count,
  (SELECT COUNT(*) FROM public.investments i 
   JOIN public.portfolios p ON i.portfolio_id = p.id 
   WHERE p.user_id = u.id) as investment_count
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id;

-- Grant permisos a la vista solo para admin
GRANT SELECT ON public.admin_users_view TO authenticated;

-- RLS para la vista
CREATE POLICY "Only admin can view user list" ON public.admin_users_view
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Insertar el usuario admin si no existe (esto se ejecutará cuando se registre)
-- El trigger se encargará de asignar el rol automáticamente