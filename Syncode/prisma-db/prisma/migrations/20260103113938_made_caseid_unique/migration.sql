/*
  Warnings:

  - A unique constraint covering the columns `[caseId]` on the table `Transcript` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transcript_caseId_key" ON "Transcript"("caseId");
