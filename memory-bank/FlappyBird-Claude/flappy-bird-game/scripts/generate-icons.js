const fs = require('fs');
const path = require('path');

// Since we can't use external packages, let's create a simple HTML file
// that will help us manually generate the icons

const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Icon Generator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f0f0f0;
        }
        .icon-container {
            margin: 20px 0;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        canvas {
            border: 1px solid #ddd;
            display: block;
            margin: 10px 0;
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover {
            background: #45a049;
        }
    </style>
</head>
<body>
    <h1>Flappy Bird Icon Generator</h1>
    <p>Click the buttons below to download icons in different sizes:</p>
    
    <div class="icon-container">
        <h3>Icon Preview</h3>
        <img id="svgPreview" src="/bird-icon.svg" width="256" height="256" />
    </div>
    
    <div class="icon-container">
        <h3>Generate Icons</h3>
        <canvas id="canvas" style="display: none;"></canvas>
        <button onclick="generateIcon(16)">Download favicon.ico (16x16)</button>
        <button onclick="generateIcon(32)">Download favicon-32.png (32x32)</button>
        <button onclick="generateIcon(192)">Download icon-192.png (192x192)</button>
        <button onclick="generateIcon(512)">Download icon-512.png (512x512)</button>
        <button onclick="generateIcon(180)">Download apple-icon.png (180x180)</button>
    </div>
    
    <script>
        function generateIcon(size) {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = size;
            canvas.height = size;
            
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0, size, size);
                
                canvas.toBlob(function(blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    
                    if (size === 16) {
                        a.download = 'favicon.ico';
                    } else if (size === 32) {
                        a.download = 'favicon-32.png';
                    } else if (size === 192) {
                        a.download = 'icon-192.png';
                    } else if (size === 512) {
                        a.download = 'icon-512.png';
                    } else if (size === 180) {
                        a.download = 'apple-icon.png';
                    }
                    
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                });
            };
            img.src = '/bird-icon.svg';
        }
    </script>
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync(path.join(__dirname, '..', 'public', 'icon-generator.html'), html);

console.log('Icon generator created! To generate icons:');
console.log('1. Make sure the dev server is running');
console.log('2. Open http://localhost:3000/icon-generator.html');
console.log('3. Click each button to download the icons');
console.log('4. Move the downloaded files to the public folder');
console.log('5. Delete icon-generator.html when done'); 