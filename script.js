document.addEventListener("DOMContentLoaded", () => {
  // Toast notification function
  function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.background = isSuccess ? '#4CAF50' : '#f44336';
  toast.style.display = 'block';
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, 3000);
}

  // Simulate progress for operations - FIXED VERSION
  function simulateProgress(progressBar) {
    if (!progressBar) {
      console.error("Progress bar element not found");
      return;
    }
    
    // Reset the progress bar
    progressBar.style.display = 'block';
    const bar = progressBar.querySelector('.progress-bar');
    if (!bar) {
      console.error("Progress bar inner element not found");
      return;
    }
    
    bar.style.width = '0%';
    
    // Animate the progress
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          progressBar.style.display = 'none';
          bar.style.width = '0%';
        }, 500);
      } else {
        width += 2; // Slower animation
        bar.style.width = width + '%';
      }
    }, 50); // Faster update
  }

  // Test the connection to the Flask server
  async function testConnection() {
    try {
      const response = await fetch('http://127.0.0.1:5000/');
      console.log('Connection test:', response.status);
    } catch (error) {
      console.error('Connection failed:', error);
      showToast("Cannot connect to server. Make sure Flask is running.", false);
    }
  }

  // Call this when the page loads
  testConnection();
 // Function to change language using Google Translate
function changeLanguage(lang) {
  // Check if Google Translate is loaded
  if (typeof google !== 'undefined' && google.translate) {
    const translateElement = google.translate.TranslateElement();
    const selectField = document.querySelector('.goog-te-combo');
    
    if (selectField) {
      selectField.value = lang;
      selectField.dispatchEvent(new Event('change'));
      
      // Show notification
      const langNames = {
        'en': 'English',
        'bn': 'Bengali',
        'hi': 'Hindi',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'ja': 'Japanese'
      };
      
      showToast(`Language changed to ${langNames[lang]}`);
      
      // Save language preference
      localStorage.setItem('preferredLanguage', lang);
    }
  } else {
    // Fallback: redirect to Google Translate version
    window.location.href = `https://translate.google.com/translate?hl=en&sl=auto&tl=${lang}&u=${encodeURIComponent(window.location.href)}`;
  }
}

// Make the function available globally
window.changeLanguage = changeLanguage;

// Initialize with saved language preference if available
document.addEventListener("DOMContentLoaded", function() {
  const savedLanguage = localStorage.getItem('preferredLanguage');
  if (savedLanguage) {
    // Wait for Google Translate to load
    setTimeout(() => {
      changeLanguage(savedLanguage);
    }, 2000);
  }
});

  // --- About Section Toggle ---
  const aboutLink = document.getElementById('aboutLink');
  const aboutSection = document.getElementById('about');

  aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    const isVisible = aboutSection.classList.toggle('visible');
    if (isVisible) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

// Add to your script.js file, inside the DOMContentLoaded event

// Legal documents modal functionality
const privacyLink = document.getElementById('privacyLink');
const termsLink = document.getElementById('termsLink');
const legalModal = document.getElementById('legalModal');
const legalModalTitle = document.getElementById('legalModalTitle');
const legalContent = document.getElementById('legalContent');
const closeLegalModal = document.querySelector('.close-legal-modal');

// Privacy Policy content
// Update your privacyPolicyContent variable in script.js
const privacyPolicyContent = `
  <h3>PDFik Privacy Policy</h3>
<p><strong>Last Updated: August 2025</strong></p>

<p>PDFik is committed to protecting your privacy and securing your data. This Privacy Policy explains how we handle your information when you use our PDF processing tools.</p>

<h4>1. Information We Process</h4>
<h5>1.1 Files You Upload</h5>
<p>When you use PDFik, we temporarily process:</p>
<ul>
  <li>PDF and other document files you upload for processing</li>
  <li>Basic file metadata (name, size, type) needed for functionality</li>
</ul>

<p><strong>Important:</strong> Your files are processed in memory and automatically deleted immediately after processing completes. We do not store your files on our servers.</p>

<h5>1.2 Technical Information</h5>
<p>For service operation and security, we may collect:</p>
<ul>
  <li>Basic server logs (timestamp, operation type, success/failure status)</li>
  <li>Anonymous usage statistics to improve service performance</li>
  <li>Error reports to fix technical issues</li>
</ul>

<h5>1.3 Contact Information</h5>
<p>If you contact us through our form, we collect:</p>
<ul>
  <li>Your name and email address to respond to your inquiry</li>
  <li>Your message content</li>
</ul>

<h5>1.4 Cookies and Local Storage</h5>
<p>PDFik uses minimal storage technologies:</p>
<ul>
  <li><strong>Consent Preference:</strong> One cookie to remember your cookie consent choice</li>
  <li><strong>Language Preference:</strong> Browser local storage to remember your language setting</li>
  <li><strong>Session Data:</strong> Temporary memory storage during file processing</li>
</ul>

<p>We do not use tracking cookies, analytics cookies, or any persistent identifiers.</p>

<h4>2. How We Use Your Information</h4>
<ul>
  <li>To process your PDF operations as requested</li>
  <li>To maintain and improve our service quality</li>
  <li>To respond to your customer support inquiries</li>
  <li>To ensure the security and proper functioning of our service</li>
</ul>

<h4>3. Data Retention</h4>
<ul>
  <li><strong>Uploaded Files:</strong> Deleted immediately after processing (typically within seconds)</li>
</ul>

<h4>4. Data Sharing</h4>
<p>We do not sell, rent, or trade your personal information. We only share data when:</p>
<ul>
  <li>Required by law or legal process</li>
  <li>Necessary to protect our rights or safety</li>
</ul>

<h4>5. Your Rights</h4>
<p>You have the right to:</p>
<ul>
  <li>Access any personal information we hold about you</li>
  <li>Request deletion of your personal information</li>
  <li>Withdraw consent for data processing</li>
  <li>Request information about our data practices</li>
</ul>

<h4>6. Security</h4>
<p>We implement appropriate technical measures to protect your data during processing, including:</p>
<ul>
  <li>Secure HTTPS connections for all data transfers</li>
  <li>Memory-only processing without persistent storage</li>
  <li>Regular security assessments</li>
</ul>

<h4>7. Contact Us</h4>
<p>For questions about this privacy policy or your data, contact us at:</p>
<p>Email: parthapratimswi@gmail.com</p>
`;

// Terms & Conditions content
const termsContent = `
  <h3>PDFik Terms & Conditions</h3>
  <p><strong>Last Updated: August 2025</strong></p>
  
  <p>Welcome to PDFik! These Terms & Conditions ("Terms," "Agreement") govern your access to and use of the PDFik platform, including all associated tools, services, and features (collectively, the "Services"). By accessing or using PDFik, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please refrain from using PDFik.</p>
  
  <h4>1. Acceptance of Terms</h4>
  <p>1.1 By using PDFik, you agree to comply with all applicable laws and regulations regarding your use of the platform.</p>
  <p>1.2 You confirm that you are at least 13 years of age and have the legal capacity to enter into this Agreement.</p>
  <p>1.3 These Terms apply to all users, visitors, and anyone accessing PDFik, including any third parties who interact with the Services on your behalf.</p>
  <p>1.4 Continued use of PDFik constitutes acceptance of any updates or revisions to these Terms.</p>
  
  <h4>2. Use of Services</h4>
  <p>2.1 PDFik provides tools for processing PDF files, including but not limited to merge, split, convert, compress, rotate, unlock, and watermark.</p>
  <p>2.2 You agree to use the Services only for lawful purposes and in compliance with these Terms.</p>
  <p>2.3 You may not use PDFik to upload, transmit, or distribute any content that:</p>
  <ul>
    <li>Is illegal, harmful, threatening, abusive, harassing, or defamatory</li>
    <li>Violates any intellectual property, privacy, or proprietary rights of others</li>
    <li>Contains viruses, malware, or harmful code that may disrupt the Services or other users</li>
  </ul>
  <p>2.4 PDFik reserves the right to suspend or terminate access for users who violate these Terms.</p>
  <h4>3. Intellectual Property</h4>
<p>All intellectual property rights in the PDFik platform, including logos, branding, and underlying technology, remain the property of PDFik. Users retain ownership of their own files and content uploaded for processing.</p>

<h4>4. Disclaimer of Warranties</h4>
<p>PDFik is provided "as is" and "as available," without warranties of any kind. We make no guarantees that the Services will be error-free, uninterrupted, or completely secure. Users assume full responsibility for the use of the Services.</p>

<h4>5. Limitation of Liability</h4>
<p>To the fullest extent permitted by law, PDFik shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the Services, including but not limited to data loss, downtime, or unauthorized access.</p>

<h4>6. Governing Law</h4>
<p>These Terms are governed by the laws of India. Any disputes shall be resolved under the jurisdiction of Indian courts.</p>

  <!-- Continue with the rest of your terms content -->
  
  <h4>7. Contact Information</h4>
  <p>For questions, concerns, or clarifications regarding these Terms & Conditions, you may contact us at:</p>
  <p>Email: parthapratimswi@gmail.com</p>
`;

