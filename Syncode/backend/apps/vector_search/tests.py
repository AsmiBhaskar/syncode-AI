import json
from unittest.mock import patch

from django.test import Client, TestCase


class VectorSearchTests(TestCase):
	def setUp(self):
		self.client = Client()

	def test_missing_query_returns_400(self):
		res = self.client.post(
			"/api/vector-search/",
			data=json.dumps({}),
			content_type="application/json",
		)
		self.assertEqual(res.status_code, 400)

	@patch("apps.vector_search.views.get_faiss_client")
	def test_text_query_success(self, mock_client_factory):
		class FakeClient:
			def search_by_text(self, query_text, k=5):
				return [
					{
						"icd_code": "A00",
						"description": "Cholera",
						"section_id": "I",
						"section_name": "Infectious diseases",
						"includes": "",
						"excludes1": "",
						"excludes2": "",
						"distance": 0.1,
					}
				]

		mock_client_factory.return_value = FakeClient()

		res = self.client.post(
			"/api/vector-search/",
			data=json.dumps({"query": "cholera", "k": 1}),
			content_type="application/json",
		)

		self.assertEqual(res.status_code, 200)
		payload = res.json()
		self.assertEqual(payload["count"], 1)
		self.assertEqual(payload["results"][0]["icd_code"], "A00")
