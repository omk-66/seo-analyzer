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

interface ScreenshotData {
    exists: boolean;
    dataUrl: string | null;
    width: number;
    height: number;
}

// Performance metrics for usability section
interface PageSpeedMetrics {
    firstContentfulPaint: {
        value: number | null;
        displayValue: string;
    };
    speedIndex: {
        value: number | null;
        displayValue: string;
    };
    largestContentfulPaint: {
        value: number | null;
        displayValue: string;
    };
    timeToInteractive: {
        value: number | null;
        displayValue: string;
    };
    totalBlockingTime: {
        value: number | null;
        displayValue: string;
    };
    cumulativeLayoutShift: {
        value: number | null;
        displayValue: string;
    };
}

interface PerformanceData {
    url: string;
    strategy: string;
    scores: { [key: string]: number };
    performance: PerformanceMetrics;
    webVitals: WebVitals | null;
    resourceBreakdown: ResourceBreakdown;
    imageSummary: ImageSummary;
    images: ImageData[];
    imageOpportunities: ImageOpportunities;
    screenshot: ScreenshotData;
    metrics: PageSpeedMetrics;
}

// Default/fallback data
function getDefaultPerformanceData(strategy: string): PerformanceData {
    return {
        url: '',
        strategy,
        scores: { performance: 0 },
        performance: {
            serverResponseTimeMs: null,
            firstContentfulPaintMs: null,
            largestContentfulPaintMs: null,
            speedIndexMs: null,
            timeToInteractiveMs: null,
            totalBlockingTimeMs: null,
            cumulativeLayoutShift: null
        },
        webVitals: null,
        resourceBreakdown: {
            totalRequests: 0,
            html: { count: 0, sizeKB: 0 },
            js: { count: 0, sizeKB: 0 },
            css: { count: 0, sizeKB: 0 },
            images: { count: 0, sizeKB: 0 },
            fonts: { count: 0, sizeKB: 0 },
            media: { count: 0, sizeKB: 0 },
            xhr: { count: 0, sizeKB: 0 },
            other: { count: 0, sizeKB: 0 }
        },
        imageSummary: {
            totalImages: 0,
            totalTransferSizeMB: 0,
            totalOriginalSizeMB: 0,
            avgImageSizeKB: 0
        },
        images: [],
        imageOpportunities: {
            oversizedImages: [],
            nextGenFormats: [],
            lazyLoadingIssues: [],
            imageCompressionIssues: []
        },
        screenshot: { exists: false, dataUrl: null, width: 0, height: 0 },
        metrics: {
            firstContentfulPaint: { value: null, displayValue: '' },
            speedIndex: { value: null, displayValue: '' },
            largestContentfulPaint: { value: null, displayValue: '' },
            timeToInteractive: { value: null, displayValue: '' },
            totalBlockingTime: { value: null, displayValue: '' },
            cumulativeLayoutShift: { value: null, displayValue: '' }
        }
    };
}

