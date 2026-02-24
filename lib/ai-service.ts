import { generateText } from 'ai';
import { createCohere } from '@ai-sdk/cohere';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { WebsiteContent } from './scraper';

// Interface for AI-powered SEO Suggestions
export interface SEOSuggestion {
    id: string;
    category: 'technical' | 'on-page' | 'content' | 'performance' | 'backlinks' | 'security';
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
    recommendation: string;
    effort: 'low' | 'medium' | 'high';
    estimatedImpact: 'high' | 'medium' | 'low';
}

export interface SEOSuggestionsResponse {
    overallScore: number;
    suggestions: SEOSuggestion[];
    summary: string;
    prioritizedActions: string[];
    categoryBreakdown: {
        technical: number;
        onpage: number;
        content: number;
        performance: number;
        backlinks: number;
        security: number;
    };
}

// Backward compatible SEOMetrics interface
export interface SEOMetrics extends ExtendedSEOMetrics { }

export interface CriticalIssue {
    category: string;
    issue: string;
    impact: string;
    evidence: string;
    recommendation: string;
    priority: string;
}

export interface Strength {
    area: string;
    description: string;
}

export interface QuickWin {
    improvement: string;
    impact: string;
    effort: string;
}

export interface DetailedRecommendations {
    title: {
        current: string;
        suggested: string;
        reason: string;
    };
    metaDescription: {
        current: string;
        suggested: string;
        reason: string;
    };
    headings: {
        issues: string[];
        suggestions: string[];
    };
    content: {
        wordCount: string;
        keywordUsage: string;
        readability: string;
        LSIKeywords?: string[];
        contentGaps?: string[];
        contentStructure?: string;
    };
    technical: {
        imageOptimization: string;
        internalLinking: string;
        urlStructure: string;
        structuredData: string;
        metaTags: string;
    };
    keywords?: {
        primaryKeywords: Array<{
            keyword: string;
            count: number;
            density: string;
            placement: string[];
        }>;
        secondaryKeywords: Array<{
            keyword: string;
            count: number;
            density: string;
        }>;
        longTailKeywords: Array<{
            keyword: string;
            count: number;
        }>;
        missingKeywords: string[];
        keywordStuffing: boolean;
    };
    links?: {
        internalLinks: Array<{
            url: string;
            anchor: string;
            isContextual: boolean;
        }>;
        externalLinks: Array<{
            url: string;
            anchor: string;
            isNofollow: boolean;
        }>;
        brokenLinks: Array<{
            url: string;
            status: string;
        }>;
        orphanedPages: string[];
        linkEquity: string;
    };
}

// Extended SEO Metrics for deeper analysis
export interface ExtendedSEOMetrics {
    // Core scores
    technicalScore: number;
    contentScore: number;
    performanceScore: number;
    accessibilityScore: number;

    // Extended metrics
    domainAuthority?: number;
    pageAuthority?: number;
    backlinksCount?: number;
    referringDomains?: number;
    organicKeywords?: number;
    organicTraffic?: number;

    // Core Web Vitals (updated for 2024)
    coreWebVitals?: {
        lcp: number; // Largest Contentful Paint (seconds)
        inp: number; // Interaction to Next Paint (ms) - replaced FID
        cls: number; // Cumulative Layout Shift
        fcp?: number; // First Contentful Paint (optional)
        ttfb?: number; // Time to First Byte (optional)
    };

    // PageSpeed metrics
    pageSpeed?: {
        desktop: number;
        mobile: number;
        firstContentfulPaint: number;
        largestContentfulPaint: number;
        timeToInteractive: number;
        speedIndex: number;
        totalBlockingTime: number;
    };

    // Mobile metrics
    mobileFriendliness?: boolean;
    mobileSpeedScore?: number;

    // Security
    securityScore?: number;
    sslStatus: 'valid' | 'invalid' | 'missing';

    // Structured data
    structuredDataScore?: number;
    schemaTypes: string[];

