import json
import os
import sys
import traceback
from pathlib import Path

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

SYNCODE_DIR = Path(__file__).resolve().parents[3]
SCRIPTS_DIR = SYNCODE_DIR / "scripts"

if str(SCRIPTS_DIR) not in sys.path:
	sys.path.append(str(SCRIPTS_DIR))

from chunking import chunk_text
from faiss_loader import load_resources
from faiss_search import search_faiss
from pdf_loader import pdf_to_text
from rank_embeddings import rank_results

_faiss_resources = None


def get_faiss_resources():
	global _faiss_resources
	if _faiss_resources is None:
		_faiss_resources = load_resources()
	return _faiss_resources


def _read_text_file(file_path: Path) -> str:
	return file_path.read_text(encoding="utf-8", errors="ignore")


def _read_docx_file(file_path: Path) -> str:
	try:
		from docx import Document
	except ModuleNotFoundError as exc:
		raise ImportError("python-docx is required to read DOCX files.") from exc

	doc = Document(str(file_path))
	return "\n".join([p.text for p in doc.paragraphs if p.text])


def _extract_texts(file_paths):
	texts = []

	for raw_path in file_paths:
		if not raw_path:
			continue

		file_path = Path(raw_path).resolve()

		if not file_path.exists() or not file_path.is_file():
			raise FileNotFoundError(f"File not found: {file_path}")

		suffix = file_path.suffix.lower()

		if suffix == ".pdf":
			texts.append(pdf_to_text(str(file_path)))
		elif suffix == ".txt":
			texts.append(_read_text_file(file_path))
		elif suffix == ".docx":
			texts.append(_read_docx_file(file_path))
		else:
			raise ValueError(f"Unsupported file type: {suffix}")

	return texts


def _check_internal_key(request):
	expected = os.environ.get("INGESTION_API_KEY")
	if not expected:
		return None

	provided = request.headers.get("x-internal-api-key")
	if provided != expected:
		return JsonResponse({"error": "Unauthorized"}, status=401)

	return None


@csrf_exempt
def extract_codes(request):
	if request.method != "POST":
		return JsonResponse({"error": "POST request required"}, status=405)

	auth_error = _check_internal_key(request)
	if auth_error:
		return auth_error

	try:
		payload = json.loads(request.body or "{}")
		raw_text = payload.get("rawText", "")
		file_paths = payload.get("filePaths") or []

		top_k = int(payload.get("topK", 5))
		max_chars = int(payload.get("maxChars", 500))
		overlap = int(payload.get("overlap", 100))

		texts = []
		if raw_text and raw_text.strip():
			texts.append(raw_text)

		if file_paths:
			texts.extend(_extract_texts(file_paths))

		merged_text = "\n".join([t for t in texts if t and t.strip()])

		if not merged_text.strip():
			return JsonResponse({"error": "No text content to process"}, status=400)

		index, meta, model = get_faiss_resources()
		chunks = chunk_text(merged_text, max_chars=max_chars, overlap=overlap)
		raw_results = search_faiss(index, meta, model, chunks, top_k=top_k)
		ranked_results = rank_results(raw_results)

		return JsonResponse({
			"results": ranked_results,
			"count": len(ranked_results),
		})
	except json.JSONDecodeError as exc:
		return JsonResponse({"error": f"Invalid JSON: {exc}"}, status=400)
	except Exception as exc:
		error_message = str(exc) or exc.__class__.__name__
		response = {"error": error_message}
		if settings.DEBUG:
			response["type"] = exc.__class__.__name__
			response["trace"] = traceback.format_exc()
		return JsonResponse(response, status=500)