export async function getFullPageSpeedDashboardData({
    url,
    apiKey,
    strategy = "mobile"
}: {
    url: string;
    apiKey: string;
    strategy?: string;
}): Promise<PerformanceData> {
    const endpoint = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

    // Ensure URL has proper protocol
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

    // Use only performance category to reduce response size and time
    const apiUrl = `${endpoint}?url=${encodeURIComponent(formattedUrl)}&strategy=${strategy}&category=performance&key=${apiKey}`;

    console.log('[PAGESPEED] Fetching data from:', apiUrl.replace(/key=[^&]+/, 'key=***'));
    console.log('[PAGESPEED] Formatted URL:', formattedUrl);
    console.log('[PAGESPEED] Strategy:', strategy);

    try {
        const response = await axios.get(apiUrl, {
            timeout: 60000, // Increased to 60 seconds
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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

        /* ================= PAGE SPEED METRICS (for usability section) ================= */

        const metrics: PageSpeedMetrics = {
            firstContentfulPaint: {
                value: audits["first-contentful-paint"]?.numericValue
                    ? +(audits["first-contentful-paint"].numericValue / 1000).toFixed(2)
                    : null,
                displayValue: audits["first-contentful-paint"]?.displayValue || ''
            },
            speedIndex: {
                value: audits["speed-index"]?.numericValue
                    ? +(audits["speed-index"].numericValue / 1000).toFixed(2)
                    : null,
                displayValue: audits["speed-index"]?.displayValue || ''
            },
            largestContentfulPaint: {
                value: audits["largest-contentful-paint"]?.numericValue
                    ? +(audits["largest-contentful-paint"].numericValue / 1000).toFixed(2)
                    : null,
                displayValue: audits["largest-contentful-paint"]?.displayValue || ''
            },
            timeToInteractive: {
                value: audits["interactive"]?.numericValue
                    ? +(audits["interactive"].numericValue / 1000).toFixed(2)
                    : null,
                displayValue: audits["interactive"]?.displayValue || ''
            },
            totalBlockingTime: {
                value: audits["total-blocking-time"]?.numericValue
                    ? +(audits["total-blocking-time"].numericValue / 1000).toFixed(2)
                    : null,
                displayValue: audits["total-blocking-time"]?.displayValue || ''
            },
            cumulativeLayoutShift: {
                value: audits["cumulative-layout-shift"]?.numericValue ?? null,
                displayValue: audits["cumulative-layout-shift"]?.displayValue || ''
            }
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

        /* ================= SCREENSHOT ================= */

        // Get screenshot from screenshot-thumbnails (contains multiple frames)
        const screenshotThumbnails = audits["screenshot-thumbnails"]?.details?.items ?? [];
        const screenshotData: ScreenshotData = {
            exists: false,
            dataUrl: null,
            width: 0,
            height: 0
        };

        if (screenshotThumbnails.length > 0) {
            // Get the last (final) screenshot which is the fully loaded page
            const finalScreenshot = screenshotThumbnails[screenshotThumbnails.length - 1];
            if (finalScreenshot?.data) {
                screenshotData.exists = true;
                screenshotData.dataUrl = finalScreenshot.data;
                screenshotData.width = finalScreenshot.width || 0;
                screenshotData.height = finalScreenshot.height || 0;
                console.log('[PAGESPEED] Screenshot found:', screenshotData.exists, 'width:', screenshotData.width, 'height:', screenshotData.height);
            }
        }

        /* ================= CATEGORY SCORES ================= */

        const scores: { [key: string]: number } = Object.fromEntries(
            Object.entries(categories).map(([k, v]: [string, any]) => [
                k,
                Math.round(v.score * 100)
            ])
        );

        /* ================= FINAL RETURN ================= */

        const result: PerformanceData = {
            url: lighthouse.finalUrl,
            strategy,
            scores,
            performance,
            webVitals,
            resourceBreakdown,
            imageSummary,
            images,
            imageOpportunities,
            screenshot: screenshotData,
            metrics: metrics
        };

        console.log('[PAGESPEED] Returning result with keys:', Object.keys(result));
        console.log('[PAGESPEED] Performance scores:', result.scores);
        console.log('[PAGESPEED] Total requests:', result.resourceBreakdown.totalRequests);
        console.log('[PAGESPEED] Screenshot exists:', result.screenshot.exists);

        return result;
    } catch (error: any) {
        console.error('[PAGESPEED] API error:', error);

        // Return default data instead of throwing error
        console.warn('[PAGESPEED] Using fallback data for', strategy, 'due to API error:', error?.message);
        return getDefaultPerformanceData(strategy);
    }
}

// Interface for combined performance data with both mobile and desktop
export interface CombinedPerformanceData {
    mobile: PerformanceData;
    desktop: PerformanceData;
}

// Get both mobile and desktop data - handle individual failures gracefully
export async function getCombinedPageSpeedData({
    url,
    apiKey
}: {
    url: string;
    apiKey: string;
}): Promise<CombinedPerformanceData> {
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

    // Fetch both mobile and desktop data - if one fails, use fallback for that one
    const [mobileData, desktopData] = await Promise.all([
        getFullPageSpeedDashboardData({ url: formattedUrl, apiKey, strategy: 'mobile' }),
        getFullPageSpeedDashboardData({ url: formattedUrl, apiKey, strategy: 'desktop' })
    ]);

    return {
        mobile: mobileData,
        desktop: desktopData
    };
}