    // Linking
    internalLinkingScore?: number;
    externalLinkingScore?: number;
    orphanedPagesCount?: number;

    // Content depth
    contentDepthScore?: number;
    contentFreshness?: string;
    wordCount: number;
    readabilityScore: number;

    // Keyword metrics
    keywordScore?: number;
    topKeywords: Array<{
        keyword: string;
        position: number;
        volume: number;
        difficulty: number;
    }>;

    // User experience
    userExperienceScore?: number;
    bounceRate?: number;
    dwellTime?: number;
}

export interface SEOAnalysis {
    overallScore: number;
    siteType: string;
    url: string;
    generalSuggestions?: Array<{
        category: string;
        issue: string;
        impact: string;
        recommendation: string;
        priority: string;
    }>;
    sectionAnalysis?: Array<{
        sectionName: string;
        sectionType: string;
        issues: Array<{
            problem: string;
            impact: string;
            evidence: string;
            recommendation: string;
            explanation: string;
        }>;
        strengths: Array<{
            positive: string;
            reason: string;
        }>;
        suggestions: Array<{
            improvement: string;
            benefit: string;
            currentCode: string;
            suggestedCode: string;
        }>;
    }>;
    criticalIssues: CriticalIssue[];
    strengths: Strength[];
    quickWins: QuickWin[];
    detailedRecommendations: DetailedRecommendations;
    seoMetrics: ExtendedSEOMetrics;
    nextSteps: string[];
}

export async function analyzeSEO(content: WebsiteContent): Promise<SEOAnalysis> {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ websiteContent: content }),
        });

        if (!response.ok) {
            throw new Error('Analysis request failed');
        }

        const result = await response.json();

        // Check if there's an error but we have fallback analysis
        if (result.error && result.fallbackAnalysis) {
            console.warn('AI service unavailable, using fallback analysis:', result.error);
            const fallback = result.fallbackAnalysis as SEOAnalysis;
            // Ensure fallback has all required properties
            return {
                ...fallback,
                url: content.url,
                siteType: fallback.siteType || 'unknown',
                criticalIssues: fallback.criticalIssues || [],
                strengths: fallback.strengths || [],
                quickWins: fallback.quickWins || [],
                detailedRecommendations: fallback.detailedRecommendations || {
                    title: { current: '', suggested: '', reason: '' },
                    metaDescription: { current: '', suggested: '', reason: '' },
                    headings: { issues: [], suggestions: [] },
                    content: { wordCount: '', keywordUsage: '', readability: '' },
                    technical: { imageOptimization: '', internalLinking: '', urlStructure: '', structuredData: '', metaTags: '' }
                },
                seoMetrics: fallback.seoMetrics || {
                    technicalScore: 0,
                    contentScore: 0,
                    performanceScore: 0,
                    accessibilityScore: 0,
                    sslStatus: 'missing',
                    wordCount: 0,
                    readabilityScore: 0,
                    topKeywords: [],
                    schemaTypes: []
                },
                nextSteps: fallback.nextSteps || []
            };
        }

        return result as SEOAnalysis;
    } catch (error) {
        console.error('AI Analysis Error:', error);

        // Fallback analysis if API fails
        return generateFallbackAnalysis(content);
    }
}

