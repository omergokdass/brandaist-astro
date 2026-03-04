const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro'));

let modifiedCount = 0;

for (const file of files) {
    if (file === 'mafsalli-tente.astro') continue; // already modified manually

    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    const collageIndex = content.indexOf('class="collage effect-parent light-gallery"');
    if (collageIndex === -1) continue;

    // Find the start `<div class="wrapper light-wrapper">` before the collage
    let startWrapper = content.lastIndexOf('<div class="wrapper light-wrapper">', collageIndex);
    if (startWrapper === -1) continue;

    // Find the end by looking for `<!-- /.container -->` then `</div>`
    let containerEndIndex = content.indexOf('<!-- /.container -->', collageIndex);
    if (containerEndIndex === -1) continue;
    let endWrapper = content.indexOf('</div>', containerEndIndex) + 6;

    let blockToReplace = content.substring(startWrapper, endWrapper);

    // Extract images
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    const images = [];
    let match;
    while ((match = imgRegex.exec(blockToReplace)) !== null) {
        const fullTag = match[0];
        const altMatch = /alt="([^"]*)"/.exec(fullTag);
        const alt = altMatch ? altMatch[1] : '';
        images.push({ src: match[1], alt: alt.replace(/"/g, '\\"') });
    }

    if (images.length > 0) {
        let replacement = `<div class="wrapper light-wrapper">
                                <div class="container inner">
                                    <div class="mb-4">
                                        <h3 class="text-center mb-4">Uygulama Galerimiz</h3>
                                        <ModernGallery images={[
`;
        images.forEach((img, i) => {
            replacement += `                                            { src: "${img.src}", alt: "${img.alt}" }${i < images.length - 1 ? ',' : ''}\n`;
        });

        replacement += `                                        ]} />
                                    </div>
                                </div>
                                <!-- /.container -->
                            </div>`;

        content = content.replace(blockToReplace, replacement);
        updated = true;
    }

    if (updated) {
        // Add import statement safely just below the first `---`
        const importStatement = `import ModernGallery from '../components/ModernGallery.astro';`;
        if (!content.includes(importStatement)) {
            if (content.startsWith('---')) {
                content = content.replace('---', `---\n${importStatement}`);
            }
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file} with ${images.length} images.`);
        modifiedCount++;
    }
}

console.log(`\nAll done! Successfully converted ${modifiedCount} files to use ModernGallery.`);
