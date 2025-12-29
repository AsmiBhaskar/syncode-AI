/*
  Warnings:

  - You are about to drop the column `accuracy` on the `Transcript` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `Transcript` table. All the data in the column will be lost.
  - Added the required column `inputType` to the `Transcript` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InputType" AS ENUM ('FILE', 'TEXT');

-- AlterTable
ALTER TABLE "Transcript" DROP COLUMN "accuracy",
DROP COLUMN "fileName",
ADD COLUMN     "caseId" TEXT,
ADD COLUMN     "filePaths" TEXT[],
ADD COLUMN     "inputType" "InputType" NOT NULL,
ADD COLUMN     "insuranceProvider" TEXT,
ADD COLUMN     "policyType" TEXT,
ADD COLUMN     "rawText" TEXT,
ADD COLUMN     "service" TEXT;
