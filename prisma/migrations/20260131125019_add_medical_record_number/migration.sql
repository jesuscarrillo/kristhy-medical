-- AlterTable: Add medicalRecordNumber with temporary nullable
ALTER TABLE "patients" ADD COLUMN "medicalRecordNumber" TEXT;

-- Generate unique medical record numbers for existing patients using a subquery
WITH numbered_patients AS (
  SELECT 
    id,
    'HM-' || LPAD((ROW_NUMBER() OVER (ORDER BY "createdAt"))::TEXT, 6, '0') as new_number
  FROM "patients"
  WHERE "medicalRecordNumber" IS NULL
)
UPDATE "patients"
SET "medicalRecordNumber" = numbered_patients.new_number
FROM numbered_patients
WHERE "patients".id = numbered_patients.id;

-- Make medicalRecordNumber required and unique
ALTER TABLE "patients" ALTER COLUMN "medicalRecordNumber" SET NOT NULL;
CREATE UNIQUE INDEX "patients_medicalRecordNumber_key" ON "patients"("medicalRecordNumber");
CREATE INDEX "patients_medicalRecordNumber_idx" ON "patients"("medicalRecordNumber");
