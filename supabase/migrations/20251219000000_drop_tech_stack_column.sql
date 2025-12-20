-- Migration: Drop `tech_stack` column from `jobs` table
-- WARNING: This will permanently remove any data stored in the tech_stack column.
-- Make a full backup of your database before applying this migration.

BEGIN;

ALTER TABLE public.jobs
  DROP COLUMN IF EXISTS tech_stack;

COMMIT;

-- ROLLBACK (manual):
-- To restore the column (empty default values), run the following SQL:
-- BEGIN;
-- ALTER TABLE public.jobs
--   ADD COLUMN tech_stack text[] DEFAULT '{}';
-- COMMIT;
