import fitz  # PyMuPDF
from gtts import gTTS
import os
import platform
import subprocess

def read_pdf_content(pdf_path, is_premium=False):
    try:
        doc = fitz.open(pdf_path)
        text = ""

        for page in doc:
            text += page.get_text()

        if not text.strip():
            return "[Empty or non-readable PDF]"

        if not is_premium:
            text = text[:500]

        tts = gTTS(text)
        audio_path = os.path.join("output", "pdf_voice_output.mp3")
        os.makedirs("output", exist_ok=True)
        tts.save(audio_path)

        # 🔊 Play audio automatically
        system = platform.system()
        if system == "Windows":
            os.startfile(audio_path)
        elif system == "Darwin":  # macOS
            subprocess.call(["afplay", audio_path])
        else:  # Linux
            subprocess.call(["xdg-open", audio_path])

        return f"Audio saved at: {audio_path}"

    except Exception as e:
        return f"[Error reading PDF: {str(e)}]"
