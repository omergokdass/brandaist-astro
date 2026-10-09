import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(projectRoot, '..');

const envPaths = [
    path.join(projectRoot, 'cloudflare_config.json'),
    path.join(workspaceRoot, 'cloudflare_config.json'),
    path.join(projectRoot, '.env'),
    path.join(workspaceRoot, '.env'),
];

function loadCredentials() {
    let apiToken = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN;
    let zoneId = process.env.CLOUDFLARE_ZONE_ID || process.env.CF_ZONE_ID;

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

async function fetchGraphQLAnalytics(zoneId, apiToken) {
    const today = new Date();
    const past28 = new Date();
    past28.setDate(today.getDate() - 28);

    const since = past28.toISOString().split('T')[0];
    const until = today.toISOString().split('T')[0];

    const query = `
      query GetAnalytics($zoneTag: string!, $since: Date!, $until: Date!) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            httpRequests1dGroups(
              filter: { date_geq: $since, date_leq: $until }
              limit: 35
            ) {
              dimensions {
                date
              }
              sum {
                requests
                bytes
                cachedRequests
                cachedBytes
                pageViews
              }
              uniq {
                uniques
              }
            }
          }
        }
      }
    `;

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
        throw new Error(`GraphQL Hatası: ${result.errors[0].message}`);
    }

    const groups = result.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [];
    return groups.sort((a, b) => a.dimensions.date.localeCompare(b.dimensions.date));
}

