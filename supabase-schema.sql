-- TrackPort Database Schema
-- Ejecutar estos comandos en tu consola de Supabase SQL Editor

-- 1. Crear tabla de perfiles de usuario (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- 2. Crear tabla de portfolios
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Crear tabla de inversiones
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('stock', 'crypto', 'bond', 'fund', 'other')),
  quantity DECIMAL(20, 8) NOT NULL CHECK (quantity > 0),
  purchase_price DECIMAL(20, 2) NOT NULL CHECK (purchase_price > 0),
  current_price DECIMAL(20, 2),
  purchase_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Crear tabla de historial de precios (para tracking)
CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  investment_id UUID REFERENCES public.investments(id) ON DELETE CASCADE NOT NULL,
  price DECIMAL(20, 2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas de seguridad

-- Políticas para profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para portfolios
CREATE POLICY "Users can view own portfolios." ON public.portfolios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolios." ON public.portfolios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios." ON public.portfolios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios." ON public.portfolios
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para investments
CREATE POLICY "Users can view own investments." ON public.investments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = investments.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own investments." ON public.investments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = investments.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own investments." ON public.investments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = investments.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own investments." ON public.investments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = investments.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

-- Políticas para price_history
CREATE POLICY "Users can view own price history." ON public.price_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.investments 
      JOIN public.portfolios ON portfolios.id = investments.portfolio_id
      WHERE investments.id = price_history.investment_id 
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own price history." ON public.price_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.investments 
      JOIN public.portfolios ON portfolios.id = investments.portfolio_id
      WHERE investments.id = price_history.investment_id 
      AND portfolios.user_id = auth.uid()
    )
  );

-- 7. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Crear triggers para updated_at
CREATE TRIGGER on_auth_user_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_portfolio_updated
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_investment_updated
  BEFORE UPDATE ON public.investments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 9. Crear función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  -- Crear portfolio por defecto
  INSERT INTO public.portfolios (user_id, name, description, is_default)
  VALUES (new.id, 'Mi Portfolio Principal', 'Portfolio principal de inversiones', true);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Crear trigger para nuevos usuarios
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 11. Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_portfolio_id ON public.investments(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_investments_symbol ON public.investments(symbol);
CREATE INDEX IF NOT EXISTS idx_price_history_investment_id ON public.price_history(investment_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON public.price_history(recorded_at);

-- 12. Crear vistas útiles para consultas complejas
CREATE OR REPLACE VIEW public.portfolio_summary AS
SELECT 
  p.id,
  p.user_id,
  p.name,
  p.description,
  p.is_default,
  COUNT(i.id) as total_investments,
  COALESCE(SUM(i.quantity * i.purchase_price), 0) as total_invested,
  COALESCE(SUM(i.quantity * COALESCE(i.current_price, i.purchase_price)), 0) as current_value,
  COALESCE(SUM(i.quantity * COALESCE(i.current_price, i.purchase_price)) - SUM(i.quantity * i.purchase_price), 0) as total_gain_loss
FROM public.portfolios p
LEFT JOIN public.investments i ON p.id = i.portfolio_id
GROUP BY p.id, p.user_id, p.name, p.description, p.is_default;

-- Comentarios finales:
-- Después de ejecutar este script:
-- 1. Ve a Authentication > Settings en Supabase Dashboard
-- 2. Copia tu Project URL y anon public key
-- 3. Actualiza src/lib/supabase.ts con estos valores reales