/*
  Warnings:

  - The primary key for the `Plan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deletedAt` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `isArchived` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_pkey",
DROP COLUMN "deletedAt",
DROP COLUMN "isArchived",
ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "isCustom" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPopular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresCard" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "savings" DOUBLE PRECISION,
ADD COLUMN     "trialDays" INTEGER,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "Plan_pkey" PRIMARY KEY ("id");
