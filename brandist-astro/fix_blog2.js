import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, 'src', 'pages', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro'));

for (const file of files) {
    if (file === 'mafsalli-ile-kasetli-tente-farklari.astro') continue; // Already good

    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Replace Layout with PageLayout
    content = content.replace(/import Layout from "\.\.\/\.\.\/layouts\/Layout\.astro";/, 'import PageLayout from "../../layouts/PageLayout.astro";');
    content = content.replace(/<Layout/g, '<PageLayout');
    content = content.replace(/<\/Layout>/g, '</PageLayout>');

    // 2. Add headerTitle to PageLayout props based on ogTitle or title
    let ogTitleMatch = content.match(/ogTitle="([^"]+)"/);
    let headerTitle = "Blog & Rehber";
    if (ogTitleMatch && ogTitleMatch.length > 1) {
        headerTitle = ogTitleMatch[1].replace(' | Amir Branda Blog', '').replace(' | Amir Branda', '');
    }
    if (!content.includes('headerTitle=')) {
        content = content.replace(/ogTitle="([^"]+)"/, `ogTitle="$1"\n    headerTitle="${headerTitle}"\n    headerTitleTag="h1"\n    headerBgImage="/style/brand/img/kategori-arkasi-pp.webp"\n    hideSidebar={true}`);
    }

    // 3. Replace the top wrappers with <article>
    const articleStart = '<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg prose-blue">';
    // Match the standard wrapper
    content = content.replace(/<div\s*class="wrapper image-wrapper bg-image inverse-text"[\s\S]*?<div class="blog single-view">\s*<div class="post">\s*(<div>)?/i, articleStart);
    // Match the classic view wrapper
    content = content.replace(/<div\s*class="wrapper image-wrapper bg-image inverse-text"[\s\S]*?<div class="blog classic-view">\s*<div class="post">/i, articleStart);

    // 4. Replace the bottom wrappers
    content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<aside class="col-md-3 sidebar">[\s\S]*?<\/aside>\s*<\/div>\s*<\/div>\s*<\/div>/i, '</article>');
    content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/i, '</article>');

    // 5. Title fixing
    content = content.replace(/<h2 class="h3 mb-3">/g, '<h1 id="page" class="text-3xl md:text-4xl font-extrabold text-center mb-10 text-gray-900 leading-tight">');
    content = content.replace(/<h1 class="post-title text-center">\s*<a href="#" name="PAGE" id="page"\s*>/g, '<h1 id="page" class="text-3xl md:text-4xl font-extrabold text-center mb-10 text-gray-900 leading-tight">');
    content = content.replace(/<\/a>\s*<\/h1>/g, '</h1>');

    // 6. Image and Figure fixing
    content = content.replace(/<figure class="mb-10 overflow-hidden rounded-3xl shadow-lg border border-gray-100">/g, '<figure class="mb-10 overflow-hidden rounded-3xl shadow-lg border border-gray-100">'); // Already kinda handled before, but let's standard
    // Remove inline styles in images
    content = content.replace(/style="width: 100%; max-width: 800px; height: auto; object-fit: cover;"/g, '');
    content = content.replace(/class="img-fluid rounded shadow-sm"/g, 'class="w-full h-auto aspect-video object-cover hover:scale-105 transition-transform duration-700 m-0"');

    // 7. General fixes
    content = content.replace(/<ul class="icon-list bullet-default mb-20">/g, '<ul>');
    content = content.replace(/<ul class="icon-list bullet-primary">/g, '<ul>');
    content = content.replace(/<h3 class="h4 mt-4 mb-2">/g, '<h3>');

    fs.writeFileSync(filePath, content);
    console.log('Processed', file);
}
console.log('All remaining blog files updated');
