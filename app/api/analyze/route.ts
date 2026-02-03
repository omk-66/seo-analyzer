import { NextRequest, NextResponse } from 'next/server';
// import { google } from '@ai-sdk/google';
import { generateText, generateObject, Output } from 'ai';
import { cohere } from '@ai-sdk/cohere';
import { z } from 'zod';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { jsonrepair } from 'jsonrepair';
// import puppeteer from 'puppeteer';
import { generateSEOPrompt } from '@/lib/seo-prompt';
import { generateOptimizedSEOPrompt } from '@/lib/seo-prompt-optimized';
import { optimizeWebsiteContent, optimizePageSpeedData, optimizeSitemapData } from '@/lib/data-optimizer';
import { deepseek } from '@ai-sdk/deepseek';
import { SeoAuditResponseSchema } from '@/lib/types/llm-response';

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
// import { fireworks } from '@ai-sdk/fireworks';

// Function to fetch Google PageSpeed Insights data
async function getPageSpeedData(url: string) {
  try {
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    if (!apiKey) {
      console.warn('Google PageSpeed API key not found');
      return null;
    }

    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    const response = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${apiKey}&category=performance&strategy=mobile`
    );

    return response.data;
  } catch (error) {
    console.warn('Failed to fetch PageSpeed data:', error);
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
      // Parse XML to count URLs
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
  screenshots?: {
    fullPage?: string;
    viewport?: string;
    mobile?: string;
  };
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

// Function to capture webpage screenshots
// async function captureScreenshots(url: string): Promise<{ fullPage?: string; viewport?: string; mobile?: string }> {
//   let browser;
//   try {
//     browser = await puppeteer.launch({
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });

//     const screenshots: { fullPage?: string; viewport?: string; mobile?: string } = {};

//     // Desktop viewport screenshot
//     const desktopPage = await browser.newPage();
//     await desktopPage.setViewport({ width: 1366, height: 768 });
//     await desktopPage.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

//     // Capture viewport screenshot
//     const viewportScreenshot = await desktopPage.screenshot({
//       type: 'png',
//       fullPage: false
//     });
//     screenshots.viewport = `data:image/png;base64,${Buffer.from(viewportScreenshot).toString('base64')}`;

//     // Capture full page screenshot
//     const fullPageScreenshot = await desktopPage.screenshot({
//       type: 'png',
//       fullPage: true
//     });
//     screenshots.fullPage = `data:image/png;base64,${Buffer.from(fullPageScreenshot).toString('base64')}`;

//     await desktopPage.close();

//     // Mobile screenshot
//     const mobilePage = await browser.newPage();
//     await mobilePage.setViewport({ width: 375, height: 667 });
//     await mobilePage.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

//     const mobileScreenshot = await mobilePage.screenshot({
//       type: 'png',
//       fullPage: true
//     });
//     screenshots.mobile = `data:image/png;base64,${Buffer.from(mobileScreenshot).toString('base64')}`;

//     await mobilePage.close();

//     return screenshots;
//   } catch (error) {
//     console.warn('Failed to capture screenshots:', error);
//     return {};
//   } finally {
//     if (browser) {
//       await browser.close();
//     }
//   }
// }

// Server-side scraping function
async function scrapeWebsiteServer(url: string): Promise<WebsiteContent> {
  try {
    // Ensure URL has protocol
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

    const response = await axios.get(formattedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // Extract title
    const title = $('title').text().trim() || '';

    // Extract meta description
    const metaDescription = $('meta[name="description"]').attr('content') || '';

    // Extract Open Graph meta tags
    const openGraph: Record<string, string> = {};
    $('meta[property^="og:"]').each((_, el) => {
      const $meta = $(el);
      const property = $meta.attr('property')?.replace('og:', '') || '';
      const content = $meta.attr('content') || '';
      if (property && content) {
        openGraph[property] = content;
      }
    });

    // Extract Twitter Card meta tags
    const twitter: Record<string, string> = {};
    $('meta[name^="twitter:"]').each((_, el) => {
      const $meta = $(el);
      const name = $meta.attr('name')?.replace('twitter:', '') || '';
      const content = $meta.attr('content') || '';
      if (name && content) {
        twitter[name] = content;
      }
    });

    // Extract other meta tags
    const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
    const metaAuthor = $('meta[name="author"]').attr('content') || '';
    const metaViewport = $('meta[name="viewport"]').attr('content') || '';
    const metaRobots = $('meta[name="robots"]').attr('content') || '';
    const canonical = $('link[rel="canonical"]').attr('href') || '';

    // Extract headings
    const headings = {
      h1: $('h1').map((_, el) => $(el).text().trim()).get(),
      h2: $('h2').map((_, el) => $(el).text().trim()).get(),
      h3: $('h3').map((_, el) => $(el).text().trim()).get(),
      h4: $('h4').map((_, el) => $(el).text().trim()).get(),
      h5: $('h5').map((_, el) => $(el).text().trim()).get(),
      h6: $('h6').map((_, el) => $(el).text().trim()).get()
    };

    // Extract content
    const content = $('body').text().trim();

    // Get base URL for resolving relative URLs
    const baseUrl = new URL(formattedUrl).origin;

    // Extract images
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

    // Extract links
    const links = $('a[href]').map((_, el) => {
      const $link = $(el);
      const href = $link.attr('href') || '';
      const text = $link.text().trim();
      const isExternal = href.startsWith('http') && !href.includes(baseUrl);
      const isNofollow = $link.attr('rel')?.includes('nofollow') || false;
      const anchorText = text || $link.attr('title') || '';

      return { href, text, isExternal, isNofollow, anchorText };
    }).get();

    // Check for structured data
    const structuredData = $('script[type="application/ld+json"]').length > 0;

    // Calculate performance metrics
    const internalLinks = links.filter(link => !link.isExternal);
    const externalLinks = links.filter(link => link.isExternal);
    const nofollowLinks = links.filter(link => link.isNofollow);
    const imagesWithoutAlt = images.filter(img => !img.alt).length;
    const imagesWithAlt = images.filter(img => img.alt).length;
    const imagesWithoutDimensions = images.filter(img => !img.width || !img.height).length;

    // Extract structured data types
    const structuredDataTypes: string[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const scriptContent = $(el).html() || '';
        const typeMatch = scriptContent.match(/"@type"\s*:\s*"([^"]+)"/);
        if (typeMatch) {
          structuredDataTypes.push(typeMatch[1]);
        }
      } catch (e) {
        // Skip invalid JSON
      }
    });

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
        twitter,
      },
      performance: {
        contentLength: content.length,
        wordCount: content.split(/\s+/).filter(Boolean).length,
        headingCount: headings.h1.length + headings.h2.length + headings.h3.length,
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
        structuredDataTypes,
      },
      technical: {
        hasHttps: formattedUrl.startsWith('https://'),
        hasH1: headings.h1.length > 0,
        hasMultipleH1: headings.h1.length > 1,
        hasTitle: !!title,
        hasMetaDescription: !!metaDescription,
        titleLength: title.length,
        metaDescriptionLength: metaDescription.length,
        imagesWithoutAlt,
        imagesWithAlt,
        imagesWithoutDimensions,
        headingStructure: {
          hasH1: headings.h1.length > 0,
          h1Count: headings.h1.length,
          h2Count: headings.h2.length,
          h3Count: headings.h3.length,
          h4Count: headings.h4.length,
          h5Count: headings.h5.length,
          h6Count: headings.h6.length,
          properHierarchy: true,
          skippedLevels: false,
        },
        domainAuthority: 0,
        estimatedBacklinks: 0,
        estimatedOrganicTraffic: 0,
        coreWebVitals: { lcp: 0, inp: 0, cls: 0 },
        mobileFriendliness: true,
        pageSpeed: { desktop: 0, mobile: 0 },
        readabilityScore: { fleschKincaid: 0, readingLevel: 'Unknown', avgWordsPerSentence: 0 },
        socialSharing: { facebookShareable: true, twitterShareable: true, linkedinShareable: true },
        technicalSEO: { hasRobotsTxt: false, hasSitemap: false, hasFavicon: false, hasManifest: false, languageDeclared: true },
      },
    };
  } catch (error: any) {
    throw new Error(`Failed to scrape website: ${error.message}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    log.step('1', 'Starting SEO Analysis');

    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    log.info('Analyzing URL', { url });

    // Fetch data in parallel
    log.step('2', 'Fetching website data');
    const [websiteContent, pageSpeedData, sitemapData] = await Promise.all([
      scrapeWebsiteServer(url),
      getPageSpeedData(url),
      checkSitemap(url)
    ]);

    log.success('Data fetched', {
      hasContent: !!websiteContent,
      hasPageSpeed: !!pageSpeedData,
      hasSitemap: sitemapData.found
    });

    // Check if scraping was successful
    if (!websiteContent || !websiteContent.title) {
      log.warn('Could not extract meaningful content from URL');
      return NextResponse.json({
        error: 'Could not analyze this URL. Please check if it is accessible.',
      }, { status: 200 });
    }

    // Optimize data for AI consumption
    log.step('3', 'Optimizing data for AI');
    const optimizedWebsiteContent = optimizeWebsiteContent(websiteContent);
    const optimizedPageSpeedData = optimizePageSpeedData(pageSpeedData);
    const optimizedSitemapData = optimizeSitemapData(sitemapData);

    log.success('Data optimized', {
      contentLength: optimizedWebsiteContent.performance.contentLength,
      headingCount: optimizedWebsiteContent.performance.headingCount,
      linkCount: optimizedWebsiteContent.performance.linkCount
    });

    // Generate AI prompt
    log.step('4', 'Generating AI prompt');
    const prompt = generateOptimizedSEOPrompt(
      optimizedWebsiteContent,
      optimizedPageSpeedData,
      optimizedSitemapData
    );

    log.info('Prompt generated', {
      promptLength: prompt.length,
      includesPageSpeed: !!optimizedPageSpeedData
    });

    // ============================================
    // MULTI-STRATEGY AI ANALYSIS WITH FALLBACK
    // ============================================

    let analysis: any;
    let modelUsed = '';
    let parseMethod = '';

    try {
      // ============================================
      // STRATEGY 1: generateObject (Type-Safe JSON)
      // ============================================
      log.step('6', 'Calling AI model with structured output');
      const startTime = Date.now();
      log.info('Starting AI analysis with structured output', { url: optimizedWebsiteContent.url });

      const result = await generateObject({
        model: cohere('command-a-03-2025'),
        schema: SEOAnalysisSchema,
        prompt: prompt,
      });

      const endTime = Date.now();
      log.success('AI analysis completed', {
        duration: `${endTime - startTime}ms`,
        modelUsed: 'cohere-command-a-03-2025',
        method: 'generateObject'
      });

      analysis = result.object;
      modelUsed = 'cohere-command-a-03-2025';
      parseMethod = 'generateObject (type-safe)';
    } catch (objectError: any) {
      log.warn('generateObject failed, falling back to generateText', {
        error: objectError?.message
      });

      // ============================================
      // STRATEGY 2: generateText with JSON parsing
      // ============================================
      try {
        log.info('Trying generateText fallback', { url: optimizedWebsiteContent.url });
        const { text: generatedText } = await generateText({
          model: cohere('command-a-03-2025'),
          prompt: prompt,
        });

        log.info('generateText completed, parsing JSON', { responseLength: generatedText.length });

        // Multiple parsing strategies
        let jsonString = generatedText;
        let parsed = null;

        // Strategy 1: Direct JSON.parse
        try {
          parsed = JSON.parse(jsonString);
          log.success('JSON parsed on first attempt');
        } catch (e: any) {
          log.warn('Direct parse failed, trying extraction', { error: e.message });
        }

        // Strategy 2: Extract from markdown code blocks
        if (!parsed) {
          const codeBlockMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (codeBlockMatch) {
            jsonString = codeBlockMatch[1];
            try {
              parsed = JSON.parse(jsonString);
              log.success('JSON parsed from code block');
            } catch (e) {
              log.warn('Code block parse failed');
            }
          }
        }

        // Strategy 3: Extract JSON object with regex
        if (!parsed) {
          const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonString = jsonMatch[0];
            // Clean JSON
            jsonString = jsonString
              .replace(/,\s*([}\]])/g, '$1')
              .replace(/'/g, '"')
              .replace(/\n/g, ' ');
            try {
              parsed = JSON.parse(jsonString);
              log.success('JSON parsed after extraction');
            } catch (e) {
              log.warn('Regex extraction failed');
            }
          }
        }

        // Strategy 4: Use jsonrepair library
        if (!parsed && typeof jsonrepair === 'function') {
          try {
            const repaired = jsonrepair(jsonString);
            parsed = JSON.parse(repaired);
            log.success('JSON repaired using jsonrepair');
          } catch (e) {
            log.warn('jsonrepair failed');
          }
        }

        // Strategy 5: Generate minimal analysis from partial data
        if (!parsed) {
          log.warn('All parsing strategies failed, using minimal analysis');
          parsed = {
            overallScore: 50,
            siteType: 'other',
            url: optimizedWebsiteContent.url,
            criticalIssues: [{
              category: 'on-page',
              issue: 'Unable to parse AI response',
              impact: 'Limited analysis available',
              evidence: 'All parsing strategies failed',
              recommendation: 'Try again with a simpler URL',
              priority: 'medium'
            }],
            strengths: [],
            quickWins: [],
            detailedRecommendations: {
              title: { current: '', suggested: '', reason: '' },
              metaDescription: { current: '', suggested: '', reason: '' },
              headings: { issues: [], suggestions: [] },
              content: { wordCount: '', keywordUsage: '', readability: '' },
              technical: { imageOptimization: '', internalLinking: '', urlStructure: '', structuredData: '', metaTags: '' }
            },
            seoMetrics: {
              technicalScore: 50,
              contentScore: 50,
              performanceScore: 50,
              accessibilityScore: 50,
              securityScore: 50,
              mobileSpeedScore: 50,
              readabilityScore: 50,
              wordCount: 0,
              contentDepthScore: 50,
              keywordScore: 50,
              structuredDataScore: 50,
              internalLinkingScore: 50,
              externalLinkingScore: 50,
              userExperienceScore: 50,
              socialSharingScore: 50,
              sslStatus: 'valid',
              mobileFriendliness: true,
              contentFreshness: 'Unknown',
              topKeywords: [],
              schemaTypes: [],
              coreWebVitals: { lcp: 0, inp: 0, cls: 0 },
              pageSpeed: { desktop: 0, mobile: 0, firstContentfulPaint: 0, largestContentfulPaint: 0, timeToInteractive: 0, speedIndex: 0, totalBlockingTime: 0 },
              additionalMetrics: { domainAuthority: 0, pageAuthority: 0, backlinksCount: 0, referringDomains: 0, organicKeywords: 0, organicTraffic: 0, bounceRate: 0, dwellTime: 0, conversionRate: 0 }
            },
            nextSteps: ['Try analyzing again', 'Check URL accessibility']
          };
          parseMethod = 'minimal-fallback';
        }

        analysis = parsed;
        modelUsed = 'cohere-command-a-03-2025';
        parseMethod = parseMethod || 'generateText + JSON parsing';
      } catch (textError: any) {
        log.error('generateText failed', { error: textError?.message });
        throw new Error('AI service temporarily unavailable');
      }
    }

    if (!analysis) {
      log.warn('No analysis generated, using fallback');
      analysis = {
        overallScore: 50,
        siteType: 'other',
        url: optimizedWebsiteContent.url,
        criticalIssues: [],
        strengths: [],
        quickWins: [],
        detailedRecommendations: {
          title: { current: '', suggested: '', reason: '' },
          metaDescription: { current: '', suggested: '', reason: '' },
          headings: { issues: [], suggestions: [] },
          content: { wordCount: '', keywordUsage: '', readability: '' },
          technical: { imageOptimization: '', internalLinking: '', urlStructure: '', structuredData: '', metaTags: '' }
        },
        seoMetrics: {
          technicalScore: 50,
          contentScore: 50,
          performanceScore: 50,
          accessibilityScore: 50,
          securityScore: 50,
          mobileSpeedScore: 50,
          readabilityScore: 50,
          wordCount: 0,
          contentDepthScore: 50,
          keywordScore: 50,
          structuredDataScore: 50,
          internalLinkingScore: 50,
          externalLinkingScore: 50,
          userExperienceScore: 50,
          socialSharingScore: 50,
          sslStatus: 'valid',
          mobileFriendliness: true,
          contentFreshness: 'Unknown',
          topKeywords: [],
          schemaTypes: [],
          coreWebVitals: { lcp: 0, inp: 0, cls: 0 },
          pageSpeed: { desktop: 0, mobile: 0, firstContentfulPaint: 0, largestContentfulPaint: 0, timeToInteractive: 0, speedIndex: 0, totalBlockingTime: 0 },
          additionalMetrics: { domainAuthority: 0, pageAuthority: 0, backlinksCount: 0, referringDomains: 0, organicKeywords: 0, organicTraffic: 0, bounceRate: 0, dwellTime: 0, conversionRate: 0 }
        },
        nextSteps: []
      };
      parseMethod = 'fallback';
    }

    // Add parse method info
    (analysis as any)._parseMethod = parseMethod;
    (analysis as any)._modelUsed = modelUsed;

    log.success('SEO analysis complete', {
      overallScore: analysis.overallScore,
      criticalIssues: analysis.criticalIssues?.length || 0,
      strengths: analysis.strengths?.length || 0,
      parseMethod: parseMethod
    });

    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website. Please try again.' },
      { status: 500 }
    );
  }
}
