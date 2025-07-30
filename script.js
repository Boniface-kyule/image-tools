// Batch Processor
const batchInput = document.getElementById('batch-input');
const batchProcessBtn = document.getElementById('batch-process-btn');
const batchResults = document.getElementById('batch-results');

batchProcessBtn.addEventListener('click', processBatchImages);

async function processBatchImages() {
    if (!batchInput.files.length) {
        alert('Please select images first');
        return;
    }
    
    if (batchInput.files.length > 5) {
        alert('Maximum 5 images allowed for batch processing');
        return;
    }

    batchResults.innerHTML = '<p>Processing...</p>';
    const format = document.getElementById('batch-format').value;
    const quality = parseFloat(document.getElementById('batch-quality').value) || 0.8;
    
    let resultsHTML = '';
    
    for (let i = 0; i < batchInput.files.length; i++) {
        const file = batchInput.files[i];
        const result = await processSingleImage(file, format, quality);
        resultsHTML += `
            <div class="batch-item">
                <p>${file.name} → ${format}</p>
                <img src="${result.url}" alt="Processed ${file.name}">
                <a href="${result.url}" download="batch_${i}.${format}">Download</a>
                <p>Size: ${result.size}</p>
            </div>
        `;
    }
    
    batchResults.innerHTML = resultsHTML;
}

async function processSingleImage(file, format, quality) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                let mimeType;
                switch(format) {
                    case 'jpeg': mimeType = 'image/jpeg'; break;
                    case 'png': mimeType = 'image/png'; break;
                    case 'webp': mimeType = 'image/webp'; break;
                    default: mimeType = 'image/png';
                }
                
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    resolve({
                        url: url,
                        size: `${(blob.size / 1024).toFixed(1)} KB`
                    });
                }, mimeType, quality);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}