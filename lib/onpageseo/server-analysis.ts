import { OnPageSEOAnalysis } from './types';

// Title Tag Analysis
function analyzeTitleTag(title: string): OnPageSEOAnalysis['titleTag'] {
    const minLength = 50;
    const maxLength = 60;
    const length = title.length;

    if (!title || title.trim() === '') {
        return {
            exists: false,
            title: '',
            length: 0,
            isOptimalLength: false,
            minLength,
            maxLength,
            status: 'error',
            message: 'Your page is missing a Title Tag. Title tags are crucial for search engines to understand your page content.',
        };
    }

    if (length < minLength) {
        return {
            exists: true,
            title,
            length,
            isOptimalLength: false,
            minLength,
            maxLength,
            status: 'warning',
            message: `Your Title Tag is too short (${length} characters). It should be between ${minLength} and ${maxLength} characters (including spaces).`,
        };
    }

    if (length > maxLength) {
        return {
            exists: true,
            title,
            length,
            isOptimalLength: false,
            minLength,
            maxLength,
            status: 'warning',
            message: `Your Title Tag is too long (${length} characters). It should be between ${minLength} and ${maxLength} characters (including spaces) to avoid truncation in search results.`,
        };
    }

    return {
        exists: true,
        title,
        length,
        isOptimalLength: true,
        minLength,
        maxLength,
        status: 'good',
        message: `Your Title Tag length is optimal (${length} characters).`,
    };
}

// Meta Description Analysis
function analyzeMetaDescription(metaDescription: string): OnPageSEOAnalysis['metaDescription'] {
    const minLength = 120;
    const maxLength = 160;
    const length = metaDescription.length;

    if (!metaDescription || metaDescription.trim() === '') {
        return {
            exists: false,
            description: '',
            length: 0,
            isOptimalLength: false,
            minLength,
            maxLength,
            status: 'error',
            message: 'Your page is missing a Meta Description. Meta descriptions are important for search engines to understand your page content.',
        };
    }

    if (length < minLength) {
        return {
            exists: true,
            description: metaDescription,
            length,
            isOptimalLength: false,
            minLength,
            maxLength,
            status: 'warning',
            message: `Your Meta Description is too short (${length} characters). It should be between ${minLength} and ${maxLength} characters (including spaces).`,
        };
    }

    if (length > maxLength) {
        return {
            exists: true,
            description: metaDescription,
            length,
            isOptimalLength: false,
            minLength,
            maxLength,
            status: 'warning',
            message: `Your Meta Description is too long (${length} characters). It should be between ${minLength} and ${maxLength} characters (including spaces) to avoid truncation in search results.`,
        };
    }

    return {
        exists: true,
        description: metaDescription,
        length,
        isOptimalLength: true,
        minLength,
        maxLength,
        status: 'good',
        message: `Your Meta Description length is optimal (${length} characters).`,
    };
}

// Hreflang Analysis
function analyzeHreflang(hreflangEntries: string[]): OnPageSEOAnalysis['hreflang'] {
    if (!hreflangEntries || hreflangEntries.length === 0) {
        return {
            hasHreflang: false,
            hreflangEntries: [],
            status: 'warning',
            message: 'Your page is not making use of Hreflang attributes. Hreflang tags help search engines show the correct language/content for your users.',
        };
    }

    return {
        hasHreflang: true,
        hreflangEntries,
        status: 'good',
        message: `Your page uses ${hreflangEntries.length} Hreflang attribute(s) for language/regional targeting.`,
    };
}

// Language Analysis
function analyzeLanguage(langAttribute: string | undefined | null): OnPageSEOAnalysis['language'] {
    if (!langAttribute || langAttribute.trim() === '') {
        return {
            hasLangAttribute: false,
            declaredLanguage: null,
            status: 'warning',
            message: 'Your page is not using the Lang Attribute. Declaring a language helps search engines and assistive technologies understand your content.',
        };
    }

    return {
        hasLangAttribute: true,
        declaredLanguage: langAttribute,
        status: 'good',
        message: `Your page is using the Lang Attribute. Declared: ${langAttribute}`,
    };
}

