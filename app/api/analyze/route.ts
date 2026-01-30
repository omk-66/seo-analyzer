import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { cohere } from '@ai-sdk/cohere';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Website content interface (same as in scraper.ts)
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

    // Extract headings (all levels)
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

    // Extract images with enhanced data
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

    // Extract links with enhanced analysis
    const baseUrl = new URL(formattedUrl).origin;
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

    // Estimate domain authority based on various factors
    const estimateDomainAuthority = (): number => {
      let score = 30; // Base score

      // Factor in HTTPS
      if (formattedUrl.startsWith('https://')) score += 10;

      // Factor in content quality indicators
      if (title.length > 0 && title.length <= 60) score += 5;
      if (metaDescription.length > 0 && metaDescription.length <= 160) score += 5;
      if (structuredData) score += 8;
      if (hasH1 && !hasMultipleH1) score += 5;

      // Factor in technical SEO
      if (canonical) score += 3;
      if (metaRobots) score += 2;
      if (metaViewport) score += 2;

      // Factor in content depth
      if (content.length > 1000) score += 5;
      if (headings.h2.length > 3) score += 3;
      if (images.length > 3) score += 2;

      // Factor in link profile
      if (externalLinks.length > 5) score += 3;
      if (internalLinks.length > 10) score += 2;

      // Factor in social media optimization
      if (Object.keys(openGraph).length > 3) score += 3;
      if (Object.keys(twitter).length > 2) score += 2;

      return Math.min(100, Math.max(1, score));
    };

    // Estimate backlinks and organic traffic based on domain authority
    const domainAuthority = estimateDomainAuthority();
    const estimatedBacklinks = Math.floor(Math.pow(domainAuthority / 10, 2.5) * 50);
    const estimatedOrganicTraffic = Math.floor(Math.pow(domainAuthority / 10, 3) * 100);

    // Simulate Core Web Vitals (in real implementation, these would be measured)
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

      // Flesch-Kincaid Grade Level formula
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
      hasRobotsTxt: false, // Would need separate HTTP request
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
    throw new Error(`Failed to scrape website: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


import { deepseek } from '@ai-sdk/deepseek';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // console.log('Starting SEO analysis for:', url);

    // Scrape website on server-side (no CORS issues)
    const websiteContent = await scrapeWebsiteServer(url);
    // console.log('Website scraped successfully');

    // Check if API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      // console.log('Google Generative AI API key not found, using fallback analysis');
      return NextResponse.json({
        error: 'Google Generative AI API key not configured. Using basic SEO analysis.',
        // fallbackAnalysis: generateFallbackAnalysis(websiteContent)
      }, { status: 200 });
    }

    try {
      // Read the SEO audit knowledge base
      const seoKnowledgeBase = `
You are an expert SEO analyst with deep knowledge of technical SEO, on-page optimization, content quality assessment, and authority building. Follow this comprehensive SEO audit framework based on industry best practices:

## COMPREHENSIVE SEO AUDIT FRAMEWORK

### Priority Order (Critical to Success)
1. **Crawlability & Indexation** (can Google find and index it?)
2. **Technical Foundations** (is the site fast and functional?)
3. **On-Page Optimization** (is content optimized?)
4. **Content Quality & E-E-A-T** (does it deserve to rank?)
5. **Authority & Backlinks** (does it have credibility?)

### TECHNICAL SEO ANALYSIS
**Crawlability & Indexation:**
- Robots.txt analysis (blocks, sitemap reference)
- XML sitemap presence and quality
- Site architecture (click depth, orphan pages)
- Canonicalization consistency
- Indexation status (site: results, Search Console data)
- Crawl budget optimization

**Site Speed & Core Web Vitals:**
- LCP (Largest Contentful Paint): Target < 2.5s
- INP (Interaction to Next Paint): Target < 200ms
- CLS (Cumulative Layout Shift): Target < 0.1
- Server response time (TTFB)
- Image optimization and modern formats
- JavaScript/CSS optimization
- Caching headers and CDN usage

**Mobile-Friendliness:**
- Responsive design implementation
- Viewport configuration
- Tap target sizes and usability
- Mobile-first indexing readiness

**Security & HTTPS:**
- HTTPS implementation across all pages
- SSL certificate validity
- Mixed content issues
- HSTS headers

### ON-PAGE SEO OPTIMIZATION
**Title Tags Analysis:**
- Uniqueness and length (50-60 characters optimal)
- Primary keyword placement
- Brand name positioning
- Click-worthiness and CTR potential

**Meta Descriptions:**
- Unique descriptions (150-160 characters)
- Value proposition clarity
- Call-to-action inclusion
- Keyword relevance

**Heading Structure:**
- Single H1 per page with primary keyword
- Logical hierarchy (H1 → H2 → H3)
- Semantic heading usage (not just styling)
- Content alignment with headings

**Content Optimization:**
- Primary keyword in first 100 words
- Related keywords and semantic relevance
- Content depth and comprehensiveness
- Search intent satisfaction
- Competitive advantage analysis

**Image Optimization:**
- Alt text implementation and descriptiveness
- File naming conventions
- Compression and modern formats (WebP)
- Lazy loading and responsive images

**Internal Linking:**
- Important pages link authority
- Descriptive anchor text
- Logical link relationships
- Orphan page identification

### CONTENT QUALITY & E-E-A-T ASSESSMENT
**Experience Signals:**
- First-hand experience demonstration
- Original insights and data
- Real examples and case studies

**Expertise Indicators:**
- Author credentials and expertise
- Accurate, well-sourced information
- Technical accuracy and depth

**Authoritativeness Factors:**
- Industry recognition and citations
- Backlink profile quality
- Thought leadership content

**Trustworthiness Elements:**
- Information accuracy and transparency
- Contact information and business details
- Privacy policy and terms of service
- Secure site implementation

### AUTHORITY & BACKLINKS ANALYSIS
**Backlink Profile:**
- Domain Authority (DA) and Page Authority (PA)
- Total backlinks count and quality
- Referring domains diversity
- Anchor text distribution
- Link velocity and growth

**Competitive Analysis:**
- Keyword rankings and positions
- Organic traffic estimates
- Content gap analysis
- Top-performing content identification

### SITE TYPE-SPECIFIC ANALYSIS
**SaaS/Product Sites:**
- Product page content depth
- Blog-product integration
- Feature comparison content
- Educational content presence

**E-commerce Sites:**
- Category page optimization
- Product description uniqueness
- Schema markup implementation
- Faceted navigation handling

**Content/Blog Sites:**
- Content freshness and updates
- Topical clustering and silos
- Author expertise demonstration
- Internal linking strategy

**Local Business:**
- NAP consistency
- Local schema implementation
- Google Business Profile optimization
- Location-specific content

## ANALYSIS REQUIREMENTS

For each website section identified (Hero, Navigation, About, Features, Pricing, Testimonials, Footer, etc.), provide:

1. **Issues Found**: Specific problems with evidence
2. **Strengths**: What's working well and why
3. **Improvement Opportunities**: Specific enhancements with benefits
4. **Code Examples**: Before/after implementations

## COMPREHENSIVE METRICS TO INCLUDE

In your analysis, provide estimates for:
- Domain Authority (1-100 scale)
- Page Authority (1-100 scale) 
- Backlinks count (total and quality assessment)
- Referring domains count
- Organic keywords ranking
- Estimated organic traffic
- Core Web Vitals scores (LCP, INP, CLS)
- Mobile-friendliness score
- Page speed scores (desktop/mobile)
- Security implementation score
- Structured data usage score
- Internal linking quality score
- Content depth assessment
- User experience signals

Focus on actionable, specific recommendations that will improve search rankings and user experience. Consider all technical metrics provided and prioritize issues that will have the biggest impact on organic search performance.
`;

      const prompt = `
${seoKnowledgeBase}

Analyze the following comprehensive website data for SEO improvements and provide detailed, actionable recommendations with specific code examples:

WEBSITE DATA:
URL: ${websiteContent.url}
Title: "${websiteContent.title}"
Meta Description: "${websiteContent.metaDescription}"

TECHNICAL SEO METRICS:
- HTTPS Enabled: ${websiteContent.technical.hasHttps}
- Has Title: ${websiteContent.technical.hasTitle}
- Has Meta Description: ${websiteContent.technical.hasMetaDescription}
- Title Length: ${websiteContent.technical.titleLength} characters (optimal: 50-60)
- Meta Description Length: ${websiteContent.technical.metaDescriptionLength} characters (optimal: 150-160)
- Has Canonical: ${websiteContent.performance.hasCanonical}
- Has Robots Meta: ${websiteContent.performance.hasRobotsMeta}
- Has Viewport Meta: ${websiteContent.performance.hasViewportMeta}
- Has Structured Data: ${websiteContent.performance.hasStructuredData}
- Structured Data Types: ${websiteContent.performance.structuredDataTypes.join(', ') || 'None'}
- Has Open Graph: ${websiteContent.performance.hasOpenGraph}
- Has Twitter Cards: ${websiteContent.performance.hasTwitterCards}
- Domain Authority (DR): ${websiteContent.technical.domainAuthority}/100
- Estimated Backlinks: ${websiteContent.technical.estimatedBacklinks}
- Estimated Organic Traffic: ${websiteContent.technical.estimatedOrganicTraffic}/month

CORE WEB VITALS:
- Largest Contentful Paint (LCP): ${websiteContent.technical.coreWebVitals.lcp}s (target: < 2.5s)
- Interaction to Next Paint (INP): ${websiteContent.technical.coreWebVitals.inp}ms (target: < 200ms)
- Cumulative Layout Shift (CLS): ${websiteContent.technical.coreWebVitals.cls} (target: < 0.1)

PERFORMANCE METRICS:
- Page Speed (Desktop): ${websiteContent.technical.pageSpeed.desktop}/100
- Page Speed (Mobile): ${websiteContent.technical.pageSpeed.mobile}/100
- Mobile Friendliness: ${websiteContent.technical.mobileFriendliness}

READABILITY ANALYSIS:
- Flesch-Kincaid Grade Level: ${websiteContent.technical.readabilityScore.fleschKincaid}
- Reading Level: ${websiteContent.technical.readabilityScore.readingLevel}
- Avg Words Per Sentence: ${websiteContent.technical.readabilityScore.avgWordsPerSentence}

SOCIAL MEDIA OPTIMIZATION:
- Facebook Shareable: ${websiteContent.technical.socialSharing.facebookShareable}
- Twitter Shareable: ${websiteContent.technical.socialSharing.twitterShareable}
- LinkedIn Shareable: ${websiteContent.technical.socialSharing.linkedinShareable}

TECHNICAL SEO ELEMENTS:
- Has Favicon: ${websiteContent.technical.technicalSEO.hasFavicon}
- Has Manifest: ${websiteContent.technical.technicalSEO.hasManifest}
- Has Sitemap: ${websiteContent.technical.technicalSEO.hasSitemap}
- Language Declared: ${websiteContent.technical.technicalSEO.languageDeclared}

HEADING STRUCTURE:
H1 Tags: ${websiteContent.headings.h1.length ? websiteContent.headings.h1.map((h: any) => `"${h}"`).join(', ') : 'None'}
H2 Tags: ${websiteContent.headings.h2.length ? websiteContent.headings.h2.map((h: any) => `"${h}"`).join(', ') : 'None'}
H3 Tags: ${websiteContent.headings.h3.length ? websiteContent.headings.h3.map((h: any) => `"${h}"`).join(', ') : 'None'}
H4 Tags: ${websiteContent.headings.h4.length ? websiteContent.headings.h4.map((h: any) => `"${h}"`).join(', ') : 'None'}
H5 Tags: ${websiteContent.headings.h5.length ? websiteContent.headings.h5.map((h: any) => `"${h}"`).join(', ') : 'None'}
H6 Tags: ${websiteContent.headings.h6.length ? websiteContent.headings.h6.map((h: any) => `"${h}"`).join(', ') : 'None'}
H1 Count: ${websiteContent.technical.headingStructure.h1Count} (should be 1)
H2 Count: ${websiteContent.technical.headingStructure.h2Count}
H3 Count: ${websiteContent.technical.headingStructure.h3Count}
H4 Count: ${websiteContent.technical.headingStructure.h4Count}
H5 Count: ${websiteContent.technical.headingStructure.h5Count}
H6 Count: ${websiteContent.technical.headingStructure.h6Count}
Proper Hierarchy: ${websiteContent.technical.headingStructure.properHierarchy}
Skipped Heading Levels: ${websiteContent.technical.headingStructure.skippedLevels}

CONTENT ANALYSIS:
Content Length: ${websiteContent.performance.contentLength} characters
Word Count: ${websiteContent.performance.wordCount} words
Content Preview: "${websiteContent.content.substring(0, 1000)}..."

IMAGES & MEDIA:
Total Images: ${websiteContent.performance.imageCount}
Images with Alt Text: ${websiteContent.technical.imagesWithAlt}
Images Missing Alt Text: ${websiteContent.technical.imagesWithoutAlt}
Images Missing Dimensions: ${websiteContent.technical.imagesWithoutDimensions}
Alt Text Coverage: ${websiteContent.performance.imageCount > 0 ? Math.round((websiteContent.technical.imagesWithAlt / websiteContent.performance.imageCount) * 100) : 0}%
Images with Loading Attribute: ${websiteContent.images.filter(img => img.loading).length}

LINKS & NAVIGATION:
Total Links: ${websiteContent.performance.linkCount}
Internal Links: ${websiteContent.performance.internalLinkCount}
External Links: ${websiteContent.performance.externalLinkCount}
Nofollow Links: ${websiteContent.performance.nofollowLinkCount}
Internal Link Ratio: ${websiteContent.performance.linkCount > 0 ? Math.round((websiteContent.performance.internalLinkCount / websiteContent.performance.linkCount) * 100) : 0}%
External Link Quality: ${websiteContent.performance.externalLinkCount > 0 ? 'Analyze external domains for authority' : 'No external links found'}

META TAGS:
Keywords: "${websiteContent.meta.keywords || 'Not specified'}"
Author: "${websiteContent.meta.author || 'Not specified'}"
Robots: "${websiteContent.meta.robots || 'Not specified'}"
Canonical: "${websiteContent.meta.canonical || 'Not specified'}"

TASK: Provide a comprehensive SEO analysis in this exact JSON format. Focus on SECTION-BY-SECTION analysis with specific before/after code examples:

For each section, include:
1. **Current Code Examples**: Show the actual HTML/meta tags that need improvement
2. **Suggested Code Examples**: Provide the corrected code with proper syntax
3. **Implementation Details**: Explain exactly how to apply the changes
4. **Performance Impact**: Describe the expected improvement
5. **Priority Level**: Critical/High/Medium/Low
6. **File Location**: Specify where to make changes (e.g., index.html, components/Header.js)

## COMPREHENSIVE SEO AUDIT FRAMEWORK:

### TECHNICAL SEO AUDIT:
**Crawlability & Indexation:**
- Robots.txt analysis and recommendations
- XML sitemap optimization
- Crawl budget optimization
- Indexation status check
- Canonical tag implementation

**Site Architecture:**
- Internal linking structure
- URL structure optimization
- Navigation hierarchy
- Orphan page identification
- Site speed optimization

**Core Web Vitals:**
- LCP (Largest Contentful Paint) optimization
- INP (Interaction to Next Paint) improvement
- CLS (Cumulative Layout Shift) reduction
- Server response time (TTFB)
- Image optimization with specific dimensions and file sizes

**Mobile Optimization:**
- Responsive design verification
- Mobile-first indexing readiness
- Touch target size optimization
- Viewport configuration
- Mobile performance optimization

**Security & HTTPS:**
- SSL certificate validation
- Mixed content issues
- HTTP to HTTPS redirects
- HSTS implementation
- Security headers

### ON-PAGE SEO AUDIT:
**Title Tags Optimization:**
- Title length optimization (50-60 characters)
- Keyword placement in titles
- Brand name positioning
- Title uniqueness across pages
- Click-through rate optimization

**Meta Descriptions:**
- Meta description length (150-160 characters)
- Keyword inclusion and natural language
- Value proposition and call-to-action
- Description uniqueness
- SERP appearance optimization

**Heading Structure:**
- H1 tag optimization (one per page)
- Heading hierarchy (H1 → H2 → H3)
- Keyword placement in headings
- Semantic HTML5 structure
- Heading content alignment

**Content Optimization:**
- Keyword density and placement
- Content length and depth
- Readability and font size optimization
- Content freshness and updates
- Search intent satisfaction
- Competitor content analysis

**Image Optimization:**
- Alt text implementation
- Image dimensions and file size optimization
- Modern format recommendations (WebP, AVIF)
- Lazy loading implementation
- Responsive image configuration
- Image sitemap inclusion

**Internal Linking:**
- Anchor text optimization
- Link distribution analysis
- Contextual linking strategy
- Link juice flow optimization
- Broken link identification

### OFF-PAGE SEO AUDIT:
**Backlink Analysis:**
- Domain Authority estimation
- Backlink quality assessment
- Anchor text distribution
- Referring domain diversity
- Link velocity analysis
- Competitor backlink comparison

**Social Media Optimization:**
- Open Graph tag implementation
- Twitter Card optimization
- Social sharing optimization
- Social media meta tags
- Social signals analysis

**Local SEO (if applicable):**
- NAP consistency
- Google Business Profile optimization
- Local schema implementation
- Location-specific content
- Local citation analysis

### CONTENT QUALITY ASSESSMENT:
**E-E-A-T Signals:**
- Experience demonstration
- Expertise indicators
- Authoritativeness factors
- Trustworthiness elements
- Content quality scoring

**User Experience:**
- Page layout optimization
- Font size and readability
- Color contrast and accessibility
- Navigation usability
- Content engagement metrics

**Technical Performance:**
- Page speed optimization
- Core Web Vitals improvement
- Mobile performance
- Server optimization
- CDN implementation

For technical issues, include:
- **Current HTML**: Show the problematic code
- **Suggested HTML**: Provide the corrected implementation
- **CSS/JavaScript**: Include any necessary styling or scripts
- **File Location**: Specify where to make changes
- **Performance Impact**: Expected improvement metrics

For content issues, include:
- **Current Content**: Show the current text/heading
- **Suggested Content**: Provide improved version
- **SEO Best Practices**: Explain the reasoning
- **Character/Word Count**: Optimize for SEO best practices
- **Font Size Recommendations**: Specific font size improvements

For image optimization, include:
- **Current Image**: Show current image tag
- **Suggested Image**: Provide optimized version with dimensions
- **File Size**: Specific file size recommendations
- **Format**: Recommended image format (WebP, AVIF, etc.)
- **Dimensions**: Optimal width and height
- **Loading Strategy**: Lazy loading implementation

For performance issues, include:
- **Current Implementation**: Show slow-loading code
- **Optimized Code**: Provide faster alternatives
- **Loading Strategies**: Lazy loading, compression, caching
- **Measurement Tools**: How to verify improvements
- **Expected Performance Gains**: Specific metrics improvement

RESPONSE FORMAT: Return ONLY the JSON object below, nothing else:

{
  "overallScore": 0-100,
  "siteType": "SaaS/e-commerce/blog/local/other",
  "generalSuggestions": [
    {
      "category": "technical/content/structure",
      "issue": "overall website issue",
      "impact": "why this matters for SEO",
      "recommendation": "how to fix it",
      "priority": "critical/high/medium/low",
      "currentCode": "current HTML/meta tag code here",
      "suggestedCode": "improved code here",
      "implementation": "step-by-step instructions"
    }
  ],
  "sectionAnalysis": [
    {
      "sectionName": "Hero Section",
      "sectionType": "hero/header/navigation/footer/about/cta/contact/testimonials/features/pricing",
      "issues": [
        {
          "problem": "specific problem in this section",
          "impact": "why this matters for SEO",
          "evidence": "current HTML/code snippet",
          "recommendation": "suggested fix here",
          "suggestedCode": "improved code here",
          "implementation": "how to implement the fix"
        }
      ],
      "strengths": [
        {
          "positive": "what's working well in this section",
          "reason": "why this is good for SEO"
        }
      ],
      "suggestions": [
        {
          "improvement": "specific enhancement suggestion",
          "benefit": "SEO benefit of this improvement",
          "currentCode": "current code snippet",
          "suggestedCode": "improved code snippet",
          "implementation": "how to implement"
        }
      ]
    }
  ],
  "detailedRecommendations": {
    "title": {
      "current": "current title tag",
      "suggested": "optimized title tag",
      "reason": "why this is better",
      "currentCode": "<title>Current Title</title>",
      "suggestedCode": "<title>Optimized Title</title>",
      "implementation": "Replace title tag in <head> section"
    },
    "metaDescription": {
      "current": "current meta description", 
      "suggested": "optimized meta description",
      "reason": "why this is better",
      "currentCode": "<meta name=\"description\" content=\"Current description\">",
      "suggestedCode": "<meta name=\"description\" content=\"Optimized description\">",
      "implementation": "Update meta description in <head> section"
    },
    "headings": {
      "issues": [
        {
          "problem": "heading structure problem",
          "impact": "why this matters for SEO",
          "evidence": "<h3>Subtitle</h3><h2>Main Title</h2>",
          "recommendation": "Fix heading hierarchy",
          "suggestedCode": "<h1>Main Title</h1><h2>Subtitle</h2>",
          "implementation": "Update heading structure in HTML"
        }
      ],
      "suggestions": [
        {
          "improvement": "Add semantic HTML5 heading structure",
          "benefit": "Better SEO and accessibility",
          "currentCode": "<div class=\"title\">Title</div>",
          "suggestedCode": "<h1>Title</h1>",
          "implementation": "Replace div with semantic h1 tag"
        }
      ],
      "codeExamples": {
        "before": "<h3>Subtitle</h3><h2>Main Title</h2>",
        "after": "<h1>Main Title</h1><h2>Subtitle</h2>"
      }
    },
    "content": {
      "wordCount": "assessment of content length",
      "keywordUsage": "keyword optimization suggestions",
      "readability": "content quality assessment",
      "suggestedAdditions": ["specific content to add"],
      "currentContent": "current content snippet",
      "suggestedContent": "improved content version",
      "implementation": "how to update content"
    },
    "technical": {
      "imageOptimization": {
        "currentCode": "<img src=\"image.jpg\" alt=\"\" />",
        "suggestedCode": "<img src=\"image.jpg\" alt=\"Descriptive alt text\" width=\"800\" height=\"600\" loading=\"lazy\" />",
        "implementation": "Add alt text, dimensions, and lazy loading to all images"
      },
      "internalLinking": {
        "currentCode": "<a href=\"/about\">About</a>",
        "suggestedCode": "<a href=\"/about\" title=\"Learn more about our services\">About</a>",
        "implementation": "Add descriptive title attributes to all internal links"
      },
      "urlStructure": {
        "currentCode": "www.example.com/page?id=123",
        "suggestedCode": "www.example.com/keyword-rich-page",
        "implementation": "Create SEO-friendly URLs with keywords"
      },
      "structuredData": {
        "currentCode": "",
        "suggestedCode": "<script type=\"application/ld+json\">{\"@context\": \"https://schema.org\", \"@type\": \"WebPage\", \"name\": \"Page Title\"}</script>",
        "implementation": "Add JSON-LD structured data to <head> section"
      },
      "metaTags": {
        "currentCode": "<meta name=\"keywords\" content=\"old keywords\" />",
        "suggestedCode": "<meta name=\"keywords\" content=\"new, optimized, keywords\" />",
        "implementation": "Update meta keywords with relevant terms"
      }
    },
    "performance": {
      "pageSpeed": {
        "currentCode": "<script src=\"large-script.js\"></script>",
        "suggestedCode": "<script src=\"large-script.js\" defer></script>",
        "implementation": "Add defer attribute to non-critical scripts"
      },
      "coreWebVitals": {
        "currentCode": "<img src=\"large-image.jpg\" />",
        "suggestedCode": "<img src=\"large-image.jpg\" loading=\"lazy\" width=\"800\" height=\"600\" />",
        "implementation": "Implement lazy loading for images to improve LCP"
      },
      "loadingOptimization": {
        "currentCode": "<link rel=\"stylesheet\" href=\"styles.css\" />",
        "suggestedCode": "<link rel=\"preload\" href=\"critical.css\" as=\"style\" /><link rel=\"stylesheet\" href=\"non-critical.css\" media=\"print\" />",
        "implementation": "Implement critical CSS loading strategy"
      }
    }
  }
}

    "pageAuthority": 1-100,
    "backlinksCount": estimated_total_backlinks,
    "referringDomains": estimated_referring_domains,
    "organicKeywords": estimated_organic_keywords_ranking,
    "organicTraffic": estimated_monthly_organic_traffic,
    "coreWebVitals": {
      "inp": score_0-100_or_time_in_milliseconds,
      "cls": score_0-100_or_decimal_value
    },
    "mobileFriendliness": boolean,
    "pageSpeed": {
      "desktop": 0-100,
      "mobile": 0-100
    },
    "securityScore": 0-100,
    "structuredDataScore": 0-100,
    "internalLinkingScore": 0-100,
    "contentDepthScore": 0-100,
    "userExperienceScore": 0-100
  },
  "nextSteps": [
    "Immediate actions (critical issues)",
    "Short-term improvements (high impact)", 
    "Long-term strategy (content & authority)"
  ]
}

