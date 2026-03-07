import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'src', 'pages', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace layout specific structural classes with Tailwind Typography
    content = content.replace(/<article class="post">/g, '<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg prose-blue">');
    content = content.replace(/<div class="post-content">/g, '<div>');
    content = content.replace(/<div class="seo-content">/g, '<div>');

    // Clean up title
    content = content.replace(/<h1 class="post-title text-center" id="page">/g, '<h1 id="page" class="text-3xl md:text-4xl font-extrabold text-center mb-10 text-gray-900 leading-tight">');

    // Clean up figures
    content = content.replace(/<figure class="mb-25">/g, '<figure class="mb-10 overflow-hidden rounded-3xl shadow-lg border border-gray-100">');
    content = content.replace(/<figure class="mb-5">/g, '<figure class="mb-10 overflow-hidden rounded-3xl shadow-lg border border-gray-100">');

    // Clean up images
    content = content.replace(/class="w-100 img-fluid rounded mb-3 shadow-sm"/g, 'class="w-full h-auto aspect-video object-cover hover:scale-105 transition-transform duration-700 m-0"');
    content = content.replace(/class="w-100 img-fluid rounded mb-3"/g, 'class="w-full h-auto aspect-video object-cover hover:scale-105 transition-transform duration-700 m-0"');

    // Clean up typography links
    content = content.replace(/class="text-primary font-weight-bold"/g, 'class="text-primary font-bold hover:underline"');
    content = content.replace(/class="bg-light p-3 rounded mb-4 shadow-sm"/g, 'class="bg-gray-50 p-6 rounded-2xl mb-8 shadow-sm border border-gray-100"');

    fs.writeFileSync(filePath, content);
    console.log('Processed:', file);
}
console.log('Finished processing blog files.');
