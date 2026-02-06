-- =====================================================
-- LIMPAR IMAGE_PATH INVÁLIDOS - RODE NO SUPABASE
-- =====================================================

-- Verificar itens com image_path problemático
SELECT id, name, image_path 
FROM menu_items 
WHERE image_path IS NOT NULL 
  AND image_path != ''
  AND image_path NOT LIKE 'http%';

-- Limpar image_path que não são URLs válidas
UPDATE menu_items 
SET image_path = NULL 
WHERE image_path IS NOT NULL 
  AND image_path != ''
  AND image_path NOT LIKE 'http%';

-- Verificar resultado
SELECT id, name, image_path FROM menu_items;
