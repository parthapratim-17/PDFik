from PyPDF2 import PdfReader, PdfWriter

def unlock_pdf_file(input_path, output_path, password):
    try:
        reader = PdfReader(input_path)
        if reader.is_encrypted:
            reader.decrypt(password)

        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)

        with open(output_path, "wb") as f:
            writer.write(f)
        return True
    except Exception as e:
        print("Unlock PDF Error:", e)
        return False
