const fs = require('fs');
let content = fs.readFileSync('src/layouts/Layout.astro', 'utf8');

const footerStart = content.indexOf('<footer');
const footerEnd = content.indexOf('</footer>') + 9;

if (footerStart !== -1 && footerEnd !== -1) {
    const newFooter = `<footer class="bg-gray-900 text-white py-12 border-t border-gray-800 font-sans">
    <div class="container mx-auto px-4 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-center lg:text-left">
            <!-- Konum -->
            <div>
                <h3 class="text-lg font-bold text-white mb-4 uppercase tracking-wider relative inline-block pb-2 border-b-2 border-primary">Konum</h3>
                <address class="not-italic mt-2">
                    <a href="https://maps.app.goo.gl/hVhqkTaVXen2EfRM9" target="_blank" class="text-gray-400 hover:text-primary transition-colors block leading-relaxed">
                        Ayvansaray Mahallesi Esnaf Loncası Sokak No:27, Fatih / İstanbul
                    </a>
                </address>
            </div>

            <!-- Kurumsal -->
            <div>
                <h3 class="text-lg font-bold text-white mb-4 uppercase tracking-wider relative inline-block pb-2 border-b-2 border-primary">Kurumsal</h3>
                <ul class="space-y-2">
                    <li><a href="/hakkimizda" class="text-gray-400 hover:text-primary transition-colors">Hakkımızda</a></li>
                    <li><a href="/sikca-sorulan-sorular" class="text-gray-400 hover:text-primary transition-colors">Sıkça Sorulan Sorular</a></li>
                    <li><a href="/blog" class="text-gray-400 hover:text-primary transition-colors">Blog / Faydalı Bilgiler</a></li>
                    <li><a href="/fiyat-listesi" class="text-gray-400 hover:text-primary transition-colors">Fiyat Listesi</a></li>
                    <li><a href="/kvkk-aydinlatma-metni" class="text-gray-400 hover:text-primary transition-colors">KVKK Aydınlatma Metni</a></li>
                    <li><a href="/gizlilik-ve-cerez-politikasi" class="text-gray-400 hover:text-primary transition-colors">Gizlilik ve Çerez Politikası</a></li>
                </ul>
            </div>

            <!-- Social Media -->
            <div>
                <h3 class="text-lg font-bold text-white mb-4 uppercase tracking-wider relative inline-block pb-2 border-b-2 border-primary">Bizi Takip Edin</h3>
                <div class="flex justify-center lg:justify-start space-x-3 mt-2">
                    <a href="https://tr.pinterest.com/amirbranda/" target="_blank" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                        <i class="fa-brands fa-pinterest text-lg"></i>
                    </a>
                    <a href="https://www.facebook.com/amirbrandacadirtente/" target="_blank" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                        <i class="fa-brands fa-facebook-f text-lg"></i>
                    </a>
                    <a href="https://www.instagram.com/branda.ist/" target="_blank" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300">
                        <i class="fa-brands fa-instagram text-lg"></i>
                    </a>
                    <a href="https://x.com/amirbrandaist" target="_blank" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-black hover:text-white transition-all duration-300">
                        <i class="fa-brands fa-twitter text-lg"></i>
                    </a>
                </div>
            </div>

            <!-- İletişim -->
            <div>
                <h3 class="text-lg font-bold text-white mb-4 uppercase tracking-wider relative inline-block pb-2 border-b-2 border-primary">İletişim</h3>
                <div class="space-y-2 text-gray-400">
                    <a href="mailto:amirbranda@hotmail.com" class="hover:text-primary transition-colors block">amirbranda@hotmail.com</a>
                    <a href="tel:+902125330891" class="hover:text-primary transition-colors block">0 212 533 08 91</a>
                    <a href="tel:+905386044851" class="hover:text-primary transition-colors block text-lg font-bold text-white mt-2">0 538 604 48 51</a>
                </div>
            </div>
        </div>

        <div class="border-t border-gray-800 pt-6 mt-6">
            <p class="text-center text-gray-500 text-sm">
                &copy; 2026 Amir Branda. Tüm Hakları Saklıdır.
            </p>
        </div>
    </div>
</footer>`;

    content = content.substring(0, footerStart) + newFooter + content.substring(footerEnd);
    fs.writeFileSync('src/layouts/Layout.astro', content, 'utf8');
    console.log('Footer updated successfully.');
} else {
    console.error('Could not find footer tags.');
}