// Open modal with Privacy Policy
if (privacyLink) {
  privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    legalModalTitle.textContent = 'Privacy Policy';
    legalContent.innerHTML = privacyPolicyContent;
    legalModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  });
}

// Open modal with Terms & Conditions
if (termsLink) {
  termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    legalModalTitle.textContent = 'Terms & Conditions';
    legalContent.innerHTML = termsContent;
    legalModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  });
}

// Close modal
if (closeLegalModal) {
  closeLegalModal.addEventListener('click', () => {
    legalModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  });
}

// Close modal when clicking outside content
window.addEventListener('click', (e) => {
  if (e.target === legalModal) {
    legalModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }
});

// Cookie consent functionality
function checkCookieConsent() {
  if (!localStorage.getItem('cookiesAccepted')) {
    // Create cookie consent banner
    const cookieBanner = document.createElement('div');
    cookieBanner.className = 'cookie-consent';
    cookieBanner.innerHTML = `
      <p>We use minimal cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
      <div class="cookie-consent-buttons">
        <button class="cookie-consent-btn cookie-accept">Accept</button>
        <button class="cookie-consent-btn cookie-decline">Decline</button>
      </div>
    `;
    
    document.body.appendChild(cookieBanner);
    
    // Add event listeners to buttons
    cookieBanner.querySelector('.cookie-accept').addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.style.display = 'none';
      showToast("Cookie preferences saved");
    });
    
    cookieBanner.querySelector('.cookie-decline').addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'false');
      cookieBanner.style.display = 'none';
      showToast("Cookie preferences saved");
    });
  }
}