// Header Tags Analysis
function analyzeHeaderTags(
    h1Tags: string[],
    h2Tags: string[],
    h3Tags: string[],
    h4Tags: string[],
    h5Tags: string[],
    h6Tags: string[]
): OnPageSEOAnalysis['headers'] {
    const safeH1 = Array.isArray(h1Tags) ? h1Tags : [];
    const safeH2 = Array.isArray(h2Tags) ? h2Tags : [];
    const safeH3 = Array.isArray(h3Tags) ? h3Tags : [];
    const safeH4 = Array.isArray(h4Tags) ? h4Tags : [];
    const safeH5 = Array.isArray(h5Tags) ? h5Tags : [];
    const safeH6 = Array.isArray(h6Tags) ? h6Tags : [];

    const headerFrequency = {
        h1: safeH1.length,
        h2: safeH2.length,
        h3: safeH3.length,
        h4: safeH4.length,
        h5: safeH5.length,
        h6: safeH6.length,
    };

    const hasMultipleH1 = safeH1.length > 1;

    if (safeH1.length === 0) {
        return {
            hasH1: false,
            h1Tags: [],
            headerFrequency,
            hasMultipleH1: false,
            status: 'error',
            message: 'Your page is missing an H1 Tag. H1 tags help search engines understand the main topic of your page.',
        };
    }

    if (hasMultipleH1) {
        return {
            hasH1: true,
            h1Tags: safeH1,
            headerFrequency,
            hasMultipleH1: true,
            status: 'warning',
            message: `Your page has ${safeH1.length} H1 Tags. Ideally, you should have only one H1 tag per page for better SEO structure.`,
        };
    }

    if (safeH2.length > 0 || safeH3.length > 0) {
        return {
            hasH1: true,
            h1Tags: safeH1,
            headerFrequency,
            hasMultipleH1: false,
            status: 'good',
            message: `Your page has ${safeH1.length} H1 Tag and uses multiple levels of Header Tags (H2: ${safeH2.length}, H3: ${safeH3.length}).`,
        };
    }

    return {
        hasH1: true,
        h1Tags: safeH1,
        headerFrequency,
        hasMultipleH1: false,
        status: 'good',
        message: `Your page has ${safeH1.length} H1 Tag.`,
    };
}

// Content Amount Analysis
function analyzeContentAmount(wordCount: number): OnPageSEOAnalysis['contentAmount'] {
    const minWords = 300;
    const maxWords = 3500;

    if (wordCount < minWords) {
        return {
            wordCount,
            status: 'warning',
            message: `Your page has ${wordCount} words, which is below the recommended minimum of ${minWords} words. Adding more content can improve your ranking potential.`,
            minWords,
            maxWords,
        };
    }

    if (wordCount > maxWords) {
        return {
            wordCount,
            status: 'warning',
            message: `Your page has ${wordCount} words, which exceeds the recommended maximum of ${maxWords} words. Consider breaking up lengthy content into multiple pages.`,
            minWords,
            maxWords,
        };
    }

    return {
        wordCount,
        status: 'good',
        message: `Your page has a good level of textual content (${wordCount} words), which will assist in its ranking potential.`,
        minWords,
        maxWords,
    };
}

// Image Alt Analysis
function analyzeImageAltAttributes(
    images: Array<{ src: string; alt?: string; hasAlt?: boolean }>
): OnPageSEOAnalysis['imageAlt'] {
    const safeImages = Array.isArray(images) ? images : [];

    const processedImages = safeImages.map(img => ({
        src: img.src,
        alt: img.alt,
        hasAlt: img.hasAlt ?? (!!img.alt && img.alt.trim() !== '')
    }));

    const totalImages = processedImages.length;
    const imagesWithAlt = processedImages.filter(img => img.hasAlt).length;
    const imagesWithoutAlt = totalImages - imagesWithAlt;
    const missingPercentage = totalImages > 0 ? Math.round((imagesWithoutAlt / totalImages) * 100) : 0;

    if (imagesWithoutAlt === 0) {
        return {
            totalImages,
            imagesWithAlt,
            imagesWithoutAlt,
            missingPercentage: 0,
            status: 'good',
            message: `You do not have any images missing Alt Attributes on your page. All ${totalImages} images have proper alt text.`,
            images: processedImages,
        };
    }

    if (missingPercentage <= 50) {
        return {
            totalImages,
            imagesWithAlt,
            imagesWithoutAlt,
            missingPercentage,
            status: 'warning',
            message: `${imagesWithoutAlt} image(s) on your page are missing Alt Attributes (${missingPercentage}% of total). Adding alt text improves accessibility and SEO.`,
            images: processedImages,
        };
    }

    return {
        totalImages,
        imagesWithAlt,
        imagesWithoutAlt,
        missingPercentage,
        status: 'error',
        message: `${imagesWithoutAlt} image(s) on your page are missing Alt Attributes (${missingPercentage}% of total). This significantly impacts accessibility and SEO.`,
        images: processedImages,
    };
}

