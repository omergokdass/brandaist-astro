const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const filesToFix = [
    'bioklimatik-tente.astro', 'balkon-tentesi.astro', 'bahce-tentesi.astro',
    'alan-kapama-sistemleri.astro', 'pvc-branda.astro', 'zip-tente.astro',
    'tir-brandasi.astro', 'stor-tente.astro'
];

function getClosingDivIndex(html, startIndex) {
    let depth = 0;
    let i = startIndex;
    while (i < html.length) {
        if (html.startsWith('<div', i)) {
            depth++;
            i += 4;
        } else if (html.startsWith('</div', i)) {
            depth--;
            if (depth === 0) return i + 6; // '</div>'.length
            i += 5;
        } else {
            i++;
        }
    }
    return -1;
}

let modifiedCount = 0;

for (const file of filesToFix) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    const collageIndex = content.indexOf('class="collage effect-parent light-gallery"');
    if (collageIndex === -1) continue;

    let startWrapper = content.lastIndexOf('<div class="wrapper light-wrapper">', collageIndex);
    if (startWrapper === -1) {
        startWrapper = content.lastIndexOf('<div class="wrapper light-wrapper"', collageIndex);
    }

    let endWrapper = getClosingDivIndex(content, startWrapper);
    if (endWrapper === -1) continue;

    let blockToReplace = content.substring(startWrapper, endWrapper);

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
            `</div>`;

        content = content.replace(blockToReplace, replacement);

        const importStatement = `import ModernGallery from '../components/ModernGallery.astro';`;
        if (!content.includes('import ModernGallery')) {
            if (content.startsWith('---')) {
                content = content.replace('---', `---\n${importStatement}`);
            }
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file} with ${images.length} images.`);
        modifiedCount++;
    } else {
        // Empty gallery
        content = content.replace(blockToReplace, '');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Removed empty gallery from ${file}`);
        modifiedCount++;
    }
}

console.log(`All done! Processed ${modifiedCount} remaining files.`);
