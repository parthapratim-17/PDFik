import os
import tkinter as tk
from tkinter import filedialog, messagebox
from voice_engine import read_pdf_content  # Local import

IS_PREMIUM = False  # Toggle for testing

OUTPUT_DIR = "output"

def voice_reader_flow():
    filepath = filedialog.askopenfilename(filetypes=[("PDF files", "*.pdf")], title="Select PDF to Read Aloud")
    if filepath:
        try:
            status_label.config(text="🔊 Extracting text...", fg="orange")
            root.update_idletasks()

            result = read_pdf_content(filepath, IS_PREMIUM)

            if isinstance(result, str):
                status_label.config(text="✅ Reading completed!", fg="green")
                messagebox.showinfo("Success", f"{result}")
            else:
                status_label.config(text="❌ Failed to process", fg="red")
                messagebox.showerror("Error", "Unable to process this file.")
        except Exception as e:
            status_label.config(text="❌ Error occurred.", fg="red")
            messagebox.showerror("Error", str(e))

# UI Setup
root = tk.Tk()
root.title("PDFik - Personal Voice Reader")
root.geometry("450x220")
root.configure(bg="#1f1f2e")
root.resizable(False, False)

tk.Label(root, text="🎧 PDF Voice Reader", font=("Segoe UI", 18, "bold"),
         bg="#1f1f2e", fg="#00ffcc").pack(pady=20)

tk.Button(root, text="Select PDF to Hear Content", command=voice_reader_flow,
          font=("Segoe UI", 13), bg="#2e86de", fg="white",
          padx=20, pady=10).pack(pady=10)

status_label = tk.Label(root, text="", font=("Segoe UI", 10), bg="#1f1f2e", fg="white")
status_label.pack(pady=10)

root.mainloop()
