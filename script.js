document.getElementById('unlockBtn').addEventListener('click', unlockPDF);

async function unlockPDF() {
  const fileInput = document.getElementById('pdfInput');
  const passwordInput = document.getElementById('passwordInput');
  const errorMessage = document.getElementById('errorMessage');
  const pdfContainer = document.getElementById('pdfContainer');
  
  // Clear previous errors and content
  errorMessage.classList.add('hidden');
  pdfContainer.innerHTML = '';

  if (fileInput.files.length === 0) {
    errorMessage.textContent = 'Please upload a PDF file.';
    errorMessage.classList.remove('hidden');
    return;
  }

  const file = fileInput.files[0];
  const password = passwordInput.value.trim();
  
  try {
    const loadingTask = pdfjsLib.getDocument({ 
      url: URL.createObjectURL(file),
      password: password
    });
    
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1); // Display first page as an example
    const scale = 1.5;
    const viewport = page.getViewport({ scale: scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    
    pdfContainer.appendChild(canvas);
  } catch (error) {
    errorMessage.textContent = 'Error unlocking PDF. ' + error.message;
    errorMessage.classList.remove('hidden');
  }
}
