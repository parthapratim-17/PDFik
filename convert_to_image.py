import fitz
import os

def convert_pdf_to_images(input_pdf, output_folder, img_format="png", dpi=150):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    doc = fitz.open(input_pdf)
    saved_files = []
    zoom = dpi / 72
    matrix = fitz.Matrix(zoom, zoom)

    for i in range(len(doc)):
        page = doc.load_page(i)
        pix = page.get_pixmap(matrix=matrix, colorspace=fitz.csRGB, alpha=False)

        # Force PNG only for now (stable everywhere)
        image_path = os.path.join(output_folder, f"page_{i+1}.png")
        pix.save(image_path)  

        saved_files.append(image_path)

    doc.close()
    return saved_files