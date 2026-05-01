import os
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SYNCODE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))

CSV_PATH = os.path.join(
    SYNCODE_DIR, 'docs', 'icd10cm_tabular_2026-2.csv'
)

EMBEDDINGS_DIR = os.path.join(
    SYNCODE_DIR, 'ml', 'embeddings'
)

INDEX_PATH = os.path.join(EMBEDDINGS_DIR, 'faiss_index.index')
META_PATH = os.path.join(EMBEDDINGS_DIR, 'icd_meta.npy')

os.makedirs(EMBEDDINGS_DIR, exist_ok=True)

faiss.omp_set_num_threads(1)

df = pd.read_csv(CSV_PATH, encoding='latin1')

df = df[
    [
        'code',
        'code_desc',
        'section_id',
        'section_name',
        'includes_section',
        'excludes1_section',
        'excludes2_section'
    ]
].dropna(subset=['code_desc'])

df = df.fillna("")

texts = df['code_desc'].astype(str).tolist()
codes = df['code'].astype(str).tolist()
sections = df[
    [
        'section_id',
        'section_name',
        'includes_section',
        'excludes1_section',
        'excludes2_section'
    ]
].astype(str).values

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

embeddings = model.encode(
    texts,
    batch_size=16,
    show_progress_bar=True,
    convert_to_numpy=True
).astype('float32')

index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(embeddings)

faiss.write_index(index, INDEX_PATH)
np.save(
    META_PATH,
    np.array(list(zip(codes, texts, sections.tolist())), dtype=object)
)

print("✅ Vector DB built successfully")
