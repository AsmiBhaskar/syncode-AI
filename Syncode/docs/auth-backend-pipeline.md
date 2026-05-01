# Auth backend integration (full pipeline flow)

## Purpose
This document summarizes how the Node auth-backend connects the frontend to Django ingestion for the full pipeline flow.

## Runtime flow
1) Frontend uploads a transcript to auth-backend.
2) Auth-backend creates a transcript + processing status in Postgres.
3) Background processing calls Django ingestion.
4) ICD codes are saved to medicalCodes.
5) Processing status updates as steps complete.
6) Frontend polls status and then fetches results.

## Key endpoints (auth-backend)
- POST /api/transcripts/upload
  - Creates transcript and kicks off background processing.

- GET /api/transcripts/:transcriptId/status
  - Used by frontend to show progress.

- GET /api/results/:caseId
  - Returns codes; returns 202 if still processing.

## Services
- services/ingestion.service.js
  - Calls Django ingestion endpoint.

- services/transcriptProcessing.service.js
  - Orchestrates status updates and code persistence.

## Environment variables
Auth-backend (.env):
- DJANGO_INGESTION_URL=http://localhost:8000/api/ingestion/extract/
- PROCESSING_STATUS_URL=http://localhost:5000/api/transcripts/internal/processing-status
- INTERNAL_API_KEY=dev-internal-key

Frontend (.env):
- VITE_BACKEND_URL=http://localhost:5000

## Status steps
The default steps used for processing status:
1) Ingestion
2) Code Extraction
3) Finalize

## Development notes
- Django should be running on port 8000.
- Auth-backend should be running on port 5000.
- Frontend should be running on port 5173.
