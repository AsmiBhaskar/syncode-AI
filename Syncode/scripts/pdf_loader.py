from importlib import import_module

def pdf_to_text(pdf_path: str) -> str:
    try:
        pdfplumber = import_module("pdfplumber")
    except ModuleNotFoundError as exc:
        raise ImportError("pdfplumber is required to read PDF files.") from exc

    all_text = []

    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            text = page.extract_text()
            if text:
                all_text.append(text)

    return "\n".join(all_text)
