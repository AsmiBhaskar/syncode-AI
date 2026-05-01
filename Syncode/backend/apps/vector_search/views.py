from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import numpy as np
import json
from .client import FaissClient

# Lazy initialization to prevent startup crashes
_faiss_client = None

def get_faiss_client():
	global _faiss_client
	if _faiss_client is None:
		_faiss_client = FaissClient()
	return _faiss_client

@csrf_exempt
def vector_search(request):
	if request.method == 'POST':
		try:
			data = json.loads(request.body)
			query_text = data.get('query')
			query_vector = data.get('vector')
			k = int(data.get('k', 5))
			
			# Support text-based search (primary method)
			if query_text:
				faiss_client = get_faiss_client()
				results = faiss_client.search_by_text(query_text, k)
				return JsonResponse({'results': results, 'count': len(results)})
			
			# Support vector-based search (backward compatibility)
			elif query_vector and isinstance(query_vector, list):
				faiss_client = get_faiss_client()
				D, I = faiss_client.search(np.array(query_vector, dtype='float32').reshape(1, -1), k)
				# Return with metadata
				results = []
				for i, d in zip(I, D):
					meta_entry = faiss_client.meta[i]
					if len(meta_entry) >= 3:
						code, desc, section = meta_entry[0], meta_entry[1], meta_entry[2]
					else:
						code, desc = meta_entry[0], meta_entry[1]
						section = ["", "", "", "", ""]

					if isinstance(section, (list, tuple, np.ndarray)):
						section_values = list(section)
					else:
						section_values = []
					section_values = (section_values + ["", "", "", "", ""])[:5]

					def clean_value(value):
						if value is None:
							return ""
						if isinstance(value, str) and value.strip().lower() == "nan":
							return ""
						if isinstance(value, float) and np.isnan(value):
							return ""
						return str(value)
					results.append({
						"icd_code": clean_value(code),
						"description": clean_value(desc),
						"section_id": clean_value(section_values[0]),
						"section_name": clean_value(section_values[1]),
						"includes": clean_value(section_values[2]),
						"distance": float(d)
					})
				return JsonResponse({'results': results, 'count': len(results)})
			else:
				return JsonResponse({'error': 'query (text) or vector (list) required'}, status=400)
		except Exception as e:
			return JsonResponse({'error': str(e)}, status=500)
	return JsonResponse({'error': 'POST request required'}, status=405)
