const fs = require('fs');
let content = fs.readFileSync('src/pages/fiyat-listesi.astro', 'utf8');

const frontmatterAdd = `---
import Layout from "../layouts/Layout.astro";
const currentYear = new Date().getFullYear();

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Tente ve branda fiyatlarına montaj dahil mi?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Evet, Amir Branda olarak İstanbul içi sunduğumuz tüm tente, kış bahçesi ve depo çadırı fiyat tekliflerimize nakliye ve uzman ekibimiz tarafından yapılan anahtar teslim montaj işlemi dahildir."
      }
    },
    {
      "@type": "Question",
      "name": "Ücretsiz keşif hizmetiniz var mı?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kesinlikle! Projenizin büyüklüğü ne olursa olsun, mekanınızı yerinde incelemek, ölçü almak ve size en uygun branda sistemini önermek için ücretsiz keşif hizmeti sunuyoruz."
      }
    },
    {
      "@type": "Question",
      "name": "M2 (Metrekare) fiyatı kumaş türüne göre ne kadar fark eder?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kumaş seçimi fiyatı doğrudan etkiler. Ekonomik bir branda m2 başına daha uygunken, 10 yıl solmazlık garantili Avrupa akrilik kumaşlar m2 başına daha yüksek bir fiyata sahiptir."
      }
    },
    {
      "@type": "Question",
      "name": "Sipariş verildikten sonra teslimat süresi nedir?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standart ürünlerde teslimat süremiz 3-5 iş günüdür. Kış bahçesi veya pergola gibi büyük projelerin imalatı ise 1-2 hafta arasında tamamlanmaktadır."
      }
    }
  ]
};
---

<Layout
    title="Amir Branda | En Ucuz Tente ve Branda Fiyat Listesi 2026"
    description="Amir Branda 2026 güncel kampanya ve fiyat listesi. İstanbul'da en uygun şeffaf branda m2 fiyatları, indirimli mafsallı tente ve ucuz çadır fiyat hesaplama."
    ogTitle="Amir Branda | En Ucuz Tente ve Branda Fiyat Listesi 2026"
    faqSchema={JSON.stringify(faqData)}
>`;

// Replace frontmatter
content = content.replace(/---\r?\nimport Layout from "\.\.\/layouts\/Layout\.astro";\r?\nconst currentYear = new Date\(\)\.getFullYear\(\);\r?\n---\r?\n\r?\n<Layout\r?\n    title="Amir Branda \| En Ucuz Tente ve Branda Fiyat Listesi 2026"\r?\n    description="Amir Branda 2026 güncel kampanya ve fiyat listesi\. İstanbul'da en uygun şeffaf branda m2 fiyatları, indirimli mafsallı tente ve ucuz çadır fiyat hesaplama\."\r?\n    ogTitle="Amir Branda \| En Ucuz Tente ve Branda Fiyat Listesi 2026"\r?\n>/g, frontmatterAdd);

// Fix "10x10" spam keyword leftovers in the table
content = content.replace(/title="10x10 Branda Çadır Fiyatları"/g, 'title="Büyük Ebat Çadır Fiyatları"');
content = content.replace(/>10x10 Branda Çadır \(Özel Ölçü\)</g, '>Büyük Ebat Endüstriyel Çadır<');

