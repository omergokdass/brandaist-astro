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

    // We check for the old gallery class
    const collageIndex = content.indexOf('class="collage effect-parent light-gallery"');
    if (collageIndex === -1) continue; // no old gallery

    // Find the starting div wrapper
    let startWrapper = content.lastIndexOf('<div class="wrapper light-wrapper">', collageIndex);
    if (startWrapper === -1) {
        startWrapper = content.lastIndexOf('<div class="wrapper light-wrapper"', collageIndex);
        if (startWrapper === -1) continue;
    }

    // Find the ending div wrapper
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
        let replacement = `<div class="wrapper light-wrapper">\n` +
            `    <div class="container inner">\n` +
            `        <div class="mb-4">\n` +
            `            <h3 class="text-center mb-4">Uygulama Galerimiz</h3>\n` +
            `            <ModernGallery images={[\n`;

        images.forEach((img, i) => {
            replacement += `                { src: "${img.src}", alt: "${img.alt}" }${i < images.length - 1 ? ',' : ''}\n`;
        });

        replacement += `            ]} />\n` +
            `        </div>\n` +
            `    </div>\n` +
            `    <!-- /.container -->\n` +
            `</div>`;

        content = content.replace(blockToReplace, replacement);
        updated = true;
    }

    if (updated) {
        // Add import statement safely to the frontmatter
        const importStatement = `import ModernGallery from '../components/ModernGallery.astro';`;
        if (!content.includes('import ModernGallery')) {
            // Usually Astro pages start with ---
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
