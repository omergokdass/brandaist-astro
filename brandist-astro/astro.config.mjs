import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://branda.ist',
    trailingSlash: 'ignore',
    build: {
        format: 'directory',
    },
    integrations: [sitemap()],
    redirects: {
        // --- 1. WordPress ve Eski Tesisat Kalıntıları ---
        '/elementor-2359': '/',
        '/wp-content/plugins/litespeed-cache/guest.vary.php': '/',

        // --- 2. Eski HTML Uzantılı Sayfalar (Canonical Duplicate Çözümleri) ---
        '/products.html': '/urunler',
        '/iletisim/urunler.html': '/urunler',
        '/hakkimizda/iletisim.html': '/iletisim',
        '/iletisim.html': '/iletisim',
        '/iletisim/hakkimizda.html': '/hakkimizda',
        '/hakkimizda.html': '/hakkimizda',
        '/hizmetler.html': '/hizmetler',
        // '/index.html': '/', // Astro build'de EEXIST hatası veriyor, _redirects dosyasında yönetilecek

        // --- 3. Eski Linki Değişen Sayfalar (Adres Değişikliği) ---
        '/fabrika-bolmeleri-kapilari': '/bolme-ve-kapi-brandasi',
        '/endustriyel-cadirlar': '/endustriyel-cadir',
        '/pergola-motorlu-tente': '/pergola-tente',
        '/hali-saha-cadiri': '/halisaha-spor-cadiri',
        '/ceset-torbasi-brandasi': '/urunler',

        // --- 4. Klasöre Taşınan Blog Yazıları ---
        '/kis-bahcesi-icin-seffaf-branda-secimi': '/blog/kis-bahcesi-icin-seffaf-branda-secimi',
        '/depo-cadiri-alirken-dikkat-edilmesi-gerekenler': '/blog/depo-cadiri-alirken-dikkat-edilmesi-gerekenler',
        '/kis-bahcesi-ruhsat-gerektirir-mi': '/blog/kis-bahcesi-ruhsat-gerektirir-mi',
        '/mafsalli-ile-kasetli-tente-farklari': '/blog/mafsalli-ile-kasetli-tente-farklari',
        '/motorlu-tente-arizalari-ve-cozumleri': '/blog/motorlu-tente-arizalari-ve-cozumleri',
        '/akrilik-mi-polyester-mi-secmeli': '/blog/akrilik-mi-polyester-mi-secmeli',
        '/depo-cadiri-nedir': '/blog/depo-cadiri-nedir'
    }
});
