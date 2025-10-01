-- SQL script to update "Bread" to "Couvert" in whats_included column
-- This updates the JSON array values in the database

-- For PostgreSQL, update JSON arrays
UPDATE restaurants
SET whats_included = REPLACE(whats_included, '"Bread"', '"Couvert"')
WHERE whats_included LIKE '%"Bread"%';

-- Verify the update
SELECT id, name, whats_included
FROM restaurants
WHERE whats_included LIKE '%Couvert%';
