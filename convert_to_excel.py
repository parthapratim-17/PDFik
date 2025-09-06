import pdfplumber
import pandas as pd
import os

def convert_pdf_to_excel(pdf_path, output_path):
    tables = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            table = page.extract_table()
            if table:
                tables.append(pd.DataFrame(table[1:], columns=table[0]))

    if tables:
        combined_df = pd.concat(tables, ignore_index=True)
        combined_df.to_excel(output_path, index=False)
        return True
    else:
        return False  # No tables found