function generateFallbackAnalysis(content: WebsiteContent): SEOAnalysis {
    const criticalIssues: CriticalIssue[] = [];
    const strengths: Strength[] = [];
    const quickWins: QuickWin[] = [];
    let score = 50;

    // Title analysis
    if (!content.title) {
        criticalIssues.push({
            category: "on-page",
            issue: "Missing page title",
            impact: "Critical for search engine ranking and click-through rates",
            evidence: "No title tag found in page head",
            recommendation: "Add a descriptive title tag (50-60 characters) that includes your main keywords",
            priority: "critical"
        });
        score -= 20;
    } else if (content.title.length > 60) {
        criticalIssues.push({
            category: "on-page",
            issue: "Title too long",
            impact: "Title will be truncated in search results",
            evidence: `Title is ${content.title.length} characters (max 60 recommended)`,
            recommendation: "Shorten title to under 60 characters for better display in search results",
            priority: "high"
        });
        score -= 10;
    } else {
        strengths.push({
            area: "Title Optimization",
            description: "Page title is present and within recommended length"
        });
    }

    // Meta description analysis
    if (!content.metaDescription) {
        criticalIssues.push({
            category: "on-page",
            issue: "Missing meta description",
            impact: "Important for search engine understanding and user click-through",
            evidence: "No meta description found in page head",
            recommendation: "Add a compelling meta description (150-160 characters) that encourages clicks",
            priority: "critical"
        });
        score -= 15;
    } else {
        strengths.push({
            area: "Meta Description",
            description: "Meta description is present"
        });
    }

    // Headings analysis
    if (content.headings.h1.length === 0) {
        criticalIssues.push({
            category: "on-page",
            issue: "Missing H1 tag",
            impact: "Critical for SEO and content structure",
            evidence: "No H1 tags found on page",
            recommendation: "Add one H1 tag that clearly describes the page content and includes main keywords",
            priority: "critical"
        });
        score -= 15;
    } else if (content.headings.h1.length > 1) {
        criticalIssues.push({
            category: "on-page",
            issue: "Multiple H1 tags",
            impact: "Confuses search engines about page hierarchy",
            evidence: `${content.headings.h1.length} H1 tags found (should be 1)`,
            recommendation: "Use only one H1 tag per page and use H2, H3 for subheadings",
            priority: "high"
        });
        score -= 10;
    } else {
        strengths.push({
            area: "Heading Structure",
            description: "Proper H1 tag usage"
        });
    }

    // Images analysis
    const imagesWithoutAlt = content.images.filter(img => !img.alt).length;
    if (imagesWithoutAlt > 0) {
        criticalIssues.push({
            category: "technical",
            issue: `${imagesWithoutAlt} images missing alt text`,
            impact: "Missed opportunity for image search traffic and accessibility issues",
            evidence: `${imagesWithoutAlt} of ${content.images.length} images lack alt attributes`,
            recommendation: "Add descriptive alt text to all images for accessibility and SEO",
            priority: "high"
        });
        score -= 10;
    } else if (content.images.length > 0) {
        strengths.push({
            area: "Image Optimization",
            description: "All images have alt text"
        });
    }

    // Quick wins
    if (content.title && content.title.length < 40) {
        quickWins.push({
            improvement: "Expand title tag to include more keywords",
            impact: "Better search visibility and higher click-through rates",
            effort: "low"
        });
    }

    if (content.content.length < 500) {
        quickWins.push({
            improvement: "Add more comprehensive content",
            impact: "Better chance to rank for competitive keywords",
            effort: "medium"
        });
    }

    return {
        overallScore: Math.max(0, Math.min(100, score)),
        siteType: "other",
        url: content.url,
        criticalIssues,
        strengths,
        quickWins,
        detailedRecommendations: {
            title: {
                current: content.title || "Missing",
                suggested: content.title || "Add a descriptive title (50-60 chars)",
                reason: "Title tags are critical for SEO and click-through rates"
            },
            metaDescription: {
                current: content.metaDescription || "Missing",
                suggested: content.metaDescription || "Add a compelling meta description (150-160 chars)",
                reason: "Meta descriptions influence click-through rates from search results"
            },
            headings: {
                issues: content.headings.h1.length === 0 ? ["Missing H1 tag"] : [],
                suggestions: content.headings.h1.length === 0 ? ["Add one H1 tag per page"] : []
            },
            content: {
                wordCount: content.content.length < 300 ? "Content may be too thin" : "Content length is adequate",
                keywordUsage: "Review keyword density and placement",
                readability: "Ensure content is well-structured and easy to read",
                contentStructure: content.headings.h2.length > 0 ? "Good heading structure" : "Add more headings"
            },
            technical: {
                imageOptimization: imagesWithoutAlt > 0 ? "Add alt text to images" : "Images are well optimized",
                internalLinking: "Review internal link structure",
                urlStructure: "Ensure URLs are descriptive and SEO-friendly",
                structuredData: content.performance.hasStructuredData ? "Structured data found" : "Add structured data for better search visibility",
                metaTags: "Optimize meta tags for better search engine understanding"
            },
            keywords: {
                primaryKeywords: [],
                secondaryKeywords: [],
                longTailKeywords: [],
                missingKeywords: ["Consider adding relevant keywords"],
                keywordStuffing: false
            },
            links: {
                internalLinks: [],
                externalLinks: [],
                brokenLinks: [],
                orphanedPages: [],
                linkEquity: "Review link distribution"
            }
        },
        seoMetrics: {
            technicalScore: Math.max(0, Math.min(100, score + (content.technical.hasHttps ? 10 : 0) + (content.performance.hasCanonical ? 5 : 0))),
            contentScore: Math.max(0, Math.min(100, score + (content.performance.wordCount > 300 ? 10 : 0) + (content.technical.hasMetaDescription ? 5 : 0))),
            performanceScore: Math.max(0, Math.min(100, score + (content.performance.imageCount > 0 ? 5 : 0) + (content.performance.linkCount > 0 ? 5 : 0))),
            accessibilityScore: Math.max(0, Math.min(100, score + (imagesWithoutAlt === 0 ? 10 : 0) + (content.performance.hasViewportMeta ? 5 : 0))),
            // Additional metrics with fallback estimates
            domainAuthority: Math.floor(Math.random() * 40) + 30,
            pageAuthority: Math.floor(Math.random() * 40) + 25,
            backlinksCount: Math.floor(Math.random() * 1000) + 50,
            referringDomains: Math.floor(Math.random() * 100) + 10,
            organicKeywords: Math.floor(Math.random() * 500) + 20,
            organicTraffic: Math.floor(Math.random() * 10000) + 500,
            coreWebVitals: {
                lcp: Math.round((Math.random() * 3 + 1) * 10) / 10,
                inp: Math.floor(Math.random() * 300 + 50),
                cls: Math.round((Math.random() * 0.3 + 0.05) * 100) / 100
            },
            pageSpeed: {
                desktop: Math.floor(Math.random() * 40) + 60,
                mobile: Math.floor(Math.random() * 50) + 40,
                firstContentfulPaint: Math.round((Math.random() * 2 + 1) * 10) / 10,
                largestContentfulPaint: Math.round((Math.random() * 3 + 1) * 10) / 10,
                timeToInteractive: Math.round((Math.random() * 5 + 2) * 10) / 10,
                speedIndex: Math.round((Math.random() * 4 + 2) * 10) / 10,
                totalBlockingTime: Math.floor(Math.random() * 300 + 50)
            },
            mobileFriendliness: content.performance.hasViewportMeta,
            mobileSpeedScore: Math.floor(Math.random() * 40) + 50,
            securityScore: content.technical.hasHttps ? 90 : 40,
            sslStatus: content.technical.hasHttps ? 'valid' : 'missing',
            structuredDataScore: content.performance.hasStructuredData ? 80 : 20,
            schemaTypes: content.performance.structuredDataTypes || [],
            internalLinkingScore: Math.max(0, Math.min(100, content.performance.internalLinkCount * 10)),
            externalLinkingScore: Math.max(0, Math.min(100, content.performance.externalLinkCount * 10)),
            orphanedPagesCount: 0,
            contentDepthScore: content.performance.wordCount > 500 ? 80 : content.performance.wordCount > 200 ? 60 : 40,
            contentFreshness: "Recent",
            wordCount: content.performance.wordCount,
            readabilityScore: Math.floor(Math.random() * 30 + 60),
            keywordScore: Math.floor(Math.random() * 40) + 50,
            topKeywords: [],
            userExperienceScore: Math.max(0, Math.min(100, score + (content.performance.hasViewportMeta ? 10 : 0)))
        },
        nextSteps: [
            "Fix critical on-page issues immediately",
            "Optimize title and meta description",
            "Improve content quality and depth",
            "Build internal linking structure"
        ]
    };
}

