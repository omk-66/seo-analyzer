import axios from 'axios';

interface PerformanceMetrics {
    serverResponseTimeMs: number | null;
    firstContentfulPaintMs: number | null;
    largestContentfulPaintMs: number | null;
    speedIndexMs: number | null;
    timeToInteractiveMs: number | null;
    totalBlockingTimeMs: number | null;
    cumulativeLayoutShift: number | null;
}

interface WebVitals {
    LCP: number | null;
    CLS: number | null;
    INP: number | null;
}

interface ResourceBreakdown {
    totalRequests: number;
    html: { count: number; sizeKB: number };
    js: { count: number; sizeKB: number };
    css: { count: number; sizeKB: number };
    images: { count: number; sizeKB: number };
    fonts: { count: number; sizeKB: number };
    media: { count: number; sizeKB: number };
    xhr: { count: number; sizeKB: number };
    other: { count: number; sizeKB: number };
}

interface ImageData {
    url: string;
    format: string;
    transferSizeKB: number;
    originalSizeKB: number;
    compressionPercent: number;
}

interface ImageSummary {
    totalImages: number;
    totalTransferSizeMB: number;
    totalOriginalSizeMB: number;
    avgImageSizeKB: number;
}

interface ImageOpportunities {
    oversizedImages: any[];
    nextGenFormats: any[];
    lazyLoadingIssues: any[];
    imageCompressionIssues: any[];
}

interface PageSpeedDashboardData {
    url: string;
    strategy: string;
    scores: { [key: string]: number };
    performance: PerformanceMetrics;
    webVitals: WebVitals | null;
    resourceBreakdown: ResourceBreakdown;
    imageSummary: ImageSummary;
    images: ImageData[];
    imageOpportunities: ImageOpportunities;
}

