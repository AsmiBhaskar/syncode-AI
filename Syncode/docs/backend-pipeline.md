# Backend ingestion + vector search pipeline

## Purpose
This document summarizes the Django ingestion and vector search services, how they are used, and how to rebuild the ICD vector database.

## Endpoints (Django)

### POST /api/ingestion/extract/
Runs the full extraction pipeline (text -> chunk -> vector search -> rank).

Request JSON:
- rawText: string (optional, required if filePaths empty)
- filePaths: string[] (optional, absolute server paths)
- topK: number (optional, default 5)
- maxChars: number (optional, default 500)
- overlap: number (optional, default 100)

Response JSON:
- results: array of objects
  - chunk: string
  - code: string
  - description: string
  - section_id: string
  - section_name: string
  - includes: string
  - distance: number
- count: number

Notes:
- filePaths must be accessible on the Django host; do not send file content here.
- Exclusion fields are intentionally removed from the response.

### POST /api/vector-search/
Direct FAISS lookup for quick searches.

Request JSON:
- query: string (text search) OR
- vector: number[] (embedding vector)
- k: number (optional, default 5)

Response JSON:
- results: array of objects
  - icd_code: string
  - description: string
  - section_id: string
  - section_name: string
  - includes: string
  - distance: number
- count: number

## Pipeline steps
1) Extract text (PDF/TXT/DOCX)
2) Normalize and chunk text
3) Embed chunks with SentenceTransformer
4) Search FAISS index
5) Rank and return codes

## Vector DB rebuild
Rebuild when the ICD CSV changes or you want fresh embeddings:

1) Ensure the model is cached (MiniLM 384-dim).
2) Run:
   python scripts/setup_vectordb.py

Artifacts:
- ml/embeddings/faiss_index.index
- ml/embeddings/icd_meta.npy

## Model + index compatibility
The loader selects the model based on FAISS dimension:
- 384: sentence-transformers/all-MiniLM-L6-v2
- 768: sentence-transformers/all-mpnet-base-v2

If index/model dims mismatch, ingestion fails with a clear error.

## Tests
Run from Syncode/backend:
- python manage.py test

Tests cover:
- ingestion endpoint request handling
- vector search endpoint request handling