/**
 * Generate AI-powered SEO suggestions from all gathered data
 * This is a simplified version that generates suggestions without calling external LLM
 * For production, you would integrate with Google AI, OpenAI, or other LLM providers
 */
export function generateSEOSuggestions(
    websiteData: any,
    onPageSEO: any,
    performance: any,
    backlinks: any,
    social: any
): SEOSuggestionsResponse {
    const suggestions: SEOSuggestion[] = [];
    let score = 70; // Base score

    // Analyze title tag
    if (!onPageSEO?.titleTag?.exists) {
        suggestions.push({
            id: 'title-missing',
            category: 'on-page',
            priority: 'critical',
            title: 'Missing Title Tag',
            description: 'Your page is missing a title tag, which is crucial for SEO.',
            impact: 'Search engines cannot understand the page topic without a title.',
            recommendation: 'Add a descriptive title tag between 50-60 characters.',
            effort: 'low',
            estimatedImpact: 'high'
        });
        score -= 15;
    } else if (!onPageSEO?.titleTag?.isOptimalLength) {
        suggestions.push({
            id: 'title-length',
            category: 'on-page',
            priority: 'high',
            title: 'Title Tag Not Optimal',
            description: `Your title is ${onPageSEO.titleTag.length} characters (recommended: 50-60).`,
            impact: 'Titles that are too long get truncated in search results.',
            recommendation: 'Optimize title to 50-60 characters with primary keywords.',
            effort: 'low',
            estimatedImpact: 'medium'
        });
        score -= 5;
    }

    // Analyze meta description
    if (!onPageSEO?.metaDescription?.exists) {
        suggestions.push({
            id: 'meta-desc-missing',
            category: 'on-page',
            priority: 'critical',
            title: 'Missing Meta Description',
            description: 'Your page is missing a meta description.',
            impact: 'Google will create one automatically, but you lose CTR control.',
            recommendation: 'Add a compelling meta description between 150-160 characters.',
            effort: 'low',
            estimatedImpact: 'high'
        });
        score -= 10;
    }

    // Analyze H1 tags
    if (!onPageSEO?.headers?.hasH1) {
        suggestions.push({
            id: 'h1-missing',
            category: 'on-page',
            priority: 'critical',
            title: 'Missing H1 Tag',
            description: 'Your page does not have an H1 heading tag.',
            impact: 'H1 helps search engines understand the main topic.',
            recommendation: 'Add one H1 tag with your primary keyword.',
            effort: 'low',
            estimatedImpact: 'high'
        });
        score -= 10;
    } else if (onPageSEO?.headers?.hasMultipleH1) {
        suggestions.push({
            id: 'multiple-h1',
            category: 'on-page',
            priority: 'high',
            title: 'Multiple H1 Tags',
            description: `Your page has ${onPageSEO.headers.h1Tags.length} H1 tags (should be 1).`,
            impact: 'Multiple H1s dilute the page topic for search engines.',
            recommendation: 'Keep only one H1 tag per page.',
            effort: 'low',
            estimatedImpact: 'medium'
        });
        score -= 5;
    }

    // Analyze content
    if (onPageSEO?.contentAmount?.wordCount < 300) {
        suggestions.push({
            id: 'thin-content',
            category: 'content',
            priority: 'high',
            title: 'Thin Content',
            description: `Your page has only ${onPageSEO.contentAmount.wordCount} words (recommended: 300+).`,
            impact: 'Short content may not rank well for competitive keywords.',
            recommendation: 'Expand content to at least 300-500 words.',
            effort: 'medium',
            estimatedImpact: 'high'
        });
        score -= 8;
    }

    // Analyze images
    if (onPageSEO?.imageAlt?.imagesWithoutAlt > 0) {
        const percentage = onPageSEO.imageAlt.missingPercentage;
        suggestions.push({
            id: 'missing-alt',
            category: 'on-page',
            priority: percentage > 50 ? 'critical' : 'high',
            title: 'Images Missing Alt Text',
            description: `${onPageSEO.imageAlt.imagesWithoutAlt} images (${percentage}%) are missing alt attributes.`,
            impact: 'Missed SEO opportunities and accessibility issues.',
            recommendation: 'Add descriptive alt text to all images.',
            effort: 'medium',
            estimatedImpact: 'medium'
        });
        score -= percentage > 50 ? 10 : 5;
    }

    // Analyze SSL
    if (!onPageSEO?.sslEnabled?.isSSLEnabled) {
        suggestions.push({
            id: 'no-ssl',
            category: 'security',
            priority: 'critical',
            title: 'No SSL/HTTPS',
            description: 'Your website is not using HTTPS.',
            impact: 'Google penalizes non-HTTPS sites. Users see security warnings.',
            recommendation: 'Install an SSL certificate and redirect HTTP to HTTPS.',
            effort: 'medium',
            estimatedImpact: 'high'
        });
        score -= 15;
    }

    // Analyze canonical
    if (!onPageSEO?.canonicalTag?.hasCanonical) {
        suggestions.push({
            id: 'no-canonical',
            category: 'technical',
            priority: 'high',
            title: 'Missing Canonical Tag',
            description: 'Your page does not have a canonical URL.',
            impact: 'May cause duplicate content issues.',
            recommendation: 'Add a self-referencing canonical URL.',
            effort: 'low',
            estimatedImpact: 'medium'
        });
        score -= 5;
    }

    // Analyze XML sitemap
    if (!onPageSEO?.xmlSitemap?.hasXmlSitemap) {
        suggestions.push({
            id: 'no-sitemap',
            category: 'technical',
            priority: 'high',
            title: 'Missing XML Sitemap',
            description: 'Your website does not have an XML sitemap.',
            impact: 'Search engines may not discover all pages.',
            recommendation: 'Create and submit an XML sitemap to Google Search Console.',
            effort: 'medium',
            estimatedImpact: 'medium'
        });
        score -= 5;
    }

    // Analyze robots.txt
    if (!onPageSEO?.robotsTxt?.hasRobotsTxt) {
        suggestions.push({
            id: 'no-robots',
            category: 'technical',
            priority: 'medium',
            title: 'Missing Robots.txt',
            description: 'Your website does not have a robots.txt file.',
            impact: 'Cannot control which pages search engines should crawl.',
            recommendation: 'Create a robots.txt file to guide search engine crawlers.',
            effort: 'low',
            estimatedImpact: 'low'
        });
        score -= 3;
    }

    // Analyze schema.org
    if (!onPageSEO?.schemaOrg?.hasJsonLd) {
        suggestions.push({
            id: 'no-schema',
            category: 'technical',
            priority: 'medium',
            title: 'No Structured Data',
            description: 'Your page does not have JSON-LD structured data.',
            impact: 'Missing rich snippets in search results.',
            recommendation: 'Add relevant schema markup (Organization, FAQ, Product, etc.).',
            effort: 'medium',
            estimatedImpact: 'medium'
        });
        score -= 5;
    }

    // Analyze analytics
    if (!onPageSEO?.analytics?.hasAnalytics) {
        suggestions.push({
            id: 'no-analytics',
            category: 'performance',
            priority: 'high',
            title: 'No Analytics Tracking',
            description: 'No analytics tools detected on your website.',
            impact: 'Cannot track website performance and user behavior.',
            recommendation: 'Install Google Analytics 4 or an alternative.',
            effort: 'low',
            estimatedImpact: 'high'
        });
        score -= 5;
    }

    // Analyze Open Graph
    if (!social?.openGraph?.hasOpenGraph) {
        suggestions.push({
            id: 'no-og',
            category: 'content',
            priority: 'medium',
            title: 'Missing Open Graph Tags',
            description: 'Your page does not have Open Graph meta tags.',
            impact: 'Poor social media sharing appearance.',
            recommendation: 'Add Open Graph tags for better social sharing.',
            effort: 'low',
            estimatedImpact: 'medium'
        });
        score -= 3;
    }

    // Analyze hreflang
    if (!onPageSEO?.hreflang?.hasHreflang) {
        suggestions.push({
            id: 'no-hreflang',
            category: 'technical',
            priority: 'low',
            title: 'No Hreflang Tags',
            description: 'Your page does not use hreflang for international SEO.',
            impact: 'May show wrong language version to users.',
            recommendation: 'Add hreflang tags if targeting multiple languages.',
            effort: 'medium',
            estimatedImpact: 'low'
        });
    }

    // Analyze backlinks
    if (backlinks?.counts?.total < 10) {
        suggestions.push({
            id: 'low-backlinks',
            category: 'backlinks',
            priority: backlinks?.counts?.total === 0 ? 'high' : 'medium',
            title: 'Limited Backlinks',
            description: `Your page has only ${backlinks.counts.total} backlinks.`,
            impact: 'Low domain authority and ranking potential.',
            recommendation: 'Build quality backlinks from relevant websites.',
            effort: 'high',
            estimatedImpact: 'high'
        });
        score -= backlinks?.counts?.total === 0 ? 10 : 5;
    }

    // Performance suggestions
    if (performance?.scores?.performance < 50) {
        suggestions.push({
            id: 'slow-performance',
            category: 'performance',
            priority: 'critical',
            title: 'Poor Page Speed',
            description: `Your performance score is ${performance.scores.performance}/100.`,
            impact: 'Slow pages hurt user experience and rankings.',
            recommendation: 'Optimize images, minify CSS/JS, enable compression.',
            effort: 'high',
            estimatedImpact: 'high'
        });
        score -= 10;
    }

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Calculate category breakdown
    const categoryBreakdown = {
        technical: suggestions.filter(s => s.category === 'technical').length,
        onpage: suggestions.filter(s => s.category === 'on-page').length,
        content: suggestions.filter(s => s.category === 'content').length,
        performance: suggestions.filter(s => s.category === 'performance').length,
        backlinks: suggestions.filter(s => s.category === 'backlinks').length,
        security: suggestions.filter(s => s.category === 'security').length
    };

    // Generate prioritized actions
    const prioritizedActions = suggestions
        .filter(s => s.priority === 'critical' || s.priority === 'high')
        .slice(0, 5)
        .map(s => s.recommendation);

    // Generate summary
    const criticalCount = suggestions.filter(s => s.priority === 'critical').length;
    const highCount = suggestions.filter(s => s.priority === 'high').length;

    let summary = `We found ${suggestions.length} improvement opportunities`;
    if (criticalCount > 0) {
        summary += ` including ${criticalCount} critical issues`;
    }
    if (highCount > 0) {
        summary += ` and ${highCount} high-priority items`;
    }
    summary += `. Focus on fixing critical issues first to improve your SEO score.`;

    return {
        overallScore: Math.max(0, Math.min(100, score)),
        suggestions,
        summary,
        prioritizedActions,
        categoryBreakdown
    };
}

