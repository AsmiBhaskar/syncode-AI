-- CreateTable
CREATE TABLE "MedicalCode" (
    "id" SERIAL NOT NULL,
    "transcriptId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicalCode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicalCode" ADD CONSTRAINT "MedicalCode_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
