import { NextResponse } from 'next/server';
import { scrapeWebsiteServer } from '@/lib/scraper';
import { runOnPageSEOAnalysis } from '@/lib/onpageseo/server-analysis';
import { getFullPageSpeedDashboardData, getCombinedPageSpeedData, CombinedPerformanceData } from '@/lib/pagespeed-dashboard';

export interface UsabilityData {
    desktopScreenshot: {
        exists: boolean;
        dataUrl: string | null;
        width: number;
        height: number;
    };
    mobileScreenshot: {
        exists: boolean;
        dataUrl: string | null;
        width: number;
        height: number;
    };
    mobileFriendly: boolean;
    viewportConfigured: boolean;
    touchElementsSize: {
        tooSmall: number;
        appropriate: number;
    };
    desktopMetrics: {
        firstContentfulPaint: { value: number | null; displayValue: string };
        speedIndex: { value: number | null; displayValue: string };
        largestContentfulPaint: { value: number | null; displayValue: string };
        timeToInteractive: { value: number | null; displayValue: string };
        totalBlockingTime: { value: number | null; displayValue: string };
        cumulativeLayoutShift: { value: number | null; displayValue: string };
    };
    mobileMetrics: {
        firstContentfulPaint: { value: number | null; displayValue: string };
        speedIndex: { value: number | null; displayValue: string };
        largestContentfulPaint: { value: number | null; displayValue: string };
        timeToInteractive: { value: number | null; displayValue: string };
        totalBlockingTime: { value: number | null; displayValue: string };
        cumulativeLayoutShift: { value: number | null; displayValue: string };
    };
    desktopScores: {
        performance: number;
        accessibility: number;
        bestPractices: number;
        seo: number;
    };
    mobileScores: {
        performance: number;
        accessibility: number;
        bestPractices: number;
        seo: number;
    };
}

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // Scrape the website
        const websiteData = await scrapeWebsiteServer(url);

        // Fetch comprehensive PageSpeed data (mobile + desktop in parallel - only 2 API calls)
        const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
        let combinedPerformanceData: CombinedPerformanceData | null = null;
        let usabilityData: UsabilityData = {
            desktopScreenshot: {
                exists: false,
                dataUrl: null,
                width: 0,
                height: 0
            },
            mobileScreenshot: {
                exists: false,
                dataUrl: null,
                width: 0,
                height: 0
            },
            mobileFriendly: websiteData.technical?.mobileFriendliness ?? false,
            viewportConfigured: !!websiteData.meta?.viewport,
            touchElementsSize: {
                tooSmall: 0,
                appropriate: 0
            },
            desktopMetrics: {
                firstContentfulPaint: { value: null, displayValue: '' },
                speedIndex: { value: null, displayValue: '' },
                largestContentfulPaint: { value: null, displayValue: '' },
                timeToInteractive: { value: null, displayValue: '' },
                totalBlockingTime: { value: null, displayValue: '' },
                cumulativeLayoutShift: { value: null, displayValue: '' }
            },
            mobileMetrics: {
                firstContentfulPaint: { value: null, displayValue: '' },
                speedIndex: { value: null, displayValue: '' },
                largestContentfulPaint: { value: null, displayValue: '' },
                timeToInteractive: { value: null, displayValue: '' },
                totalBlockingTime: { value: null, displayValue: '' },
                cumulativeLayoutShift: { value: null, displayValue: '' }
            },
            desktopScores: {
                performance: 0,
                accessibility: 0,
                bestPractices: 0,
                seo: 0
            },
            mobileScores: {
                performance: 0,
                accessibility: 0,
                bestPractices: 0,
                seo: 0
            }
        };

        console.log('[DEBUG] Google PageSpeed API Key exists:', !!apiKey);
        console.log('[DEBUG] API Key length:', apiKey?.length || 0);

        if (apiKey) {
            try {
                console.log('[DEBUG] Fetching combined PageSpeed data (mobile + desktop) for:', url);

                // Make only 2 API calls in parallel - one for mobile, one for desktop
                combinedPerformanceData = await getCombinedPageSpeedData({
                    url,
                    apiKey
                });

                console.log('[DEBUG] Combined PageSpeed data fetched successfully');
                console.log('[DEBUG] Mobile screenshot exists:', combinedPerformanceData.mobile.screenshot.exists);
                console.log('[DEBUG] Desktop screenshot exists:', combinedPerformanceData.desktop.screenshot.exists);

                // Extract screenshots from the combined data
                usabilityData.mobileScreenshot = combinedPerformanceData.mobile.screenshot;
                usabilityData.desktopScreenshot = combinedPerformanceData.desktop.screenshot;

                // Extract metrics from both mobile and desktop
                usabilityData.mobileMetrics = {
                    firstContentfulPaint: combinedPerformanceData.mobile.metrics.firstContentfulPaint,
                    speedIndex: combinedPerformanceData.mobile.metrics.speedIndex,
                    largestContentfulPaint: combinedPerformanceData.mobile.metrics.largestContentfulPaint,
                    timeToInteractive: combinedPerformanceData.mobile.metrics.timeToInteractive,
                    totalBlockingTime: combinedPerformanceData.mobile.metrics.totalBlockingTime,
                    cumulativeLayoutShift: combinedPerformanceData.mobile.metrics.cumulativeLayoutShift
                };

                usabilityData.desktopMetrics = {
                    firstContentfulPaint: combinedPerformanceData.desktop.metrics.firstContentfulPaint,
                    speedIndex: combinedPerformanceData.desktop.metrics.speedIndex,
                    largestContentfulPaint: combinedPerformanceData.desktop.metrics.largestContentfulPaint,
                    timeToInteractive: combinedPerformanceData.desktop.metrics.timeToInteractive,
                    totalBlockingTime: combinedPerformanceData.desktop.metrics.totalBlockingTime,
                    cumulativeLayoutShift: combinedPerformanceData.desktop.metrics.cumulativeLayoutShift
                };

                // Extract scores from both mobile and desktop
                usabilityData.desktopScores = {
                    performance: combinedPerformanceData.desktop.scores.performance || 0,
                    accessibility: combinedPerformanceData.desktop.scores.accessibility || 0,
                    bestPractices: combinedPerformanceData.desktop.scores['best-practices'] || 0,
                    seo: combinedPerformanceData.desktop.scores.seo || 0
                };

                usabilityData.mobileScores = {
                    performance: combinedPerformanceData.mobile.scores.performance || 0,
                    accessibility: combinedPerformanceData.mobile.scores.accessibility || 0,
                    bestPractices: combinedPerformanceData.mobile.scores['best-practices'] || 0,
                    seo: combinedPerformanceData.mobile.scores.seo || 0
                };

            } catch (error: any) {
                console.error('[ERROR] Failed to fetch combined PageSpeed data:', error);
                console.error('[ERROR] Error details:', error?.message || 'Unknown error');
            }
        } else {
            console.warn('[WARN] Google PageSpeed API key not found in environment variables');
        }

        // Use mobile data as the primary performance data
        let performanceData = combinedPerformanceData?.mobile || null;

        // Ensure we always have some performance data for the UI
        if (!performanceData) {
            console.log('[INFO] Using fallback performance data');
            performanceData = {
                url: url,
                strategy: "mobile",
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

        // Run on-page SEO analysis
        const onPageSEO = runOnPageSEOAnalysis({
            title: websiteData.title,
            metaDescription: websiteData.metaDescription,
            headings: websiteData.headings,
            meta: {
                openGraph: websiteData.meta.openGraph,
                canonical: websiteData.meta.canonical,
                noindex: websiteData.meta.noindex,
                robotsContent: websiteData.meta.robotsContent,
            },
            performance: {
                wordCount: websiteData.performance?.wordCount || 0
            },
            lang: websiteData.technical?.technicalSEO?.langAttribute || undefined,
            images: websiteData.images.map(img => ({
                src: img.src,
                alt: img.alt,
                width: img.width,
                height: img.height,
                loading: img.loading
            })),
            security: {
                sslEnabled: websiteData.security?.sslEnabled,
                httpsRedirect: websiteData.security?.httpsRedirect,
            },
            crawlers: {
                robotsTxtUrl: websiteData.crawlers?.robotsTxtUrl || null,
                robotsTxtExists: websiteData.crawlers?.robotsTxtExists || false,
                blockedByRobots: websiteData.crawlers?.blockedByRobots || false,
                llmsTxtUrl: websiteData.crawlers?.llmsTxtUrl || null,
                llmsTxtExists: websiteData.crawlers?.llmsTxtExists || false,
            },
            sitemaps: {
                xmlSitemapUrl: websiteData.sitemaps?.xmlSitemapUrl || null,
                xmlSitemapExists: websiteData.sitemaps?.xmlSitemapExists || false,
            },
            analytics: {
                hasAnalytics: websiteData.analytics?.hasAnalytics || false,
                analyticsType: websiteData.analytics?.analyticsType || null,
            },
            structuredData: {
                hasJsonLd: websiteData.structuredData?.hasJsonLd || false,
                schemaTypes: websiteData.structuredData?.schemaTypes || [],
                hasOrganizationSchema: websiteData.structuredData?.hasOrganizationSchema || false,
                hasPersonSchema: websiteData.structuredData?.hasPersonSchema || false,
                organizationName: websiteData.structuredData?.organizationName || null,
            },
        });

        console.log('[DEBUG] Final API response - Performance data exists:', !!performanceData);
        console.log('[DEBUG] Final API response - Usability data exists:', !!usabilityData);

        return NextResponse.json({
            url: websiteData.url,
            onPageSEO,
            performance: performanceData,
            usability: usabilityData,
            combinedPerformance: combinedPerformanceData
        });
    } catch (error: any) {
        console.error('[ERROR] On-page SEO analysis error:', error);
        console.error('[ERROR] Error message:', error?.message);
        return NextResponse.json(
            { error: 'Failed to analyze website' },
            { status: 500 }
        );
    }
}
