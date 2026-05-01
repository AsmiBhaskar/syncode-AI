import os
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

# Get path to backend/apps/vector_search -> backend -> Syncode -> ml/embeddings
EMBEDDINGS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '..', 'ml', 'embeddings')
INDEX_PATH = os.path.abspath(os.path.join(EMBEDDINGS_DIR, 'faiss_index.index'))
META_PATH = os.path.abspath(os.path.join(EMBEDDINGS_DIR, 'icd_meta.npy'))

class FaissClient:
    def __init__(self, index_path=INDEX_PATH, meta_path=META_PATH):
        self.index = faiss.read_index(index_path)
        self.meta = np.load(meta_path, allow_pickle=True)
        model_map = {
            384: "sentence-transformers/all-MiniLM-L6-v2",
            768: "sentence-transformers/all-mpnet-base-v2",
        }
        model_name = model_map.get(self.index.d)
        if not model_name:
            raise ValueError(f"Unsupported FAISS dimension: {self.index.d}")

        self.model = SentenceTransformer(model_name)
        if self.model.get_sentence_embedding_dimension() != self.index.d:
            raise ValueError(
                "Embedding dimension mismatch: "
                f"model={self.model.get_sentence_embedding_dimension()} index={self.index.d}"
            )
        self.dim = self.index.d

    def search(self, query_vector, k=5):
        if not isinstance(query_vector, np.ndarray):
            query_vector = np.array(query_vector, dtype='float32').reshape(1, -1)
        D, I = self.index.search(query_vector, k)
        return D[0], I[0]
    
    def search_by_text(self, query_text, k=5):
        """Search for ICD codes by disease description text"""
        query_vec = self.model.encode([query_text]).astype('float32')
        distances, indices = self.index.search(query_vec, k)
        
        results = []
        for i, d in zip(indices[0], distances[0]):
            meta_entry = self.meta[i]
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
        return results
