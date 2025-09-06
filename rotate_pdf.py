import fitz  # PyMuPDF
import os

def rotate_pdf(input_path, output_path, rotation_angle=90):
    """
    Rotate all pages in a PDF by the specified angle.
    
    Args:
        input_path (str): Path to the input PDF file
        output_path (str): Path to save the rotated PDF
        rotation_angle (int): Rotation angle (90, 180, or 270 degrees)
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        # Validate input file exists
        if not os.path.exists(input_path):
            return False, "Input file does not exist"
            
        # Validate rotation angle
        if rotation_angle not in [90, 180, 270]:
            return False, "Rotation angle must be 90, 180, or 270 degrees"
        
        # Open the PDF
        doc = fitz.open(input_path)
        
        if len(doc) == 0:
            doc.close()
            return False, "PDF contains no pages"
        
        # Rotate each page
        for page in doc:
            current_rotation = page.rotation
            new_rotation = (current_rotation + rotation_angle) % 360
            page.set_rotation(new_rotation)
        
        # Save the rotated PDF
        doc.save(output_path)
        doc.close()
        
        return True, "PDF rotated successfully"
        
    except Exception as e:
        print(f"Rotation error: {e}")
        return False, f"Error rotating PDF: {str(e)}"

def rotate_specific_pages(input_path, output_path, page_rotations):
    """
    Rotate specific pages in a PDF by different angles.
    
    Args:
        input_path (str): Path to the input PDF file
        output_path (str): Path to save the rotated PDF
        page_rotations (dict): Dictionary with page numbers as keys and rotation angles as values
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        # Validate input file exists
        if not os.path.exists(input_path):
            return False, "Input file does not exist"
            
        doc = fitz.open(input_path)
        
        if len(doc) == 0:
            doc.close()
            return False, "PDF contains no pages"
        
        # Validate page rotations and convert keys to integers
        converted_rotations = {}
        for page_num_str, rotation in page_rotations.items():
            try:
                page_num_int = int(page_num_str)
                if page_num_int < 0 or page_num_int >= len(doc):
                    doc.close()
                    return False, f"Page number {page_num_str} is out of range"
                    
                if rotation not in [0, 90, 180, 270]:
                    doc.close()
                    return False, f"Invalid rotation angle {rotation} for page {page_num_str}"
                
                converted_rotations[page_num_int] = rotation
            except (ValueError, TypeError):
                doc.close()
                return False, f"Invalid page number format: {page_num_str}"
        
        # Apply rotations
        for page_num, rotation in converted_rotations.items():
            page = doc[page_num]
            page.set_rotation(rotation)
        
        doc.save(output_path)
        doc.close()
        
        return True, "PDF pages rotated successfully"
        
    except Exception as e:
        print(f"Specific page rotation error: {e}")
        return False, f"Error rotating PDF pages: {str(e)}"