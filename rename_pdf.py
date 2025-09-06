import os
import shutil

def rename_pdf(input_path, new_name, output_dir="output"):
    try:
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        base_name = os.path.basename(new_name)
        if not base_name.endswith(".pdf"):
            base_name += ".pdf"
        new_path = os.path.join(output_dir, base_name)
        shutil.copy2(input_path, new_path)
        return new_path
    except Exception as e:
        print("Rename error:", e)
        return None