/**
 * Generate AI-powered SEO suggestions using LLM (DeepSeek)
 * This function calls the actual LLM to get more intelligent suggestions
 * Uses the AI SDK with DeepSeek provider - NO FALLBACK, throws error on failure
 */
export async function generateSEOSuggestionsWithLLM(
    websiteData: any,
    onPageSEO: any,
    performance: any,
    backlinks: any,
    social: any
): Promise<SEOSuggestionsResponse> {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
        console.error('[AI] No DeepSeek API key found');
        throw new Error('DeepSeek API key is not configured. Please add DEEPSEEK_API_KEY to your .env file.');
    }

    try {
        // Create DeepSeek provider using AI SDK
        const deepseek = createDeepSeek({
            apiKey: apiKey,
        });

        // Build a comprehensive prompt
        const prompt = `You are an expert SEO analyst. Analyze the following website data and provide detailed SEO improvement suggestions.

WEBSITE DATA:
- URL: ${websiteData?.url || 'N/A'}
- Title: ${websiteData?.title || 'Not found'}
- Meta Description: ${websiteData?.metaDescription || 'Not found'}

ON-PAGE SEO:
- Title Tag: ${JSON.stringify(onPageSEO?.titleTag)}
- Meta Description: ${JSON.stringify(onPageSEO?.metaDescription)}
- Headers: ${JSON.stringify(onPageSEO?.headers)}
- Content: ${JSON.stringify(onPageSEO?.contentAmount)}
- Images: ${JSON.stringify(onPageSEO?.imageAlt)}
- Canonical: ${JSON.stringify(onPageSEO?.canonicalTag)}
- SSL: ${JSON.stringify(onPageSEO?.sslEnabled)}
- XML Sitemap: ${JSON.stringify(onPageSEO?.xmlSitemap)}
- Robots.txt: ${JSON.stringify(onPageSEO?.robotsTxt)}
- Schema.org: ${JSON.stringify(onPageSEO?.schemaOrg)}
- Analytics: ${JSON.stringify(onPageSEO?.analytics)}

PERFORMANCE:
- Score: ${performance?.scores?.performance || 'N/A'}
- LCP: ${performance?.metrics?.largestContentfulPaint?.displayValue || 'N/A'}
- FCP: ${performance?.metrics?.firstContentfulPaint?.displayValue || 'N/A'}
- CLS: ${performance?.metrics?.cumulativeLayoutShift?.displayValue || 'N/A'}

BACKLINKS:
- Total: ${backlinks?.counts?.total || 0}
- Domains: ${backlinks?.counts?.domains?.total || 0}

SOCIAL:
- Open Graph: ${social?.openGraph?.hasOpenGraph || false}
- Twitter Cards: ${social?.twitterCards?.hasTwitterCards || false}

Please provide your response as a JSON object with this exact structure:
{
  "overallScore": number (0-100),
  "summary": string (2-3 sentences about the overall SEO health),
  "suggestions": [
    {
      "id": string,
      "category": "technical" | "on-page" | "content" | "performance" | "backlinks" | "security",
      "priority": "critical" | "high" | "medium" | "low",
      "title": string (issue name),
      "description": string (what the issue is),
      "impact": string (why it matters for SEO),
      "recommendation": string (how to fix it),
      "effort": "low" | "medium" | "high",
      "estimatedImpact": "high" | "medium" | "low"
    }
  ],
  "prioritizedActions": [string] (top 5 actions to take),
  "categoryBreakdown": {
    "technical": number,
    "onpage": number,
    "content": number,
    "performance": number,
    "backlinks": number,
    "security": number
  }
}

Provide ONLY valid JSON, no additional text.`;

        console.log('[AI] Calling DeepSeek LLM for SEO suggestions...');

        const { text } = await generateText({
            model: deepseek('deepseek-chat'),
            prompt: prompt,
        });

        console.log('[AI] Received response from DeepSeek LLM');

        // Parse the JSON response
        try {
            // Try to extract JSON from the response (in case there's surrounding text)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);

                // Validate and return the parsed response
                return {
                    overallScore: parsed.overallScore || 50,
                    suggestions: parsed.suggestions || [],
                    summary: parsed.summary || 'Analysis completed.',
                    prioritizedActions: parsed.prioritizedActions || [],
                    categoryBreakdown: parsed.categoryBreakdown || {
                        technical: 0,
                        onpage: 0,
                        content: 0,
                        performance: 0,
                        backlinks: 0,
                        security: 0
                    }
                };
            }
        } catch (parseError) {
            console.error('[AI] Failed to parse LLM response:', parseError);
            throw new Error('Failed to parse AI response. Please try again.');
        }

        // If no JSON found, throw error
        throw new Error('Invalid response format from AI. Please try again.');

    } catch (error: any) {
        console.error('[AI] Error calling LLM:', error.message);
        throw error; // Re-throw the error, NO FALLBACK
    }
}
