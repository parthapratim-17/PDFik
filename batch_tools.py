import os
from tkinter import filedialog, Toplevel, StringVar, OptionMenu, Label, Button, messagebox
from pdf_tools.convert_to_word import convert_pdf_to_word
from pdf_tools.convert_to_excel import convert_pdf_to_excel
from pdf_tools.convert_to_image import convert_pdf_to_images
from pdf_tools.utils import IS_PREMIUM

OUTPUT_DIR = "output"

def batch_convert_ui(root):
    if not IS_PREMIUM:
        messagebox.showwarning("Pro Feature", "This feature is available only for Pro users.")
        return

    # Select multiple PDF files manually
    filepaths = filedialog.askopenfilenames(
        title="Select PDFs for Batch Conversion",
        filetypes=[("PDF files", "*.pdf")]
    )
    
    if not filepaths:
        return

    # Ask conversion mode
    mode_window = Toplevel(root)
    mode_window.title("Select Conversion Mode")
    mode_window.geometry("320x200")
    mode_window.configure(bg="#1f1f2e")

    Label(mode_window, text="Choose Conversion Type:", font=("Segoe UI", 12), bg="#1f1f2e", fg="white").pack(pady=10)
    selected_mode = StringVar(mode_window)
    selected_mode.set("Word")  # Default

    dropdown = OptionMenu(mode_window, selected_mode, "Word", "Excel", "Image")
    dropdown.config(font=("Segoe UI", 11), bg="#2d3436", fg="white", width=12)
    dropdown["menu"].config(bg="#2d3436", fg="white")
    dropdown.pack(pady=10)

    def start_batch():
        mode = selected_mode.get().lower()
        results = {}

        for path in filepaths:
            filename = os.path.basename(path)
            base_name = os.path.splitext(filename)[0]

            try:
                if not os.path.exists(OUTPUT_DIR):
                    os.makedirs(OUTPUT_DIR)

                if mode == "word":
                    output_path = os.path.join(OUTPUT_DIR, f"{base_name}_converted.docx")
                    convert_pdf_to_word(path, output_path)

                elif mode == "excel":
                    output_path = os.path.join(OUTPUT_DIR, f"{base_name}_converted.xlsx")
                    convert_pdf_to_excel(path, output_path)

                elif mode == "image":
                    image_folder = os.path.join(OUTPUT_DIR, f"{base_name}_images")
                    os.makedirs(image_folder, exist_ok=True)
                    convert_pdf_to_images(path, image_folder, img_format="png")

                results[filename] = "✅ Success"

            except Exception as e:
                results[filename] = f"❌ Failed: {str(e)}"

        mode_window.destroy()
        result_text = "\n".join([f"{k}: {v}" for k, v in results.items()])
        messagebox.showinfo("Batch Summary", result_text)

    Button(mode_window, text="Convert All", command=start_batch, font=("Segoe UI", 11),
           bg="#00cec9", fg="black", padx=10, pady=5).pack(pady=20)
