// Advanced Filters
const filtersInput = document.getElementById('filters-input');
const applyFiltersBtn = document.getElementById('apply-filters-btn');
const filtersCanvas = document.getElementById('filters-canvas');
const filtersDownload = document.getElementById('filters-download');

applyFiltersBtn.addEventListener('click', applyAdvancedFilters);

function applyAdvancedFilters() {
    if (!filtersInput.files[0]) {
        alert('Please select an image first');
        return;
    }

    const file = filtersInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            filtersCanvas.width = img.width;
            filtersCanvas.height = img.height;
            const ctx = filtersCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Apply filters
            const brightness = parseInt(document.getElementById('brightness').value);
            const contrast = parseInt(document.getElementById('contrast').value);
            const saturation = parseInt(document.getElementById('saturation').value);
            const sharpness = parseInt(document.getElementById('sharpness').value);
            const enhanceQuality = document.getElementById('enhance-toggle').checked;
            
            const imageData = ctx.getImageData(0, 0, filtersCanvas.width, filtersCanvas.height);
            const data = imageData.data;
            
            // Apply brightness, contrast, saturation
            for (let i = 0; i < data.length; i += 4) {
                // Brightness
                data[i] += brightness * 2.55;
                data[i+1] += brightness * 2.55;
                data[i+2] += brightness * 2.55;
                
                // Contrast
                const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
                data[i] = factor * (data[i] - 128) + 128;
                data[i+1] = factor * (data[i+1] - 128) + 128;
                data[i+2] = factor * (data[i+2] - 128) + 128;
                
                // Saturation (simplified)
                const gray = 0.2989 * data[i] + 0.5870 * data[i+1] + 0.1140 * data[i+2];
                data[i] = gray + (data[i] - gray) * (saturation + 100) / 100;
                data[i+1] = gray + (data[i+1] - gray) * (saturation + 100) / 100;
                data[i+2] = gray + (data[i+2] - gray) * (saturation + 100) / 100;
            }
            
            ctx.putImageData(imageData, 0, 0);
            
            // Apply sharpness (simplified unsharp mask)
            if (sharpness > 0) {
                ctx.filter = `blur(${(100 - sharpness) / 500}px)`;
                ctx.drawImage(filtersCanvas, 0, 0);
                ctx.filter = 'none';
            }
            
            // Quality enhancement (simplified)
            if (enhanceQuality) {
                ctx.globalCompositeOperation = 'overlay';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fillRect(0, 0, filtersCanvas.width, filtersCanvas.height);
                ctx.globalCompositeOperation = 'source-over';
            }
            
            // Set download link
            filtersDownload.href = filtersCanvas.toDataURL('image/jpeg', 0.9);
            filtersDownload.setAttribute('download', `enhanced_${file.name.split('.')[0]}.jpg`);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}