// Canonical Tag Analysis
function analyzeCanonicalTag(canonical: string | undefined): OnPageSEOAnalysis['canonicalTag'] {
    if (!canonical || canonical.trim() === '') {
        return {
            hasCanonical: false,
            canonicalUrl: null,
            status: 'warning',
            message: 'Your page is not using a Canonical Tag. Canonical tags help prevent duplicate content issues.',
        };
    }

    return {
        hasCanonical: true,
        canonicalUrl: canonical,
        status: 'good',
        message: `Your page is using the Canonical Tag: ${canonical}`,
    };
}

// Noindex Tag Analysis
function analyzeNoindexTag(noindex: boolean | undefined): OnPageSEOAnalysis['noindexTag'] {
    if (noindex) {
        return {
            hasNoindex: true,
            status: 'warning',
            message: 'Your page is using the Noindex Tag which prevents indexing. This means search engines will not index this page.',
        };
    }

    return {
        hasNoindex: false,
        status: 'good',
        message: 'Your page is not using the Noindex Tag which allows indexing.',
    };
}

// Noindex Header Analysis
function analyzeNoindexHeader(robotsContent: string | undefined): OnPageSEOAnalysis['noindexHeader'] {
    const hasNoindexInHeader = robotsContent?.toLowerCase().includes('noindex') || false;

    if (hasNoindexInHeader) {
        return {
            hasNoindexInHeader: true,
            status: 'warning',
            message: 'Your page is using the Noindex Header which prevents indexing.',
        };
    }

    return {
        hasNoindexInHeader: false,
        status: 'good',
        message: 'Your page is not using the Noindex Header which allows indexing.',
    };
}

// SSL Analysis
function analyzeSSL(sslEnabled: boolean | undefined): OnPageSEOAnalysis['sslEnabled'] {
    if (sslEnabled) {
        return {
            isSSLEnabled: true,
            status: 'good',
            message: 'Your website has SSL enabled.',
        };
    }

    return {
        isSSLEnabled: false,
        status: 'error',
        message: 'Your website does not have SSL enabled. This can affect security and SEO.',
    };
}

// HTTPS Redirect Analysis
function analyzeHttpsRedirect(httpsRedirect: boolean | undefined): OnPageSEOAnalysis['httpsRedirect'] {
    if (httpsRedirect) {
        return {
            isHttpsRedirect: true,
            status: 'good',
            message: 'Your page successfully redirects to a HTTPS (SSL secure) version.',
        };
    }

    return {
        isHttpsRedirect: false,
        status: 'warning',
        message: 'Your page does not redirect to HTTPS. Consider redirecting to the secure version.',
    };
}

// Robots.txt Analysis
function analyzeRobotsTxt(robotsTxtExists: boolean | undefined, robotsTxtUrl: string | null): OnPageSEOAnalysis['robotsTxt'] {
    if (robotsTxtExists) {
        return {
            hasRobotsTxt: true,
            robotsTxtUrl: robotsTxtUrl || null,
            status: 'good',
            message: `Your website appears to have a robots.txt file. ${robotsTxtUrl || ''}`,
        };
    }

    return {
        hasRobotsTxt: false,
        robotsTxtUrl: null,
        status: 'warning',
        message: 'Your website does not appear to have a robots.txt file.',
    };
}

