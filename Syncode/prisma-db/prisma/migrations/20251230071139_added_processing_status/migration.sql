-- CreateTable
CREATE TABLE "ProcessingStatus" (
    "id" SERIAL NOT NULL,
    "transcriptId" INTEGER NOT NULL,
    "service" TEXT NOT NULL,
    "progress" INTEGER NOT NULL,
    "currentStep" TEXT NOT NULL,
    "steps" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessingStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessingStatus_transcriptId_key" ON "ProcessingStatus"("transcriptId");

-- AddForeignKey
ALTER TABLE "ProcessingStatus" ADD CONSTRAINT "ProcessingStatus_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