// Check cookie consent on page load
checkCookieConsent();
  // --- Animate Features on Scroll ---
  const featuresSection = document.querySelector('.features-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        featuresSection.classList.add('in-view');
        observer.unobserve(featuresSection);
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(featuresSection);
// --- Analyze PDF Functionality (Download as TXT) ---
const analyzeBtn = document.querySelector("#analyzeBtn");
const analyzeInput = document.querySelector("#analyzeInput");
const analyzeFileListContainer = document.querySelector("#analyzeFileListContainer");
const analyzeProgress = document.querySelector("#analyzeProgress");

if (analyzeInput && analyzeFileListContainer) {
  analyzeInput.addEventListener('change', () => {
    analyzeFileListContainer.innerHTML = '';
    
    if (analyzeInput.files.length > 0) {
      const list = document.createElement('ul');
      const file = analyzeInput.files[0];
      const listItem = document.createElement('li');
      listItem.textContent = file.name;
      listItem.className = 'file-list-item';
      list.appendChild(listItem);
      analyzeFileListContainer.appendChild(list);
    }
  });
}

if (analyzeBtn && analyzeInput) {
  analyzeBtn.addEventListener("click", async () => {
    if (!analyzeInput.files.length) {
      showToast("Please select a PDF file first!", false);
      return;
    }

    simulateProgress(analyzeProgress);
    
    try {
      let formData = new FormData();
      formData.append("pdf", analyzeInput.files[0]);

      let res = await fetch("http://127.0.0.1:5000/analyze-pdf", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        showToast(`Failed to analyze PDF: ${errorData.error}`, false);
        return;
      }

      const insights = await res.json();
      
      // Convert insights to text format
      let textContent = "PDF Analysis Report\n";
      textContent += "===================\n\n";
      textContent += `Generated on: ${new Date().toLocaleString()}\n`;
      textContent += `File name: ${analyzeInput.files[0].name}\n\n`;
      
      for (const [key, value] of Object.entries(insights)) {
        textContent += `${key.replace(/_/g, ' ').toUpperCase()}: ${value}\n`;
      }
      
      // Create and download the text file
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${analyzeInput.files[0].name.split('.')[0]}_analysis.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      analyzeFileListContainer.innerHTML = '';
      analyzeInput.value = '';
      showToast("PDF analysis downloaded as TXT file!");

    } catch (err) {
      console.error("An error occurred during PDF analysis:", err);
      showToast("Something went wrong! Please check the console for details.", false);
    }
  });
}
   // --- Organize PDF Functionality --- (MOVED TO TOP)
  const organizeInput = document.querySelector("#organizeInput");
  const organizeControls = document.querySelector("#organizeControls");
  const organizeFileListContainer = document.querySelector("#organizeFileListContainer");
  const organizeProgress = document.querySelector("#organizeProgress");
  const pageInfo = document.querySelector("#pageInfo");
  const pageCountElement = document.querySelector("#pageCount");
  const reorderBtn = document.querySelector("#reorderBtn");
  const deleteBtn = document.querySelector("#deleteBtn");
  const reorderInterface = document.querySelector("#reorderInterface");
  const deleteInterface = document.querySelector("#deleteInterface");
  const pageList = document.querySelector("#pageList");
  const pageCheckboxes = document.querySelector("#pageCheckboxes");
  const applyReorder = document.querySelector("#applyReorder");
  const applyDelete = document.querySelector("#applyDelete");
  const closeReorder = document.querySelector("#closeReorder");
  const closeDelete = document.querySelector("#closeDelete");

  // Check if all required elements exist
  if (organizeInput && organizeControls && organizeFileListContainer && 
      organizeProgress && pageInfo && pageCountElement && reorderBtn && 
      deleteBtn && reorderInterface && deleteInterface && pageList && 
      pageCheckboxes && applyReorder && applyDelete && closeReorder && closeDelete) {
    
    let currentPdfFile = null;
    let pageCount = 0;

    // Close reorder interface
    closeReorder.addEventListener('click', () => {
      reorderInterface.style.display = 'none';
    });

    // Close delete interface
    closeDelete.addEventListener('click', () => {
      deleteInterface.style.display = 'none';
    });

    organizeInput.addEventListener('change', async () => {
      organizeFileListContainer.innerHTML = '';
      organizeControls.style.display = 'none';
      reorderInterface.style.display = 'none';
      deleteInterface.style.display = 'none';
      
      pageList.innerHTML = '';
      pageCheckboxes.innerHTML = '';
      
      if (organizeInput.files.length > 0) {
        currentPdfFile = organizeInput.files[0];
        const list = document.createElement('ul');
        const listItem = document.createElement('li');
        listItem.textContent = currentPdfFile.name;
        listItem.className = 'file-list-item';
        list.appendChild(listItem);
        organizeFileListContainer.appendChild(list);
        
        // Get PDF page count
        try {
          const formData = new FormData();
          formData.append("pdf", currentPdfFile);
          
          const res = await fetch("http://127.0.0.1:5000/get-pdf-info", {
            method: "POST",
            body: formData
          });
          
          if (res.ok) {
            const data = await res.json();
            pageCount = data.page_count;
            pageCountElement.textContent = pageCount;
            
            organizeControls.style.display = 'block';
          } else {
            // Try to parse error as JSON, fallback to text if it fails
            try {
              const errorData = await res.json();
              showToast(`Failed to get PDF information: ${errorData.error}`, false);
            } catch {
              showToast("Failed to get PDF information", false);
            }
          }
        } catch (err) {
          console.error("Error getting PDF info:", err);
          showToast("Error loading PDF information", false);
        }
      }
    });

    // Reorder functionality
    reorderBtn.addEventListener('click', () => {
      reorderInterface.style.display = 'block';
      deleteInterface.style.display = 'none';
      
      // Populate page list for reordering
      pageList.innerHTML = '';
      for (let i = 0; i < pageCount; i++) {
        const listItem = document.createElement('li');
        listItem.textContent = `Page ${i + 1}`;
        listItem.dataset.pageIndex = i;
        listItem.draggable = true;
        pageList.appendChild(listItem);
      }
      
      // Make list sortable
      let draggedItem = null;
      
      pageList.querySelectorAll('li').forEach(item => {
        item.addEventListener('dragstart', function() {
          draggedItem = this;
          setTimeout(() => this.style.opacity = '0.5', 0);
        });
        
        item.addEventListener('dragend', function() {
          draggedItem = null;
          this.style.opacity = '1';
        });
        
        item.addEventListener('dragover', function(e) {
          e.preventDefault();
        });
        
        item.addEventListener('dragenter', function(e) {
          e.preventDefault();
          this.style.backgroundColor = '#e9ecef';
        });
        
        item.addEventListener('dragleave', function() {
          this.style.backgroundColor = '#f8f9fa';
        });
        
        item.addEventListener('drop', function(e) {
          e.preventDefault();
          this.style.backgroundColor = '#f8f9fa';
          if (draggedItem !== this) {
            const allItems = Array.from(pageList.querySelectorAll('li'));
            const thisIndex = allItems.indexOf(this);
            const draggedIndex = allItems.indexOf(draggedItem);
            
            if (draggedIndex < thisIndex) {
              pageList.insertBefore(draggedItem, this.nextSibling);
            } else {
              pageList.insertBefore(draggedItem, this);
            }
          }
        });
      });
    });

    // Delete functionality
    deleteBtn.addEventListener('click', () => {
      deleteInterface.style.display = 'block';
      reorderInterface.style.display = 'none';
      
      // Populate page checkboxes for deletion
      pageCheckboxes.innerHTML = '';
      for (let i = 0; i < pageCount; i++) {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'page-checkbox';
        checkboxDiv.innerHTML = `
          <input type="checkbox" id="page-${i}" value="${i}">
          <label for="page-${i}">Page ${i + 1}</label>
        `;
        pageCheckboxes.appendChild(checkboxDiv);
      }
    });

    // Apply reorder
    applyReorder.addEventListener('click', async () => {
      if (!currentPdfFile) {
        showToast("Please select a PDF file first!", false);
        return;
      }
      
      const newOrder = Array.from(pageList.querySelectorAll('li')).map(item => 
        parseInt(item.dataset.pageIndex)
      );
      
      simulateProgress(organizeProgress);
      
      try {
        let formData = new FormData();
        formData.append("pdf", currentPdfFile);
        formData.append("new_order", JSON.stringify(newOrder));
        formData.append("action", "reorder");

        let res = await fetch("http://127.0.0.1:5000/organize-pdf", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          // Try to parse error as JSON, fallback to text if it fails
          try {
            const errorData = await res.json();
            showToast(`Failed to reorganize PDF: ${errorData.error}`, false);
          } catch {
            showToast("Failed to reorganize PDF", false);
          }
          return;
        }

        let blob = await res.blob();
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.style.display = 'none';
        a.href = url;
        a.download = "reorganized.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
        // Hide the reorder interface after successful download
        reorderInterface.style.display = 'none';
        showToast("PDF reorganized successfully!");
      } catch (err) {
        console.error("An error occurred during reorganization:", err);
        showToast("Something went wrong! Please check the console for details.", false);
      }
    });

    // Apply deletion
    applyDelete.addEventListener('click', async () => {
      if (!currentPdfFile) {
        showToast("Please select a PDF file first!", false);
        return;
      }
      
      const pagesToDelete = Array.from(pageCheckboxes.querySelectorAll('input:checked')).map(
        checkbox => parseInt(checkbox.value)
      );
      
      if (pagesToDelete.length === 0) {
        showToast("Please select at least one page to delete", false);
        return;
      }
      
      if (pagesToDelete.length >= pageCount) {
        showToast("Cannot delete all pages from a PDF", false);
        return;
      }
      
      simulateProgress(organizeProgress);
      
      try {
        let formData = new FormData();
        formData.append("pdf", currentPdfFile);
        formData.append("pages_to_delete", JSON.stringify(pagesToDelete));
        formData.append("action", "delete");

        let res = await fetch("http://127.0.0.1:5000/organize-pdf", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          // Try to parse error as JSON, fallback to text if it fails
          try {
            const errorData = await res.json();
            showToast(`Failed to delete pages: ${errorData.error}`, false);
          } catch {
            showToast("Failed to delete pages", false);
          }
          return;
        }

        let blob = await res.blob();
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.style.display = 'none';
        a.href = url;
        a.download = "modified.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
        // Hide the delete interface after successful download
        deleteInterface.style.display = 'none';
        showToast("Pages deleted successfully!");
      } catch (err) {
        console.error("An error occurred during page deletion:", err);
        showToast("Something went wrong! Please check the console for details.", false);
      }
    });
  } else {
    console.error("One or more organize PDF elements not found");
  }
    const compareInput1 = document.querySelector("#compareInput1");
  const compareInput2 = document.querySelector("#compareInput2");
  const compareFileList1 = document.querySelector("#compareFileList1");
  const compareFileList2 = document.querySelector("#compareFileList2");
  const compareType = document.querySelector("#compareType");
  const compareBtn = document.querySelector("#compareBtn");
  const compareProgress = document.querySelector("#compareProgress");
  const compareResults = document.querySelector("#compareResults");
  const compareContent = document.querySelector("#compareContent");
  const closeCompare = document.querySelector("#closeCompare");

  if (compareInput1 && compareInput2 && compareFileList1 && compareFileList2 && 
      compareType && compareBtn && compareProgress && compareResults && 
      compareContent && closeCompare) {
    
    let compareFile1 = null;
    let compareFile2 = null;

    // Close compare results
    closeCompare.addEventListener('click', () => {
      compareResults.style.display = 'none';
    });

    // File 1 selection
    compareInput1.addEventListener('change', () => {
      compareFileList1.innerHTML = '';
      if (compareInput1.files.length > 0) {
        compareFile1 = compareInput1.files[0];
        const listItem = document.createElement('div');
        listItem.textContent = compareFile1.name;
        listItem.className = 'file-list-item';
        compareFileList1.appendChild(listItem);
      }
    });

    // File 2 selection
    compareInput2.addEventListener('change', () => {
      compareFileList2.innerHTML = '';
      if (compareInput2.files.length > 0) {
        compareFile2 = compareInput2.files[0];
        const listItem = document.createElement('div');
        listItem.textContent = compareFile2.name;
        listItem.className = 'file-list-item';
        compareFileList2.appendChild(listItem);
      }
    });

    // Compare button
    compareBtn.addEventListener('click', async () => {
      if (!compareFile1 || !compareFile2) {
        showToast("Please select both PDF files!", false);
        return;
      }

      simulateProgress(compareProgress);
      
      try {
        let formData = new FormData();
        formData.append("pdf1", compareFile1);
        formData.append("pdf2", compareFile2);
        formData.append("type", compareType.value);

        let res = await fetch("http://127.0.0.1:5000/compare-pdfs", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast(`Comparison failed: ${errorData.error}`, false);
          return;
        }

        const results = await res.json();
        
        // Display results
        compareContent.innerHTML = '';
        
        if (results.comparison_type === "basic") {
          const basicHtml = `
            <div class="insight-item">
              <span class="insight-name">PDF 1 Pages:</span>
              <span class="insight-value">${results.pdf1_pages}</span>
            </div>
            <div class="insight-item">
              <span class="insight-name">PDF 2 Pages:</span>
              <span class="insight-value">${results.pdf2_pages}</span>
            </div>
            <div class="insight-item">
              <span class="insight-name">Page Difference:</span>
              <span class="insight-value">${results.page_difference}</span>
            </div>
            <div class="insight-item">
              <span class="insight-name">PDF 1 Size:</span>
              <span class="insight-value">${(results.pdf1_size / 1024).toFixed(2)} KB</span>
            </div>
            <div class="insight-item">
              <span class="insight-name">PDF 2 Size:</span>
              <span class="insight-value">${(results.pdf2_size / 1024).toFixed(2)} KB</span>
            </div>
            <div class="insight-item">
              <span class="insight-name">Size Difference:</span>
              <span class="insight-value">${(results.size_difference / 1024).toFixed(2)} KB</span>
            </div>
          `;
          compareContent.innerHTML = basicHtml;
        }
        else if (results.comparison_type === "detailed") {
          let detailedHtml = '';
          
          // Add similarity visualization if available
          if (results.similarity_percentage !== undefined) {
            detailedHtml += `
              <div class="similarity-text">
                Overall Similarity: ${results.similarity_percentage.toFixed(1)}%
              </div>
              <div class="similarity-bar">
                <div class="similarity-fill" style="width: ${results.similarity_percentage}%"></div>
              </div>
            `;
          }
          
          // Add results
          results.results.forEach(result => {
            detailedHtml += `<div class="insight-item"><span>${result}</span></div>`;
          });
          
          compareContent.innerHTML = detailedHtml;
        }
        else if (results.comparison_type === "metadata") {
          let metadataHtml = `<div class="insight-item">
            <span class="insight-name">Differences Found:</span>
            <span class="insight-value">${results.differences_count}</span>
          </div>`;
          
          results.results.forEach(result => {
            metadataHtml += `<div class="insight-item"><span>${result}</span></div>`;
          });
          
          compareContent.innerHTML = metadataHtml;
        }
        
        compareResults.style.display = 'block';
        showToast("PDF comparison completed successfully!");
        
      } catch (err) {
        console.error("An error occurred during PDF comparison:", err);
        showToast("Something went wrong! Please check the console for details.", false);
      }
    });
  }
// --- Rotate PDF Functionality ---
const rotateBtn = document.querySelector("#rotateBtn");
const rotateInput = document.querySelector("#rotateInput");
const rotationType = document.querySelector("#rotationType");
const rotationAngle = document.querySelector("#rotationAngle");
const selectedPagesAngle = document.querySelector("#selectedPagesAngle");
const allRotationOptions = document.querySelector("#allRotationOptions");
const specificRotationOptions = document.querySelector("#specificRotationOptions");
const pageSelectionGrid = document.querySelector("#pageSelectionGrid");
const selectAllBtn = document.querySelector("#selectAllPages");
const rotateFileListContainer = document.querySelector("#rotateFileListContainer");
const rotateProgress = document.querySelector("#rotateProgress");

let pdfPageCount = 0;
let allPagesSelected = false;

// Show/hide rotation options based on type
if (rotationType) {
  rotationType.addEventListener('change', () => {
    if (rotationType.value === 'all') {
      allRotationOptions.style.display = 'block';
      specificRotationOptions.style.display = 'none';
    } else {
      allRotationOptions.style.display = 'none';
      specificRotationOptions.style.display = 'block';
      
      // If we have a PDF loaded, ensure page selection is populated
      if (pdfPageCount > 0 && pageSelectionGrid.children.length === 0) {
        populatePageSelection();
      }
    }
  });
}

// Select all pages functionality
if (selectAllBtn) {
  selectAllBtn.addEventListener('click', () => {
    const checkboxes = pageSelectionGrid.querySelectorAll('input[type="checkbox"]');
    allPagesSelected = !allPagesSelected;
    
    checkboxes.forEach(checkbox => {
      checkbox.checked = allPagesSelected;
      const item = checkbox.closest('.page-checkbox-item');
      if (allPagesSelected) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
    
    selectAllBtn.textContent = allPagesSelected ? 'Deselect All' : 'Select All';
  });
}

// Function to populate page selection grid
function populatePageSelection() {
  pageSelectionGrid.innerHTML = '';
  
  for (let i = 0; i < pdfPageCount; i++) {
    const pageItem = document.createElement('div');
    pageItem.className = 'page-checkbox-item';
    pageItem.innerHTML = `
      <input type="checkbox" id="page-${i}" name="page-${i}" value="${i}">
      <label for="page-${i}">Page ${i + 1}</label>
    `;
    pageSelectionGrid.appendChild(pageItem);
    
    // Add event listener to toggle selection style
    const checkbox = pageItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        pageItem.classList.add('selected');
      } else {
        pageItem.classList.remove('selected');
        allPagesSelected = false;
        selectAllBtn.textContent = 'Select All';
      }
    });
  }
}

