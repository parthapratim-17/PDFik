from PyPDF2 import PdfReader, PdfWriter
import os

def split_pdf(input_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    reader = PdfReader(input_path)
    for i, page in enumerate(reader.pages):
        writer = PdfWriter()
        writer.add_page(page)

        output_file = os.path.join(output_dir, f"page_{i + 1}.pdf")
        with open(output_file, "wb") as f:
            writer.write(f)

    return len(reader.pages)
