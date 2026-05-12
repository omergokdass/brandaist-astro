# Branda.ist - Kurumsal Web Sitesi

Bu proje, **Branda.ist** markası için geliştirilmiş, hızlı, SEO uyumlu ve modern bir kurumsal web sitesi projesidir. Proje [Astro](https://astro.build/) framework'ü kullanılarak statik site üretimi (SSG) temelinde inşa edilmiştir.

## 🚀 Teknolojiler ve Araçlar

Projenin altyapısını oluşturan bazı temel yazılımlar:
- **[Astro](https://astro.build/):** Yüksek performanslı statik sayfalar, sayfa yönlendirmeleri ve temiz mimari.
- **TypeScript:** Bileşenlerde ve script'lerde tip güvenliği sağlanarak hatalara karşı daha temiz bir geliştirme deneyimi.
- **Sharp:** Görsel optimizasyonları ve resim biçimlendirmeleri.
- **PurgeCSS & Terser:** Gereksiz CSS kodlarını ayıklama ve JavaScript dosyalarını sıkıştırarak site hızını artırma.
- **@astrojs/sitemap:** Otomatik sitemap oluşturma ve temel SEO süreçleri.

## 📁 Proje Yapısı

Kök kütüklüğün içerisinde ana Astro projesi `brandist-astro/` dizininde bulunmaktadır:

```text
brandist-astro/
├── public/         # İşlenmeyecek statik varlıklar (resimler, fontlar, favicon vb.)
├── src/
│   ├── components/ # Yeniden kullanılabilir Astro bileşenleri (Navbar, Sidebar, HeroSection vb.)
│   └── pages/      # Route yapısını oluşturan ana alt sayfalar (ör: mafsalli-tente.astro, depo-cadiri.astro)
├── astro.config.mjs# Astro framework yapılandırma dosyası
└── package.json    # Proje bağımlılıkları ve komut dosyaları
```

## 🛠️ Kurulum ve Çalıştırma

Projeyi bilgisayarınızda yerel olarak (localhost) çalıştırmak için aşağıdaki adımları sırayla izleyebilirsiniz:

1. **İlgili Klasöre Geçin:**  
   Projeniz `brandist-astro` alt klosöründe yer almaktadır, önce bu klasöre geçiş yapmalısınız:
   ```bash
   cd brandist-astro
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```
   *Tarayıcınızda [http://localhost:4321](http://localhost:4321) adresine giderek siteyi canlı geliştirme modunda görüntüleyebilirsiniz.*

4. **Üretime Hazır Hale Getirin (Build):**
   ```bash
   npm run build
   ```
   *Bu komut, statik dosyaları `dist/` klasörüne oluşturur. Ayrıca post-build komutlarıyla CSS optimizasyonları (optimize-css.js) uygulanır.*

5. **Üretim Sürümünü Önizleyin:**
   ```bash
   npm run preview
   ```

## 📝 İçerik ve SEO (Sayfalar)

Proje, ağırlıklı olarak tente, branda, alan kapama, çadır ile kış bahçesi sistemleri gibi ürün hizmetlerinin tanıtımını içerir. Site genelinden bazı önemli hizmet sayfaları:
- **Tente Sistemleri:** `mafsalli-tente.astro`, `pergola-tente.astro`, `bioklimatik-tente.astro`, `karpuz-tente.astro` vb.
- **Çadır ve Branda Sistemleri:** `depo-cadiri.astro`, `şeffaf-branda.astro`, `otopark-brandasi.astro`, `afet-deprem-cadiri.astro` vb.
- **SEO & Blog Odaklı Sayfalar:** Sıkça sorulan sorular, blog yazıları, bilgilendirme sayfaları (örn: "kış bahçesi ruhsat gerektirir mi?", "akrilik mi polyester mi seçilmeli?"). Tüm bu sayfalar, web sitesine organik trafik çekmeye yönelik optimize edilmiştir.
