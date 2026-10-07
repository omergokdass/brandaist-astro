import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(projectRoot, '..');

// Desteklenen konfigürasyon yolları
const envPaths = [
    path.join(projectRoot, '.env'),
    path.join(workspaceRoot, '.env'),
    path.join(projectRoot, 'cloudflare_config.json'),
    path.join(workspaceRoot, 'cloudflare_config.json'),
];

function loadCredentials() {
    let apiToken = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN;
    let zoneId = process.env.CLOUDFLARE_ZONE_ID || process.env.CF_ZONE_ID;

    // .env veya json dosyalarından ara
    for (const p of envPaths) {
        if (fs.existsSync(p)) {
            if (p.endsWith('.json')) {
                try {
                    const cfg = JSON.parse(fs.readFileSync(p, 'utf-8'));
                    if (cfg.apiToken) apiToken = cfg.apiToken;
                    if (cfg.zoneId) zoneId = cfg.zoneId;
                } catch (e) {}
            } else if (p.endsWith('.env')) {
                const lines = fs.readFileSync(p, 'utf-8').split('\n');
                for (const line of lines) {
                    const clean = line.trim();
                    if (!clean || clean.startsWith('#')) continue;
                    const [k, ...v] = clean.split('=');
                    const key = k.trim();
                    const val = v.join('=').trim().replace(/^["']|["']$/g, '');
                    if ((key === 'CLOUDFLARE_API_TOKEN' || key === 'CF_API_TOKEN') && !apiToken) apiToken = val;
                    if ((key === 'CLOUDFLARE_ZONE_ID' || key === 'CF_ZONE_ID') && !zoneId) zoneId = val;
                }
            }
        }
    }

    return { apiToken, zoneId };
}

function printInstructions() {
    console.log('\n================================================================');
    console.log('📡 CLOUDFLARE KENAR ANALİTİK SENKRONİZASYON ARACI (branda.ist)');
    console.log('================================================================\n');
    console.log('❌ Cloudflare API Bilgileri Bulunamadı!\n');
    console.log('Bu scriptin Cloudflare verilerini (ziyaretçiler, en çok açılan sayfalar,');
    console.log('404 hataları ve Googlebot/ChatGPT/Claude bot taramaları) çekebilmesi için');
    console.log('2 adet bilgiye ihtiyacı vardır:\n');
    console.log('----------------------------------------------------------------');
    console.log('1. CLOUDFLARE ZONE ID (Alan Adı Kimliği):');
    console.log('   - Cloudflare paneline (dash.cloudflare.com) giriş yapın.');
    console.log('   - "branda.ist" alan adınıza tıklayın.');
    console.log('   - Sayfanın sağ alt köşesinde "API" bölümündeki "Zone ID"yi kopyalayın.');
    console.log('----------------------------------------------------------------');
    console.log('2. CLOUDFLARE API TOKEN:');
    console.log('   - Sağ üstteki profil simgenizden "My Profile" > "API Tokens" sekmesine gidin.');
    console.log('   - "Create Token" butonuna basın.');
    console.log('   - "Read analytics and logs" şablonunu seçin (veya Zone > Analytics > Read yetkisi verin).');
    console.log('   - "Zone Resources" kısmından "All zones" veya "branda.ist" seçip oluşturun ve kopyalayın.');
    console.log('----------------------------------------------------------------\n');
    console.log('👉 BU BİLGİLERİ PROJEYE NASIL VEREBİLİRSİNİZ?');
    console.log('Proje ana dizinine veya brandist-astro klasörüne "cloudflare_config.json" dosyası oluşturup');
    console.log('aşağıdaki formatta kaydedebilirsiniz:\n');
    console.log(`{`);
    console.log(`  "zoneId": "BURAYA_ZONE_ID_YAZIN",`);
    console.log(`  "apiToken": "BURAYA_API_TOKEN_YAZIN"`);
    console.log(`}\n`);
    console.log('(veya .env dosyasına CLOUDFLARE_ZONE_ID ve CLOUDFLARE_API_TOKEN olarak ekleyebilirsiniz)\n');
}

async function fetchZoneDetails(zoneId, apiToken) {
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}`, {
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();
    if (!data.success) {
        throw new Error(`Zone bilgisi alınamadı: ${JSON.stringify(data.errors)}`);
    }
    return data.result;
}

async function fetchDashboardAnalytics(zoneId, apiToken) {
    // Son 28 gün (40320 dakika)
    const minutes = 40320;
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/analytics/dashboard?since=-${minutes}&continuous=true`, {
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();
    if (!data.success) {
        throw new Error(`Dashboard analitik verisi alınamadı: ${JSON.stringify(data.errors)}`);
    }
    return data.result;
}

async function fetchGraphQLAnalytics(zoneId, apiToken) {
    const today = new Date();
    const past28 = new Date();
    past28.setDate(today.getDate() - 28);

    const since = past28.toISOString().split('T')[0];
    const until = today.toISOString().split('T')[0];

    // GraphQL sorgusu: En çok ziyaret edilen sayfalar, durum kodları ve bot aktiviteleri
    const query = `
      query GetZoneEdgeData($zoneTag: string!, $since: Date!, $until: Date!) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            topPaths: httpRequestsAdaptiveGroups(
              filter: { date_geq: $since, date_leq: $until }
              limit: 25
              orderBy: [count_DESC]
            ) {
              count
              dimensions {
                clientRequestPath
              }
            }
            topStatus: httpRequestsAdaptiveGroups(
              filter: { date_geq: $since, date_leq: $until }
              limit: 10
              orderBy: [count_DESC]
            ) {
              count
              dimensions {
                edgeResponseStatus
              }
            }
            crawlers: httpRequestsAdaptiveGroups(
              filter: {
                date_geq: $since,
                date_leq: $until,
                userAgent_like: "%bot%"
              }
              limit: 20
              orderBy: [count_DESC]
            ) {
              count
              dimensions {
                userAgent
              }
            }
          }
        }
      }
    `;

    try {
        const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query,
                variables: { zoneTag: zoneId, since, until }
            })
        });
        const result = await res.json();
        if (result.errors && result.errors.length > 0) {
            return { error: result.errors[0].message };
        }
        return result.data?.viewer?.zones?.[0] || {};
    } catch (e) {
        return { error: e.message };
    }
}

