from PyPDF2 import PdfReader, PdfWriter

def password_protect_pdf(input_path, output_path, user_password):
    try:
        reader = PdfReader(input_path)
        writer = PdfWriter()

        for page in reader.pages:
            writer.add_page(page)

        writer.encrypt(user_password)

        with open(output_path, "wb") as f:
            writer.write(f)

        return True
    except Exception as e:
        print("Password protect error:", str(e))
        return False