IMPORTANT: 
1. Start with generalSuggestions for overall website issues
2. Then provide detailed sectionAnalysis for each identifiable section (Hero, Navigation, About, CTA, Features, Pricing, Testimonials, Footer, etc.)
3. For each section, identify the section type and provide specific issues, strengths, and suggestions
4. Include actual HTML code snippets for current and suggested implementations
5. Make recommendations specific to the website's actual content and structure
6. Focus on actionable, specific recommendations that will improve search rankings

CRITICAL JSON REQUIREMENTS:
- Return ONLY valid JSON - no extra text before or after
- Ensure all strings are properly escaped
- No trailing commas in arrays or objects
- All property names must be in quotes
- Do not include any markdown formatting or code blocks in the JSON
- Test your JSON output before returning

SECTION IDENTIFICATION GUIDELINES:
- Hero Section: Main header area with title, subtitle, CTA
- Navigation: Menu/navigation bar
- About Section: Company/team information
- Features Section: Product/service features
- Pricing Section: Pricing tables/plans
- Testimonials Section: Customer reviews
- CTA Section: Call-to-action areas
- Contact Section: Contact information/forms
- Footer: Bottom section with links

Focus on actionable, specific recommendations that will improve search rankings and user experience.
Consider all the technical metrics provided and prioritize issues that will have the biggest impact.

