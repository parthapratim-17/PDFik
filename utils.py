import os
from pdf_tools.watermark import add_watermark

IS_PREMIUM = True  # ✅ Global premium flag

def process_output(path):
    if not os.path.exists(path):
        print("⚠️ Skipping watermark: file does not exist")
        return

    if not IS_PREMIUM and path.endswith(".pdf"):
        watermark_path = os.path.join("assets", "watermark.pdf")
        if os.path.exists(watermark_path):
            try:
                add_watermark(path, watermark_path)
                print("✅ Watermark added to", path)
            except Exception as e:
                print("❌ Error adding watermark:", e)
        else:
            print("⚠️ Watermark file not found, skipping...")
