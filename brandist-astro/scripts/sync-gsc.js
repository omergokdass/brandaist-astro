import fs from 'fs';
import path from 'path';
import http from 'http';
import url from 'url';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(projectRoot, '..');

const keyFileCandidates = [
    path.join(projectRoot, 'service_account.json'),
    path.join(workspaceRoot, 'service_account.json'),
    path.join(projectRoot, 'credentials.json'),
    path.join(workspaceRoot, 'credentials.json'),
    path.join(projectRoot, 'gsc-key.json'),
    path.join(workspaceRoot, 'gsc-key.json'),
];

const oauthCandidates = [
    path.join(projectRoot, 'oauth_credentials.json'),
    path.join(workspaceRoot, 'oauth_credentials.json'),
    path.join(projectRoot, 'client_secret.json'),
    path.join(workspaceRoot, 'client_secret.json'),
];

const tokenPath = path.join(projectRoot, 'token.json');

function startBrowserAuth(oAuth2Client) {
    return new Promise((resolve, reject) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
            prompt: 'consent'
        });

        const server = http.createServer(async (req, res) => {
            try {
                if (req.url.startsWith('/oauth2callback')) {
                    const qs = new url.URL(req.url, 'http://localhost:8085').searchParams;
                    const code = qs.get('code');
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end('<h1>✅ Giriş Başarılı!</h1><p>Bu sekmeyi kapatıp terminale geri dönebilirsiniz.</p>');
                    server.destroy();

                    const { tokens } = await oAuth2Client.getToken(code);
                    oAuth2Client.setCredentials(tokens);
                    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
                    console.log('✅ Yeni giriş yetkisi başarıyla alındı ve token.json dosyasına kaydedildi!\n');
                    resolve(oAuth2Client);
                }
            } catch (e) {
                reject(e);
            }
        });

        const sockets = new Set();
        server.on('connection', socket => {
            sockets.add(socket);
            socket.on('close', () => sockets.delete(socket));
        });
        server.destroy = () => {
            for (const s of sockets) s.destroy();
            server.close();
        };

        server.listen(8085, () => {
            console.log('🌐 Lütfen açılan tarayıcı penceresinden Google hesabınızla giriş yapıp izin verin.');
            console.log(`🔗 Otomatik açılmazsa bu adrese gidin: ${authUrl}\n`);
            // Windows
            exec(`start "" "${authUrl}"`);
        });
    });
}

async function getOAuthClient(oauthPath, forceNew = false) {
    const content = fs.readFileSync(oauthPath, 'utf-8');
    const credentials = JSON.parse(content);
    const { client_secret, client_id } = credentials.installed || credentials.web || credentials;
    
    const redirectUri = 'http://localhost:8085/oauth2callback';
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

    if (!forceNew && fs.existsSync(tokenPath)) {
        try {
            const token = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
            oAuth2Client.setCredentials(token);
            // Belirtecin aktif olup olmadığını doğrula
            await oAuth2Client.getAccessToken();
            return oAuth2Client;
        } catch (e) {
            console.log(`⚠️ Mevcut token geçersiz veya süresi dolmuş (${e.message}).`);
            console.log('🔄 Eski token temizleniyor ve otomatik yeniden tarayıcı yetkilendirmesi başlatılıyor...\n');
            try {
                if (fs.existsSync(tokenPath)) fs.unlinkSync(tokenPath);
            } catch (err) {}
        }
    }

    return startBrowserAuth(oAuth2Client);
}

