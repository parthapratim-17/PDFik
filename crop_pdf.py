# Update crop_pdf.py
import fitz
import os

def crop_pdf(input_path, output_path, crop_settings):
    """
    Crop PDF with various options.
    
    Args:
        input_path: Path to input PDF
        output_path: Path to save cropped PDF
        crop_settings: Dictionary with crop options. Can be:
            - preset: "small", "medium", "large", "custom"
            - margins: [left, top, right, bottom] (for custom preset)
            - crop_to: "content", "margin" (content detection)
            - page_range: [start, end] or "all"
    """
    try:
        doc = fitz.open(input_path)
        
        # Preset margins (left, top, right, bottom)
        crop_presets = {
            "minimal": (10, 10, 10, 10),
            "small": (30, 30, 30, 30),
            "medium": (50, 50, 50, 50),
            "large": (80, 80, 80, 80),
            "generous": (100, 100, 100, 100),
        }
        
        preset = crop_settings.get("preset", "medium")
        custom_margins = crop_settings.get("margins", [0, 0, 0, 0])
        crop_to = crop_settings.get("crop_to", "margin")
        page_range = crop_settings.get("page_range", "all")
        
        # Determine page range to process
        if page_range == "all":
            pages_to_process = range(len(doc))
        else:
            start, end = page_range
            pages_to_process = range(start-1, min(end, len(doc)))
        
        for page_num in pages_to_process:
            page = doc[page_num]
            rect = page.rect
            
            if crop_to == "content":
                # Try to detect content and crop to it
                content_rect = get_content_rect(page)
                if content_rect:
                    # Ensure the content rect is within page boundaries
                    content_rect = ensure_rect_in_bounds(content_rect, rect)
                    page.set_cropbox(content_rect)
                else:
                    # Fall back to margin cropping if content detection fails
                    apply_margin_cropping(page, rect, preset, crop_presets, custom_margins)
            else:
                # Standard margin-based cropping
                apply_margin_cropping(page, rect, preset, crop_presets, custom_margins)
        
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        doc.save(output_path)
        doc.close()
        return True
        
    except Exception as e:
        print("Crop PDF Error:", str(e))
        return False

def apply_margin_cropping(page, rect, preset, crop_presets, custom_margins):
    """Apply margin-based cropping to a page."""
    if preset == "custom" and len(custom_margins) == 4:
        l, t, r, b = custom_margins
    elif preset in crop_presets:
        l, t, r, b = crop_presets[preset]
    else:
        l, t, r, b = crop_presets["medium"]
    
    # Ensure margins don't exceed page dimensions
    page_width = rect.x1 - rect.x0
    page_height = rect.y1 - rect.y0
    
    # Limit margins to reasonable values
    l = min(l, page_width / 2)
    t = min(t, page_height / 2)
    r = min(r, page_width / 2)
    b = min(b, page_height / 2)
    
    new_rect = fitz.Rect(
        rect.x0 + l,
        rect.y0 + t,
        rect.x1 - r,
        rect.y1 - b
    )
    
    # Ensure the new rectangle is valid and within page bounds
    if (new_rect.x0 < new_rect.x1 and new_rect.y0 < new_rect.y1 and
        new_rect.x0 >= rect.x0 and new_rect.y0 >= rect.y0 and
        new_rect.x1 <= rect.x1 and new_rect.y1 <= rect.y1):
        page.set_cropbox(new_rect)
    else:
        # If invalid, use a safe default (small margins)
        safe_rect = fitz.Rect(
            rect.x0 + 10,
            rect.y0 + 10,
            rect.x1 - 10,
            rect.y1 - 10
        )
        page.set_cropbox(safe_rect)

def get_content_rect(page):
    """
    Try to detect content on the page and return a rectangle that contains it.
    This is a simple implementation - could be enhanced with more sophisticated algorithms.
    """
    try:
        # Get text and image areas
        text_areas = page.get_text("blocks")
        image_areas = page.get_image_info()
        
        if not text_areas and not image_areas:
            return None
        
        # Find the bounding box that contains all content
        min_x, min_y = float('inf'), float('inf')
        max_x, max_y = float('-inf'), float('-inf')
        
        # Process text areas
        for block in text_areas:
            x0, y0, x1, y1 = block[:4]
            min_x = min(min_x, x0)
            min_y = min(min_y, y0)
            max_x = max(max_x, x1)
            max_y = max(max_y, y1)
        
        # Process image areas
        for img in image_areas:
            x0, y0, x1, y1 = img["bbox"]
            min_x = min(min_x, x0)
            min_y = min(min_y, y0)
            max_x = max(max_x, x1)
            max_y = max(max_y, y1)
        
        # Add a small margin around the content
        margin = 10
        content_rect = fitz.Rect(
            max(0, min_x - margin),
            max(0, min_y - margin),
            min(page.rect.width, max_x + margin),
            min(page.rect.height, max_y + margin)
        )
        
        return content_rect
        
    except Exception:
        # If content detection fails, return None to fall back to margin cropping
        return None

def ensure_rect_in_bounds(rect, page_rect):
    """
    Ensure that a rectangle is within the bounds of the page.
    """
    return fitz.Rect(
        max(page_rect.x0, min(rect.x0, page_rect.x1)),
        max(page_rect.y0, min(rect.y0, page_rect.y1)),
        min(page_rect.x1, max(rect.x1, page_rect.x0)),
        min(page_rect.y1, max(rect.y1, page_rect.y0))
    )