-- ========================================================
-- ESQUEMA DE BASE DE DATOS PARA DULZURABOX (SUPABASE)
-- Ejecutar en el SQL Editor de Supabase
-- ========================================================

-- 1. Crear tabla de categorías
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Crear tabla de productos
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Seguridad (RLS)
-- Permitir lectura pública a cualquiera (Visitantes de la tienda)
CREATE POLICY "Permitir lectura publica de categorias" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Permitir lectura publica de productos activos" 
ON public.products FOR SELECT 
USING (true);

-- Permitir todas las operaciones (Insert, Update, Delete) solo a usuarios autenticados (Admin)
CREATE POLICY "Permitir todo a administradores en categorias" 
ON public.categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Permitir todo a administradores en productos" 
ON public.products FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 5. Configurar Storage para imágenes de productos
-- Crea el bucket 'products' como público si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de Storage
CREATE POLICY "Acceso publico de lectura a imagenes de productos"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Admin puede subir y modificar imagenes de productos"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');

-- 6. Insertar Categorías Iniciales
INSERT INTO public.categories (name, slug, order_index) VALUES
('Hot Wheels', 'hot-wheels', 1),
('Cajas DulzuraBox', 'cajas-dulzurabox', 2),
('Ramos', 'ramos', 3),
('Cuadros y Polaroids', 'cuadros-polaroids', 4)
ON CONFLICT (slug) DO NOTHING;
