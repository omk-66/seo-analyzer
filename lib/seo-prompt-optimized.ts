export const generateOptimizedSEOPrompt = (websiteContent: any, pageSpeedData?: any, sitemapData?: any) => {
  const truncateText = (text: string, maxLength: number = 200) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const summarizeHeadings = (headings: string[], maxCount: number = 5) => {
    return headings.slice(0, maxCount).map(h => `"${truncateText(h, 50)}"`).join(', ');
  };

  const extractKeyPageSpeedMetrics = (pageSpeedData: any) => {
    if (!pageSpeedData?.lighthouseResult) return null;
    const audits = pageSpeedData.lighthouseResult.audits || {};
    const categories = pageSpeedData.lighthouseResult.categories || {};

    return {
      performanceScore: categories.performance?.score ? Math.round(categories.performance.score * 100) : null,
      lcp: audits['largest-contentful-paint']?.displayValue ? parseFloat(audits['largest-contentful-paint']?.displayValue.replace(/[^0-9.]/g, '')) : null,
      inp: audits['interaction-to-next-paint']?.displayValue ? parseInt(audits['interaction-to-next-paint']?.displayValue.replace(/[^0-9]/g, '')) : null,
      cls: audits['cumulative-layout-shift']?.displayValue ? parseFloat(audits['cumulative-layout-shift']?.displayValue) : null,
      fcp: audits['first-contentful-paint']?.displayValue ? parseFloat(audits['first-contentful-paint']?.displayValue.replace(/[^0-9.]/g, '')) : null,
      ttfb: audits['server-response-time']?.displayValue ? parseFloat(audits['server-response-time']?.displayValue.replace(/[^0-9.]/g, '')) : null,
      tti: audits['interactive']?.displayValue ? parseFloat(audits['interactive']?.displayValue.replace(/[^0-9.]/g, '')) : null,
      tbt: audits['total-blocking-time']?.displayValue ? parseInt(audits['total-blocking-time']?.displayValue.replace(/[^0-9]/g, '')) : null,
      speedIndex: audits['speed-index']?.displayValue ? parseFloat(audits['speed-index']?.displayValue.replace(/[^0-9.]/g, '')) : null
    };
  };

  return `You are an expert SEO analyst providing comprehensive AIOSEO-style deep audit results. Analyze this website thoroughly.

## CRITICAL JSON FORMATTING RULES - READ CAREFULLY:
1. Use ONLY double quotes " for all strings and property names
2. NEVER use single quotes ' inside strings
3. For HTML examples, use \" to escape quotes inside strings, like: {\"@type\": \"Organization\"}
4. Escape special characters properly (newlines as \\n, tabs as \\t)
5. Ensure all arrays and objects are properly closed
6. NO trailing commas before } or ]
7. All property values must be properly typed (strings in quotes, numbers without quotes, booleans as true/false)

## SITE DATA
URL: ${websiteContent.url}
Title: "${truncateText(websiteContent.title, 100)}"
Meta Description: "${truncateText(websiteContent.metaDescription, 150)}"

## TECHNICAL SEO ANALYSIS
HTTPS: ${websiteContent.technical.hasHttps ? '✅' : '❌'}
Title: ${websiteContent.technical.hasTitle ? '✅' : '❌'} (${websiteContent.technical.titleLength} chars)
Meta Description: ${websiteContent.technical.hasMetaDescription ? '✅' : '❌'} (${websiteContent.technical.metaDescriptionLength} chars)
Canonical: ${websiteContent.performance.hasCanonical ? '✅' : '❌'}
Viewport: ${websiteContent.performance.hasViewportMeta ? '✅' : '❌'}
Structured Data: ${websiteContent.performance.hasStructuredData ? '✅' : '❌'}
Open Graph: ${websiteContent.performance.hasOpenGraph ? '✅' : '❌'}
Robots Meta: ${websiteContent.performance.hasRobotsMeta ? '✅' : '❌'}
Schema Types: ${websiteContent.performance.structuredDataTypes?.join(', ') || 'None'}

## HEADING STRUCTURE
H1 Count: ${websiteContent.technical.headingStructure.h1Count} (should be 1)
H2 Count: ${websiteContent.technical.headingStructure.h2Count}
H3 Count: ${websiteContent.technical.headingStructure.h3Count}
Hierarchy: ${websiteContent.technical.headingStructure.properHierarchy ? '✅ Proper' : '❌ Issues'}

## CONTENT ANALYSIS
Word Count: ${websiteContent.performance.wordCount} words
Content Length: ${websiteContent.performance.contentLength} chars
Readability: ${websiteContent.technical.readabilityScore.readingLevel}

## MEDIA & LINKS
Images: ${websiteContent.performance.imageCount} total, ${websiteContent.technical.imagesWithAlt} with alt, ${websiteContent.technical.imagesWithoutAlt} missing
Links: ${websiteContent.performance.linkCount} total (${websiteContent.performance.internalLinkCount} internal, ${websiteContent.performance.externalLinkCount} external)

${sitemapData ? `
## SITEMAP
Found: ${sitemapData.found ? '✅' : '❌'} (${sitemapData.urlCount || 0} URLs)
` : ''}

${pageSpeedData ? `
## PAGESPEED INSIGHTS
Score: ${extractKeyPageSpeedMetrics(pageSpeedData)?.performanceScore || 'N/A'}/100
LCP: ${extractKeyPageSpeedMetrics(pageSpeedData)?.lcp || 'N/A'}s
INP: ${extractKeyPageSpeedMetrics(pageSpeedData)?.inp || 'N/A'}ms
CLS: ${extractKeyPageSpeedMetrics(pageSpeedData)?.cls || 'N/A'}
FCP: ${extractKeyPageSpeedMetrics(pageSpeedData)?.fcp || 'N/A'}s
TTFB: ${extractKeyPageSpeedMetrics(pageSpeedData)?.ttfb || 'N/A'}s
` : ''}

## TASK
Provide a COMPREHENSIVE SEO audit report with detailed analysis in this JSON format:

{
  "overallScore": 0-100,
  "siteType": "blog|e-commerce|business|portfolio|educational|news|other",
  "url": "${websiteContent.url}",
  
  "criticalIssues": [
    {
      "category": "technical|on-page|content|security|performance",
      "issue": "specific issue name",
      "impact": "why it matters - 2-3 sentences explaining the SEO impact",
      "evidence": "exact evidence found on the page",
      "recommendation": "specific actionable recommendation with code example if applicable",
      "priority": "critical|high|medium|low"
    }
  ],
  
  "strengths": [
    {
      "area": "what's working well",
      "description": "detailed description of why this is a strength"
    }
  ],
  
  "quickWins": [
    {
      "improvement": "specific quick improvement",
      "impact": "expected SEO benefit",
      "effort": "low|medium|high"
    }
  ],
  
  "detailedRecommendations": {
    "title": {
      "current": "current title or empty",
      "suggested": "improved title under 60 chars with primary keyword",
      "reason": "why this improves SEO and CTR"
    },
    
    "metaDescription": {
      "current": "current meta or empty",
      "suggested": "compelling meta under 160 chars with CTA",
      "reason": " CTR improvement explanation"
    },
    
    "headings": {
      "issues": ["specific issue 1", "specific issue 2"],
      "suggestions": ["specific suggestion 1", "specific suggestion 2"]
    },
    
    "content": {
      "wordCount": "detailed assessment with word count range recommendation",
      "keywordUsage": "detailed keyword analysis with density percentages",
      "readability": "readability score assessment with Flesch-Kincaid level",
      "LSIKeywords": ["LSI keyword 1", "LSI keyword 2", "LSI keyword 3"],
      "contentGaps": ["missing content area 1", "missing content area 2"],
      "contentStructure": "heading hierarchy and content organization assessment"
    },
    
    "keywords": {
      "primaryKeywords": [
        {"keyword": "primary keyword", "count": 5, "density": "1.2%", "placement": ["title", "h1", "first paragraph"]}
      ],
      "secondaryKeywords": [
        {"keyword": "secondary keyword", "count": 3, "density": "0.8%"}
      ],
      "longTailKeywords": [
        {"keyword": "long tail phrase", "count": 2}
      ],
      "missingKeywords": ["target keyword 1", "target keyword 2"],
      "keywordStuffing": false
    },
    
    "links": {
      "internalLinks": [
        {"url": "/internal-page", "anchor": "anchor text", "isContextual": true}
      ],
      "externalLinks": [
        {"url": "https://example.com", "anchor": "anchor text", "isNofollow": false}
      ],
      "brokenLinks": [
        {"url": "/broken-page", "status": "404"}
      ],
      "orphanedPages": ["/page1", "/page2"],
      "linkEquity": "detailed assessment of link equity distribution"
    },
    
    "technical": {
      "imageOptimization": "detailed image optimization assessment",
      "internalLinking": "internal linking structure assessment",
      "urlStructure": "URL structure and readability assessment",
      "structuredData": "structured data implementation assessment",
      "metaTags": "all meta tags assessment including Open Graph, Twitter Cards"
    }
  },
  
  "seoMetrics": {
    "technicalScore": 0-100,
    "contentScore": 0-100,
    "performanceScore": 0-100,
    "accessibilityScore": 0-100,
    "securityScore": 0-100,
    "mobileSpeedScore": 0-100,
    "readabilityScore": 0-100,
    "wordCount": 0,
    "contentDepthScore": 0-100,
    "keywordScore": 0-100,
    "structuredDataScore": 0-100,
    "internalLinkingScore": 0-100,
    "externalLinkingScore": 0-100,
    "userExperienceScore": 0-100,
    "socialSharingScore": 0-100,
    
    "coreWebVitals": {
      "lcp": 2.5,
      "inp": 100,
      "cls": 0.1,
      "fcp": 1.8,
      "ttfb": 0.5
    },
    
    "pageSpeed": {
      "desktop": 85,
      "mobile": 72,
      "firstContentfulPaint": 1.8,
      "largestContentfulPaint": 2.5,
      "timeToInteractive": 3.2,
      "speedIndex": 2.8,
      "totalBlockingTime": 150
    },
    
    "sslStatus": "valid|invalid|missing",
    "mobileFriendliness": true,
    "contentFreshness": "Recent|Outdated|Unknown",
    "topKeywords": [
      {"keyword": "keyword", "position": 1, "volume": 1000, "difficulty": 45}
    ],
    "schemaTypes": ["WebSite", "Organization", "BreadcrumbList"],
    
    "additionalMetrics": {
      "domainAuthority": 45,
      "pageAuthority": 35,
      "backlinksCount": 150,
      "referringDomains": 50,
      "organicKeywords": 200,
      "organicTraffic": 5000,
      "bounceRate": 45.2,
      "dwellTime": 180,
      "conversionRate": 2.5
    }
  },
  
  "nextSteps": [
    "priority 1: most important action",
    "priority 2: second most important action",
    "priority 3: third most important action"
  ]
}

## COMPREHENSIVE AUDIT REQUIREMENTS:

### CRITICAL ISSUES (Priority: Critical/High)
- Missing essential SEO elements (title, meta, H1, canonical)
- Security issues (no HTTPS, invalid SSL)
- Major performance problems (LCP > 4s, CLS > 0.25)
- Critical accessibility issues (missing alt on important images)
- Broken internal links affecting crawlability

### WARNINGS (Priority: Medium/Low)
- Suboptimal title/meta length
- Heading structure issues
- Image optimization opportunities
- Missing optional meta tags
- Content quality suggestions

### PASSED CHECKS
- All positive findings that are working correctly
- Proper implementation of SEO best practices
- Good performance metrics
- Proper schema implementation

### QUICK WINS
- Easy fixes with high impact
- Low effort improvements
- Content optimizations
- Small technical fixes

### KEYWORD ANALYSIS
- Extract and count all keywords
- Calculate keyword density
- Identify keyword placement (title, headings, content)
- Find missing keyword opportunities
- Check for keyword stuffing

### CONTENT ANALYSIS
- Word count assessment (thin vs adequate vs comprehensive)
- Readability score (Flesch-Kincaid)
- LSI keyword identification
- Content gap analysis
- Content structure evaluation

### TECHNICAL SEO
- URL structure analysis
- Internal linking assessment
- External linking quality
- Schema markup evaluation (check for Organization, WebSite, WebPage, BreadcrumbList, Article, Product, LocalBusiness schemas)
- Core Web Vitals analysis
- Mobile friendliness check\n\n### SCHEMA MARKUP GUIDANCE\nWhen recommending schema markup, provide:\n1. Which schema types should be implemented based on the site type\n2. Specific JSON-LD code examples using ONLY double quotes for strings\n3. Example of properly escaped JSON-LD: {\"@context\": \"https://schema.org\", \"@type\": \"Organization\", \"name\": \"Company Name\", \"url\": \"https://example.com\"}

Provide detailed, actionable, and specific recommendations. Use technical evidence from the data provided.`;
};

