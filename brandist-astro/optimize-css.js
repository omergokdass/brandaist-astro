import { PurgeCSS } from 'purgecss';
import fs from 'fs';

async function optimizeCss() {
    console.log('🚀 CSS Purge Optimisation Starting...');
    const result = await new PurgeCSS().purge({
        content: ['dist/**/*.html', 'dist/**/*.js'],
        css: ['dist/style/css/plugins.css', 'dist/style/css/bootstrap.min.css', 'dist/style/css/style.css'],
        safelist: [
            /^nav-/, /^navbar-/, /^dropdown-/, // Menü yapıları
            /^tp-/, /^rs-/, /^rev_slider/, // Revolution Slider
            'active', 'show', 'open', 'collapsed', 'collapsing', 'fade', // JS etkileşim sınıfları
            /^fa-/, // Font Awesome ikonu başlangıç sınıfları
            /^mfp-/, // Magnific Popup (Lightbox)
            // Bootstrap grid and utilities that might be dynamically generated
            /^col-/, /^m-/, /^p-/, /^mt-/, /^mb-/, /^pt-/, /^pb-/, /^bg-/, /^text-/, /^d-/
        ]
    });

    let totalSaved = 0;

    for (const res of result) {
        if (!res.file) continue;
        const originalSize = fs.statSync(res.file).size;
        fs.writeFileSync(res.file, res.css);
        const newSize = Buffer.byteLength(res.css, 'utf8');

        const saved = originalSize - newSize;
        totalSaved += saved;

        console.log(`✅ Optimized ${res.file}: ${(originalSize / 1024).toFixed(2)} KB -> ${(newSize / 1024).toFixed(2)} KB (-${(saved / 1024).toFixed(2)} KB)`);
    }

    console.log(`🎉 CSS Optimization complete! Total saved: ${(totalSaved / 1024).toFixed(2)} KB`);
}

optimizeCss().catch(console.error);
