const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '../../brand.ist/Pages');
const targetDir = path.resolve(__dirname, '../src/pages');

// Folders to migrate
const foldersToMigrate = ['tente', 'cadir', 'branda', 'kumas-turleri'];

function migrateFile(filePath, targetPath) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Remove Razor directives
    content = content.replace(/^@page[\s\S]*?@{[\s\S]*?}/m, '').trim();
    content = content.replace(/@Html\.AntiForgeryToken\(\)/g, '');

    // Extract a title from the first h1
    let title = "Brand.ist";
    const titleMatch = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (titleMatch && titleMatch[1]) {
        // Simple strip string from tags
        title = titleMatch[1].replace(/<[^>]*>?/gm, '').trim();
    }

    // Wrap in Astro Layout
    // Calculate relative path for Layout
    const relDepth = path.relative(targetDir, path.dirname(targetPath)).split(path.sep).length;
    const layoutPath = '../'.repeat(relDepth) + 'layouts/Layout.astro';

    const astroContent = `---
import Layout from '${layoutPath}';
---

<Layout title="${title}">
${content}
</Layout>
`;

    // Write to target
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, astroContent, 'utf-8');
    console.log(`Migrated: ${filePath} -> ${targetPath}`);
}

foldersToMigrate.forEach(folder => {
    const folderPath = path.join(sourceDir, folder);
    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        files.forEach(file => {
            if (file.endsWith('.cshtml') && !file.includes('.cs.')) {
                // E.g. bioklimatik-tente.cshtml
                const filePath = path.join(folderPath, file);
                const astroFile = file.replace('.cshtml', '.astro');
                const targetFilePath = path.join(targetDir, folder, astroFile);
                migrateFile(filePath, targetFilePath);
            }
        });
    } else {
        console.warn(`Folder not found: ${folderPath}`);
    }
});

console.log('Migration complete!');
