from chunking import chunk_text
from faiss_search import search_faiss
from rank_embeddings import rank_results
from icd_normalizer import normalize_icd_results


def find_icd_codes(text, index, meta, model):
    chunks = chunk_text(text)

    raw_results = search_faiss(
        index=index,
        meta=meta,
        model=model,
        chunks=chunks
    )

    ranked_results = rank_results(raw_results)

    return normalize_icd_results(ranked_results)

