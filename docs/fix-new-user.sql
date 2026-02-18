-- =====================================================
-- FIX: Suporte a Novos Usuários
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- 1. Garantir que todas as colunas existam na tabela organizations
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS admin_theme TEXT DEFAULT 'sunset';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS theme_preset TEXT DEFAULT 'neo-brutal';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS favicon_url TEXT;

-- 2. Garantir que as políticas de RLS permitam INSERT e UPDATE
-- (Necessário para auto-criação de organização ao primeiro login)

-- Remover políticas antigas que possam estar bloqueando
DROP POLICY IF EXISTS "Public read organizations" ON organizations;
DROP POLICY IF EXISTS "Allow all for organizations" ON organizations;
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Allow all for categories" ON categories;
DROP POLICY IF EXISTS "Public read items" ON menu_items;
DROP POLICY IF EXISTS "Allow all for menu_items" ON menu_items;

-- Recriar políticas corretas
CREATE POLICY "Public read organizations" ON organizations FOR SELECT USING (true);
CREATE POLICY "Allow write organizations" ON organizations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update organizations" ON organizations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete organizations" ON organizations FOR DELETE USING (true);

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow write categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update categories" ON categories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete categories" ON categories FOR DELETE USING (true);

CREATE POLICY "Public read items" ON menu_items FOR SELECT USING (is_active = true);
CREATE POLICY "Allow write items" ON menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update items" ON menu_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete items" ON menu_items FOR DELETE USING (true);

-- 3. Verificar resultado
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'organizations'
ORDER BY ordinal_position;
