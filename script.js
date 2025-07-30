document.addEventListener('DOMContentLoaded', function() {
    // Tool switching
    const toolButtons = document.querySelectorAll('.tool-btn');
    const toolSections = document.querySelectorAll('.tool-section');
    
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            toolButtons.forEach(btn => btn.classList.remove('active'));
            toolSections.forEach(section => section.classList.remove('active'));
            
            button.classList.add('active');
            const toolName = button.getAttribute('data-tool');
            document.getElementById(`${toolName}-tool`).classList.add('active');
        });
    });

    // Image Resizer
    const resizerInput = document.getElementById('resizer-input');
    const resizeWidth = document.getElementById('resize-width');
    const resizeHeight = document.getElementById('resize-height');
    const maintainRatio = document.getElementById('maintain-ratio');
    const resizeBtn = document.getElementById('resize-btn');
    const resizerCanvas = document.getElementById('resizer-canvas');
    const resizerDownload = document.getElementById('resizer-download');
    
    resizeBtn.addEventListener('click', resizeImage);
    
    function resizeImage() {
        if (!resizerInput.files[0]) {
            alert('Please select an image first');
            return;
        }
        
        const file = resizerInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const ctx = resizerCanvas.getContext('2d');
                
                let width = parseInt(resizeWidth.value) || img.width;
                let height = parseInt(resizeHeight.value) || img.height;
                
                if (maintainRatio.checked) {
                    if (resizeWidth.value && !resizeHeight.value) {
                        height = (width / img.width) * img.height;
                    } else if (!resizeWidth.value && resizeHeight.value) {
                        width = (height / img.height) * img.width;
                    } else if (resizeWidth.value && resizeHeight.value) {
                        // Use the smaller ratio to maintain aspect
                        const widthRatio = width / img.width;
                        const heightRatio = height / img.height;
                        const ratio = Math.min(widthRatio, heightRatio);
                        width = img.width * ratio;
                        height = img.height * ratio;
                    }
                }
                
                resizerCanvas.width = width;
                resizerCanvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                resizerDownload.href = resizerCanvas.toDataURL('image/png');
                resizerDownload.setAttribute('download', `resized-${file.name.split('.')[0]}.png`);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Image Compressor
    const compressorInput = document.getElementById('compressor-input');
    const compressionQuality = document.getElementById('compression-quality');
    const compressionWidth = document.getElementById('compression-width');
    const compressionHeight = document.getElementById('compression-height');
    const compressBtn = document.getElementById('compress-btn');
    const compressorCanvas = document.getElementById('compressor-canvas');
    const compressorDownload = document.getElementById('compressor-download');
    const originalSize = document.getElementById('original-size');
    const compressedSize = document.getElementById('compressed-size');
    const reductionPercent = document.getElementById('reduction-percent');
    
    compressBtn.addEventListener('click', compressImage);
    
    function compressImage() {
        if (!compressorInput.files[0]) {
            alert('Please select an image first');
            return;
        }
        
        const file = compressorInput.files[0];
        originalSize.textContent = `${(file.size / 1024).toFixed(2)} KB`;
        
        const quality = parseFloat(compressionQuality.value) || 0.8;
        const maxWidth = parseInt(compressionWidth.value) || undefined;
        const maxHeight = parseInt(compressionHeight.value) || undefined;
        
        new Compressor(file, {
            quality,
            maxWidth,
            maxHeight,
            success(result) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        compressorCanvas.width = img.width;
                        compressorCanvas.height = img.height;
                        const ctx = compressorCanvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        
                        compressorCanvas.toBlob((blob) => {
                            const compressedUrl = URL.createObjectURL(blob);
                            compressorDownload.href = compressedUrl;
                            compressorDownload.setAttribute('download', `compressed-${file.name.split('.')[0]}.jpg`);
                            
                            const compressedSizeKB = (blob.size / 1024).toFixed(2);
                            const reduction = ((file.size - blob.size) / file.size * 100).toFixed(2);
                            
                            compressedSize.textContent = `${compressedSizeKB} KB`;
                            reductionPercent.textContent = `${reduction}%`;
                        }, 'image/jpeg', quality);
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(result);
            },
            error(err) {
                console.error(err.message);
                alert('Compression failed. Please try again.');
            }
        });
    }

    // Image Converter
    const converterInput = document.getElementById('converter-input');
    const outputFormat = document.getElementById('output-format');
    const conversionQuality = document.getElementById('conversion-quality');
    const convertBtn = document.getElementById('convert-btn');
    const converterCanvas = document.getElementById('converter-canvas');
    const converterDownload = document.getElementById('converter-download');
    
    convertBtn.addEventListener('click', convertImage);
    
    function convertImage() {
        if (!converterInput.files[0]) {
            alert('Please select an image first');
            return;
        }
        
        const file = converterInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                converterCanvas.width = img.width;
                converterCanvas.height = img.height;
                const ctx = converterCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                const format = outputFormat.value;
                const quality = parseFloat(conversionQuality.value) || 0.9;
                
                let mimeType;
                switch(format) {
                    case 'jpeg': mimeType = 'image/jpeg'; break;
                    case 'png': mimeType = 'image/png'; break;
                    case 'webp': mimeType = 'image/webp'; break;
                    default: mimeType = 'image/png';
                }
                
                const dataUrl = converterCanvas.toDataURL(mimeType, quality);
                converterDownload.href = dataUrl;
                converterDownload.setAttribute('download', `converted-${file.name.split('.')[0]}.${format}`);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});