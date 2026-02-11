// On-Page SEO Analysis Result Types
export interface OnPageSEOAnalysis {
    titleTag: {
        exists: boolean;
        title: string;
        length: number;
        isOptimalLength: boolean;
        minLength: number;
        maxLength: number;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    metaDescription: {
        exists: boolean;
        description: string;
        length: number;
        isOptimalLength: boolean;
        minLength: number;
        maxLength: number;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    hreflang: {
        hasHreflang: boolean;
        hreflangEntries: string[];
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    language: {
        hasLangAttribute: boolean;
        declaredLanguage: string | null;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    headers: {
        hasH1: boolean;
        h1Tags: string[];
        headerFrequency: {
            h1: number;
            h2: number;
            h3: number;
            h4: number;
            h5: number;
            h6: number;
        };
        hasMultipleH1: boolean;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    contentAmount: {
        wordCount: number;
        minWords: number;
        maxWords: number;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    imageAlt: {
        totalImages: number;
        imagesWithAlt: number;
        imagesWithoutAlt: number;
        missingPercentage: number;
        status: 'good' | 'warning' | 'error';
        message: string;
        images: Array<{
            src: string;
            alt?: string;
            hasAlt: boolean;
        }>;
    };
    // New sections
    canonicalTag: {
        hasCanonical: boolean;
        canonicalUrl: string | null;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    noindexTag: {
        hasNoindex: boolean;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    noindexHeader: {
        hasNoindexInHeader: boolean;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    sslEnabled: {
        isSSLEnabled: boolean;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    httpsRedirect: {
        isHttpsRedirect: boolean;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    robotsTxt: {
        hasRobotsTxt: boolean;
        robotsTxtUrl: string | null;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    blockedByRobots: {
        isBlocked: boolean;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    llmsTxt: {
        hasLlmsTxt: boolean;
        llmsTxtUrl: string | null;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    xmlSitemap: {
        hasXmlSitemap: boolean;
        xmlSitemapUrl: string | null;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    analytics: {
        hasAnalytics: boolean;
        analyticsType: string | null;
        detectedTools: Array<{
            name: string;
            category: 'analytics' | 'marketing' | 'heatmap' | 'all-in-one';
            confidence: 'high' | 'medium' | 'low';
            detectedBy: string;
            details?: string;
        }>;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    schemaOrg: {
        hasJsonLd: boolean;
        schemaTypes: string[];
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    identitySchema: {
        hasOrganizationSchema: boolean;
        hasPersonSchema: boolean;
        organizationName: string | null;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    // Backlinks data
    backlinks: {
        counts: {
            total: number;
            doFollow: number;
            fromHomePage: number;
            doFollowFromHomePage: number;
            text: number;
            toHomePage: number;
        };
        domains: {
            total: number;
            doFollow: number;
            fromHomePage: number;
            toHomePage: number;
        };
        ips: number | null;
        cBlocks: number | null;
        anchors: number | null;
        anchorUrls: number | null;
        topTLD: string | null;
        topCountry: string | null;
        topAnchorsByBacklinks: Array<{
            anchor: string;
            count: number;
        }>;
        topAnchorsByDomains: Array<{
            anchor: string;
            domains: number;
        }>;
        topAnchorUrlsByBacklinks: Array<{
            url: string;
            count: number;
        }>;
        topAnchorUrlsByDomains: Array<{
            url: string;
            domains: number;
        }>;
    };
    // Individual backlinks list
    backlinkList: Array<{
        url_from: string;
        url_to: string;
        title: string;
        anchor: string;
        alt: string;
        nofollow: boolean;
        image: boolean;
        image_source: string;
        inlink_rank: number;
        domain_inlink_rank: number;
        first_seen: string;
        last_visited: string;
    }>;
}
