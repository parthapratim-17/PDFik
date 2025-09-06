# Update ocr_tool.py
import os
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import tempfile
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to automatically find Tesseract or use a common path
try:
    # Common installation paths for Tesseract
    possible_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        "/usr/bin/tesseract",
        "/usr/local/bin/tesseract"
    ]
    
    tesseract_found = False
    for path in possible_paths:
        if os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            tesseract_found = True
            logger.info(f"Tesseract found at: {path}")
            break
    
    if not tesseract_found:
        # If not found in common paths, try to use the system PATH
        pytesseract.pytesseract.tesseract_cmd = 'tesseract'
        logger.info("Using Tesseract from system PATH")
except Exception as e:
    logger.error(f"Error setting up Tesseract: {e}")

def extract_text_from_image(img_path):
    """
    Extract text from an image using OCR.
    """
    try:
        img = Image.open(img_path)
        # Preprocess image for better OCR results
        img = img.convert('L')  # Convert to grayscale
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception as e:
        logger.error(f"OCR Error on image {img_path}: {e}")
        return f"[OCR Error: {e}]"

def extract_text_from_pdf(pdf_path, output_txt_path):
    """
    Extract text from a PDF using OCR, page by page.
    """
    try:
        doc = fitz.open(pdf_path)
        all_text = ""
        
        for i, page in enumerate(doc):
            logger.info(f"Processing page {i+1}/{len(doc)}")
            
            # First try to extract text directly (in case it's not a scanned image)
            page_text = page.get_text()
            
            # If little or no text was extracted, use OCR
            if not page_text or len(page_text.strip()) < 50:
                # Render page as image
                mat = fitz.Matrix(2.0, 2.0)  # Higher resolution for better OCR
                pix = page.get_pixmap(matrix=mat)
                
                # Save temporary image
                with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_img:
                    img_path = temp_img.name
                
                pix.save(img_path)
                
                # Extract text from image
                ocr_text = extract_text_from_image(img_path)
                
                # Clean up temporary image
                os.unlink(img_path)
                
                # Use OCR text if we got meaningful results
                if ocr_text and len(ocr_text.strip()) > 10:
                    page_text = ocr_text
                else:
                    page_text = "[No text could be extracted from this page]"
            
            all_text += f"\n--- Page {i+1} ---\n{page_text}\n"
        
        doc.close()
        
        # Save extracted text
        with open(output_txt_path, "w", encoding="utf-8") as f:
            f.write(all_text)
        
        return True
        
    except Exception as e:
        logger.error(f"Error in extract_text_from_pdf: {e}")
        return False