// Blocked by Robots.txt Analysis
function analyzeBlockedByRobots(blockedByRobots: boolean | undefined): OnPageSEOAnalysis['blockedByRobots'] {
    if (blockedByRobots) {
        return {
            isBlocked: true,
            status: 'warning',
            message: 'Your page appears to be blocked by robots.txt.',
        };
    }

    return {
        isBlocked: false,
        status: 'good',
        message: 'Your page does not appear to be blocked by robots.txt.',
    };
}

// Llms.txt Analysis
function analyzeLlmsTxt(llmsTxtExists: boolean | undefined, llmsTxtUrl: string | null): OnPageSEOAnalysis['llmsTxt'] {
    if (llmsTxtExists) {
        return {
            hasLlmsTxt: true,
            llmsTxtUrl: llmsTxtUrl || null,
            status: 'good',
            message: `Your website has an llms.txt file. ${llmsTxtUrl || ''}`,
        };
    }

    return {
        hasLlmsTxt: false,
        llmsTxtUrl: null,
        status: 'warning',
        message: 'We have not detected or been able to retrieve an llms.txt file successfully.',
    };
}

// XML Sitemap Analysis
function analyzeXmlSitemap(xmlSitemapExists: boolean | undefined, xmlSitemapUrl: string | null): OnPageSEOAnalysis['xmlSitemap'] {
    if (xmlSitemapExists) {
        return {
            hasXmlSitemap: true,
            xmlSitemapUrl: xmlSitemapUrl || null,
            status: 'good',
            message: `Your website appears to have an XML Sitemap. ${xmlSitemapUrl || ''}`,
        };
    }

    return {
        hasXmlSitemap: false,
        xmlSitemapUrl: null,
        status: 'warning',
        message: 'Your website does not appear to have an XML Sitemap.',
    };
}

// Analytics Analysis
function analyzeAnalytics(hasAnalytics: boolean | undefined, analyticsType: string | null): OnPageSEOAnalysis['analytics'] {
    if (hasAnalytics && analyticsType) {
        return {
            hasAnalytics: true,
            analyticsType,
            status: 'good',
            message: `Your page is using an analytics tool. ${analyticsType}`,
        };
    }

    if (hasAnalytics) {
        return {
            hasAnalytics: true,
            analyticsType: null,
            status: 'good',
            message: 'Your page is using an analytics tool.',
        };
    }

    return {
        hasAnalytics: false,
        analyticsType: null,
        status: 'warning',
        message: 'Your page is not using an analytics tool. Consider adding analytics to track performance.',
    };
}

// Schema.org Structured Data Analysis
function analyzeStructuredData(hasJsonLd: boolean | undefined, schemaTypes: string[]): OnPageSEOAnalysis['schemaOrg'] {
    if (hasJsonLd && schemaTypes.length > 0) {
        return {
            hasJsonLd: true,
            schemaTypes,
            status: 'good',
            message: `You are using JSON-LD Schema on your page. Types: ${schemaTypes.join(', ')}`,
        };
    }

    if (hasJsonLd) {
        return {
            hasJsonLd: true,
            schemaTypes: [],
            status: 'good',
            message: 'You are using JSON-LD Schema on your page.',
        };
    }

    return {
        hasJsonLd: false,
        schemaTypes: [],
        status: 'warning',
        message: 'Your page is not using JSON-LD Schema markup.',
    };
}

// Identity Schema Analysis
function analyzeIdentitySchema(
    hasOrganizationSchema: boolean | undefined,
    hasPersonSchema: boolean | undefined,
    organizationName: string | null
): OnPageSEOAnalysis['identitySchema'] {
    if (hasOrganizationSchema || hasPersonSchema) {
        const schemaTypes = [];
        if (hasOrganizationSchema) schemaTypes.push('Organization');
        if (hasPersonSchema) schemaTypes.push('Person');

        return {
            hasOrganizationSchema: !!hasOrganizationSchema,
            hasPersonSchema: !!hasPersonSchema,
            organizationName,
            status: 'good',
            message: `Organization or Person Schema identified on the page. ${organizationName || ''}`,
        };
    }

    return {
        hasOrganizationSchema: false,
        hasPersonSchema: false,
        organizationName: null,
        status: 'warning',
        message: 'No Organization or Person Schema identified on the page.',
    };
}

