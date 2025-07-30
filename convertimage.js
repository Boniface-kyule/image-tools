// Update your convertImage function to handle HEIC
async function convertImage() {
    if (!converterInput.files[0]) {
        alert('Please select an image first');
        return;
    }
    
    const file = converterInput.files[0];
    const format = outputFormat.value;
    const quality = parseFloat(conversionQuality.value) || 0.9;
    
    // Handle HEIC files
    if (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
        try {
            const resultBlob = await heic2any({
                blob: file,
                toType: `image/${format}`,
                quality: quality
            });
            
            const url = URL.createObjectURL(resultBlob);
            converterDownload.href = url;
            converterDownload.setAttribute('download', `converted_${file.name.split('.')[0]}.${format}`);
            
            // Display the converted image
            const img = new Image();
            img.onload = function() {
                converterCanvas.width = img.width;
                converterCanvas.height = img.height;
                const ctx = converterCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
            };
            img.src = url;
            return;
        } catch (err) {
            console.error('HEIC conversion failed:', err);
            alert('HEIC conversion failed. Please try another image.');
            return;
        }
    }
    
    // Regular conversion for other formats
    const reader = new FileReader();
    // ... (rest of your existing convertImage function)
}