if (rotateInput && rotateFileListContainer) {
  rotateInput.addEventListener('change', async () => {
    rotateFileListContainer.innerHTML = '';
    pageSelectionGrid.innerHTML = '';
    pdfPageCount = 0;
    
    if (rotateInput.files.length > 0) {
      const list = document.createElement('ul');
      const file = rotateInput.files[0];
      const listItem = document.createElement('li');
      listItem.textContent = file.name;
      listItem.className = 'file-list-item';
      list.appendChild(listItem);
      rotateFileListContainer.appendChild(list);
      
      // Get page count for the PDF
      try {
        const formData = new FormData();
        formData.append("pdf", file);
        
        const res = await fetch("http://127.0.0.1:5000/get-pdf-info", {
          method: "POST",
          body: formData
        });
        
        if (res.ok) {
          const data = await res.json();
          pdfPageCount = data.page_count;
          
          // If specific rotation is selected, populate page selection
          if (rotationType.value === 'specific') {
            populatePageSelection();
          }
        }
      } catch (err) {
        console.error("Error getting PDF info:", err);
      }
    }
  });
}

if (rotateBtn && rotateInput) {
  rotateBtn.addEventListener("click", async () => {
    if (!rotateInput.files.length) {
      showToast("Please select a PDF file first!", false);
      return;
    }

    simulateProgress(rotateProgress);
    
    try {
      let formData = new FormData();
      formData.append("pdf", rotateInput.files[0]);
      formData.append("rotation_type", rotationType.value);
      
      if (rotationType.value === 'all') {
        formData.append("rotation_angle", rotationAngle.value);
      } else {
        // Get selected pages - FIXED
        const selectedPages = {};
        const checkboxes = pageSelectionGrid.querySelectorAll('input[type="checkbox"]:checked');
        
        if (checkboxes.length === 0) {
          showToast("Please select at least one page to rotate", false);
          return;
        }
        
        const angle = parseInt(selectedPagesAngle.value);
        
        // Create an array of page rotations
        const pageRotations = {};
        checkboxes.forEach(checkbox => {
          pageRotations[checkbox.value] = angle;
        });
        
        formData.append("page_rotations", JSON.stringify(pageRotations));
      }

      let res = await fetch("http://127.0.0.1:5000/rotate-pdf", {
        method: "POST",
        body: formData
      });

      // Check if response is JSON (error) or a PDF (success)
      const contentType = res.headers.get("content-type");
      
      if (!res.ok) {
        // It's an error response (JSON)
        const errorData = await res.json();
        showToast(`Failed to rotate PDF: ${errorData.error}`, false);
        return;
      }
      
      if (contentType && contentType.includes("application/json")) {
        // Handle JSON response (shouldn't happen for success, but just in case)
        const data = await res.json();
        if (data.error) {
          showToast(`Failed to rotate PDF: ${data.error}`, false);
        } else {
          showToast("PDF rotated successfully, but unexpected response format", false);
        }
        return;
      }

      // It's a PDF response (success)
      let blob = await res.blob();
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.style.display = 'none';
      a.href = url;
      a.download = "rotated.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      rotateFileListContainer.innerHTML = '';
      rotateInput.value = '';
      pageSelectionGrid.innerHTML = '';
      showToast("PDF rotated successfully!");
    } catch (err) {
      console.error("An error occurred during PDF rotation:", err);
      showToast("Something went wrong! Please check the console for details.", false);
    }
  });
}
// Add to script.js (in the DOMContentLoaded event)
// --- OCR Extract Functionality ---
const ocrExtractBtn = document.querySelector("#ocrExtractBtn");
const ocrExtractInput = document.querySelector("#ocrExtractInput");
const ocrExtractFileListContainer = document.querySelector("#ocrExtractFileListContainer");
const ocrExtractProgress = document.querySelector("#ocrExtractProgress");