// Main function to run all on-page SEO analysis
export function runOnPageSEOAnalysis(websiteData: {
    title: string;
    metaDescription: string;
    headings: {
        h1?: string[];
        h2?: string[];
        h3?: string[];
        h4?: string[];
        h5?: string[];
        h6?: string[];
    };
    meta: {
        openGraph?: Record<string, string>;
        canonical?: string;
        noindex?: boolean;
        robotsContent?: string;
    };
    performance?: {
        wordCount?: number;
    };
    lang?: string;
    images?: Array<{
        src: string;
        alt?: string;
        width?: string;
        height?: string;
        loading?: string;
    }>;
    security?: {
        sslEnabled?: boolean;
        httpsRedirect?: boolean;
    };
    crawlers?: {
        robotsTxtUrl?: string | null;
        robotsTxtExists?: boolean;
        blockedByRobots?: boolean;
        llmsTxtUrl?: string | null;
        llmsTxtExists?: boolean;
    };
    sitemaps?: {
        xmlSitemapUrl?: string | null;
        xmlSitemapExists?: boolean;
    };
    analytics?: {
        hasAnalytics?: boolean;
        analyticsType?: string | null;
    };
    structuredData?: {
        hasJsonLd?: boolean;
        schemaTypes?: string[];
        hasOrganizationSchema?: boolean;
        hasPersonSchema?: boolean;
        organizationName?: string | null;
    };
}): OnPageSEOAnalysis {
    const hreflangEntries = websiteData.meta?.openGraph?.['alternate']
        ? (Array.isArray(websiteData.meta.openGraph['alternate'])
            ? websiteData.meta.openGraph['alternate']
            : [websiteData.meta.openGraph['alternate']])
        : [];

    const langAttribute = websiteData.lang;

    return {
        titleTag: analyzeTitleTag(websiteData.title),
        metaDescription: analyzeMetaDescription(websiteData.metaDescription),
        hreflang: analyzeHreflang(hreflangEntries),
        language: analyzeLanguage(langAttribute),
        headers: analyzeHeaderTags(
            websiteData.headings?.h1 || [],
            websiteData.headings?.h2 || [],
            websiteData.headings?.h3 || [],
            websiteData.headings?.h4 || [],
            websiteData.headings?.h5 || [],
            websiteData.headings?.h6 || []
        ),
        contentAmount: analyzeContentAmount(websiteData.performance?.wordCount || 0),
        imageAlt: analyzeImageAltAttributes(
            (websiteData.images || []).map(img => ({
                src: img.src,
                alt: img.alt || '',
                hasAlt: !!(img.alt && img.alt.trim() !== '')
            }))
        ),
        canonicalTag: analyzeCanonicalTag(websiteData.meta?.canonical),
        noindexTag: analyzeNoindexTag(websiteData.meta?.noindex),
        noindexHeader: analyzeNoindexHeader(websiteData.meta?.robotsContent),
        sslEnabled: analyzeSSL(websiteData.security?.sslEnabled),
        httpsRedirect: analyzeHttpsRedirect(websiteData.security?.httpsRedirect),
        robotsTxt: analyzeRobotsTxt(websiteData.crawlers?.robotsTxtExists, websiteData.crawlers?.robotsTxtUrl),
        blockedByRobots: analyzeBlockedByRobots(websiteData.crawlers?.blockedByRobots),
        llmsTxt: analyzeLlmsTxt(websiteData.crawlers?.llmsTxtExists, websiteData.crawlers?.llmsTxtUrl),
        xmlSitemap: analyzeXmlSitemap(websiteData.sitemaps?.xmlSitemapExists, websiteData.sitemaps?.xmlSitemapUrl),
        analytics: analyzeAnalytics(websiteData.analytics?.hasAnalytics, websiteData.analytics?.analyticsType),
        schemaOrg: analyzeStructuredData(websiteData.structuredData?.hasJsonLd, websiteData.structuredData?.schemaTypes || []),
        identitySchema: analyzeIdentitySchema(
            websiteData.structuredData?.hasOrganizationSchema,
            websiteData.structuredData?.hasPersonSchema,
            websiteData.structuredData?.organizationName
        ),
    };
}
