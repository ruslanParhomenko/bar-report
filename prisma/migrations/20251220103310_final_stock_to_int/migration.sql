-- 1. Удаляем старое строковое поле
ALTER TABLE "Tobacco" DROP COLUMN "finalStock";

-- 2. Переименовываем временное числовое поле
ALTER TABLE "Tobacco" RENAME COLUMN "finalStockInt" TO "finalStock";

-- 3. Делаем поле обязательным
ALTER TABLE "Tobacco" ALTER COLUMN "finalStock" SET NOT NULL;

