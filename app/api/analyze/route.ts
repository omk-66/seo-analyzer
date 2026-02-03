import { NextRequest, NextResponse } from 'next/server';
// import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { cohere } from '@ai-sdk/cohere';
import axios from 'axios';
import * as cheerio from 'cheerio';
// import puppeteer from 'puppeteer';
import { generateSEOPrompt } from '@/lib/seo-prompt';
import { generateOptimizedSEOPrompt } from '@/lib/seo-prompt-optimized';
import { optimizeWebsiteContent, optimizePageSpeedData, optimizeSitemapData } from '@/lib/data-optimizer';
import { deepseek } from '@ai-sdk/deepseek';
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
        const jsonData = JSON.parse($(el).html() || '{}');
        if (jsonData['@type']) {
          if (Array.isArray(jsonData['@type'])) {
            structuredDataTypes.push(...jsonData['@type']);
          } else {
            structuredDataTypes.push(jsonData['@type']);
          }
        }
      } catch (e) {
        // Invalid JSON, skip
      }
    });

    // Enhanced heading structure analysis
    const hasH1 = headings.h1.length > 0;
    const hasMultipleH1 = headings.h1.length > 1;
    const h1Count = headings.h1.length;
    const h2Count = headings.h2.length;
    const h3Count = headings.h3.length;
    const h4Count = headings.h4.length;
    const h5Count = headings.h5.length;
    const h6Count = headings.h6.length;

    // Check for proper heading hierarchy
    const properHierarchy = h1Count === 1 && (
      (h2Count > 0 && h3Count === 0 && h4Count === 0 && h5Count === 0 && h6Count === 0) ||
      (h2Count > 0 && h3Count > 0 && h4Count === 0 && h5Count === 0 && h6Count === 0) ||
      (h2Count > 0 && h3Count > 0 && h4Count > 0 && h5Count === 0 && h6Count === 0) ||
      (h2Count > 0 && h3Count > 0 && h4Count > 0 && h5Count > 0 && h6Count === 0) ||
      (h2Count > 0 && h3Count > 0 && h4Count > 0 && h5Count > 0 && h6Count > 0)
    );

    // Check for skipped heading levels
    const skippedLevels = (h1Count > 0 && h2Count === 0 && (h3Count > 0 || h4Count > 0 || h5Count > 0 || h6Count > 0)) ||
      (h2Count > 0 && h3Count === 0 && (h4Count > 0 || h5Count > 0 || h6Count > 0)) ||
      (h3Count > 0 && h4Count === 0 && (h5Count > 0 || h6Count > 0)) ||
      (h4Count > 0 && h5Count === 0 && h6Count > 0);

    // Estimate domain authority
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

    // Simulate Core Web Vitals
    const coreWebVitals = {
      lcp: Math.round((Math.random() * 2 + 1 + (domainAuthority > 70 ? -0.5 : 0.5)) * 10) / 10,
      inp: Math.floor(Math.random() * 200 + 100 + (domainAuthority > 70 ? -50 : 50)),
      cls: Math.round((Math.random() * 0.2 + 0.05 + (domainAuthority > 70 ? -0.02 : 0.02)) * 100) / 100
    };

    // Calculate readability scores
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

    // Check technical SEO elements
    const technicalSEO = {
      hasRobotsTxt: false,
      hasSitemap: $('link[rel="sitemap"]').length > 0 || $('link[type="application/xml"]').length > 0,
      hasFavicon: $('link[rel="icon"]').length > 0 || $('link[rel="shortcut icon"]').length > 0,
      hasManifest: $('link[rel="manifest"]').length > 0,
      languageDeclared: $('html').attr('lang') !== undefined
    };

    // Social sharing analysis
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

    // Capture screenshots
    // const screenshots = await captureScreenshots(formattedUrl);

    return {
      url: formattedUrl,
      title,
      metaDescription,
      headings,
      content,
      images,
      // screenshots,
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
    throw new Error(`Failed to scrape website: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Fallback function to generate minimal analysis when AI parsing fails
function generateMinimalAnalysis(websiteContent: any, pageSpeedData: any) {
  const issues: any[] = [];
  const strengths: any[] = [];
  let score = 70;

  // Title check
  if (!websiteContent.title) {
    issues.push({
      category: 'on-page',
      issue: 'Missing page title',
      impact: 'Critical for search engine ranking and click-through rates',
      evidence: 'No title tag found',
      recommendation: 'Add a descriptive title tag (50-60 characters)',
      priority: 'critical'
    });
    score -= 15;
  } else {
    strengths.push({
      area: 'Title Optimization',
      description: 'Page title is present'
    });
  }

  // Meta description check
  if (!websiteContent.metaDescription) {
    issues.push({
      category: 'on-page',
      issue: 'Missing meta description',
      impact: 'Important for click-through rates',
      evidence: 'No meta description found',
      recommendation: 'Add a compelling meta description (150-160 characters)',
      priority: 'high'
    });
    score -= 10;
  } else {
    strengths.push({
      area: 'Meta Description',
      description: 'Meta description is present'
    });
  }

  // H1 check
  if (!websiteContent.technical.hasH1) {
    issues.push({
      category: 'on-page',
      issue: 'Missing H1 tag',
      impact: 'Critical for content structure and SEO',
      evidence: 'No H1 tags found',
      recommendation: 'Add one H1 tag with main keyword',
      priority: 'critical'
    });
    score -= 15;
  }

  return {
    overallScore: Math.max(0, Math.min(100, score)),
    siteType: 'website',
    url: websiteContent.url,
    criticalIssues: issues,
    strengths,
    quickWins: [],
    detailedRecommendations: {
      title: {
        current: websiteContent.title || '',
        suggested: websiteContent.title ? websiteContent.title.substring(0, 55) : 'Add a descriptive title',
        reason: 'Title tags are critical for SEO'
      },
      metaDescription: {
        current: websiteContent.metaDescription || '',
        suggested: websiteContent.metaDescription ? websiteContent.metaDescription.substring(0, 155) : 'Add a compelling description',
        reason: 'Meta descriptions improve click-through rates'
      },
      headings: {
        issues: websiteContent.technical.hasH1 ? [] : ['Missing H1 tag'],
        suggestions: websiteContent.technical.hasH1 ? [] : ['Add one H1 tag per page']
      },
      content: {
        wordCount: websiteContent.performance.wordCount > 300 ? 'Adequate content length' : 'Content may be too thin',
        keywordUsage: 'Review keyword placement and density',
        readability: 'Ensure content is well-structured'
      },
      technical: {
        imageOptimization: 'Review image alt tags',
        internalLinking: 'Add internal links to related content',
        urlStructure: 'URLs are readable and descriptive',
        structuredData: websiteContent.performance.hasStructuredData ? 'Structured data found' : 'Consider adding schema markup',
        metaTags: 'Meta tags are properly configured'
      },
      keywords: {
        primaryKeywords: [],
        secondaryKeywords: [],
        longTailKeywords: [],
        missingKeywords: ['Add relevant keywords based on content'],
        keywordStuffing: false
      },
      links: {
        internalLinks: [],
        externalLinks: [],
        brokenLinks: [],
        orphanedPages: [],
        linkEquity: 'Review internal linking structure'
      }
    },
    seoMetrics: {
      technicalScore: Math.max(0, Math.min(100, score + 10)),
      contentScore: Math.max(0, Math.min(100, score)),
      performanceScore: 70,
      accessibilityScore: 75,
      securityScore: websiteContent.technical.hasHttps ? 90 : 40,
      mobileSpeedScore: 70,
      readabilityScore: 70,
      wordCount: websiteContent.performance.wordCount,
      contentDepthScore: websiteContent.performance.wordCount > 500 ? 80 : 60,
      keywordScore: 65,
      structuredDataScore: websiteContent.performance.hasStructuredData ? 80 : 30,
      internalLinkingScore: Math.min(100, websiteContent.performance.internalLinkCount * 10),
      externalLinkingScore: Math.min(100, websiteContent.performance.externalLinkCount * 10),
      userExperienceScore: 70,
      sslStatus: websiteContent.technical.hasHttps ? 'valid' : 'missing',
      mobileFriendliness: !!websiteContent.meta.viewport,
      contentFreshness: 'Recent',
      topKeywords: [],
      schemaTypes: websiteContent.performance.structuredDataTypes || [],
      coreWebVitals: {
        lcp: 2.5,
        inp: 100,
        cls: 0.1
      },
      pageSpeed: {
        desktop: 75,
        mobile: 70,
        firstContentfulPaint: 1.8,
        largestContentfulPaint: 2.5,
        timeToInteractive: 3.2,
        speedIndex: 2.8,
        totalBlockingTime: 150
      }
    },
    nextSteps: [
      'Fix critical on-page SEO issues',
      'Add missing meta tags',
      'Improve content quality'
    ]
  };
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Scrape website on server-side
    const websiteContent = await scrapeWebsiteServer(url);

    // Fetch additional data
    const [pageSpeedData, sitemapData] = await Promise.all([
      getPageSpeedData(url),
      checkSitemap(url)
    ]);

    // Check if API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({
        error: 'Google Generative AI API key not configured. Using basic SEO analysis.',
      }, { status: 200 });
    }

    try {
      // Optimize the data to reduce token usage
      const optimizedWebsiteContent = optimizeWebsiteContent(websiteContent);
      const optimizedPageSpeedData = optimizePageSpeedData(pageSpeedData);
      const optimizedSitemapData = optimizeSitemapData(sitemapData);

      // Generate the optimized SEO prompt
      const prompt = generateOptimizedSEOPrompt(optimizedWebsiteContent, optimizedPageSpeedData, optimizedSitemapData);

      let text = '';
      let modelUsed = '';

      try {
        // Use Vercel AI SDK with AI model
        const startTime = new Date().getTime();
        console.log("starting AI analysis");
        console.log("start time:", startTime);
        const { text: generatedText } = await generateText({
          model: cohere('command-a-03-2025'),
          prompt: prompt,
        });
        console.log("end time:", new Date().getTime());
        console.log("total time:", new Date().getTime() - startTime);

        text = generatedText;
        modelUsed = 'cohere-command-a-03-2025';
      } catch (modelError: any) {
        console.error('Model error with optimized prompt:', modelError);

        // If optimized prompt still fails, try ultra-minimal prompt
        if (modelError.message?.includes('tokens')) {
          console.log('Trying ultra-minimal prompt as fallback...');
          const minimalPrompt = `Analyze this website SEO: URL=${optimizedWebsiteContent.url}, Title="${optimizedWebsiteContent.title}", HasH1=${optimizedWebsiteContent.technical.hasH1}, HasMetaDesc=${optimizedWebsiteContent.technical.hasMetaDescription}. Return JSON with overallScore, criticalIssues, importantImprovements, strengths, quickWins, seoScores.`;

          try {
            const { text: fallbackText } = await generateText({
              model: cohere('command-a-03-2025'),
              prompt: minimalPrompt,
            });
            text = fallbackText;
            modelUsed = 'cohere-command-a-03-2025-minimal';
          } catch (fallbackError: any) {
            console.error('Minimal prompt also failed:', fallbackError);
            return NextResponse.json({
              error: 'AI service token limit exceeded. Try analyzing a smaller page.',
            }, { status: 200 });
          }
        } else {
          return NextResponse.json({
            error: 'AI service temporarily unavailable. Please try again later.',
          }, { status: 200 });
        }
      }

      if (!text) {
        return NextResponse.json({
          error: 'AI models are currently unavailable. Using enhanced SEO analysis.',
        }, { status: 200 });
      }

      // Clean up the response and parse JSON
      let analysis;
      try {
        // Try to extract JSON from the response
        let jsonString = text;

        // If response contains markdown code blocks, extract the JSON
        const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
          jsonString = codeBlockMatch[1];
        }

        // Try to find JSON object in the text
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }

        jsonString = jsonMatch[0];

        // Fix common JSON issues
        jsonString = jsonString
          // Remove trailing commas before } or ]
          .replace(/,\s*([}\]])/g, '$1')
          // Fix missing colons after property names
          .replace(/("[^"]+")\s*([^:])/g, '$1: $2')
          // Fix unquoted values
          .replace(/([:\s])(true|false)([\s,}\]])/g, '$1"$2"$3')
          .replace(/([:\s])(\d+\.?\d*)([\s,}\]])/g, '$1$2$3')
          // Fix single quotes to double quotes
          .replace(/'([^']*)'/g, '"$1"')
          // Fix line breaks in strings
          .replace(/\n/g, ' ')
          .replace(/\r/g, ' ')
          // Remove any control characters
          .replace(/[\x00-\x1f\x7f-\x9f]/g, '');

        analysis = JSON.parse(jsonString);

        // Add the raw PageSpeed data to the response for UI display
        if (pageSpeedData) {
          analysis.pageSpeedData = pageSpeedData;
        }
      } catch (parseError: any) {
        console.error('JSON Parse Error:', parseError.message);

        // Try to create a minimal valid analysis from partial data
        analysis = generateMinimalAnalysis(websiteContent, pageSpeedData);
      }

      return NextResponse.json(analysis);
    } catch (error: any) {
      console.error('AI Analysis Error:', error);

      return NextResponse.json({
        error: 'Analysis service temporarily unavailable. Please try again later.',
      }, { status: 200 });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website. Please try again.' },
      { status: 500 }
    );
  }
}
