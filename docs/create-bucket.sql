-- =====================================================
-- CRIAR BUCKET DE IMAGENS - RODE NO SUPABASE
-- =====================================================

-- 1. Criar o bucket (via Dashboard ou SQL)
-- Vá em Storage > Create Bucket
-- Nome: menu-images
-- Public: SIM (marque a opção)

-- 2. Se preferir via SQL, rode:
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Política para permitir upload (qualquer usuário autenticado pode fazer upload em sua pasta)
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images');

-- 4. Política para permitir leitura pública
CREATE POLICY "Public read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

-- 5. Política para deletar (só o dono)
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-images');
