import mammoth
from xhtml2pdf import pisa

def convert_word_to_pdf(docx_path, pdf_path):
    """
    Independent Word → PDF converter (no LibreOffice/Word/GTK needed).
    Uses Mammoth to extract clean HTML, then xhtml2pdf to render PDF.
    """
    try:
        # Convert DOCX -> clean HTML
        with open(docx_path, "rb") as docx_file:
            result = mammoth.convert_to_html(docx_file)
            html_content = result.value

        # Add basic CSS so PDF doesn't look plain
        html_template = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; font-size: 12pt; }}
                h1,h2,h3 {{ color: #333; }}
                p {{ margin: 4px 0; }}
                table {{ border-collapse: collapse; width: 100%; margin: 10px 0; }}
                td, th {{ border: 1px solid #444; padding: 6px; }}
            </style>
        </head>
        <body>{html_content}</body>
        </html>
        """

        # Convert HTML -> PDF
        with open(pdf_path, "wb") as out_file:
            pisa_status = pisa.CreatePDF(html_template, dest=out_file)

        return not pisa_status.err
    except Exception as e:
        print(f"[Word→PDF Independent] Error: {e}")
        return False
