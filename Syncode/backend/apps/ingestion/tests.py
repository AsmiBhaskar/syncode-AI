import json
import tempfile
from pathlib import Path
from unittest.mock import patch

from django.test import Client, TestCase


class IngestionExtractTests(TestCase):
	def setUp(self):
		self.client = Client()

	def test_get_not_allowed(self):
		res = self.client.get("/api/ingestion/extract/")
		self.assertEqual(res.status_code, 405)

	def test_empty_payload_returns_400(self):
		res = self.client.post(
			"/api/ingestion/extract/",
			data=json.dumps({}),
			content_type="application/json",
		)
		self.assertEqual(res.status_code, 400)

	@patch("apps.ingestion.views.get_faiss_resources")
	@patch("apps.ingestion.views.search_faiss")
	@patch("apps.ingestion.views.rank_results")
	def test_raw_text_success(self, mock_rank, mock_search, mock_resources):
		mock_resources.return_value = (object(), object(), object())
		mock_search.return_value = [{"code": "A00", "distance": 0.1}]
		mock_rank.return_value = [
			{
				"code": "A00",
				"description": "Cholera",
				"distance": 0.1,
			}
		]

		res = self.client.post(
			"/api/ingestion/extract/",
			data=json.dumps({"rawText": "coughing blood", "topK": 3}),
			content_type="application/json",
		)

		self.assertEqual(res.status_code, 200)
		payload = res.json()
		self.assertEqual(payload["count"], 1)
		self.assertEqual(payload["results"][0]["code"], "A00")

	@patch("apps.ingestion.views.get_faiss_resources")
	@patch("apps.ingestion.views.search_faiss")
	@patch("apps.ingestion.views.rank_results")
	def test_file_path_success(self, mock_rank, mock_search, mock_resources):
		mock_resources.return_value = (object(), object(), object())
		mock_search.return_value = [{"code": "B00", "distance": 0.2}]
		mock_rank.return_value = [
			{
				"code": "B00",
				"description": "Herpesviral infections",
				"distance": 0.2,
			}
		]

		with tempfile.TemporaryDirectory() as tmpdir:
			file_path = Path(tmpdir) / "note.txt"
			file_path.write_text("fever and cough", encoding="utf-8")

			res = self.client.post(
				"/api/ingestion/extract/",
				data=json.dumps({"filePaths": [str(file_path)]}),
				content_type="application/json",
			)

		self.assertEqual(res.status_code, 200)
		payload = res.json()
		self.assertEqual(payload["count"], 1)
		self.assertEqual(payload["results"][0]["code"], "B00")