async function run() {
    const { apiToken, zoneId } = loadCredentials();

    if (!apiToken || !zoneId) {
        console.log('❌ Cloudflare API bilgileri bulunamadı. Lütfen cloudflare_config.json dosyasını kontrol edin.');
        process.exit(1);
    }

    console.log('\n================================================================');
    console.log('📡 CLOUDFLARE KENAR (EDGE) ANALİTİK ARACI (branda.ist)');
    console.log('================================================================\n');
    console.log(`🔑 Zone ID: ${zoneId}`);
    console.log('⏳ Cloudflare GraphQL API\'sine bağlanılıyor...\n');

    try {
        const zoneInfo = await fetchZoneDetails(zoneId, apiToken);
        console.log(`✅ Doğrulanan Alan Adı: ${zoneInfo.name} (${zoneInfo.plan?.name || 'Free'})`);

        console.log('📊 Son 28 günlük kenar trafik verileri çekiliyor...');
        const dailyGroups = await fetchGraphQLAnalytics(zoneId, apiToken);

        if (dailyGroups.length === 0) {
            console.log('⚠️ Analitik verisi henüz oluşmamış veya boş döndü.');
            process.exit(0);
        }

        const totalRequests = dailyGroups.reduce((acc, g) => acc + (g.sum?.requests || 0), 0);
        const totalCachedRequests = dailyGroups.reduce((acc, g) => acc + (g.sum?.cachedRequests || 0), 0);
        const totalPageViews = dailyGroups.reduce((acc, g) => acc + (g.sum?.pageViews || 0), 0);
        const totalBytes = dailyGroups.reduce((acc, g) => acc + (g.sum?.bytes || 0), 0);
        const totalCachedBytes = dailyGroups.reduce((acc, g) => acc + (g.sum?.cachedBytes || 0), 0);
        const avgDailyUniques = Math.round(dailyGroups.reduce((acc, g) => acc + (g.uniq?.uniques || 0), 0) / dailyGroups.length);

        const cacheHitRate = totalRequests > 0 ? ((totalCachedRequests / totalRequests) * 100).toFixed(1) : 0;
        const totalBandwidthMB = (totalBytes / (1024 * 1024)).toFixed(2);
        const savedBandwidthMB = (totalCachedBytes / (1024 * 1024)).toFixed(2);

        // Son 7 gün özeti
        const last7 = dailyGroups.slice(-7);
        const last7Requests = last7.reduce((acc, g) => acc + (g.sum?.requests || 0), 0);
        const last7PageViews = last7.reduce((acc, g) => acc + (g.sum?.pageViews || 0), 0);
        const last7UniquesAvg = Math.round(last7.reduce((acc, g) => acc + (g.uniq?.uniques || 0), 0) / last7.length);

        const reportData = {
            metadata: {
                domain: zoneInfo.name,
                zoneId: zoneId,
                syncTime: new Date().toISOString(),
                dateRange: {
                    start: dailyGroups[0]?.dimensions?.date,
                    end: dailyGroups[dailyGroups.length - 1]?.dimensions?.date,
                    totalDaysTracked: dailyGroups.length
                }
            },
            summary28Days: {
                totalRequests,
                totalCachedRequests,
                cacheHitRate: `%${cacheHitRate}`,
                totalPageViews,
                averageDailyUniqueVisitors: avgDailyUniques,
                totalBandwidthMB: `${totalBandwidthMB} MB`,
                savedBandwidthMB: `${savedBandwidthMB} MB`
            },
            summary7Days: {
                totalRequests: last7Requests,
                totalPageViews: last7PageViews,
                averageDailyUniqueVisitors: last7UniquesAvg
            },
            dailyBreakdown: dailyGroups.map(g => ({
                date: g.dimensions.date,
                requests: g.sum.requests,
                pageViews: g.sum.pageViews,
                uniqueVisitors: g.uniq.uniques,
                cachedRequests: g.sum.cachedRequests
            }))
        };

        const jsonOut = path.join(workspaceRoot, 'cloudflare_analytics_data.json');
        const mdOut = path.join(workspaceRoot, 'cloudflare_analytics_summary.md');

        fs.writeFileSync(jsonOut, JSON.stringify(reportData, null, 2), 'utf-8');

        let mdContent = `# Cloudflare Kenar (Edge) Canlı Trafik Raporu (${zoneInfo.name})
**Son Güncelleme:** ${new Date().toLocaleString('tr-TR')}
**Tarih Aralığı:** ${dailyGroups[0]?.dimensions?.date} ile ${dailyGroups[dailyGroups.length - 1]?.dimensions?.date} arası (${dailyGroups.length} Gün)

## 📊 Genel Kenar Performans Özeti (Son 28 Gün)
- **Toplam HTTP İstekleri (Requests):** ${totalRequests.toLocaleString('tr-TR')}
- **Toplam Sayfa Görüntüleme (Page Views):** ${totalPageViews.toLocaleString('tr-TR')}
- **Günlük Ortalama Tekil Ziyaretçi:** ~${avgDailyUniques.toLocaleString('tr-TR')} kişi/gün
- **Cloudflare Önbellek (Cache) Başarı Oranı:** %${cacheHitRate} *(Toplam ${totalCachedRequests.toLocaleString('tr-TR')} istek doğrudan Cloudflare kenar sunucusundan anında sunuldu)*
- **Toplam Trafik Bant Genişliği:** ${totalBandwidthMB} MB *(Bunun ${savedBandwidthMB} MB'ı önbellekten tasarruf edildi)*

---

## ⚡ Son 7 Günlük Hızlı Trend
- **Son 7 Gün Toplam İstek:** ${last7Requests.toLocaleString('tr-TR')}
- **Son 7 Gün Toplam Sayfa Görüntüleme:** ${last7PageViews.toLocaleString('tr-TR')}
- **Son 7 Gün Ortalama Tekil Ziyaretçi:** ~${last7UniquesAvg.toLocaleString('tr-TR')} kişi/gün

---

## 📅 Günlük Trafik ve Ziyaretçi Tablosu (Son Günler)
| Tarih | Tekil Ziyaretçi | Sayfa Görüntüleme | Toplam İstek | Önbellek Hit |
|---|---|---|---|---|
${dailyGroups.slice(-14).reverse().map(g => `| **${g.dimensions.date}** | ${g.uniq.uniques} | ${g.sum.pageViews.toLocaleString('tr-TR')} | ${g.sum.requests.toLocaleString('tr-TR')} | ${g.sum.cachedRequests.toLocaleString('tr-TR')} |`).join('\n')}

---

> [!NOTE]
> Bu rapor Cloudflare kenar sunucularından doğrudan GraphQL API ile çekilmiştir. Reklam engelleyicilere takılmayan, sitenize gelen gerçek ham ağ trafiğini ve sayfa yüklenme hacmini yansıtır.
`;

        fs.writeFileSync(mdOut, mdContent, 'utf-8');

        console.log('\n================================================================');
        console.log('🎉 CLOUDFLARE VERİLERİ BAŞARIYLA ÇEKİLDİ VE KAYDEDİLDİ!');
        console.log('================================================================\n');
        console.log(`📈 Toplam İstek: ${totalRequests.toLocaleString('tr-TR')} | Toplam Sayfa Görüntüleme: ${totalPageViews.toLocaleString('tr-TR')}`);
        console.log(`👥 Günlük Ortalama Tekil Ziyaretçi: ~${avgDailyUniques} kişi/gün | Önbellek Oranı: %${cacheHitRate}`);
        console.log(`📁 Kaydedilen Dosyalar:`);
        console.log(`   - ${jsonOut}`);
        console.log(`   - ${mdOut}\n`);

    } catch (err) {
        console.error('\n❌ Cloudflare API Hatası:', err.message);
        process.exit(1);
    }
}

run();
