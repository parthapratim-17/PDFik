from PIL import Image
import os

def convert_image_to_pdf(image_path, pdf_path):
    try:
        image = Image.open(image_path)
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        image.save(pdf_path, "PDF", resolution=100.0)
        return True
    except Exception as e:
        print(f"Error converting image to PDF: {e}")
        return False