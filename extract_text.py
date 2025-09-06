import fitz  # PyMuPDF

def extract_text_from_pdf(input_path, output_path):
    try:
        doc = fitz.open(input_path)
        full_text = ""
        for page in doc:
            full_text += page.get_text() + "\n"

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(full_text)
        return True
    except Exception as e:
        print("Text Extraction error:", e)
        return False