if (ocrExtractInput && ocrExtractFileListContainer) {
  ocrExtractInput.addEventListener('change', () => {
    ocrExtractFileListContainer.innerHTML = '';
    if (ocrExtractInput.files.length > 0) {
      const list = document.createElement('ul');
      const file = ocrExtractInput.files[0];
      const listItem = document.createElement('li');
      listItem.textContent = file.name;
      listItem.className = 'file-list-item';
      list.appendChild(listItem);
      ocrExtractFileListContainer.appendChild(list);
    }
  });
}

if (ocrExtractBtn && ocrExtractInput) {
  ocrExtractBtn.addEventListener("click", async () => {
    if (!ocrExtractInput.files.length) {
      showToast("Please select a PDF file first!", false);
      return;
    }

    simulateProgress(ocrExtractProgress);
    
    try {
      let formData = new FormData();
      formData.append("pdf", ocrExtractInput.files[0]);

      let res = await fetch("http://127.0.0.1:5000/ocr-extract", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        showToast(`Failed to extract text with OCR: ${errorData.error}`, false);
        return;
      }

      let blob = await res.blob();
      let url = window.URL.createObjectURL(blob);
      
      // Get filename from Content-Disposition header or use default
      let filename = 'ocr_extracted.txt';
      const disposition = res.headers.get('Content-Disposition');
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) { 
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      let a = document.createElement("a");
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      ocrExtractFileListContainer.innerHTML = '';
      ocrExtractInput.value = '';
      showToast("Text extracted with OCR successfully!");
    } catch (err) {
      console.error("An error occurred during OCR extraction:", err);
      showToast("Something went wrong! Please check the console for details.", false);
    }
  });
}
// Add to script.js (in the DOMContentLoaded event)
// --- Crop PDF Functionality ---
const cropBtn = document.querySelector("#cropBtn");
const cropInput = document.querySelector("#cropInput");
const cropFileListContainer = document.querySelector("#cropFileListContainer");
const cropProgress = document.querySelector("#cropProgress");
const cropPreset = document.querySelector("#cropPreset");
const cropTo = document.querySelector("#cropTo");
const pageRange = document.querySelector("#pageRange");
const customMargins = document.querySelector("#customMargins");
const customPageRange = document.querySelector("#customPageRange");
const customMarginsContainer = document.querySelector("#customMarginsContainer");
const customPageRangeContainer = document.querySelector("#customPageRangeContainer");

// Show/hide custom options based on selections
if (cropPreset) {
  cropPreset.addEventListener('change', () => {
    if (cropPreset.value === 'custom') {
      customMarginsContainer.style.display = 'block';
    } else {
      customMarginsContainer.style.display = 'none';
    }
  });
}

if (pageRange) {
  pageRange.addEventListener('change', () => {
    if (pageRange.value === 'custom') {
      customPageRangeContainer.style.display = 'block';
    } else {
      customPageRangeContainer.style.display = 'none';
    }
  });
}

if (cropInput && cropFileListContainer) {
  cropInput.addEventListener('change', () => {
    cropFileListContainer.innerHTML = '';
    if (cropInput.files.length > 0) {
      const list = document.createElement('ul');
      const file = cropInput.files[0];
      const listItem = document.createElement('li');
      listItem.textContent = file.name;
      listItem.className = 'file-list-item';
      list.appendChild(listItem);
      cropFileListContainer.appendChild(list);
    }
  });
}

if (cropBtn && cropInput) {
  cropBtn.addEventListener("click", async () => {
    if (!cropInput.files.length) {
      showToast("Please select a PDF file first!", false);
      return;
    }

    // Validate custom margins if used - FIXED
    if (cropPreset.value === 'custom') {
      const margins = customMargins.value.split(',');
      if (margins.length !== 4 || margins.some(m => isNaN(parseInt(m.trim())))) {
        showToast("Please enter valid margins in the format: left,top,right,bottom", false);
        return;
      }
    }

    // Validate custom page range if used - FIXED
    if (pageRange.value === 'custom') {
      const range = customPageRange.value.split('-');
      if (range.length !== 2 || range.some(r => isNaN(parseInt(r.trim())))) {
        showToast("Please enter a valid page range in the format: start-end", false);
        return;
      }
      
      const start = parseInt(range[0].trim());
      const end = parseInt(range[1].trim());
      
      if (start < 1 || end < start) {
        showToast("Invalid page range. Start must be less than or equal to end.", false);
        return;
      }
    }

    simulateProgress(cropProgress);
    
    try {
      let formData = new FormData();
      formData.append("pdf", cropInput.files[0]);
      formData.append("preset", cropPreset.value);
      formData.append("crop_to", cropTo.value);
      formData.append("page_range", pageRange.value);
      
      if (cropPreset.value === 'custom') {
        formData.append("custom_margins", customMargins.value);
      }
      
      if (pageRange.value === 'custom') {
        formData.append("page_range_custom", customPageRange.value);
      }

      let res = await fetch("http://127.0.0.1:5000/crop-pdf", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        showToast(`Failed to crop PDF: ${errorData.error}`, false);
        return;
      }

      let blob = await res.blob();
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.style.display = 'none';
      a.href = url;
      a.download = "cropped.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      cropFileListContainer.innerHTML = '';
      cropInput.value = '';
      showToast("PDF cropped successfully!");
    } catch (err) {
      console.error("An error occurred during PDF cropping:", err);
      showToast("Something went wrong! Please check the console for details.", false);
    }
  });
}
// --- Convert Files Functionality ---
const convertInput = document.querySelector("#convertInput");
const convertOptions = document.querySelector("#convertOptions");
const convertFrom = document.querySelector("#convertFrom");
const convertTo = document.querySelector("#convertTo");
const imageOptions = document.querySelector("#imageOptions");
const imageFormat = document.querySelector("#imageFormat");
const imageQuality = document.querySelector("#imageQuality");
const convertBtn = document.querySelector("#convertBtn");
const convertProgress = document.querySelector("#convertProgress");
const convertStatus = document.querySelector("#convertStatus");
const convertFileListContainer = document.querySelector("#convertFileListContainer");
const convertResults = document.querySelector("#convertResults");
const convertResultsContent = document.querySelector("#convertResultsContent");
const closeConvertResults = document.querySelector("#closeConvertResults");

