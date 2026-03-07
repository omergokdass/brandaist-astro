const fs = require('fs');
const path = require('path');

const dirs = [
    path.join(__dirname, 'src/pages'),
    path.join(__dirname, 'src/pages/blog')
];

let changedCount = 0;

function processFile(filePath) {
    if (!filePath.endsWith('.astro')) return;

    const excludes = ['urunler.astro', 'hizmetler.astro', 'hakkimizda.astro', 'fiyat-listesi.astro', 'iletisim.astro', 'sikca-sorulan-sorular.astro', 'index.astro', 'blog.astro', '404.astro', 'gizlilik-politikasi.astro', 'cerez-politikasi.astro', 'kvkk.astro'];
    const fileName = path.basename(filePath);

    if (excludes.includes(fileName)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Fix H1 title -> remove link, apply Tailwind classes
    // Pattern 1: Title with <a> tag
    content = content.replace(/<h1 class="post-title text-center">\s*<a href="#" name="PAGE" id="page">(.*?)<\/a>\s*<\/h1>/gs, '<h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center" id="page">$1</h1>');

    // Pattern 2: Title with id="page" inside the tag without <a>
    content = content.replace(/<h1 class="post-title text-center"[^>]*>\s*(.*?)\s*<\/h1>/gs, '<h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center" id="page">$1</h1>');

    // Fix Cover Image
    // Find figure with img
    content = content.replace(/<figure class="mb-25">\s*<img\s*class="w-100 img-fluid rounded mb-3 shadow-sm"\s*style="max-height: 480px; object-fit: cover;"\s*src="(.*?)"\s*alt="(.*?)"\s*loading="lazy"\s*\/>\s*<\/figure>/gs, `<figure class="mb-8 overflow-hidden rounded-2xl shadow-sm border border-gray-100">
            <img
                class="w-full h-auto object-cover aspect-[16/9]"
                src="$1"
                alt="$2"
                loading="lazy"
            />
        </figure>`);

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        changedCount++;
        console.log('Updated:', fileName);
    }
}

dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isFile()) {
                processFile(fullPath);
            }
        });
    }
});

console.log('Total files updated:', changedCount);
