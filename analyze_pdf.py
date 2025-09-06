import fitz  # PyMuPDF
import os
from PyPDF2 import PdfReader

def analyze_pdf(path):
    insights = {}

    # 📄 Basic info
    try:
        reader = PdfReader(path)
        insights['Pages'] = len(reader.pages)
        insights['Is Password Protected'] = reader.is_encrypted
        insights['Text Content'] = any(page.extract_text() for page in reader.pages)
    except Exception as e:
        print(f"Error in basic PDF analysis: {e}")
        insights['Pages'] = "❌ Can't Read"
        insights['Is Password Protected'] = "Unknown"
        insights['Text Content'] = "Unknown"

    try:
        file_size = os.path.getsize(path) / (1024 * 1024)  # MB
        insights['File Size'] = f"{file_size:.2f} MB"
    except Exception as e:
        print(f"Error getting file size: {e}")
        insights['File Size'] = "N/A"

    # Advanced analysis
    doc = None
    try:
        doc = fitz.open(path)
        image_count = 0
        table_guess = 0

        for page in doc:
            image_list = page.get_images(full=True)
            image_count += len(image_list)
            text = page.get_text("text")
            table_guess += text.count("\t")  # crude table check via tabs

        insights['Images Detected'] = image_count
        insights['Possible Tables'] = table_guess
        insights['Image/Text Ratio'] = f"{round(image_count / max(len(doc), 1), 2)} img per page"
    except Exception as e:
        print(f"Error in advanced PDF analysis: {e}")
        insights['Images Detected'] = "N/A"
        insights['Possible Tables'] = "N/A"
        insights['Image/Text Ratio'] = "N/A"
    finally:
        # Ensure the document is closed
        if doc:
            try:
                doc.close()
            except:
                pass

    return insights