// Function to update conversion options based on file type
function updateConversionOptions(fileType) {
    // Clear previous options
    convertTo.innerHTML = '';
    
    // Add appropriate options based on file type
    switch(fileType) {
        case 'pdf':
            convertTo.innerHTML = `
                <option value="word">Word Document (.docx)</option>
                <option value="excel">Excel Spreadsheet (.xlsx)</option>
                <option value="image">Images</option>
            `;
            break;
        case 'word':
            convertTo.innerHTML = `
                <option value="pdf">PDF Document</option>
            `;
            break;
        case 'excel':
            convertTo.innerHTML = `
                <option value="pdf">PDF Document</option>
            `;
            break;
        case 'image':
            convertTo.innerHTML = `
                <option value="pdf">PDF Document</option>
            `;
            break;
        default:
            convertTo.innerHTML = `
                <option value="pdf">PDF Document</option>
                <option value="word">Word Document (.docx)</option>
                <option value="excel">Excel Spreadsheet (.xlsx)</option>
                <option value="image">Images</option>
            `;
    }
    
    // Show/hide image options based on selection
    if (convertTo.value === 'image') {
        imageOptions.style.display = 'block';
    } else {
        imageOptions.style.display = 'none';
    }
}

// Toggle image options based on format selection
if (convertTo) {
    convertTo.addEventListener('change', () => {
        if (convertTo.value === 'image') {
            imageOptions.style.display = 'block';
        } else {
            imageOptions.style.display = 'none';
        }
    });
}

// Close convert results
if (closeConvertResults) {
    closeConvertResults.addEventListener('click', () => {
        convertResults.style.display = 'none';
    });
}

if (convertInput && convertFileListContainer) {
    convertInput.addEventListener('change', () => {
        convertFileListContainer.innerHTML = '';
        convertOptions.style.display = 'none';
        convertBtn.style.display = 'none';
        convertStatus.style.display = 'none';
        convertResults.style.display = 'none';
        
        if (convertInput.files.length > 0) {
            const list = document.createElement('ul');
            for (const file of convertInput.files) {
                const listItem = document.createElement('li');
                listItem.textContent = file.name;
                listItem.className = 'file-list-item';
                list.appendChild(listItem);
            }
            convertFileListContainer.appendChild(list);
            
            // Detect file types and set the "Convert From" options
            const fileTypes = new Set();
            let detectedType = 'mixed';
            
            for (const file of convertInput.files) {
                const ext = file.name.split('.').pop().toLowerCase();
                if (ext === 'pdf') fileTypes.add('pdf');
                else if (ext === 'doc' || ext === 'docx') fileTypes.add('word');
                else if (ext === 'xls' || ext === 'xlsx') fileTypes.add('excel');
                else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'].includes(ext)) fileTypes.add('image');
            }
            
            // Update the "Convert From" dropdown
            convertFrom.innerHTML = '';
            if (fileTypes.size === 1) {
                // Single file type selected
                detectedType = Array.from(fileTypes)[0];
                let typeName = '';
                switch(detectedType) {
                    case 'pdf': typeName = 'PDF'; break;
                    case 'word': typeName = 'Word'; break;
                    case 'excel': typeName = 'Excel'; break;
                    case 'image': typeName = 'Image'; break;
                }
                convertFrom.innerHTML = `<option value="${detectedType}">${typeName}</option>`;
            } else {
                // Multiple file types selected - only allow conversion to PDF
                detectedType = 'mixed';
                convertFrom.innerHTML = '<option value="mixed">Mixed Files</option>';
                convertTo.innerHTML = '<option value="pdf">PDF Document</option>';
            }
            
            // Update conversion options based on detected file type
            updateConversionOptions(detectedType);
            
            // Show options and button
            convertOptions.style.display = 'block';
            convertBtn.style.display = 'block';
        }
    });
}