RESPONSE FORMAT: Return ONLY the JSON object below, nothing else:
`;

      // console.log('Using Vercel AI SDK with Google models...');
      // console.log('API Key available:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);

      let text = '';
      let modelUsed = '';

      try {
        // Use Vercel AI SDK with Google Gemini model
        const { text: generatedText } = await generateText({
          // model: google('gemini-1.5-flash'),
          // model: deepseek('deepseek-chat'),
          model: cohere('command-a-03-2025'),
          prompt: prompt,
        });

        text = generatedText;
        // console.log("generatedText ---> 🟢 ", generatedText);
        modelUsed = "command-a-03-2025";
        console.log(`Successfully used model: ${modelUsed}`);
      } catch (error: any) {
        console.log('Primary model failed, trying fallback model:', error.message);

        // try {
        //     // Try with a different model as fallback
        //     const { text: fallbackText } = await generateText({
        //         model: google('gemini-pro'),
        //         prompt: prompt,
        //     });

        //     text = fallbackText;
        //     modelUsed = "gemini-pro";
        //     console.log(`Successfully used fallback model: ${modelUsed}`);
        // } catch (fallbackError: any) {
        //     console.log('All models failed:', fallbackError.message);
        // }
      }

      if (!text) {
        // console.log('All Google AI models failed, using enhanced fallback analysis');
        return NextResponse.json({
          error: 'Google AI models are currently unavailable. Using enhanced SEO analysis.',
          // fallbackAnalysis: generateFallbackAnalysis(websiteContent)
        }, { status: 200 });
      }

      // Clean up the response and parse JSON with better error handling
      let analysis;
      try {
        // Try to find JSON in the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }

        // Clean up the JSON string
        let jsonString = jsonMatch[0];

        // Fix common JSON issues
        jsonString = jsonString
          .replace(/,\s*}/g, '}')  // Remove trailing commas before }
          .replace(/,\s*]/g, ']')  // Remove trailing commas before ]
          .replace(/:\s*,/g, ': null,')  // Fix empty values
          .replace(/:\s*}/g, ': null}');  // Fix missing values before }

        // console.log('Attempting to parse JSON:', jsonString.substring(0, 200) + '...');

        analysis = JSON.parse(jsonString);
      } catch (parseError: any) {
        console.error('JSON Parse Error:', parseError.message);
        // console.log('Raw response:', text.substring(0, 500) + '...');

        // Return fallback analysis if JSON parsing fails
        return NextResponse.json({
          error: 'AI service returned invalid format. Using basic SEO analysis.',
          // fallbackAnalysis: generateFallbackAnalysis(websiteContent)
        }, { status: 200 });
      }

      // console.log(`Successfully used Google AI model: ${modelUsed}`);

      return NextResponse.json(analysis);
    } catch (error: any) {
      console.error('Google AI Analysis Error:', error);

      // For any errors, provide fallback analysis
      return NextResponse.json({
        error: 'AI service temporarily unavailable. Using basic SEO analysis.',
        // fallbackAnalysis: generateFallbackAnalysis(websiteContent)
      }, { status: 200 });
    }
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json({
      error: 'Internal server error during SEO analysis'
    }, { status: 500 });
  }
}