async function runSync() {
    console.log('\n========================================================');
    console.log('🔍 GOOGLE SEARCH CONSOLE API SENKRONİZASYON ARACI (branda.ist)');
    console.log('========================================================\n');

    let authClient = null;
    const serviceAccountPath = keyFileCandidates.find(p => fs.existsSync(p));
    const oauthPath = oauthCandidates.find(p => fs.existsSync(p));

    if (serviceAccountPath) {
        console.log(`🔑 Kalıcı Service Account bulundu: ${serviceAccountPath}`);
        authClient = new google.auth.GoogleAuth({
            keyFile: serviceAccountPath,
            scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
        });
    } else if (oauthPath) {
        console.log(`🔑 OAuth Client bulundu: ${oauthPath}`);
        authClient = await getOAuthClient(oauthPath);
    } else {
        console.log('❌ Anahtar dosyası bulunamadı!\n');
        console.log('İki yöntemden birini kullanabilirsiniz:');
        console.log('---------------------------------------------------------------------------------');
        console.log('YÖNTEM 1 (ÖNERİLEN - Kalıcı & Süresi Dolmaz): Service Account');
        console.log('1. Google Cloud Console > "IAM & Yönetim" > "Hizmet Hesapları" (Service Accounts) sekmesine gidin.');
        console.log('2. Bir hizmet hesabı oluşturup JSON anahtarını indirin.');
        console.log('3. JSON dosyasını şu isimle projeye kaydedin: brandist-astro/service_account.json');
        console.log('4. Google Search Console > Ayarlar > Kullanıcılar bölümünden bu hizmet hesabının e-postasını "Sahip" veya "Tam Yetkili" olarak ekleyin.');
        console.log('---------------------------------------------------------------------------------');
        console.log('YÖNTEM 2 (Masaüstü OAuth):');
        console.log('1. Google Cloud Console > "API\'ler ve Hizmetler" > "Kimlik Bilgileri" sekmesine gidin.');
        console.log('2. "OAuth İstemci Kimliği" > "Masaüstü Uygulaması" seçip JSON indirin.');
        console.log('3. Dosyayı "brandist-astro/oauth_credentials.json" olarak kaydedin.\n');
        process.exit(1);
    }

    console.log('📡 Google Search Console API\'sine bağlanılıyor...');

    try {
        const searchconsole = google.searchconsole({
            version: 'v1',
            auth: authClient,
        });

        // 1. Check verified sites
        console.log('📋 Yetkili mülkler taranıyor...');
        let siteList = [];
        try {
            const sitesRes = await searchconsole.sites.list();
            siteList = sitesRes.data.siteEntry || [];
        } catch (listErr) {
            if (listErr.message && listErr.message.includes('invalid_grant')) {
                console.log('\n⚠️ invalid_grant hatası alındı. Eski token siliniyor...');
                if (fs.existsSync(tokenPath)) fs.unlinkSync(tokenPath);
                console.log('👉 Lütfen komutu tekrar çalıştırarak tarayıcıdan izin verin: npm run gsc:sync\n');
                process.exit(1);
            }
            throw listErr;
        }

        if (siteList.length === 0) {
            console.log('\n⚠️ Uyarı: Giriş yaptığınız Google hesabında doğrulanmış Search Console mülkü bulunamadı!');
            process.exit(1);
        }

        console.log(`✅ ${siteList.length} adet doğrulanmış mülk bulundu:`);
        siteList.forEach(s => console.log(`   - ${s.siteUrl} (${s.permissionLevel})`));

        // Auto-select branda.ist with Owner permission, or first owner site
        let targetSite = siteList.find(s => s.siteUrl.includes('www.branda.ist') && s.permissionLevel !== 'siteUnverifiedUser')?.siteUrl
            || siteList.find(s => s.permissionLevel === 'siteOwner')?.siteUrl
            || siteList.find(s => s.siteUrl.includes('branda.ist') && s.permissionLevel !== 'siteUnverifiedUser')?.siteUrl
            || siteList[0].siteUrl;
        console.log(`\n🎯 Hedef Mülk: ${targetSite}`);

        console.log(`⏳ Google veritabanındaki son aktif tarihler tespit ediliyor...`);

        // Google veritabanındaki son güncel tarihleri dinamik olarak tespit et (GSC veri gecikmesi ~3 gündür)
        const checkDatesRes = await searchconsole.searchanalytics.query({
            siteUrl: targetSite,
            requestBody: {
                startDate: '2026-08-15',
                endDate: new Date().toISOString().split('T')[0],
                dimensions: ['date'],
                rowLimit: 60,
            },
        });
        const allAvailableDates = checkDatesRes.data.rows || [];
        if (allAvailableDates.length === 0) {
            console.log('⚠️ Tarih verisi alınamadı.');
            process.exit(1);
        }

        const last28Dates = allAvailableDates.slice(-28);
        const startDate28 = last28Dates[0].keys[0];
        const endDate = last28Dates[last28Dates.length - 1].keys[0];
        const last7Dates = allAvailableDates.slice(-7);
        const startDate7 = last7Dates[0].keys[0];

        // GSC Dashboard skor kartları (birebir UI ile aynı genel mülk toplamı)
        const totalClicks28 = last28Dates.reduce((s, r) => s + (r.clicks || 0), 0);
        const totalImpressions28 = last28Dates.reduce((s, r) => s + (r.impressions || 0), 0);
        const avgCtr28 = totalImpressions28 > 0 ? ((totalClicks28 / totalImpressions28) * 100).toFixed(1) : '0';
        const avgPosition28 = totalImpressions28 > 0 ? (last28Dates.reduce((s, r) => s + (r.position * r.impressions), 0) / totalImpressions28).toFixed(1) : '0';

        console.log(`📅 Veri Aralığı: ${startDate28} - ${endDate} (Search Console'daki Son 28 Gün)`);
        console.log(`⏳ Sorgular ve Sayfalar çekiliyor...`);

        // Queries (28 days) - Tüm kelimeler
        const queriesRes = await searchconsole.searchanalytics.query({
            siteUrl: targetSite,
            requestBody: {
                startDate: startDate28,
                endDate: endDate,
                dimensions: ['query'],
                rowLimit: 5000,
            },
        });
        const topQueries = queriesRes.data.rows || [];

        // Pages (28 days) - Tüm sayfalar
        const pagesRes = await searchconsole.searchanalytics.query({
            siteUrl: targetSite,
            requestBody: {
                startDate: startDate28,
                endDate: endDate,
                dimensions: ['page'],
                rowLimit: 5000,
            },
        });
        const topPages = pagesRes.data.rows || [];

        // Query + Page kombinasyonları
        const queryPageRes = await searchconsole.searchanalytics.query({
            siteUrl: targetSite,
            requestBody: {
                startDate: startDate28,
                endDate: endDate,
                dimensions: ['query', 'page'],
                rowLimit: 5000,
            },
        });
        const queryPageRows = queryPageRes.data.rows || [];

        // Queries (7 days) - Son 7 gün
        const queries7Res = await searchconsole.searchanalytics.query({
            siteUrl: targetSite,
            requestBody: {
                startDate: startDate7,
                endDate: endDate,
                dimensions: ['query'],
                rowLimit: 2000,
            },
        });
        const topQueries7 = queries7Res.data.rows || [];

        // ⚡ Son 24 - 48 Saat Taze Veriler (Fresh Data / dataState: 'ALL')
        let freshQueries = [];
        try {
            const todayStr = new Date().toISOString().split('T')[0];
            const freshRes = await searchconsole.searchanalytics.query({
                siteUrl: targetSite,
                requestBody: {
                    startDate: endDate,
                    endDate: todayStr,
                    dimensions: ['query'],
                    dataState: 'ALL',
                    rowLimit: 1000,
                },
            });
            freshQueries = freshRes.data.rows || [];
        } catch (e) {}

        // Sitemaps
        let sitemapsData = [];
        try {
            const sitemapsRes = await searchconsole.sitemaps.list({ siteUrl: targetSite });
            sitemapsData = sitemapsRes.data.sitemap || [];
        } catch (e) {}

        const opportunities = topQueries
            .filter(q => q.position >= 3.5 && q.position <= 25 && q.impressions >= 5)
            .sort((a, b) => b.impressions - a.impressions)
            .slice(0, 30);

        const resultData = {
            metadata: {
                siteUrl: targetSite,
                lastSyncTime: new Date().toISOString(),
                dateRange: { startDate28, startDate7, endDate },
                summary28Days: {
                    totalClicks: totalClicks28,
                    totalImpressions: totalImpressions28,
                    avgCtr: `${avgCtr28}%`,
                    uniqueQueriesCount: topQueries.length,
                    uniquePagesCount: topPages.length,
                }
            },
            opportunities,
            freshQueries24to48Hours: freshQueries,
            topQueries28Days: topQueries,
            topQueries7Days: topQueries7,
            topPages28Days: topPages,
            queryPageCombinations: queryPageRows,
            sitemaps: sitemapsData,
        };

        const jsonOutputPath = path.join(workspaceRoot, 'search_console_data.json');
        const summaryOutputPath = path.join(workspaceRoot, 'search_console_summary.md');

        fs.writeFileSync(jsonOutputPath, JSON.stringify(resultData, null, 2), 'utf-8');

        let mdContent = `# Google Search Console Canlı Raporu (${targetSite})
**Son Güncelleme:** ${new Date().toLocaleString('tr-TR')}
**Tarih Aralığı:** ${startDate28} ile ${endDate} arası (Son 28 Gün)

## 📊 Genel Performans Özeti (Search Console Skor Kartları)
- **Toplam Tıklama:** ${totalClicks28}
- **Toplam Gösterim:** ${totalImpressions28.toLocaleString('tr-TR')}
- **Ortalama TO (CTR):** %${avgCtr28}
- **Ortalama Konum:** ${avgPosition28}
- **Trafik Alan Farklı Kelime Sayısı:** ${topQueries.length}
- **Trafik Alan Farklı Sayfa Sayısı:** ${topPages.length}

---

## ⚡ Son 24 - 48 Saatlik Taze Canlı Sorgular (Fresh Data / Dünden Bugüne Arama Trendleri)
| Anahtar Kelime | Tıklama | Gösterim | Sıra |
|---|---|---|---|
${freshQueries.slice(0, 15).map(q => `| **${q.keys[0]}** | ${q.clicks} | ${q.impressions} | ${q.position.toFixed(1)} |`).join('\n')}

---

## 🚀 En Yüksek Potansiyelli Sıralama Fırsatları (İlk Sayfaya / İlk 3'e Çıkabilecekler)
| Anahtar Kelime | Gösterim | Tıklama | Ortalama Pozisyon | TO |
|---|---|---|---|---|
${opportunities.map(o => `| **${o.keys[0]}** | ${o.impressions} | ${o.clicks} | ${o.position.toFixed(1)} | %${(o.ctr * 100).toFixed(1)} |`).join('\n')}

---

## 🏆 En Çok Tıklama Alan İlk 15 Kelime (Son 28 Gün)
| Sıra | Anahtar Kelime | Tıklama | Gösterim | Pozisyon |
|---|---|---|---|---|
${topQueries.slice(0, 15).map((q, i) => `| ${i + 1} | **${q.keys[0]}** | ${q.clicks} | ${q.impressions} | ${q.position.toFixed(1)} |`).join('\n')}

---

## 📄 En Çok Trafik Alan İlk 15 Sayfa (Son 28 Gün)
| Sayfa URL | Tıklama | Gösterim | Ort. Pozisyon |
|---|---|---|---|
${topPages.slice(0, 15).map(p => `| [${p.keys[0].replace('https://www.branda.ist', '')}](${p.keys[0]}) | ${p.clicks} | ${p.impressions} | ${p.position.toFixed(1)} |`).join('\n')}
`;

        fs.writeFileSync(summaryOutputPath, mdContent, 'utf-8');

        console.log('\n========================================================');
        console.log('🎉 SENKRONİZASYON BAŞARIYLA TAMAMLANDI!');
        console.log('========================================================\n');
        console.log(`📈 Toplam Tıklama: ${totalClicks28} | Toplam Gösterim: ${totalImpressions28} | Ortalama TO: %${avgCtr28}`);
        console.log(`📁 Veriler kaydedildi:`);
        console.log(`   - ${jsonOutputPath}`);
        console.log(`   - ${summaryOutputPath}`);

    } catch (err) {
        console.error('\n❌ API Hatası:', err.message);
        process.exit(1);
    }
}

runSync();