// Replace grid with FAQ
const gridIndex = content.indexOf('<!-- Grid Header -->');
if(gridIndex !== -1) {
    content = content.substring(0, gridIndex);
    const faqSection = `            <!-- Fiyat Hesaplama Rehberi -->
            <div class="max-w-4xl mx-auto mb-20 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                    Tente ve Branda M² Fiyatı Nasıl Hesaplanır?
                </h3>
                <div class="prose prose-lg text-gray-600 max-w-none">
                    <p class="mb-4">
                        Piyasadaki birçok firma standart ölçüler üzerinden paket fiyat sunsa da, profesyonel bir gölgelendirme sisteminin maliyeti tamamen mekanınızın ihtiyaçlarına göre şekillenir. Fiyatlandırılırken 3 ana unsur göz önünde bulundurulur:
                    </p>
                    <ul class="space-y-4 mb-6">
                        <li class="flex items-start">
                            <i class="fa-solid fa-check text-primary mt-1 mr-3"></i>
                            <div>
                                <strong class="text-gray-900">Kullanılan Kumaşın Kalitesi:</strong> 
                                Ekonomik çözümler için polyester veya pilsa kumaşlar tercih edilirken, uzun ömürlü, solmaz ve su kaydırıcı özellik aranan projelerde ithal akrilik veya <em>blackout</em> kumaşlar kullanılır. Kumaş türü m² fiyatını doğrudan değiştirir.
                            </div>
                        </li>
                        <li class="flex items-start">
                            <i class="fa-solid fa-check text-primary mt-1 mr-3"></i>
                            <div>
                                <strong class="text-gray-900">Mekanizma ve İskelet Yapısı:</strong> 
                                Basit bir manuel (çevirmeli) mafsallı tente ile Somfy motorlu, LED aydınlatmalı ve alüminyum panelli bir bioklimatik sistemin iskelet maliyeti aynı değildir.
                            </div>
                        </li>
                        <li class="flex items-start">
                            <i class="fa-solid fa-check text-primary mt-1 mr-3"></i>
                            <div>
                                <strong class="text-gray-900">Fire Payı ve Montaj Zorluğu:</strong> 
                                Asimetrik alanlarda kumaşın fire verme oranı artar. Ayrıca yüksek katlı teraslar veya vince ihtiyaç duyulan alanlarda montaj işçiliği fiyata yansıyabilir.
                            </div>
                        </li>
                    </ul>
                    <p class="font-bold text-gray-900 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        Amir Branda olarak, sürpriz maliyetleri önlemek adına projenizi yerinde inceliyor, en verimli malzeme kombinasyonunu çıkararak şeffaf bir fiyat teklifi sunuyoruz.
                    </p>
                </div>
            </div>

            <!-- Sıkça Sorulan Sorular (SSS) -->
            <div class="max-w-4xl mx-auto mb-20">
                <div class="text-center mb-10">
                    <h3 class="text-3xl font-bold text-gray-900 tracking-tight">Sıkça Sorulan Sorular</h3>
                    <hr class="w-16 mx-auto mt-4 mb-2 border-t-4 border-primary rounded-full" />
                </div>
                
                <div class="space-y-4">
                    <details class="group bg-white rounded-2xl border border-gray-100 shadow-sm open:shadow-md transition-all">
                        <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg text-gray-900">
                            <span class="font-bold">Tente ve branda fiyatlarına montaj dahil mi?</span>
                            <span class="transition group-open:rotate-180 text-primary">
                                <i class="fa-solid fa-chevron-down"></i>
                            </span>
                        </summary>
                        <div class="text-gray-600 px-6 pb-6 pt-2 leading-relaxed border-t border-gray-50 mt-2">
                            Evet, Amir Branda olarak İstanbul içi sunduğumuz tüm tente, kış bahçesi ve depo çadırı fiyat tekliflerimize nakliye ve uzman ekibimiz tarafından yapılan anahtar teslim montaj işlemi dahildir. Şehir dışı projeler için nakliye ayrıca değerlendirilir.
                        </div>
                    </details>

                    <details class="group bg-white rounded-2xl border border-gray-100 shadow-sm open:shadow-md transition-all">
                        <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg text-gray-900">
                            <span class="font-bold">Ücretsiz keşif hizmetiniz var mı?</span>
                            <span class="transition group-open:rotate-180 text-primary">
                                <i class="fa-solid fa-chevron-down"></i>
                            </span>
                        </summary>
                        <div class="text-gray-600 px-6 pb-6 pt-2 leading-relaxed border-t border-gray-50 mt-2">
                            Kesinlikle! Projenizin büyüklüğü ne olursa olsun, mekanınızı yerinde incelemek, ölçü almak ve size en uygun branda sistemini önermek için ücretsiz keşif hizmeti sunuyoruz.
                        </div>
                    </details>

                    <details class="group bg-white rounded-2xl border border-gray-100 shadow-sm open:shadow-md transition-all">
                        <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg text-gray-900">
                            <span class="font-bold">M2 (Metrekare) fiyatı kumaş türüne göre ne kadar fark eder?</span>
                            <span class="transition group-open:rotate-180 text-primary">
                                <i class="fa-solid fa-chevron-down"></i>
                            </span>
                        </summary>
                        <div class="text-gray-600 px-6 pb-6 pt-2 leading-relaxed border-t border-gray-50 mt-2">
                            Kumaş seçimi fiyatı doğrudan etkiler. Ekonomik bir branda m2 başına daha uygunken, 10 yıl solmazlık garantili Avrupa akrilik kumaşlar m2 başına daha yüksek bir fiyata sahiptir.
                        </div>
                    </details>
                    
                    <details class="group bg-white rounded-2xl border border-gray-100 shadow-sm open:shadow-md transition-all">
                        <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg text-gray-900">
                            <span class="font-bold">Sipariş verildikten sonra teslimat süresi nedir?</span>
                            <span class="transition group-open:rotate-180 text-primary">
                                <i class="fa-solid fa-chevron-down"></i>
                            </span>
                        </summary>
                        <div class="text-gray-600 px-6 pb-6 pt-2 leading-relaxed border-t border-gray-50 mt-2">
                            Standart ürünlerde teslimat süremiz 3-5 iş günüdür. Kış bahçesi veya pergola gibi büyük projelerin imalatı ise 1-2 hafta arasında tamamlanmaktadır.
                        </div>
                    </details>
                </div>
            </div>

            <!-- Call to Action Banner -->
            <div class="max-w-4xl mx-auto mt-16 relative overflow-hidden rounded-3xl shadow-2xl bg-slate-900 mb-20">
                <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary/20 to-slate-800"></div>
                <div class="relative z-10 p-10 md:p-14 text-center">
                    <h4 class="text-3xl font-bold text-white mb-6">Net Fiyat Almak İçin Beklemeyin</h4>
                    <p class="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">Uzman ekibimiz alanınızı incelesin, ihtiyaçlarınızı dinlesin ve bütçenizi sarsmayacak en kaliteli çözümü anında projelendirsin.</p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="tel:+905386044851" class="inline-flex items-center justify-center bg-primary text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-500 hover:-translate-y-1 transition-all">
                            Hemen Ara <i class="fa-solid fa-phone ml-3"></i>
                        </a>
                        <a href="https://wa.me/905386044851" target="_blank" class="inline-flex items-center justify-center bg-green-500 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-green-400 hover:-translate-y-1 transition-all">
                            WhatsApp'tan Yaz <i class="fa-brands fa-whatsapp ml-3 text-xl"></i>
                        </a>
                    </div>
                </div>
            </div>

    </div>
</Layout>
`;
    content += faqSection;
}

fs.writeFileSync('src/pages/fiyat-listesi.astro', content);
console.log("Successfully updated fiyat-listesi.astro");