if (convertBtn && convertInput) {
    convertBtn.addEventListener("click", async () => {
        if (!convertInput.files.length) {
            showToast("Please select files first!", false);
            return;
        }

        // Show status area
        convertStatus.style.display = 'block';
        convertBtn.disabled = true;
        
        const totalFiles = convertInput.files.length;
        const fromType = convertFrom.value;
        const toType = convertTo.value;
        const results = [];
        
        // Validate conversion type
        const supportedConversions = {
            'pdf': ['word', 'excel', 'image'],
            'word': ['pdf'],
            'excel': ['pdf'],
            'image': ['pdf'],
            'mixed': ['pdf'] // Mixed files can only be converted to PDF
        };
        
        if (!supportedConversions[fromType] || !supportedConversions[fromType].includes(toType)) {
            showToast(`Cannot convert ${fromType} to ${toType}`, false);
            convertBtn.disabled = false;
            convertStatus.style.display = 'none';
            return;
        }
        
        // Update overall progress
        const updateOverallProgress = (processed) => {
            const percent = Math.round((processed / totalFiles) * 100);
            document.querySelector('.convert-overall-percent').textContent = `${percent}%`;
            document.querySelector('.progress-bar-fill').style.width = `${percent}%`;
        };
        
        // Update file progress
        const updateFileProgress = (fileName, percent) => {
            document.querySelector('.convert-file-name').textContent = fileName;
            document.querySelector('.convert-file-percent').textContent = `${percent}%`;
        };
        
        // Process each file
        for (let i = 0; i < totalFiles; i++) {
            const file = convertInput.files[i];
            updateOverallProgress(i);
            updateFileProgress(file.name, 0);
            
            try {
                let formData = new FormData();
                formData.append("file", file);
                formData.append("to_type", toType);
                
                // Determine the from type for this specific file
                const ext = file.name.split('.').pop().toLowerCase();
                let fileFromType = '';
                if (ext === 'pdf') fileFromType = 'pdf';
                else if (ext === 'doc' || ext === 'docx') fileFromType = 'word';
                else if (ext === 'xls' || ext === 'xlsx') fileFromType = 'excel';
                else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'].includes(ext)) fileFromType = 'image';
                else fileFromType = 'unknown';
                
                formData.append("from_type", fileFromType);
                
                if (toType === 'image') {
                    formData.append("image_format", imageFormat.value);
                    formData.append("dpi", imageQuality.value);
                }
                
                // Show progress for this file
                simulateProgress(convertProgress);
                
                const res = await fetch("http://127.0.0.1:5000/convert-file", {
                    method: "POST",
                    body: formData
                });
                
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `Failed to convert ${file.name}`);
                }
                
                // Get the converted file
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                
                // Determine the appropriate file extension
                let fileExt = '';
                switch(toType) {
                    case 'pdf': fileExt = '.pdf'; break;
                    case 'word': fileExt = '.docx'; break;
                    case 'excel': fileExt = '.xlsx'; break;
                    case 'image': 
                        fileExt = imageFormat.value === 'png' ? '.png' : '.jpg';
                        break;
                }
                
                results.push({
                    name: file.name,
                    status: 'success',
                    downloadUrl: url,
                    downloadName: `${file.name.split('.')[0]}${fileExt}`
                });
                
                updateFileProgress(file.name, 100);
                
            } catch (err) {
                console.error(`Error converting ${file.name}:`, err);
                results.push({
                    name: file.name,
                    status: 'error',
                    error: err.message
                });
            }
        }
        
        // Complete the process
        updateOverallProgress(totalFiles);
        document.querySelector('.convert-progress-text').textContent = 'Conversion completed!';
        convertBtn.disabled = false;
        
        // Show results
        showConvertResults(results);
    });
}
function showConvertResults(results) {
    convertResultsContent.innerHTML = '';
    
    let successCount = 0;
    let errorCount = 0;
    
    // Create results list
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'convert-result-item';
        
        const fileName = document.createElement('div');
        fileName.className = 'convert-result-name';
        fileName.textContent = result.name;
        
        const status = document.createElement('div');
        status.className = 'convert-result-status';
        
        if (result.status === 'success') {
            status.classList.add('convert-result-success');
            status.textContent = '✓ Success';
            successCount++;
            
            // Add download link
            const downloadLink = document.createElement('a');
            downloadLink.href = result.downloadUrl;
            downloadLink.download = result.downloadName;
            downloadLink.textContent = 'Download';
            downloadLink.style.marginLeft = '10px';
            downloadLink.style.color = 'var(--primary-color)';
            downloadLink.style.fontSize = '0.9rem';
            status.appendChild(downloadLink);
        } else {
            status.classList.add('convert-result-error');
            status.textContent = `✗ Error: ${result.error}`;
            errorCount++;
        }
        
        resultItem.appendChild(fileName);
        resultItem.appendChild(status);
        convertResultsContent.appendChild(resultItem);
    });
    
    // Add summary
    const summary = document.createElement('div');
    summary.style.marginTop = '15px';
    summary.style.padding = '10px';
    summary.style.backgroundColor = '#f8f9fa';
    summary.style.borderRadius = '5px';
    summary.innerHTML = `
        <strong>Summary:</strong> ${successCount} succeeded, ${errorCount} failed
    `;
    convertResultsContent.appendChild(summary);
    
    // Show download all button if there are successes
    if (successCount > 0) {
        const downloadAllBtn = document.createElement('button');
        downloadAllBtn.className = 'convert-download-btn';
        downloadAllBtn.textContent = 'Download All Successful Conversions';
        downloadAllBtn.addEventListener('click', () => {
            results.filter(r => r.status === 'success').forEach(result => {
                const link = document.createElement('a');
                link.href = result.downloadUrl;
                link.download = result.downloadName;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        });
        convertResultsContent.appendChild(downloadAllBtn);
    }
    
    convertResults.style.display = 'block';
}
// --- Contact Form Functionality ---
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formProps = Object.fromEntries(formData);
    
    // Basic validation
    if (!formProps.name || !formProps.email || !formProps.subject || !formProps.message) {
      showToast("Please fill in all fields", false);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formProps.email)) {
      showToast("Please enter a valid email address", false);
      return;
    }
    
    // Get the submit button
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
      // Show loading state
      submitButton.textContent = "Sending...";
      submitButton.disabled = true;
      
      // Send form data to server
      const response = await fetch("http://127.0.0.1:5000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formProps).toString()
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showToast(data.message || "Message sent successfully!");
        contactForm.reset();
      } else {
        showToast(data.error || "Failed to send message", false);
      }
    } catch (err) {
      console.error("An error occurred while submitting the form:", err);
      showToast("Something went wrong! Please try again later.", false);
    } finally {
      // Always restore button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
}
  // --- Merge PDF Functionality ---
  const mergeBtn = document.querySelector("#mergeBtn");
  const mergeInput = document.querySelector("#mergeInput");
  const fileListContainer = document.querySelector("#fileListContainer");
  const mergeProgress = document.querySelector("#mergeProgress");

  if (mergeInput && fileListContainer) {
    mergeInput.addEventListener('change', () => {
      fileListContainer.innerHTML = '';
      if (mergeInput.files.length > 0) {
        const list = document.createElement('ul');
        for (const file of mergeInput.files) {
          const listItem = document.createElement('li');
          listItem.textContent = file.name;
          listItem.className = 'file-list-item';
          list.appendChild(listItem);
        }
        fileListContainer.appendChild(list);
      }
    });
  }

  if (mergeBtn && mergeInput) {
    mergeBtn.addEventListener("click", async () => {
      if (!mergeInput.files.length) {
        showToast("Please select PDF files first!", false);
        return;
      }

      simulateProgress(mergeProgress);
      
      try {
        let formData = new FormData();
        for (let file of mergeInput.files) {
          formData.append("pdfs", file);
        }

        let res = await fetch("http://127.0.0.1:5000/merge", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast(`Failed to merge PDFs: ${errorData.error}`, false);
          return;
        }

        let blob = await res.blob();
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.style.display = 'none';
        a.href = url;
        a.download = "merged.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        fileListContainer.innerHTML = '';
        mergeInput.value = '';
        showToast("PDFs merged successfully!");
      } catch (err) {
        console.error("An error occurred during the merge process:", err);
        showToast("Something went wrong! Please check the console for details.", false);
      }
    });
  }

  // --- Split PDF Functionality ---
  const splitBtn = document.querySelector("#splitBtn");
  const splitInput = document.querySelector("#splitInput");
  const splitFileListContainer = document.querySelector("#splitFileListContainer");
  const splitProgress = document.querySelector("#splitProgress");

  if (splitInput && splitFileListContainer) {
    splitInput.addEventListener('change', () => {
      splitFileListContainer.innerHTML = '';
      if (splitInput.files.length > 0) {
        const list = document.createElement('ul');
        const file = splitInput.files[0];
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        listItem.className = 'file-list-item';
        list.appendChild(listItem);
        splitFileListContainer.appendChild(list);
      }
    });
  }

  if (splitBtn && splitInput) {
    splitBtn.addEventListener("click", async () => {
      if (!splitInput.files.length) {
        showToast("Please select a PDF file first!", false);
        return;
      }

      simulateProgress(splitProgress);
      
      try {
        let formData = new FormData();
        formData.append("pdf", splitInput.files[0]);

        let res = await fetch("http://127.0.0.1:5000/split", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast(`Failed to split PDF: ${errorData.error}`, false);
          return;
        }

        let blob = await res.blob();
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.style.display = 'none';
        a.href = url;
        a.download = "split_pages.zip";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        splitFileListContainer.innerHTML = '';
        splitInput.value = '';
        showToast("PDF split successfully!");
      } catch (err) {
        console.error("An error occurred during the split process:", err);
        showToast("Something went wrong! Please check the console for details.", false);
      }
    });
  }

  // --- Rename PDF Functionality ---
  const renameBtn = document.querySelector("#renameBtn");
  const renameInput = document.querySelector("#renameInput");
  const newNameInput = document.querySelector("#newNameInput");
  const renameFileListContainer = document.querySelector("#renameFileListContainer");
  const renameProgress = document.querySelector("#renameProgress");

  if (renameInput && renameFileListContainer) {
    renameInput.addEventListener('change', () => {
      renameFileListContainer.innerHTML = ''; 
      if (renameInput.files.length > 0) {
        const list = document.createElement('ul');
        const file = renameInput.files[0];
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        listItem.className = 'file-list-item';
        list.appendChild(listItem);
        renameFileListContainer.appendChild(list);
      }
    });
  }

  if (renameBtn && renameInput && newNameInput) {
    renameBtn.addEventListener("click", async () => {
      if (!renameInput.files.length) {
        showToast("Please select a PDF file first!", false);
        return;
      }
      if (!newNameInput.value.trim()) {
        showToast("Please enter a new name for the file!", false);
        return;
      }

      simulateProgress(renameProgress);
      
      try {
        let formData = new FormData();
        formData.append("pdf", renameInput.files[0]);
        formData.append("new_name", newNameInput.value);

        let res = await fetch("http://127.0.0.1:5000/rename", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast(`Failed to rename PDF: ${errorData.error}`, false);
          return;
        }

        let blob = await res.blob();
        let url = window.URL.createObjectURL(blob);
        
        let a = document.createElement("a");
        a.style.display = 'none';
        a.href = url;
        let filename = newNameInput.value.trim();
        if (!filename.toLowerCase().endsWith(".pdf")) {
          filename += ".pdf";
        }
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        renameFileListContainer.innerHTML = '';
        renameInput.value = '';
        newNameInput.value = '';
        showToast("PDF renamed successfully!");
      } catch (err) {
        console.error("An error occurred during the rename process:", err);
        showToast("Something went wrong! Please check the console for details.", false);
      }
    });
  }

  // --- Extract Text Functionality ---
  const extractBtn = document.querySelector("#extractBtn");
  const extractInput = document.querySelector("#extractInput");
  const extractFileListContainer = document.querySelector("#extractFileListContainer");
  const extractProgress = document.querySelector("#extractProgress");

  if (extractInput && extractFileListContainer) {
    extractInput.addEventListener('change', () => {
      extractFileListContainer.innerHTML = '';
      if (extractInput.files.length > 0) {
        const list = document.createElement('ul');
        const file = extractInput.files[0];
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        listItem.className = 'file-list-item';
        list.appendChild(listItem);
        extractFileListContainer.appendChild(list);
      }
    });
  }

  if (extractBtn && extractInput) {
    extractBtn.addEventListener("click", async () => {
      if (!extractInput.files.length) {
        showToast("Please select a PDF file first!", false);
        return;
      }

      simulateProgress(extractProgress);
      
      try {
        let formData = new FormData();
        formData.append("pdf", extractInput.files[0]);

        let res = await fetch("http://127.0.0.1:5000/extract-text", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast(`Failed to extract text: ${errorData.error}`, false);
          return;
        }

        let blob = await res.blob();
        let url = window.URL.createObjectURL(blob);
        const disposition = res.headers.get('Content-Disposition');
        let filename = 'extracted.txt';
        if (disposition && disposition.indexOf('attachment') !== -1) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }

        let a = document.createElement("a");
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        extractFileListContainer.innerHTML = '';
        extractInput.value = '';
        showToast("Text extracted successfully!");
      } catch (err) {
        console.error("An error occurred during text extraction:", err);
        showToast("Something went wrong! Please check the console for details.", false);
      }
    });
  }

  // --- Voice Reader Functionality ---
  const voiceReaderBtn = document.querySelector("#voiceReaderBtn");
  const voiceReaderInput = document.querySelector("#voiceReaderInput");
  const voiceReaderFileListContainer = document.querySelector("#voiceReaderFileListContainer");
  const voiceProgress = document.querySelector("#voiceProgress");

  if (voiceReaderInput && voiceReaderFileListContainer) {
    voiceReaderInput.addEventListener('change', () => {
      voiceReaderFileListContainer.innerHTML = '';
      if (voiceReaderInput.files.length > 0) {
        const list = document.createElement('ul');
        const file = voiceReaderInput.files[0];
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        listItem.className = 'file-list-item';
        list.appendChild(listItem);
        voiceReaderFileListContainer.appendChild(list);
      }
    });
  }

  if (voiceReaderBtn && voiceReaderInput) {
    voiceReaderBtn.addEventListener("click", async () => {
      if (!voiceReaderInput.files.length) {
        showToast("Please select a PDF file first!", false);
        return;
      }

      simulateProgress(voiceProgress);
      
      try {
        let formData = new FormData();
        formData.append("pdf", voiceReaderInput.files[0]);

        let res = await fetch("http://127.0.0.1:5000/voice-reader", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast(`Failed to generate audio: ${errorData.error}`, false);
          return;
        }

        let blob = await res.blob();
        let url = window.URL.createObjectURL(blob);
        
        let a = document.createElement("a");
        a.style.display = 'none';
        a.href = url;
        a.download = "audio.mp3";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        voiceReaderFileListContainer.innerHTML = '';
        voiceReaderInput.value = '';
        showToast("Audio generated successfully!");
      } catch (err) {
        console.error("An error occurred during the voice reader process:", err);
        showToast("Something went wrong! Please check the console for details.", false);
      }
    });
  }

  // --- Lock PDF Functionality ---
  const lockBtn = document.querySelector("#lockBtn");
  const lockInput = document.querySelector("#lockInput");
  const lockPassword = document.querySelector("#lockPassword");
  const lockFileListContainer = document.querySelector("#lockFileListContainer");
  const lockProgress = document.querySelector("#lockProgress");

  if (lockInput && lockFileListContainer) {
    lockInput.addEventListener('change', () => {
      lockFileListContainer.innerHTML = '';
      if (lockInput.files.length > 0) {
        const list = document.createElement('ul');
        const file = lockInput.files[0];
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        listItem.className = 'file-list-item';
        list.appendChild(listItem);
        lockFileListContainer.appendChild(list);
      }
    });
  }

  if (lockBtn && lockInput && lockPassword) {
    lockBtn.addEventListener("click", async () => {
      if (!lockInput.files.length) {
        showToast("Please select a PDF file first!", false);
        return;
      }
      if (!lockPassword.value.trim()) {
        showToast("Please enter a password!", false);
        return;
      }

      simulateProgress(lockProgress);
      
      try {
        let formData = new FormData();
        formData.append("pdf", lockInput.files[0]);
        formData.append("password", lockPassword.value);

        let res = await fetch("http://127.0.0.1:5000/lock-pdf", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast(`Failed to lock PDF: ${errorData.error}`, false);
          return;
        }

        let blob = await res.blob();
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.style.display = 'none';
        a.href = url;
        a.download = "locked.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        lockFileListContainer.innerHTML = '';
        lockInput.value = '';
        lockPassword.value = '';
        showToast("PDF locked successfully!");
      } catch (err) {
        console.error("An error occurred during PDF locking:", err);
        showToast("Something went wrong! Please check the console for details.", false);
      }
    });
  }

  // --- Unlock PDF Functionality ---
  const unlockBtn = document.querySelector("#unlockBtn");
  const unlockInput = document.querySelector("#unlockInput");
  const unlockPassword = document.querySelector("#unlockPassword");
  const unlockFileListContainer = document.querySelector("#unlockFileListContainer");
  const unlockProgress = document.querySelector("#unlockProgress");

  if (unlockInput && unlockFileListContainer) {
    unlockInput.addEventListener('change', () => {
      unlockFileListContainer.innerHTML = '';
      if (unlockInput.files.length > 0) {
        const list = document.createElement('ul');
        const file = unlockInput.files[0];
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        listItem.className = 'file-list-item';
        list.appendChild(listItem);
        unlockFileListContainer.appendChild(list);
      }
    });
  }

  if (unlockBtn && unlockInput && unlockPassword) {
    unlockBtn.addEventListener("click", async () => {
      if (!unlockInput.files.length) {
        showToast("Please select a PDF file first!", false);
        return;
      }
      if (!unlockPassword.value.trim()) {
        showToast("Please enter a password!", false);
        return;
      }

      simulateProgress(unlockProgress);
      
      try {
        let formData = new FormData();
        formData.append("pdf", unlockInput.files[0]);
        formData.append("password", unlockPassword.value);

        let res = await fetch("http://127.0.0.1:5000/unlock-pdf", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast(`Failed to unlock PDF: ${errorData.error}`, false);
          return;
        }

        let blob = await res.blob();
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.style.display = 'none';
        a.href = url;
        a.download = "unlocked.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        unlockFileListContainer.innerHTML = '';
        unlockInput.value = '';
        unlockPassword.value = '';
        showToast("PDF unlocked successfully!");
      } 
      catch (err) {
        console.error("An error occurred during PDF unlocking:", err);
        showToast("Something went wrong! Please check the console for details.", false);
      }
    });
  }})
window.addEventListener("load", () => {
    const toast = document.getElementById("toast");
    toast.style.display = "block";

    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
});