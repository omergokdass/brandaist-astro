import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, 'src', 'pages', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro'));

for (const file of files) {
    if (file === 'mafsalli-ile-kasetli-tente-farklari.astro') continue;

    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix the closing tags mismatch (e.g., <h1 ...> ... </h2>)
    content = content.replace(/<h1([^>]*)>([\s\S]*?)<\/h2>/g, '<h1$1>$2</h1>');

    fs.writeFileSync(filePath, content);
    console.log('Fixed syntax in', file);
}
