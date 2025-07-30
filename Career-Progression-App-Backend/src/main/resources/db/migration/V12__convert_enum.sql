ALTER TABLE PromotionRequest ADD COLUMN status_temp VARCHAR(20);

UPDATE PromotionRequest pr
SET status_temp = ps.name
FROM PromotionStatus ps
WHERE pr.status = ps.id;

ALTER TABLE PromotionRequest DROP COLUMN status;
ALTER TABLE PromotionRequest RENAME COLUMN status_temp TO status;
ALTER TABLE PromotionRequest ALTER COLUMN status SET NOT NULL;