-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "gynecological_profiles" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "gestas" INTEGER,
    "cesareas" INTEGER,
    "ectopicos" INTEGER,
    "partos" INTEGER,
    "abortos" INTEGER,
    "molas" INTEGER,
    "menstrualCycleDays" INTEGER,
    "menstrualDuration" INTEGER,
    "menstrualPain" TEXT,
    "lastMenstrualPeriod" TIMESTAMP(3),
    "menopause" BOOLEAN NOT NULL DEFAULT false,
    "menopauseAge" INTEGER,
    "contraceptiveMethod" TEXT,
    "sexuallyActive" BOOLEAN,
    "parity" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gynecological_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gynecological_profiles_patientId_key" ON "gynecological_profiles"("patientId");

-- CreateIndex
CREATE INDEX "gynecological_profiles_patientId_idx" ON "gynecological_profiles"("patientId");

-- AddForeignKey
ALTER TABLE "gynecological_profiles" ADD CONSTRAINT "gynecological_profiles_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