async function run() {
    const { apiToken, zoneId } = loadCredentials();

    if (!apiToken || !zoneId) {
        printInstructions();
        process.exit(1);
    }

    console.log('\n================================================================');
    console.log('📡 CLOUDFLARE KENAR ANALİTİK SENKRONİZASYON ARACI (branda.ist)');
    console.log('================================================================\n');
    console.log(`🔑 Zone ID: ${zoneId}`);
    console.log('⏳ Cloudflare API\'sine bağlanılıyor...\n');

    try {
        const zoneInfo = await fetchZoneDetails(zoneId, apiToken);
        console.log(`✅ Doğrulanan Domain: ${zoneInfo.name} (Plan: ${zoneInfo.plan?.name || 'Free'})`);

        console.log('📊 Son 28 günlük genel trafik verileri çekiliyor...');
        const dashboard = await fetchDashboardAnalytics(zoneId, apiToken);

        console.log('🔍 Sayfa istekleri ve yapay zeka tarayıcı logları analiz ediliyor...');
        const graphqlData = await fetchGraphQLAnalytics(zoneId, apiToken);

        const totals = dashboard.totals || {};
        const requests = totals.requests?.all || 0;
        const cachedRequests = totals.requests?.cached || 0;
        const cacheRate = requests > 0 ? ((cachedRequests / requests) * 100).toFixed(1) : 0;
        const pageviews = totals.pageviews?.all || 0;
        const uniques = totals.uniques?.all || 0;
        const bandwidthMB = ((totals.bandwidth?.all || 0) / (1024 * 1024)).toFixed(2);

        const topPaths = graphqlData.topPaths || [];
        const topCrawlers = graphqlData.crawlers || [];

        const reportData = {
            metadata: {
                zoneName: zoneInfo.name,
                zoneId: zoneId,
                generatedAt: new Date().toISOString(),
                period: 'Son 28 Gün'
            },
            summary: {
                totalRequests: requests,
                cachedRequests: cachedRequests,
                cacheRatio: `%${cacheRate}`,
                pageViews: pageviews,
                uniqueVisitors: uniques,
                bandwidthMB: bandwidthMB,
            },
            topPages: topPaths.map(p => ({
                path: p.dimensions.clientRequestPath,
                requests: p.count
            })),
            detectedBotsAndCrawlers: topCrawlers.map(c => ({
                userAgent: c.dimensions.userAgent,
                requestCount: c.count
            }))
        };

        const jsonOut = path.join(workspaceRoot, 'cloudflare_analytics_data.json');
        const mdOut = path.join(workspaceRoot, 'cloudflare_analytics_summary.md');

        fs.writeFileSync(jsonOut, JSON.stringify(reportData, null, 2), 'utf-8');

        let mdContent = `# Cloudflare Kenar (Edge) Analitik Raporu (${zoneInfo.name})
**Oluşturulma Tarihi:** ${new Date().toLocaleString('tr-TR')}
**Dönem:** Son 28 Gün

## 📊 Genel Performans ve Trafik Özeti
- **Tekil Ziyaretçi (Uniques):** ${uniques.toLocaleString('tr-TR')}
- **Toplam Sayfa Görüntüleme:** ${pageviews.toLocaleString('tr-TR')}
- **Toplam HTTP İstekleri:** ${requests.toLocaleString('tr-TR')}
- **Önbellek (Cache) Oranı:** %${cacheRate} (${cachedRequests.toLocaleString('tr-TR')} istek Cloudflare Edge'den karşılandı)
- **Kullanılan Bant Genişliği:** ${bandwidthMB} MB

---

## 📄 En Çok İstek Alan İlk 15 Sayfa / Yol (Paths)
| Sayfa Yolu (Path) | Toplam İstek |
|---|---|
${topPaths.slice(0, 15).map(p => `| \`${p.dimensions.clientRequestPath}\` | ${p.count.toLocaleString('tr-TR')} |`).join('\n')}

