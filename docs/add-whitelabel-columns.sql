-- =====================================================
-- ADICIONAR COLUNAS WHITE LABEL - RODE NO SUPABASE
-- =====================================================

-- Adicionar coluna para tema do admin
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS admin_theme TEXT DEFAULT 'sunset';

-- Adicionar coluna para favicon
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS favicon_url TEXT;

-- Verificar se logo_url já existe (se não, adicionar)
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Verificar estrutura final
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'organizations';
