-- CreateEnum
CREATE TYPE "TranscriptStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Transcript" (
    "id" SERIAL NOT NULL,
    "transcriptId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "status" "TranscriptStatus" NOT NULL DEFAULT 'PROCESSING',
    "accuracy" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Transcript_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transcript_transcriptId_key" ON "Transcript"("transcriptId");

-- AddForeignKey
ALTER TABLE "Transcript" ADD CONSTRAINT "Transcript_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
