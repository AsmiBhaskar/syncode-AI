import numpy as np


def _clean_value(value):
    if value is None:
        return ""
    if isinstance(value, str) and value.strip().lower() == "nan":
        return ""
    if isinstance(value, float) and np.isnan(value):
        return ""
    return str(value)


def _normalize_meta_entry(meta_entry):
    if len(meta_entry) >= 3:
        code, desc, section = meta_entry[0], meta_entry[1], meta_entry[2]
    else:
        code, desc = meta_entry[0], meta_entry[1]
        section = ["", "", "", "", ""]

    section_list = list(section) if section is not None else []
    section_list = (section_list + ["", "", "", "", ""])[:5]

    return _clean_value(code), _clean_value(desc), [
        _clean_value(value) for value in section_list
    ]

def search_faiss(index, meta, model, chunks, top_k: int = 5):
    results = []

    embeddings = model.encode(chunks)
    embeddings = np.array(embeddings).astype("float32")

    if embeddings.ndim == 1:
        embeddings = embeddings.reshape(1, -1)

    if embeddings.shape[1] != index.d:
        model_dim = None
        if hasattr(model, "get_sentence_embedding_dimension"):
            model_dim = model.get_sentence_embedding_dimension()
        raise ValueError(
            "Embedding dimension mismatch: "
            f"embeddings={embeddings.shape[1]} index={index.d} model={model_dim}"
        )

    for i, emb in enumerate(embeddings):
        D, I = index.search(emb.reshape(1, -1), top_k)

        for dist, idx in zip(D[0], I[0]):
            code, desc, section = _normalize_meta_entry(meta[idx])

            results.append({
                "chunk": chunks[i],
                "code": code,
                "description": desc,
                "section_id": section[0],
                "section_name": section[1],
                "includes": section[2],
                "distance": float(dist)
            })

    return results
