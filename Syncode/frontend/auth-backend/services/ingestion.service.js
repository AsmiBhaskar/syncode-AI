import fetch from "node-fetch";

export async function requestIngestion({ rawText, filePaths, topK = 5 }) {
  const ingestionUrl = process.env.DJANGO_INGESTION_URL;
  if (!ingestionUrl) {
    throw new Error("AI ingestion is not configured");
  }

  const headers = { "Content-Type": "application/json" };
  const apiKey = process.env.INGESTION_API_KEY;
  if (apiKey) {
    headers["x-internal-api-key"] = apiKey;
  }

  const response = await fetch(ingestionUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ rawText, filePaths, topK }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || `AI ingestion failed with status ${response.status}`
    );
  }

  return data.results || [];
}
