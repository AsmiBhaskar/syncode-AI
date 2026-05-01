"""
ICD Normalizer using microsoft/Promptist

- Deduplicates ICD codes
- Selects best candidate per code
- Normalizes descriptions using Promptist
"""

from typing import List, Dict, Any
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

MODEL_NAME = "microsoft/Promptist"

# Load tokenizer & model once
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float32,
    device_map="cpu",
    use_safetensors=True
)

model.eval()


def _normalize_description(text: str) -> str:
    """
    Normalize an ICD description using Promptist.
    Keeps output short and clean.
    """
    prompt = f"Normalize the following medical diagnosis into a concise ICD-style description:\n{text}"

    inputs = tokenizer(prompt, return_tensors="pt")

    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_new_tokens=30,
            do_sample=False
        )

    decoded = tokenizer.decode(output[0], skip_special_tokens=True)

    # Remove prompt echo if present
    if decoded.lower().startswith(prompt.lower()):
        decoded = decoded[len(prompt):].strip()

    return decoded.strip() or text


def normalize_icd_results(results: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    """
    Normalize raw ICD search results.

    Input requires:
    - code
    - description
    Optional:
    - distance

    Output:
    - Unique ICD codes with normalized descriptions
    """

    best_by_code: Dict[str, Dict[str, Any]] = {}

    # Step 1: Deduplicate & select best per code
    for r in results:
        if "code" not in r or "description" not in r:
            continue

        code = r["code"]
        distance = r.get("distance", float("inf"))

        if (
            code not in best_by_code
            or distance < best_by_code[code].get("distance", float("inf"))
        ):
            best_by_code[code] = r

    # Step 2: Normalize descriptions
    normalized = []
    for r in best_by_code.values():
        normalized_desc = _normalize_description(r["description"])

        normalized.append({
            "code": r["code"],
            "description": normalized_desc
        })

    return normalized