---

## 🤖 Tespit Edilen Arama Motoru ve Yapay Zeka Tarayıcıları (Bots)
Cloudflare'in kenar sunucularında tespit ettiği otomatik tarayıcılar (Googlebot, GPTBot, ClaudeBot vb.):
| Tarayıcı (User-Agent) | İstek Sayısı |
|---|---|
${topCrawlers.length > 0 ? topCrawlers.slice(0, 15).map(c => `| \`${c.dimensions.userAgent}\` | ${c.count.toLocaleString('tr-TR')} |`).join('\n') : '| *Bot verisi GraphQL filtresinde bulunamadı veya henüz kayıt oluşmadı.* | - |'}

---

> [!NOTE]
> Bu rapor Cloudflare kenar sunucularından doğrudan çekilmiştir. Search Console arama motorundaki sıralamayı gösterirken; bu rapor sitenize **fiilen ulaşan gerçek insan trafiğini ve bot tarama frekansını** gösterir.
`;

        fs.writeFileSync(mdOut, mdContent, 'utf-8');

        console.log('\n================================================================');
        console.log('🎉 CLOUDFLARE ANALİTİK VERİLERİ BAŞARIYLA KAYDEDİLDİ!');
        console.log('================================================================\n');
        console.log(`📈 Tekil Ziyaretçi: ${uniques} | Sayfa Görüntüleme: ${pageviews} | İstek: ${requests}`);
        console.log(`📁 Veri Dosyaları:`);
        console.log(`   - ${jsonOut}`);
        console.log(`   - ${mdOut}\n`);

    } catch (err) {
        console.error('\n❌ Cloudflare API Hatası:', err.message);
        process.exit(1);
    }
}

run();
