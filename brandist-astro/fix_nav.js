const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.astro', 'utf8');

// Replace Branda desktop button
content = content.replace(
    /<button\n\s*class="flex items-center text-white hover:text-primary px-3 py-2 text-sm xl:text-base font-bold transition-colors"\n\s*>\n\s*BRANDA <svg([\s\S]*?)<\/svg>\n\s*<\/button>/g,
    '<a\n                        href="/branda"\n                        class="flex items-center text-white hover:text-primary px-3 py-2 text-sm xl:text-base font-bold transition-colors"\n                    >\n                        BRANDA <svg$1</svg>\n                    </a>'
);

// Replace Çadır desktop button
content = content.replace(
    /<button\n\s*class="flex items-center text-white hover:text-primary px-3 py-2 text-sm xl:text-base font-bold transition-colors"\n\s*>\n\s*ÇADIR <svg([\s\S]*?)<\/svg>\n\s*<\/button>/g,
    '<a\n                        href="/cadir"\n                        class="flex items-center text-white hover:text-primary px-3 py-2 text-sm xl:text-base font-bold transition-colors"\n                    >\n                        ÇADIR <svg$1</svg>\n                    </a>'
);

// Replace Tente desktop button
content = content.replace(
    /<button\n\s*class="flex items-center text-white hover:text-primary px-3 py-2 text-sm xl:text-base font-bold transition-colors"\n\s*>\n\s*TENTE <svg([\s\S]*?)<\/svg>\n\s*<\/button>/g,
    '<a\n                        href="/tente"\n                        class="flex items-center text-white hover:text-primary px-3 py-2 text-sm xl:text-base font-bold transition-colors"\n                    >\n                        TENTE <svg$1</svg>\n                    </a>'
);

// Replace mobile buttons
function replaceMobile(content, title, href, targetId) {
    const rx = new RegExp(
        '<button\\n\\s*class="w-full flex justify-between items-center px-4 py-3 rounded-lg text-lg font-bold text-white hover:bg-gray-800 transition-colors"\\n\\s*data-toggle="' + targetId + '"\\n\\s*>\\n\\s*' + title + '\\n\\s*<svg([\\s\\S]*?)<\\/svg>\\n\\s*<\\/button>', 'g'
    );
    const replacement =
        '<div class="w-full flex justify-between items-center rounded-lg text-white hover:bg-gray-800 transition-colors">\n' +
        '                    <a href="' + href + '" class="flex-grow px-4 py-3 text-lg font-bold">' + title + '</a>\n' +
        '                    <button class="px-4 py-3" data-toggle="' + targetId + '" aria-label="Menüyü aç/kapat">\n' +
        '                        <svg$1</svg>\n' +
        '                    </button>\n' +
        '                </div>';
    return content.replace(rx, replacement);
}

content = replaceMobile(content, 'Branda', '/branda', 'mobile-branda');
content = replaceMobile(content, 'Çadır', '/cadir', 'mobile-cadir');
content = replaceMobile(content, 'Tente', '/tente', 'mobile-tente');

fs.writeFileSync('src/components/Navbar.astro', content);
console.log('done!');
