from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PyPDF2 import PdfMerger, PdfReader, PdfWriter
import io
import os
import zipfile
import traceback
import shutil
import fitz # PyMuPDF, used by extract_text
from gtts import gTTS # For text-to-speech
import tempfile
from password_protect import password_protect_pdf
from unlock_pdf import unlock_pdf_file
from analyze_pdf import analyze_pdf
from organize_pdf import reorder_pdf_pages, delete_pdf_pages
from compare_pdf import compare_pdfs_basic, compare_pdfs_detailed, compare_pdfs_metadata
from rotate_pdf import rotate_pdf, rotate_specific_pages
from ocr_tool import extract_text_from_pdf
from crop_pdf import crop_pdf
from convert_to_word import convert_pdf_to_word
from convert_to_excel import convert_pdf_to_excel
from convert_to_image import convert_pdf_to_images
from excel_to_pdf import convert_excel_to_pdf
from word_to_pdf import convert_word_to_pdf
from image_to_pdf import convert_image_to_pdf
import json
from datetime import datetime
import tempfile
import os
import io
import zipfile
from PyPDF2 import PdfMerger, PdfReader, PdfWriter
import fitz  # PyMuPDF
from werkzeug.exceptions import RequestEntityTooLarge

# Initialize the Flask application
app = Flask(__name__)
# Add this right after: app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024  # 20 MB
# Enable Cross-Origin Resource Sharing (CORS)
CORS(app)
@app.errorhandler(RequestEntityTooLarge)
def handle_large_file(e):
    return {"error": "File too large! Maximum allowed size is 20 MB."}, 413
@app.route("/")
def home():
    """Root endpoint to confirm the server is running"""
    return jsonify({"message": "PDFik server is running", "status": "OK"})
@app.route("/contact", methods=["POST"])
def contact_route():
    """
    This function handles the contact form submissions using JSON file storage.
    """
    try:
        # Get form data
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        # Validate required fields
        if not all([name, email, subject, message]):
            return jsonify({"error": "All fields are required."}), 400
        
        # Validate email format
        if '@' not in email or '.' not in email:
            return jsonify({"error": "Please provide a valid email address."}), 400
        
        # Create contact entry
        contact_entry = {
            "id": datetime.now().strftime("%Y%m%d%H%M%S%f"),
            "name": name,
            "email": email,
            "subject": subject,
            "message": message,
            "created_at": datetime.now().isoformat(),
            "is_archived": False,
            "is_read": False
        }
        
        # Save to JSON file
        try:
            # Read existing contacts if file exists
            try:
                with open('contacts.json', 'r') as f:
                    contacts = json.load(f)
            except (FileNotFoundError, json.JSONDecodeError):
                contacts = []
            
            # Add new contact
            contacts.append(contact_entry)
            
            # Write back to file
            with open('contacts.json', 'w') as f:
                json.dump(contacts, f, indent=2)
            
            return jsonify({
                "message": "Your message has been sent successfully!",
                "id": contact_entry["id"]
            })
            
        except Exception as e:
            print(f"File save error: {e}")
            return jsonify({"error": "Failed to save your message."}), 500
            
    except Exception as e:
        print(f"An error occurred while processing the contact form: {e}")
        return jsonify({"error": "An internal server error occurred. Please try again later."}), 500
    
@app.route("/merge", methods=["POST"])
def merge_pdfs():
    """
    This function handles the PDF merging logic.
    """
    if 'pdfs' not in request.files:
        return jsonify({"error": "No PDF files part in the request."}), 400

    files = request.files.getlist("pdfs")

    if not files or files[0].filename == '':
        return jsonify({"error": "No files selected for merging."}), 400

    merger = PdfMerger()

    try:
        for file in files:
            if file.mimetype != 'application/pdf':
                merger.close()
                return jsonify({"error": f"File '{file.filename}' is not a valid PDF."}), 400
            
            merger.append(file.stream)

        output_stream = io.BytesIO()
        merger.write(output_stream)
        merger.close()

        output_stream.seek(0)

        return send_file(
            output_stream,
            as_attachment=True,
            download_name='merged.pdf',
            mimetype='application/pdf'
        )

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal server error occurred while merging."}), 500

