import openpyxl
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors

def convert_excel_to_pdf(excel_path, pdf_path):
    """
    Independent Excel → PDF converter (no LibreOffice/Excel needed).
    Renders sheet as a table in PDF. Text only, no charts.
    """
    try:
        wb = openpyxl.load_workbook(excel_path, data_only=True)
        sheet = wb.active

        data = []
        for row in sheet.iter_rows(values_only=True):
            data.append([str(cell) if cell is not None else "" for cell in row])

        pdf = SimpleDocTemplate(pdf_path, pagesize=landscape(A4))
        table = Table(data, repeatRows=1)

        style = TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
            ("GRID", (0, 0), (-1, -1), 0.25, colors.black),
        ])
        table.setStyle(style)

        pdf.build([table])
        return True
    except Exception as e:
        print(f"[Excel→PDF Independent] Error: {e}")
        return False