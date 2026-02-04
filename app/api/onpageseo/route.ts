import { NextResponse } from 'next/server';
import { scrapeWebsiteServer } from '@/lib/scraper';
import { runOnPageSEOAnalysis } from '@/lib/onpageseo/server-analysis';

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

        return NextResponse.json({
            url: websiteData.url,
            onPageSEO
        });
    } catch (error) {
        console.error('On-page SEO analysis error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze website' },
            { status: 500 }
        );
    }
}