@app.route("/split", methods=["POST"])
def split_pdf_route():
    """
    This function handles the PDF splitting logic.
    """
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file part in the request."}), 400
    
    file = request.files['pdf']
    if file.filename == '':
        return jsonify({"error": "No file selected for splitting."}), 400
    
    if file and file.mimetype == 'application/pdf':
        zip_buffer = io.BytesIO()
        
        try:
            # Read the PDF file directly from memory
            pdf_data = file.read()
            
            # Create a PdfReader object from the bytes
            reader = PdfReader(io.BytesIO(pdf_data))
            
            # Get number of pages
            num_pages = len(reader.pages)
            
            if num_pages == 0:
                return jsonify({"error": "The PDF file contains no pages."}), 400
            
            # Create a zip file in memory
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for i in range(num_pages):
                    # Create a new PDF writer for each page
                    writer = PdfWriter()
                    
                    # Add the current page
                    writer.add_page(reader.pages[i])
                    
                    # Write the page to a bytes buffer
                    page_buffer = io.BytesIO()
                    writer.write(page_buffer)
                    page_buffer.seek(0)
                    
                    # Add the page to the zip file
                    zip_file.writestr(f"page_{i + 1}.pdf", page_buffer.getvalue())
            
            zip_buffer.seek(0)
            
            return send_file(
                zip_buffer,
                as_attachment=True,
                download_name='split_pages.zip',
                mimetype='application/zip'
            )
            
        except Exception as e:
            print(f"An error occurred during splitting: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({"error": f"An internal server error occurred while splitting the PDF: {str(e)}"}), 500
            
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF file."}), 400
@app.route("/rename", methods=["POST"])
def rename_pdf_route():
    """
    This function handles the PDF renaming logic.
    """
    if 'pdf' not in request.files or 'new_name' not in request.form:
        return jsonify({"error": "Missing file or new name."}), 400
    
    file = request.files['pdf']
    new_name = request.form['new_name']

    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400
    
    if not new_name.strip():
        return jsonify({"error": "New name cannot be empty."}), 400

    if file and file.mimetype == 'application/pdf':
        try:
            base_name = os.path.basename(new_name).strip()
            if not base_name.lower().endswith(".pdf"):
                base_name += ".pdf"
            
            file_buffer = io.BytesIO(file.read())
            file_buffer.seek(0)

            return send_file(
                file_buffer,
                as_attachment=True,
                download_name=base_name,
                mimetype='application/pdf'
            )
        except Exception as e:
            print(f"An error occurred during renaming: {e}")
            return jsonify({"error": "An internal server error occurred while renaming the PDF."}), 500
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF file."}), 400

@app.route("/extract-text", methods=["POST"])
def extract_text_route():
    """
    This function handles the text extraction logic.
    """
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file part in the request."}), 400
    
    file = request.files['pdf']

    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400

    if file and file.mimetype == 'application/pdf':
        try:
            doc = fitz.open(stream=file.read(), filetype="pdf")
            full_text = ""
            for page in doc:
                full_text += page.get_text() + "\n"
            
            doc.close()

            text_buffer = io.BytesIO(full_text.encode('utf-8'))
            text_buffer.seek(0)

            base_name = os.path.splitext(file.filename)[0]
            download_name = f"{base_name}_extracted.txt"

            return send_file(
                text_buffer,
                as_attachment=True,
                download_name=download_name,
                mimetype='text/plain'
            )
        except Exception as e:
            print(f"An error occurred during text extraction: {e}")
            return jsonify({"error": "An internal server error occurred while extracting text."}), 500
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF file."}), 400

# Voice Reader Endpoint
@app.route("/voice-reader", methods=["POST"])
def voice_reader_route():
    """
    This function handles the PDF-to-audio conversion.
    It receives a PDF, extracts text, converts it to speech, and returns an MP3.
    """
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file part in the request."}), 400
    
    file = request.files['pdf']
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400
    
    if file and file.mimetype == 'application/pdf':
        try:
            # Extract text from PDF
            doc = fitz.open(stream=file.read(), filetype="pdf")
            full_text = ""
            for page in doc:
                full_text += page.get_text() + " "
            doc.close()
            
            # Handle case where PDF has no text
            if not full_text.strip():
                return jsonify({"error": "The selected PDF contains no readable text."}), 400

            # Split the text into manageable chunks
            chunk_size = 5000  # gTTS has a character limit, 5000 is a safe bet
            text_chunks = [full_text[i:i + chunk_size] for i in range(0, len(full_text), chunk_size)]
            
            # Create a list to hold the audio data from each chunk
            audio_chunks = []
            for chunk in text_chunks:
                tts = gTTS(text=chunk, lang='en')
                audio_buffer = io.BytesIO()
                tts.write_to_fp(audio_buffer)
                audio_chunks.append(audio_buffer.getvalue())

            # Combine all audio chunks into one final stream
            final_audio_buffer = io.BytesIO(b''.join(audio_chunks))
            final_audio_buffer.seek(0)

            # Send the combined audio file back to the user
            return send_file(
                final_audio_buffer,
                as_attachment=True,
                download_name="audio.mp3",
                mimetype="audio/mpeg"
            )

        except Exception as e:
            print(f"An error occurred during voice conversion: {e}")
            return jsonify({"error": "An internal server error occurred while generating audio."}), 500
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF file."}), 400
    
@app.route("/lock-pdf", methods=["POST"])
def lock_pdf_route():
    """
    This function handles the PDF locking logic.
    """
    if 'pdf' not in request.files or 'password' not in request.form:
        return jsonify({"error": "Missing file or password."}), 400
    
    file = request.files['pdf']
    password = request.form['password']

    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400
    
    if not password.strip():
        return jsonify({"error": "Password cannot be empty."}), 400

    if file and file.mimetype == 'application/pdf':
        try:
            # Create temporary files
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_input:
                file.save(temp_input.name)
                temp_input_path = temp_input.name
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_output:
                temp_output_path = temp_output.name
            
            # Lock the PDF
            success = password_protect_pdf(temp_input_path, temp_output_path, password)
            
            if not success:
                return jsonify({"error": "Failed to lock the PDF."}), 500
            
            # Read the locked PDF and send it back
            with open(temp_output_path, "rb") as f:
                pdf_data = f.read()
            
            # Clean up temporary files
            os.unlink(temp_input_path)
            os.unlink(temp_output_path)
            
            return send_file(
                io.BytesIO(pdf_data),
                as_attachment=True,
                download_name="locked.pdf",
                mimetype='application/pdf'
            )
            
        except Exception as e:
            print(f"An error occurred during PDF locking: {e}")
            # Clean up temporary files if they exist
            if 'temp_input_path' in locals() and os.path.exists(temp_input_path):
                os.unlink(temp_input_path)
            if 'temp_output_path' in locals() and os.path.exists(temp_output_path):
                os.unlink(temp_output_path)
            return jsonify({"error": "An internal server error occurred while locking the PDF."}), 500
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF file."}), 400

@app.route("/unlock-pdf", methods=["POST"])
def unlock_pdf_route():
    """
    This function handles the PDF unlocking logic.
    """
    if 'pdf' not in request.files or 'password' not in request.form:
        return jsonify({"error": "Missing file or password."}), 400
    
    file = request.files['pdf']
    password = request.form['password']

    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400
    
    if not password.strip():
        return jsonify({"error": "Password cannot be empty."}), 400

    if file and file.mimetype == 'application/pdf':
        try:
            # Create temporary files
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_input:
                file.save(temp_input.name)
                temp_input_path = temp_input.name
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_output:
                temp_output_path = temp_output.name
            
            # Unlock the PDF
            success = unlock_pdf_file(temp_input_path, temp_output_path, password)
            
            if not success:
                return jsonify({"error": "Failed to unlock the PDF. Incorrect password?"}), 400
            
            # Read the unlocked PDF and send it back
            with open(temp_output_path, "rb") as f:
                pdf_data = f.read()
            
            # Clean up temporary files
            os.unlink(temp_input_path)
            os.unlink(temp_output_path)
            
            return send_file(
                io.BytesIO(pdf_data),
                as_attachment=True,
                download_name="unlocked.pdf",
                mimetype='application/pdf'
            )
            
        except Exception as e:
            print(f"An error occurred during PDF unlocking: {e}")
            # Clean up temporary files if they exist
            if 'temp_input_path' in locals() and os.path.exists(temp_input_path):
                os.unlink(temp_input_path)
            if 'temp_output_path' in locals() and os.path.exists(temp_output_path):
                os.unlink(temp_output_path)
            return jsonify({"error": "An internal server error occurred while unlocking the PDF."}), 500
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF file."}), 400
    
@app.route("/analyze-pdf", methods=["POST"])
def analyze_pdf_route():
    """
    This function handles the PDF analysis logic.
    """
    print("Analyze PDF endpoint called")  # Debug
    
    if 'pdf' not in request.files:
        print("No file part in request")
        return jsonify({"error": "No PDF file part in the request."}), 400
    
    file = request.files['pdf']
    if file.filename == '':
        print("No file selected")
        return jsonify({"error": "No file selected for analysis."}), 400

    if file and file.mimetype == 'application/pdf':
        temp_file_path = None
        try:
            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                file.save(temp_file.name)
                temp_file_path = temp_file.name
            
            print(f"Temporary file created: {temp_file_path}")
            
            # Make sure the file is closed before analyzing
            # Close any open file handles
            try:
                if 'temp_file' in locals():
                    temp_file.close()
            except:
                pass
            
            # Analyze the PDF
            insights = analyze_pdf(temp_file_path)
            
            print(f"Analysis results: {insights}")
            
            # Clean up temporary file - ensure it's closed first
            try:
                if temp_file_path and os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
            except PermissionError as pe:
                print(f"Warning: Could not delete temp file immediately: {pe}")
                # Schedule for deletion on next run or ignore if it's a temp file
                # Temp files will be cleaned up by the OS eventually
            
            return jsonify(insights)
            
        except Exception as e:
            print(f"An error occurred during PDF analysis: {e}")
            # Clean up temporary file if it exists
            try:
                if temp_file_path and os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
            except PermissionError:
                print("Warning: Could not delete temp file due to permission error")
            except Exception as cleanup_error:
                print(f"Error during cleanup: {cleanup_error}")
                
            return jsonify({"error": f"An internal server error occurred while analyzing the PDF: {str(e)}"}), 500
    else:
        print("Invalid file type")
        return jsonify({"error": "Invalid file type. Please upload a PDF file."}), 400
@app.route("/get-pdf-info", methods=["POST"])
def get_pdf_info():
    """
    Get information about the PDF including page count.
    """
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file part in the request."}), 400
    
    file = request.files['pdf']
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400
    
    if file and file.mimetype == 'application/pdf':
        try:
            # Use PyPDF2 to get page count directly from the file stream
            file.seek(0)  # Ensure we're at the beginning of the file
            reader = PdfReader(file)
            page_count = len(reader.pages)
            
            return jsonify({
                "page_count": page_count,
                "filename": file.filename
            })
            
        except Exception as e:
            print(f"Error getting PDF info: {e}")
            return jsonify({"error": f"Failed to get PDF information: {str(e)}"}), 500
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF file."}), 400

@app.route("/organize-pdf", methods=["POST"])
def organize_pdf():
    """
    Handle PDF organization (reorder or delete pages).
    """
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file part in the request."}), 400
    
    file = request.files['pdf']
    action = request.form.get('action')
    
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400
    
    if not action:
        return jsonify({"error": "No action specified."}), 400
    
    if file and file.mimetype == 'application/pdf':
        temp_input_path = None
        temp_output_path = None
        
        try:
            # Create temporary files
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_input:
                file.save(temp_input.name)
                temp_input_path = temp_input.name
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_output:
                temp_output_path = temp_output.name
            
            # Perform the requested action
            if action == "reorder":
                new_order = json.loads(request.form.get('new_order', '[]'))
                if not new_order:
                    return jsonify({"error": "No reorder sequence provided."}), 400
                success = reorder_pdf_pages(temp_input_path, temp_output_path, new_order)
            elif action == "delete":
                pages_to_delete = json.loads(request.form.get('pages_to_delete', '[]'))
                if not pages_to_delete:
                    return jsonify({"error": "No pages selected for deletion."}), 400
                success = delete_pdf_pages(temp_input_path, temp_output_path, pages_to_delete)
            else:
                return jsonify({"error": "Invalid action"}), 400
            
            if not success:
                return jsonify({"error": "Failed to organize PDF"}), 500
            
            # Read the modified PDF and send it back
            with open(temp_output_path, "rb") as f:
                pdf_data = f.read()
            
            return send_file(
                io.BytesIO(pdf_data),
                as_attachment=True,
                download_name="organized.pdf",
                mimetype='application/pdf'
            )
            
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON data in request"}), 400
        except Exception as e:
            print(f"An error occurred during PDF organization: {e}")
            return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500
        finally:
            # Clean up temporary files if they exist
            if temp_input_path and os.path.exists(temp_input_path):
                try:
                    os.unlink(temp_input_path)
                except:
                    pass
            if temp_output_path and os.path.exists(temp_output_path):
                try:
                    os.unlink(temp_output_path)
                except:
                    pass
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF file."}), 400
    
@app.route("/compare-pdfs", methods=["POST"])
def compare_pdfs_route():
    """
    Compare two PDF files with different comparison types
    """
    if 'pdf1' not in request.files or 'pdf2' not in request.files:
        return jsonify({"error": "Please upload both PDF files."}), 400
    
    file1 = request.files['pdf1']
    file2 = request.files['pdf2']
    comparison_type = request.form.get('type', 'basic')
    
    if file1.filename == '' or file2.filename == '':
        return jsonify({"error": "Please select both PDF files."}), 400
    
    if file1 and file2 and file1.mimetype == 'application/pdf' and file2.mimetype == 'application/pdf':
        temp_file1_path = None
        temp_file2_path = None
        
        try:
            # Create temporary files
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp1:
                file1.save(temp1.name)
                temp_file1_path = temp1.name
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp2:
                file2.save(temp2.name)
                temp_file2_path = temp2.name
            
            # Perform comparison based on type
            if comparison_type == 'basic':
                result = compare_pdfs_basic(temp_file1_path, temp_file2_path)
            elif comparison_type == 'detailed':
                result = compare_pdfs_detailed(temp_file1_path, temp_file2_path)
            elif comparison_type == 'metadata':
                result = compare_pdfs_metadata(temp_file1_path, temp_file2_path)
            else:
                return jsonify({"error": "Invalid comparison type"}), 400
            
            if "error" in result:
                return jsonify(result), 500
                
            return jsonify(result)
            
        except Exception as e:
            return jsonify({"error": f"An error occurred during comparison: {str(e)}"}), 500
        finally:
            # Clean up temporary files
            for temp_file in [temp_file1_path, temp_file2_path]:
                if temp_file and os.path.exists(temp_file):
                    try:
                        os.unlink(temp_file)
                    except:
                        pass
    else:
        return jsonify({"error": "Invalid file types. Please upload PDF files."}), 400

@app.route("/rotate-pdf", methods=["POST"])
def rotate_pdf_route():
    """
    This function handles the PDF rotation logic.
    """
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file part in the request."}), 400
    
    file = request.files['pdf']
    rotation_type = request.form.get('rotation_type', 'all')  # 'all' or 'specific'
    rotation_angle = request.form.get('rotation_angle', '90')
    
    if file.filename == '':
        return jsonify({"error": "No file selected for rotation."}), 400
    
    if file and file.mimetype == 'application/pdf':
        temp_input_path = None
        temp_output_path = None
        
        try:
            # Create temporary files
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_input:
                file.save(temp_input.name)
                temp_input_path = temp_input.name
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_output:
                temp_output_path = temp_output.name
            
            # Perform rotation based on type
            if rotation_type == 'all':
                try:
                    angle = int(rotation_angle)
                except ValueError:
                    return jsonify({"error": "Invalid rotation angle format"}), 400
                    
                success, message = rotate_pdf(temp_input_path, temp_output_path, angle)
                
            elif rotation_type == 'specific':
                try:
                    page_rotations = json.loads(request.form.get('page_rotations', '{}'))
                    success, message = rotate_specific_pages(temp_input_path, temp_output_path, page_rotations)
                except json.JSONDecodeError:
                    return jsonify({"error": "Invalid page rotations format"}), 400
            else:
                return jsonify({"error": "Invalid rotation type"}), 400
            
            if not success:
                return jsonify({"error": message}), 500
            
            # Read the rotated PDF and send it back
            with open(temp_output_path, "rb") as f:
                pdf_data = f.read()
            
            return send_file(
                io.BytesIO(pdf_data),
                as_attachment=True,
                download_name="rotated.pdf",
                mimetype='application/pdf'
            )
            
        except Exception as e:
            print(f"An error occurred during PDF rotation: {e}")
            return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500
        finally:
            # Clean up temporary files if they exist
            if temp_input_path and os.path.exists(temp_input_path):
                try:
                    os.unlink(temp_input_path)
                except:
                    pass
            if temp_output_path and os.path.exists(temp_output_path):
                try:
                    os.unlink(temp_output_path)
                except:
                    pass
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF file."}), 400
    
# Add to app.py
@app.route("/ocr-extract", methods=["POST"])
def ocr_extract_route():
    """
    This function handles OCR text extraction from scanned PDFs.
    """
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file part in the request."}), 400
    
    file = request.files['pdf']
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400

    if file and file.mimetype == 'application/pdf':
        try:
            # Create temporary files
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
                file.save(temp_pdf.name)
                temp_pdf_path = temp_pdf.name
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.txt') as temp_txt:
                temp_txt_path = temp_txt.name
            
            # Extract text using OCR
            success = extract_text_from_pdf(temp_pdf_path, temp_txt_path)
            
            if not success:
                return jsonify({"error": "Failed to extract text using OCR. The PDF might not contain images or Tesseract might not be properly configured."}), 500
            
            # Read the extracted text
            with open(temp_txt_path, "r", encoding="utf-8") as f:
                extracted_text = f.read()
            
            # Clean up temporary files
            os.unlink(temp_pdf_path)
            os.unlink(temp_txt_path)
            
            # Create a text file for download
            text_buffer = io.BytesIO(extracted_text.encode('utf-8'))
            text_buffer.seek(0)
            
            base_name = os.path.splitext(file.filename)[0]
            download_name = f"{base_name}_ocr_extracted.txt"
            
            return send_file(
                text_buffer,
                as_attachment=True,
                download_name=download_name,
                mimetype='text/plain'
            )
            
        except Exception as e:
            print(f"An error occurred during OCR extraction: {e}")
            # Clean up temporary files if they exist
            if 'temp_pdf_path' in locals() and os.path.exists(temp_pdf_path):
                os.unlink(temp_pdf_path)
            if 'temp_txt_path' in locals() and os.path.exists(temp_txt_path):
                os.unlink(temp_txt_path)
            return jsonify({"error": f"An internal server error occurred during OCR extraction: {str(e)}"}), 500
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF file."}), 400

# Add to app.py
@app.route("/crop-pdf", methods=["POST"])
def crop_pdf_route():
    """
    This function handles PDF cropping.
    """
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file part in the request."}), 400
    
    file = request.files['pdf']
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400

    if file and file.mimetype == 'application/pdf':
        try:
            # Get crop settings from form data
            crop_settings = {
                "preset": request.form.get('preset', 'medium'),
                "crop_to": request.form.get('crop_to', 'margin'),
                "page_range": request.form.get('page_range', 'all')
            }
            
            # Parse custom margins if provided
            custom_margins = request.form.get('custom_margins')
            if custom_margins:
                try:
                    crop_settings["margins"] = [int(m) for m in custom_margins.split(',')]
                    if len(crop_settings["margins"]) != 4:
                        raise ValueError("Need exactly 4 margin values")
                except (ValueError, AttributeError):
                    return jsonify({"error": "Invalid custom margins format. Use 'left,top,right,bottom'."}), 400
            
            # Parse page range if provided
            page_range = request.form.get('page_range_custom')
            if page_range and page_range != 'all':
                try:
                    start, end = map(int, page_range.split('-'))
                    if start < 1 or end < start:
                        raise ValueError("Invalid page range")
                    crop_settings["page_range"] = [start, end]
                except (ValueError, AttributeError):
                    return jsonify({"error": "Invalid page range format. Use 'start-end'."}), 400
            
            # Create temporary files
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_input:
                file.save(temp_input.name)
                temp_input_path = temp_input.name
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_output:
                temp_output_path = temp_output.name
            
            # Crop the PDF
            success = crop_pdf(temp_input_path, temp_output_path, crop_settings)
            
            if not success:
                return jsonify({"error": "Failed to crop the PDF."}), 500
            
            # Read the cropped PDF and send it back
            with open(temp_output_path, "rb") as f:
                pdf_data = f.read()
            
            # Clean up temporary files
            os.unlink(temp_input_path)
            os.unlink(temp_output_path)
            
            return send_file(
                io.BytesIO(pdf_data),
                as_attachment=True,
                download_name="cropped.pdf",
                mimetype='application/pdf'
            )
            
        except Exception as e:
            print(f"An error occurred during PDF cropping: {e}")
            # Clean up temporary files if they exist
            if 'temp_input_path' in locals() and os.path.exists(temp_input_path):
                os.unlink(temp_input_path)
            if 'temp_output_path' in locals() and os.path.exists(temp_output_path):
                os.unlink(temp_output_path)
            return jsonify({"error": f"An internal server error occurred while cropping the PDF: {str(e)}"}), 500
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF file."}), 400

# ... (keep all the existing imports and routes above the convert-file route)

@app.route("/convert-file", methods=["POST"])
def convert_file_route():
    """
    Handle file conversion between different formats with better error handling
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request."}), 400
    
    file = request.files['file']
    from_type = request.form.get('from_type', '')
    to_type = request.form.get('to_type', 'pdf')
    
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400

    if file:
        temp_input_path = None
        temp_output_path = None
        
        try:
            # Create temporary input file
            file_extension = file.filename.split('.')[-1].lower()
            with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{file_extension}') as temp_input:
                file.save(temp_input.name)
                temp_input_path = temp_input.name
            
            # Add validation for supported conversions
            supported_conversions = {
                'pdf': ['word', 'excel', 'image'],
                'word': ['pdf'],
                'excel': ['pdf'],
                'image': ['pdf'],
                'mixed': ['pdf']
            }
            
            if from_type not in supported_conversions:
                return jsonify({"error": f"Unsupported source format: {from_type}"}), 400
                
            if to_type not in supported_conversions[from_type]:
                return jsonify({"error": f"Cannot convert {from_type} to {to_type}"}), 400
            
            # Determine the appropriate conversion function
            if from_type == 'pdf':
                if to_type == 'word':
                    # Convert PDF to Word
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as temp_output:
                        temp_output_path = temp_output.name
                    
                    success = convert_pdf_to_word(temp_input_path, temp_output_path)
                    
                    if not success:
                        return jsonify({"error": "Failed to convert PDF to Word"}), 500
                    
                    return send_file(
                        temp_output_path,
                        as_attachment=True,
                        download_name=f"{os.path.splitext(file.filename)[0]}.docx",
                        mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    )
                    
                elif to_type == 'excel':
                    # Convert PDF to Excel
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as temp_output:
                        temp_output_path = temp_output.name
                    
                    success = convert_pdf_to_excel(temp_input_path, temp_output_path)
                    
                    if not success:
                        return jsonify({"error": "Failed to convert PDF to Excel"}), 500
                    
                    return send_file(
                        temp_output_path,
                        as_attachment=True,
                        download_name=f"{os.path.splitext(file.filename)[0]}.xlsx",
                        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    )
                    
                # Add this debug version to your app.py to replace the PDF to image section

                elif to_type == 'image':
                         # Temporarily disabled
                            return jsonify({
                                "error": "PDF to Image conversion is temporarily unavailable in this version of PDFik."
                            }), 501  # 501 = Not Implemented

                    
            elif from_type == 'word':
                # Convert Word to PDF
                with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_output:
                    temp_output_path = temp_output.name
                
                success = convert_word_to_pdf(temp_input_path, temp_output_path)
                
                if not success:
                    return jsonify({"error": "Failed to convert Word to PDF"}), 500
                
                return send_file(
                    temp_output_path,
                    as_attachment=True,
                    download_name=f"{os.path.splitext(file.filename)[0]}.pdf",
                    mimetype='application/pdf'
                )
                
            elif from_type == 'excel':
                # Convert Excel to PDF
                with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_output:
                    temp_output_path = temp_output.name
                
                success = convert_excel_to_pdf(temp_input_path, temp_output_path)
                
                if not success:
                    return jsonify({"error": "Failed to convert Excel to PDF"}), 500
                
                return send_file(
                    temp_output_path,
                    as_attachment=True,
                    download_name=f"{os.path.splitext(file.filename)[0]}.pdf",
                    mimetype='application/pdf'
                )
                
            elif from_type == 'image':
                # Convert Image to PDF
                with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_output:
                    temp_output_path = temp_output.name
                
                success = convert_image_to_pdf(temp_input_path, temp_output_path)
                
                if not success:
                    return jsonify({"error": "Failed to convert Image to PDF"}), 500
                
                return send_file(
                    temp_output_path,
                    as_attachment=True,
                    download_name=f"{os.path.splitext(file.filename)[0]}.pdf",
                    mimetype='application/pdf'
                )
                
            else:
                return jsonify({"error": "Unsupported file type for conversion"}), 400
                
        except Exception as e:
            print(f"An error occurred during file conversion: {e}")
            return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500
        finally:
            # Clean up temporary files
            if temp_input_path and os.path.exists(temp_input_path):
                try:
                    os.unlink(temp_input_path)
                except:
                    pass
            if temp_output_path and os.path.exists(temp_output_path):
                try:
                    os.unlink(temp_output_path)
                except:
                    pass
    else:
        return jsonify({"error": "Invalid file."}), 400
# ... (keep the rest of your app.py file)
if __name__ == "__main__":
    app.run(debug=True)