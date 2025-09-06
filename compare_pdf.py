import fitz
import json
from datetime import datetime

def compare_pdfs_basic(file1, file2):
    """Basic comparison showing page counts and size differences"""
    try:
        doc1 = fitz.open(file1)
        doc2 = fitz.open(file2)

        len1 = len(doc1)
        len2 = len(doc2)
        
        # Get file sizes
        import os
        size1 = os.path.getsize(file1)
        size2 = os.path.getsize(file2)
        
        doc1.close()
        doc2.close()

        return {
            "pdf1_pages": len1,
            "pdf2_pages": len2,
            "page_difference": abs(len1 - len2),
            "pdf1_size": size1,
            "pdf2_size": size2,
            "size_difference": abs(size1 - size2),
            "comparison_type": "basic"
        }
        
    except Exception as e:
        return {"error": f"Error in basic comparison: {str(e)}"}

def compare_pdfs_detailed(file1, file2):
    """Detailed comparison with text content analysis"""
    try:
        doc1 = fitz.open(file1)
        doc2 = fitz.open(file2)

        differences = []
        min_pages = min(len(doc1), len(doc2))
        max_pages = max(len(doc1), len(doc2))
        
        # Basic info
        differences.append(f"PDF 1: {len(doc1)} pages")
        differences.append(f"PDF 2: {len(doc2)} pages")
        differences.append("")

        # Page-by-page comparison
        identical_pages = 0
        different_pages = 0
        
        for i in range(min_pages):
            text1 = doc1[i].get_text().strip().lower()
            text2 = doc2[i].get_text().strip().lower()
            
            if text1 == text2:
                identical_pages += 1
            else:
                different_pages += 1
                # Calculate similarity percentage
                from difflib import SequenceMatcher
                similarity = SequenceMatcher(None, text1, text2).ratio() * 100
                differences.append(f"Page {i + 1}: {similarity:.1f}% similar")

        # Summary
        differences.append("")
        differences.append(f"Identical pages: {identical_pages}")
        differences.append(f"Different pages: {different_pages}")
        differences.append(f"Similarity score: {(identical_pages/max_pages)*100:.1f}%")

        # Extra pages
        if len(doc1) > min_pages:
            differences.append(f"PDF 1 has {len(doc1) - min_pages} extra page(s)")
        if len(doc2) > min_pages:
            differences.append(f"PDF 2 has {len(doc2) - min_pages} extra page(s)")

        doc1.close()
        doc2.close()

        return {
            "comparison_type": "detailed",
            "results": differences,
            "identical_pages": identical_pages,
            "different_pages": different_pages,
            "total_pages_compared": min_pages,
            "similarity_percentage": (identical_pages/max_pages)*100 if max_pages > 0 else 0
        }
        
    except Exception as e:
        return {"error": f"Error in detailed comparison: {str(e)}"}

def compare_pdfs_metadata(file1, file2):
    """Compare PDF metadata"""
    try:
        doc1 = fitz.open(file1)
        doc2 = fitz.open(file2)
        
        meta1 = doc1.metadata
        meta2 = doc2.metadata
        
        differences = []
        
        # Compare metadata fields
        for key in set(meta1.keys()) | set(meta2.keys()):
            val1 = meta1.get(key, "Not set")
            val2 = meta2.get(key, "Not set")
            
            if val1 != val2:
                differences.append(f"{key}: PDF1='{val1}', PDF2='{val2}'")
        
        doc1.close()
        doc2.close()
        
        return {
            "comparison_type": "metadata",
            "results": differences if differences else ["Metadata is identical"],
            "differences_count": len(differences)
        }
        
    except Exception as e:
        return {"error": f"Error in metadata comparison: {str(e)}"}