import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

def load_resources():
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    SYNCODE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))

    EMBEDDINGS_DIR = os.path.join(SYNCODE_DIR, 'ml', 'embeddings')
    INDEX_PATH = os.path.join(EMBEDDINGS_DIR, 'faiss_index.index')
    META_PATH = os.path.join(EMBEDDINGS_DIR, 'icd_meta.npy')

    if not os.path.exists(INDEX_PATH):
        raise FileNotFoundError(f"FAISS index not found: {INDEX_PATH}")

    if not os.path.exists(META_PATH):
        raise FileNotFoundError(f"Metadata not found: {META_PATH}")

    index = faiss.read_index(INDEX_PATH)
    meta = np.load(META_PATH, allow_pickle=True)

    model_map = {
        384: "sentence-transformers/all-MiniLM-L6-v2",
        768: "sentence-transformers/all-mpnet-base-v2",
    }

    model_name = model_map.get(index.d)
    if not model_name:
        raise ValueError(f"Unsupported FAISS dimension: {index.d}")

    model = SentenceTransformer(model_name)
    if model.get_sentence_embedding_dimension() != index.d:
        raise ValueError(
            "Embedding dimension mismatch: "
            f"model={model.get_sentence_embedding_dimension()} index={index.d}"
        )

    return index, meta, model
