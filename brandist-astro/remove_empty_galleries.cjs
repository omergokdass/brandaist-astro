const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro'));

let modifiedCount = 0;

for (const file of files) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // We check for the old gallery class
    const collageIndex = content.indexOf('class="collage effect-parent light-gallery"');
    if (collageIndex === -1) continue;

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

    // If there are NO images in this block, we should completely remove it.
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    let match = imgRegex.exec(blockToReplace);

    if (!match) {
        // No images found, this is an empty gallery template. Remove it entirely.
        content = content.replace(blockToReplace, '');
        updated = true;
    }

    if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Removed empty gallery from ${file}`);
        modifiedCount++;
    }
}

console.log(`\nAll done! Successfully removed empty galleries from ${modifiedCount} files.`);
