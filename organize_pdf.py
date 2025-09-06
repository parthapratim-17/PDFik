# 📄 organize_pdf.py (inside pdf_tools/)
import fitz
import os

def reorder_pdf_pages(input_path, output_path, new_order):
    """
    new_order: List of integers representing page numbers (0-indexed)
    Example: [2, 0, 1] will move page 3 first, then 1, then 2.
    """
    try:
        original = fitz.open(input_path)
        new_doc = fitz.open()

        for page_num in new_order:
            if 0 <= page_num < len(original):
                new_doc.insert_pdf(original, from_page=page_num, to_page=page_num)
            else:
                raise IndexError("Invalid page number in new_order.")

        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        new_doc.save(output_path)
        new_doc.close()
        original.close()
        return True

    except Exception as e:
        print("Reorder Error:", str(e))
        return False


def delete_pdf_pages(input_path, output_path, pages_to_delete):
    """
    pages_to_delete: List of integers (0-indexed)
    """
    try:
        doc = fitz.open(input_path)
        pages_to_delete = sorted(set(pages_to_delete), reverse=True)
        for page_num in pages_to_delete:
            if 0 <= page_num < len(doc):
                doc.delete_page(page_num)

        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        doc.save(output_path)
        doc.close()
        return True

    except Exception as e:
        print("Delete Page Error:", str(e))
        return False
