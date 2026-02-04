/*
import { NextRequest, NextResponse } from 'next/server';
import { generateText, generateObject } from 'ai';
import { cohere } from '@ai-sdk/cohere';
import { z } from 'zod';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { jsonrepair } from 'jsonrepair';
import { generateSEOPrompt } from '@/lib/seo-prompt';
import { generateOptimizedSEOPrompt } from '@/lib/seo-prompt-optimized';
import { optimizeWebsiteContent, optimizePageSpeedData, optimizeSitemapData } from '@/lib/data-optimizer';
import { deepseek } from '@ai-sdk/deepseek';
import { SeoAuditResponseSchema } from '@/lib/types/llm-response';
import { runOnPageSEOAnalysis } from '@/lib/onpageseo/server-analysis';

// ============================================
// ZOD SCHEMA FOR TYPE-SAFE JSON GENERATION
// ============================================

const CriticalIssueSchema = z.object({
  category: z.enum(['technical', 'on-page', 'content', 'security', 'performance']),
  issue: z.string(),
  impact: z.string(),
  evidence: z.string(),
  recommendation: z.string(),
  priority: z.enum(['critical', 'high', 'medium', 'low'])
});

const StrengthSchema = z.object({
  area: z.string(),
  description: z.string()
});

const QuickWinSchema = z.object({
  improvement: z.string(),
  impact: z.string(),
  effort: z.enum(['low', 'medium', 'high'])
});

const DetailedRecommendationsSchema = z.object({
  title: z.object({
    current: z.string(),
    suggested: z.string(),
    reason: z.string()
  }),
  metaDescription: z.object({
    current: z.string(),
    suggested: z.string(),
    reason: z.string()
  }),
  headings: z.object({
    issues: z.array(z.string()),
    suggestions: z.array(z.string())
  }),
  content: z.object({
    wordCount: z.string(),
    keywordUsage: z.string(),
    readability: z.string(),
    LSIKeywords: z.array(z.string()).optional(),
    contentGaps: z.array(z.string()).optional(),
    contentStructure: z.string().optional()
  }),
  keywords: z.object({
    primaryKeywords: z.array(z.object({
      keyword: z.string(),
      count: z.number(),
      density: z.string(),
      placement: z.array(z.string())
    })),
    secondaryKeywords: z.array(z.object({
      keyword: z.string(),
      count: z.number(),
      density: z.string()
    })),
    longTailKeywords: z.array(z.object({
      keyword: z.string(),
      count: z.number()
    })),
    missingKeywords: z.array(z.string()),
    keywordStuffing: z.boolean()
  }).optional(),
  links: z.object({
    internalLinks: z.array(z.object({
      url: z.string(),
      anchor: z.string(),
      isContextual: z.boolean()
    })),
    externalLinks: z.array(z.object({
      url: z.string(),
      anchor: z.string(),
      isNofollow: z.boolean()
    })),
    brokenLinks: z.array(z.object({
      url: z.string(),
      status: z.string()
    })),
    orphanedPages: z.array(z.string()),
    linkEquity: z.string()
  }).optional(),
  technical: z.object({
    imageOptimization: z.string(),
    internalLinking: z.string(),
    urlStructure: z.string(),
    structuredData: z.string(),
    metaTags: z.string()
  })
});

const CoreWebVitalsSchema = z.object({
  lcp: z.number(),
  inp: z.number(),
  cls: z.number(),
  fcp: z.number().optional(),
  ttfb: z.number().optional()
});

const PageSpeedSchema = z.object({
  desktop: z.number(),
  mobile: z.number(),
  firstContentfulPaint: z.number(),
  largestContentfulPaint: z.number(),
  timeToInteractive: z.number(),
  speedIndex: z.number(),
  totalBlockingTime: z.number()
});

const TopKeywordSchema = z.object({
  keyword: z.string(),
  position: z.number(),
  volume: z.number(),
  difficulty: z.number()
});

const AdditionalMetricsSchema = z.object({
  domainAuthority: z.number(),
  pageAuthority: z.number(),
  backlinksCount: z.number(),
  referringDomains: z.number(),
  organicKeywords: z.number(),
  organicTraffic: z.number(),
  bounceRate: z.number(),
  dwellTime: z.number(),
  conversionRate: z.number()
});

const SEOMetricsSchema = z.object({
  technicalScore: z.number(),
  contentScore: z.number(),
  performanceScore: z.number(),
  accessibilityScore: z.number(),
  securityScore: z.number(),
  mobileSpeedScore: z.number(),
  readabilityScore: z.number(),
  wordCount: z.number(),
  contentDepthScore: z.number(),
  keywordScore: z.number(),
  structuredDataScore: z.number(),
  internalLinkingScore: z.number(),
  externalLinkingScore: z.number(),
  userExperienceScore: z.number(),
  socialSharingScore: z.number(),
  sslStatus: z.enum(['valid', 'invalid', 'missing']),
  mobileFriendliness: z.boolean(),
  contentFreshness: z.string(),
  topKeywords: z.array(TopKeywordSchema),
  schemaTypes: z.array(z.string()),
  coreWebVitals: CoreWebVitalsSchema,
  pageSpeed: PageSpeedSchema,
  additionalMetrics: AdditionalMetricsSchema
});

// Main SEO Analysis Schema
const SEOAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  siteType: z.enum(['blog', 'e-commerce', 'business', 'portfolio', 'educational', 'news', 'other']),
  url: z.string(),
  criticalIssues: z.array(CriticalIssueSchema),
  strengths: z.array(StrengthSchema),
  quickWins: z.array(QuickWinSchema),
  detailedRecommendations: DetailedRecommendationsSchema,
  seoMetrics: SEOMetricsSchema,
  nextSteps: z.array(z.string())
});

// Logger utility for structured logging
const log = {
  step: (step: string, message: string) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`[STEP ${step}] ${message}`);
    console.log(`${'='.repeat(60)}\n`);
  },
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  },
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  },
  debug: (message: string, data?: any) => {
    console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  },
  success: (message: string, data?: any) => {
    console.log(`[SUCCESS] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  }
};

// Function to fetch Google PageSpeed Insights data
async function getPageSpeedData(url: string) {
  try {
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    if (!apiKey) {
      console.warn('Google PageSpeed API key not found');
      return null;
    }

    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const encodedUrl = encodeURIComponent(formattedUrl);

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&key=${apiKey}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=mobile`;

    console.log('[PAGESPEED] Fetching data for:', formattedUrl);

    const response = await axios.get(apiUrl, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Audit-Bot/1.0)'
      }
    });

    if (!response.data || !response.data.lighthouseResult) {
      console.warn('[PAGESPEED] Invalid response structure');
      return null;
    }

    console.log('[PAGESPEED] ✅ Data fetched successfully');
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.warn('[PAGESPEED] Axios error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
    } else {
      console.warn('[PAGESPEED] Failed to fetch PageSpeed data:', error.message);
    }
    return null;
  }
}

// Function to check sitemap.xml
async function checkSitemap(url: string) {
  try {
    const baseUrl = url.startsWith('http') ? new URL(url).origin : `https://${url}`;
    const sitemapUrl = `${baseUrl}/sitemap.xml`;

    const response = await axios.get(sitemapUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Audit-Bot/1.0)'
      }
    });

    if (response.status === 200) {
      const urlMatches = response.data.match(/<url>/g) || [];
      const lastModifiedMatch = response.data.match(/<lastmod>([^<]+)<\/lastmod>/);

      return {
        found: true,
        url: sitemapUrl,
        urlCount: urlMatches.length,
        lastModified: lastModifiedMatch ? lastModifiedMatch[1] : 'Unknown'
      };
    }

    return { found: false };
  } catch (error) {
    return { found: false };
  }
}

// Website content interface
interface WebsiteContent {
  url: string;
  title: string;
  metaDescription: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
  };
  content: string;
  images: Array<{
    src: string;
    alt: string;
    title?: string;
    width?: string;
    height?: string;
    loading?: string;
  }>;
  links: Array<{
    href: string;
    text: string;
    isExternal: boolean;
    isNofollow: boolean;
    anchorText: string;
  }>;
  meta: {
    keywords?: string;
    author?: string;
    viewport?: string;
    robots?: string;
    canonical?: string;
    openGraph?: Record<string, string>;
    twitter?: Record<string, string>;
  };
  performance: {
    contentLength: number;
    wordCount: number;
    headingCount: number;
    imageCount: number;
    linkCount: number;
    internalLinkCount: number;
    externalLinkCount: number;
    nofollowLinkCount: number;
    hasStructuredData: boolean;
    hasViewportMeta: boolean;
    hasRobotsMeta: boolean;
    hasCanonical: boolean;
    hasOpenGraph: boolean;
    hasTwitterCards: boolean;
    structuredDataTypes: string[];
  };
  technical: {
    hasHttps: boolean;
    hasH1: boolean;
    hasMultipleH1: boolean;
    hasTitle: boolean;
    hasMetaDescription: boolean;
    titleLength: number;
    metaDescriptionLength: number;
    imagesWithoutAlt: number;
    imagesWithAlt: number;
    imagesWithoutDimensions: number;
    headingStructure: {
      hasH1: boolean;
      h1Count: number;
      h2Count: number;
      h3Count: number;
      h4Count: number;
      h5Count: number;
      h6Count: number;
      properHierarchy: boolean;
      skippedLevels: boolean;
    };
    domainAuthority: number;
    estimatedBacklinks: number;
    estimatedOrganicTraffic: number;
    coreWebVitals: {
      lcp: number;
      inp: number;
      cls: number;
    };
    mobileFriendliness: boolean;
    pageSpeed: {
      desktop: number;
      mobile: number;
    };
    readabilityScore: {
      fleschKincaid: number;
      readingLevel: string;
      avgWordsPerSentence: number;
    };
    socialSharing: {
      facebookShareable: boolean;
      twitterShareable: boolean;
      linkedinShareable: boolean;
    };
    technicalSEO: {
      hasRobotsTxt: boolean;
      hasSitemap: boolean;
      hasFavicon: boolean;
      hasManifest: boolean;
      languageDeclared: boolean;
    };
  };
}

// Server-side scraping function
async function scrapeWebsiteServer(url: string): Promise<WebsiteContent> {
  try {
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

    const response = await axios.get(formattedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    const title = $('title').text().trim() || '';
    const metaDescription = $('meta[name="description"]').attr('content') || '';

    const openGraph: Record<string, string> = {};
    $('meta[property^="og:"]').each((_, el) => {
      const $meta = $(el);
      const property = $meta.attr('property')?.replace('og:', '') || '';
      const content = $meta.attr('content') || '';
      if (property && content) {
        openGraph[property] = content;
      }
    });

    const twitter: Record<string, string> = {};
    $('meta[name^="twitter:"]').each((_, el) => {
      const $meta = $(el);
      const name = $meta.attr('name')?.replace('twitter:', '') || '';
      const content = $meta.attr('content') || '';
      if (name && content) {
        twitter[name] = content;
      }
    });

    const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
    const metaAuthor = $('meta[name="author"]').attr('content') || '';
    const metaViewport = $('meta[name="viewport"]').attr('content') || '';
    const metaRobots = $('meta[name="robots"]').attr('content') || '';
    const canonical = $('link[rel="canonical"]').attr('href') || '';

    const headings = {
      h1: $('h1').map((_, el) => $(el).text().trim()).get(),
      h2: $('h2').map((_, el) => $(el).text().trim()).get(),
      h3: $('h3').map((_, el) => $(el).text().trim()).get(),
      h4: $('h4').map((_, el) => $(el).text().trim()).get(),
      h5: $('h5').map((_, el) => $(el).text().trim()).get(),
      h6: $('h6').map((_, el) => $(el).text().trim()).get()
    };

    const content = $('body').text().trim();
    const baseUrl = new URL(formattedUrl).origin;

    const images = $('img').map((_, el) => {
      const $img = $(el);
      return {
        src: $img.attr('src') || '',
        alt: $img.attr('alt') || '',
        title: $img.attr('title') || '',
        width: $img.attr('width') || '',
        height: $img.attr('height') || '',
        loading: $img.attr('loading') || ''
      };
    }).get();

    const links = $('a[href]').map((_, el) => {
      const $link = $(el);
      const href = $link.attr('href') || '';
      const text = $link.text().trim();
      const isExternal = href.startsWith('http') && !href.includes(baseUrl);
      const isNofollow = $link.attr('rel')?.includes('nofollow') || false;
      const anchorText = text || $link.attr('title') || '';

      return { href, text, isExternal, isNofollow, anchorText };
    }).get();

    const structuredData = $('script[type="application/ld+json"]').length > 0;

    const internalLinks = links.filter(link => !link.isExternal);
    const externalLinks = links.filter(link => link.isExternal);
    const nofollowLinks = links.filter(link => link.isNofollow);
    const imagesWithoutAlt = images.filter(img => !img.alt).length;
    const imagesWithAlt = images.filter(img => img.alt).length;
    const imagesWithoutDimensions = images.filter(img => !img.width || !img.height).length;

    const structuredDataTypes: string[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const jsonData = JSON.parse($(el).html() || '{}');
        if (jsonData['@type']) {
          if (Array.isArray(jsonData['@type'])) {
            structuredDataTypes.push(...jsonData['@type']);
          } else {
            structuredDataTypes.push(jsonData['@type']);
          }
        }
      } catch (e) {}
    });

    const hasH1 = headings.h1.length > 0;
    const hasMultipleH1 = headings.h1.length > 1;
    const h1Count = headings.h1.length;
    const h2Count = headings.h2.length;
    const h3Count = headings.h3.length;
    const h4Count = headings.h4.length;
    const h5Count = headings.h5.length;
    const h6Count = headings.h6.length;

    const properHierarchy = h1Count === 1 && (
      (h2Count > 0 && h3Count === 0 && h4Count === 0 && h5Count === 0 && h6Count === 0) ||
      (h2Count > 0 && h3Count > 0 && h4Count === 0 && h5Count === 0 && h6Count === 0) ||
      (h2Count > 0 && h3Count > 0 && h4Count > 0 && h5Count === 0 && h6Count === 0) ||
      (h2Count > 0 && h3Count > 0 && h4Count > 0 && h5Count > 0 && h6Count === 0) ||
      (h2Count > 0 && h3Count > 0 && h4Count > 0 && h5Count > 0 && h6Count > 0)
    );

    const skippedLevels = (h1Count > 0 && h2Count === 0 && (h3Count > 0 || h4Count > 0 || h5Count > 0 || h6Count > 0)) ||
      (h2Count > 0 && h3Count === 0 && (h4Count > 0 || h5Count > 0 || h6Count > 0)) ||
      (h3Count > 0 && h4Count === 0 && (h5Count > 0 || h6Count > 0)) ||
      (h4Count > 0 && h5Count === 0 && h6Count > 0);

    const estimateDomainAuthority = (): number => {
      let score = 30;
      if (formattedUrl.startsWith('https://')) score += 10;
      if (title.length > 0 && title.length <= 60) score += 5;
      if (metaDescription.length > 0 && metaDescription.length <= 160) score += 5;
      if (structuredData) score += 8;
      if (hasH1 && !hasMultipleH1) score += 5;
      if (canonical) score += 3;
      if (metaRobots) score += 2;
      if (metaViewport) score += 2;
      if (content.length > 1000) score += 5;
      if (headings.h2.length > 3) score += 3;
      if (images.length > 3) score += 2;
      if (externalLinks.length > 5) score += 3;
      if (internalLinks.length > 10) score += 2;
      if (Object.keys(openGraph).length > 3) score += 3;
      if (Object.keys(twitter).length > 2) score += 2;
      return Math.min(100, Math.max(1, score));
    };

    const domainAuthority = estimateDomainAuthority();
    const estimatedBacklinks = Math.floor(Math.pow(domainAuthority / 10, 2.5) * 50);
    const estimatedOrganicTraffic = Math.floor(Math.pow(domainAuthority / 10, 3) * 100);

    const coreWebVitals = {
      lcp: Math.round((Math.random() * 2 + 1 + (domainAuthority > 70 ? -0.5 : 0.5)) * 10) / 10,
      inp: Math.floor(Math.random() * 200 + 100 + (domainAuthority > 70 ? -50 : 50)),
      cls: Math.round((Math.random() * 0.2 + 0.05 + (domainAuthority > 70 ? -0.02 : 0.02)) * 100) / 100
    };

    const calculateReadability = (text: string) => {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const words = text.split(/\s+/).filter(w => w.length > 0);
      const syllables = words.reduce((count, word) => {
        return count + Math.max(1, word.toLowerCase().replace(/[^aeiouy]/g, '').length);
      }, 0);
      const avgWordsPerSentence = words.length / sentences.length;
      const avgSyllablesPerWord = syllables / words.length;
      const fleschKincaid = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
      let readingLevel = 'Easy';
      if (fleschKincaid > 12) readingLevel = 'Very Difficult';
      else if (fleschKincaid > 10) readingLevel = 'Difficult';
      else if (fleschKincaid > 8) readingLevel = 'Fairly Difficult';
      else if (fleschKincaid > 6) readingLevel = 'Standard';
      else if (fleschKincaid > 4) readingLevel = 'Fairly Easy';
      return {
        fleschKincaid: Math.round(fleschKincaid * 10) / 10,
        readingLevel,
        avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10
      };
    };

    const readabilityScore = calculateReadability(content);

    const technicalSEO = {
      hasRobotsTxt: false,
      hasSitemap: $('link[rel="sitemap"]').length > 0 || $('link[type="application/xml"]').length > 0,
      hasFavicon: $('link[rel="icon"]').length > 0 || $('link[rel="shortcut icon"]').length > 0,
      hasManifest: $('link[rel="manifest"]').length > 0,
      languageDeclared: $('html').attr('lang') !== undefined
    };

    const socialSharing = {
      facebookShareable: Object.keys(openGraph).length > 2,
      twitterShareable: Object.keys(twitter).length > 1,
      linkedinShareable: Object.keys(openGraph).length > 1
    };

    const performance = {
      contentLength: content.length,
      wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
      headingCount: headings.h1.length + headings.h2.length + headings.h3.length + headings.h4.length + headings.h5.length + headings.h6.length,
      imageCount: images.length,
      linkCount: links.length,
      internalLinkCount: internalLinks.length,
      externalLinkCount: externalLinks.length,
      nofollowLinkCount: nofollowLinks.length,
      hasStructuredData: structuredData,
      hasViewportMeta: !!metaViewport,
      hasRobotsMeta: !!metaRobots,
      hasCanonical: !!canonical,
      hasOpenGraph: Object.keys(openGraph).length > 0,
      hasTwitterCards: Object.keys(twitter).length > 0,
      structuredDataTypes
    };

    const technical = {
      hasHttps: formattedUrl.startsWith('https://'),
      hasH1,
      hasMultipleH1,
      hasTitle: title.length > 0,
      hasMetaDescription: metaDescription.length > 0,
      titleLength: title.length,
      metaDescriptionLength: metaDescription.length,
      imagesWithoutAlt,
      imagesWithAlt,
      imagesWithoutDimensions,
      headingStructure: {
        hasH1,
        h1Count,
        h2Count,
        h3Count,
        h4Count,
        h5Count,
        h6Count,
        properHierarchy,
        skippedLevels
      },
      domainAuthority,
      estimatedBacklinks,
      estimatedOrganicTraffic,
      coreWebVitals,
      mobileFriendliness: !!metaViewport,
      pageSpeed: {
        desktop: Math.max(40, Math.min(100, 90 - (coreWebVitals.lcp * 10) + (domainAuthority > 70 ? 10 : 0))),
        mobile: Math.max(30, Math.min(100, 80 - (coreWebVitals.lcp * 15) + (domainAuthority > 70 ? 5 : 0)))
      },
      readabilityScore,
      socialSharing,
      technicalSEO
    };

    return {
      url: formattedUrl,
      title,
      metaDescription,
      headings,
      content,
      images,
      links,
      meta: {
        keywords: metaKeywords,
        author: metaAuthor,
        viewport: metaViewport,
        robots: metaRobots,
        canonical,
        openGraph,
        twitter
      },
      performance,
      technical
    };
  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error('Failed to scrape website');
  }
}

export async function POST(request: NextRequest) {
  try {
    log.step('1', 'Starting SEO analysis');
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    log.step('2', 'Scraping website content');
    const websiteContent = await scrapeWebsiteServer(url);
    log.info('Website scraped', { url: websiteContent.url, title: websiteContent.title });

    log.step('3', 'Running on-page SEO analysis');
    const onPageSEO = runOnPageSEOAnalysis({
      title: websiteContent.title,
      metaDescription: websiteContent.metaDescription,
      headings: websiteContent.headings,
      meta: websiteContent.meta,
      performance: {
        wordCount: websiteContent.performance?.wordCount || 0
      },
      lang: websiteContent.technical?.technicalSEO?.languageDeclared
        ? websiteContent.headings.h1?.length > 0 ? 'detected' : undefined
        : undefined,
      images: websiteContent.images.map(img => ({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
        loading: img.loading
      }))
    });
    log.success('On-page SEO analysis completed');

    // Skip LLM analysis for now
    const seoAnalysis = null;

    log.step('4', 'Fetching additional data');

    // Skip PageSpeed and sitemap for now

    const optimizedContent = optimizeWebsiteContent(websiteContent);

    return NextResponse.json({
      url: websiteContent.url,
      onPageSEO,
      websiteContent: optimizedContent
    });
  } catch (error) {
    log.error('Analysis failed', { error: String(error) });
    return NextResponse.json({ error: 'Failed to analyze website' }, { status: 500 });
  }
}
*/
