from PyPDF2 import PdfMerger
import os

def merge_pdfs(pdf_list, output_path):
    merger = PdfMerger()

    for pdf in pdf_list:
        merger.append(pdf)

    with open(output_path, "wb") as fout:
        merger.write(fout)

    merger.close()
    return True
