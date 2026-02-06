-- ============================================
-- SCRIPT DEFINITIVO: Configuração do Bucket de Imagens
-- Execute INTEIRO no SQL Editor do Supabase
-- ============================================

-- PASSO 1: Criar o bucket (ignora se já existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- PASSO 2: Habilitar RLS na tabela de objetos (necessário para policies)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- PASSO 3: Remover policies antigas (evita conflitos)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
    DROP POLICY IF EXISTS "menu-images-public-read" ON storage.objects;
    DROP POLICY IF EXISTS "menu-images-auth-insert" ON storage.objects;
    DROP POLICY IF EXISTS "menu-images-auth-update" ON storage.objects;
    DROP POLICY IF EXISTS "menu-images-auth-delete" ON storage.objects;
    DROP POLICY IF EXISTS "allow-public-read" ON storage.objects;
    DROP POLICY IF EXISTS "allow-all-insert" ON storage.objects;
EXCEPTION WHEN undefined_object THEN
    NULL;
END $$;

-- PASSO 4: Policy para LEITURA PÚBLICA (necessário para exibir imagens)
CREATE POLICY "allow-public-read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'menu-images');

-- PASSO 5: Policy para UPLOAD (qualquer um pode fazer upload - simplificado)
CREATE POLICY "allow-all-insert"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'menu-images');

-- PASSO 6: Policy para UPDATE
CREATE POLICY "allow-all-update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'menu-images');

-- PASSO 7: Policy para DELETE
CREATE POLICY "allow-all-delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'menu-images');

-- ============================================
-- PRONTO! Agora os uploads devem funcionar.
-- Teste na página de Configurações fazendo upload de uma logo.
-- ============================================