export async function getFullPageSpeedDashboardData({
    url,
    apiKey,
    strategy = "mobile"
}: {
    url: string;
    apiKey: string;
    strategy?: string;
}): Promise<PageSpeedDashboardData> {
    const endpoint = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

    // Ensure URL has proper protocol
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

    const apiUrl = `${endpoint}?url=${encodeURIComponent(formattedUrl)}&strategy=${strategy}&key=${apiKey}`;

    console.log('[PAGESPEED] Fetching data from:', apiUrl.replace(/key=[^&]+/, 'key=***'));
    console.log('[PAGESPEED] Formatted URL:', formattedUrl);

    try {
        const response = await axios.get(apiUrl, {
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SEO-Audit-Bot/1.0)'
            }
        });

        console.log('[PAGESPEED] Response status:', response.status);
        console.log('[PAGESPEED] Response data keys:', Object.keys(response.data));

        const data = response.data;
        const lighthouse = data.lighthouseResult;
        const audits = lighthouse.audits;
        const categories = lighthouse.categories;
        const crux = data.loadingExperience || {};

        /* ================= PERFORMANCE (GAUGE CHARTS) ================= */

        const performance: PerformanceMetrics = {
            serverResponseTimeMs: audits["server-response-time"]?.numericValue ?? null,
            firstContentfulPaintMs: audits["first-contentful-paint"]?.numericValue ?? null,
            largestContentfulPaintMs: audits["largest-contentful-paint"]?.numericValue ?? null,
            speedIndexMs: audits["speed-index"]?.numericValue ?? null,
            timeToInteractiveMs: audits["interactive"]?.numericValue ?? null,
            totalBlockingTimeMs: audits["total-blocking-time"]?.numericValue ?? null,
            cumulativeLayoutShift: audits["cumulative-layout-shift"]?.numericValue ?? null
        };

        /* ================= CORE WEB VITALS (FIELD DATA) ================= */

        const webVitals: WebVitals | null = crux.metrics
            ? {
                LCP: crux.metrics.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
                CLS: crux.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile ?? null,
                INP:
                    crux.metrics.INTERACTION_TO_NEXT_PAINT_MS?.percentile ??
                    crux.metrics.FIRST_INPUT_DELAY_MS?.percentile ??
                    null
            }
            : null;

        /* ================= NETWORK REQUESTS ================= */

        const networkItems = audits["network-requests"]?.details?.items ?? [];

        /* ================= RESOURCE BREAKDOWN ================= */

        const resourceBreakdown: ResourceBreakdown = {
            totalRequests: networkItems.length,
            html: { count: 0, sizeKB: 0 },
            js: { count: 0, sizeKB: 0 },
            css: { count: 0, sizeKB: 0 },
            images: { count: 0, sizeKB: 0 },
            fonts: { count: 0, sizeKB: 0 },
            media: { count: 0, sizeKB: 0 },
            xhr: { count: 0, sizeKB: 0 },
            other: { count: 0, sizeKB: 0 }
        };

        networkItems.forEach((req: any) => {
            const sizeKB = (req.transferSize || 0) / 1024;

            switch (req.resourceType) {
                case "Document":
                    resourceBreakdown.html.count++;
                    resourceBreakdown.html.sizeKB += sizeKB;
                    break;
                case "Script":
                    resourceBreakdown.js.count++;
                    resourceBreakdown.js.sizeKB += sizeKB;
                    break;
                case "Stylesheet":
                    resourceBreakdown.css.count++;
                    resourceBreakdown.css.sizeKB += sizeKB;
                    break;
                case "Image":
                    resourceBreakdown.images.count++;
                    resourceBreakdown.images.sizeKB += sizeKB;
                    break;
                case "Font":
                    resourceBreakdown.fonts.count++;
                    resourceBreakdown.fonts.sizeKB += sizeKB;
                    break;
                case "Media":
                    resourceBreakdown.media.count++;
                    resourceBreakdown.media.sizeKB += sizeKB;
                    break;
                case "XHR":
                case "Fetch":
                    resourceBreakdown.xhr.count++;
                    resourceBreakdown.xhr.sizeKB += sizeKB;
                    break;
                default:
                    resourceBreakdown.other.count++;
                    resourceBreakdown.other.sizeKB += sizeKB;
            }
        });

        Object.values(resourceBreakdown).forEach(v => {
            if (v.sizeKB !== undefined) v.sizeKB = +v.sizeKB.toFixed(2);
        });

        /* ================= IMAGE DATA ================= */

        const imageRequests = networkItems.filter(
            (req: any) => req.resourceType === "Image"
        );

        let totalImageBytes = 0;
        let totalImageOriginalBytes = 0;

        const images: ImageData[] = imageRequests.map((img: any) => {
            totalImageBytes += img.transferSize || 0;
            totalImageOriginalBytes += img.resourceSize || 0;

            return {
                url: img.url,
                format: img.mimeType,
                transferSizeKB: +(img.transferSize / 1024).toFixed(2),
                originalSizeKB: +(img.resourceSize / 1024).toFixed(2),
                compressionPercent: img.resourceSize
                    ? +(100 - (img.transferSize / img.resourceSize) * 100).toFixed(2)
                    : 0
            };
        });

        const imageSummary: ImageSummary = {
            totalImages: images.length,
            totalTransferSizeMB: +(totalImageBytes / 1024 / 1024).toFixed(2),
            totalOriginalSizeMB: +(totalImageOriginalBytes / 1024 / 1024).toFixed(2),
            avgImageSizeKB:
                images.length > 0
                    ? +(totalImageBytes / images.length / 1024).toFixed(2)
                    : 0
        };

        const imageOpportunities: ImageOpportunities = {
            oversizedImages: audits["uses-responsive-images"]?.details?.items ?? [],
            nextGenFormats: audits["uses-webp-images"]?.details?.items ?? [],
            lazyLoadingIssues: audits["offscreen-images"]?.details?.items ?? [],
            imageCompressionIssues: audits["uses-optimized-images"]?.details?.items ?? []
        };

        /* ================= CATEGORY SCORES ================= */

        const scores: { [key: string]: number } = Object.fromEntries(
            Object.entries(categories).map(([k, v]: [string, any]) => [
                k,
                Math.round(v.score * 100)
            ])
        );

        /* ================= FINAL RETURN ================= */

        const result = {
            url: lighthouse.finalUrl,
            strategy,
            scores,
            performance,
            webVitals,
            resourceBreakdown,
            imageSummary,
            images,
            imageOpportunities
        };

        console.log('[PAGESPEED] Returning result with keys:', Object.keys(result));
        console.log('[PAGESPEED] Performance scores:', result.scores);
        console.log('[PAGESPEED] Total requests:', result.resourceBreakdown.totalRequests);

        return result;
    } catch (error: any) {
        console.error('[PAGESPEED] API error:', error);

        // Log more details for 400 errors
        if (error.response?.status === 400) {
            console.error('[PAGESPEED] 400 Error Response:', error.response.data);
            console.error('[PAGESPEED] 400 Error Details:', JSON.stringify(error.response.data, null, 2));
        }

        console.error('[PAGESPEED] Error message:', error?.message);
        throw new Error(`Failed to fetch PageSpeed data: ${error?.message || 'Unknown error'}`);
    }
}
