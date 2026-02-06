-- =====================================================
-- VERIFICAR E CONFIGURAR THEME_PRESET - RODE NO SUPABASE
-- =====================================================

-- Verificar se a coluna theme_preset existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'organizations' 
AND column_name = 'theme_preset';

-- Se não existir, criar:
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS theme_preset TEXT DEFAULT 'neo-brutal';

-- Verificar o valor atual do seu restaurante
SELECT id, name, slug, theme_preset FROM organizations;

-- Se theme_preset estiver NULL, definir como padrão
UPDATE organizations 
SET theme_preset = 'neo-brutal' 
WHERE theme_preset IS NULL;

-- Testar mudança para outro template
-- UPDATE organizations SET theme_preset = 'dark' WHERE slug = 'SEU_SLUG_AQUI';
