export const generateOptimizedSEOPrompt = (websiteContent: any, pageSpeedData?: any, sitemapData?: any) => {
  // Truncate and summarize content to reduce tokens
  const truncateText = (text: string, maxLength: number = 200) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const summarizeHeadings = (headings: string[], maxCount: number = 5) => {
    return headings.slice(0, maxCount).map(h => `"${truncateText(h, 50)}"`).join(', ');
  };

  // Extract key PageSpeed metrics only
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

  return `You are an expert SEO analyst providing comprehensive AIOSEO-style deep audit results. Analyze this website thoroughly and provide detailed recommendations.

## SITE DATA
URL: ${websiteContent.url}
Title: "${truncateText(websiteContent.title, 100)}"
Meta Description: "${truncateText(websiteContent.metaDescription, 150)}"

## TECHNICAL SEO
HTTPS: ${websiteContent.technical.hasHttps ? '✅' : '❌'}
Has Title: ${websiteContent.technical.hasTitle ? '✅' : '❌'}
Has Meta Description: ${websiteContent.technical.hasMetaDescription ? '✅' : '❌'}
Title Length: ${websiteContent.technical.titleLength} chars (optimal: 50-60)
Meta Desc Length: ${websiteContent.technical.metaDescriptionLength} chars (optimal: 150-160)
Has Canonical: ${websiteContent.performance.hasCanonical ? '✅' : '❌'}
Has Viewport: ${websiteContent.performance.hasViewportMeta ? '✅' : '❌'}
Has Structured Data: ${websiteContent.performance.hasStructuredData ? '✅' : '❌'}
Has Open Graph: ${websiteContent.performance.hasOpenGraph ? '✅' : '❌'}
Has Robots Meta: ${websiteContent.performance.hasRobotsMeta ? '✅' : '❌'}
Structured Data Types: ${websiteContent.performance.structuredDataTypes?.join(', ') || 'None'}

## CONTENT STRUCTURE
H1 Count: ${websiteContent.technical.headingStructure.h1Count} (should be 1)
H2 Count: ${websiteContent.technical.headingStructure.h2Count}
H3 Count: ${websiteContent.technical.headingStructure.h3Count}
Proper Hierarchy: ${websiteContent.technical.headingStructure.properHierarchy ? '✅' : '❌'}
Content Length: ${websiteContent.performance.contentLength} chars
Word Count: ${websiteContent.performance.wordCount} words
Reading Level: ${websiteContent.technical.readabilityScore.readingLevel}

## HEADINGS (sample)
H1: ${summarizeHeadings(websiteContent.headings.h1, 2)}
H2: ${summarizeHeadings(websiteContent.headings.h2, 5)}
H3: ${summarizeHeadings(websiteContent.headings.h3, 5)}

## MEDIA & LINKS
Total Images: ${websiteContent.performance.imageCount}
Images with Alt: ${websiteContent.technical.imagesWithAlt}/${websiteContent.performance.imageCount}
Images Missing Alt: ${websiteContent.technical.imagesWithoutAlt}
Total Links: ${websiteContent.performance.linkCount}
Internal Links: ${websiteContent.performance.internalLinkCount}
External Links: ${websiteContent.performance.externalLinkCount}

${sitemapData ? `
## SITEMAP
Found: ${sitemapData.found ? '✅' : '❌'}
URLs: ${sitemapData.urlCount || 0}
` : ''}

${pageSpeedData ? `
## PERFORMANCE (from PageSpeed Insights)
Score: ${extractKeyPageSpeedMetrics(pageSpeedData)?.performanceScore || 'N/A'}/100
LCP: ${extractKeyPageSpeedMetrics(pageSpeedData)?.lcp || 'N/A'}s
INP: ${extractKeyPageSpeedMetrics(pageSpeedData)?.inp || 'N/A'}ms
CLS: ${extractKeyPageSpeedMetrics(pageSpeedData)?.cls || 'N/A'}
FCP: ${extractKeyPageSpeedMetrics(pageSpeedData)?.fcp || 'N/A'}s
TTFB: ${extractKeyPageSpeedMetrics(pageSpeedData)?.ttfb || 'N/A'}s
TTI: ${extractKeyPageSpeedMetrics(pageSpeedData)?.tti || 'N/A'}s
TBT: ${extractKeyPageSpeedMetrics(pageSpeedData)?.tbt || 'N/A'}ms
Speed Index: ${extractKeyPageSpeedMetrics(pageSpeedData)?.speedIndex || 'N/A'}s
` : ''}

## TASK
Provide a COMPREHENSIVE AIOSEO-style deep audit report with this exact structure:

{
  "overallScore": 0-100,
  "siteType": "website type (blog, e-commerce, business, portfolio, etc.)",
  "url": "${websiteContent.url}",
  
  "criticalIssues": [
    {
      "category": "technical|on-page|content|advanced|security",
      "issue": "specific issue name",
      "impact": "why it matters - 2-3 sentences",
      "evidence": "what we found on the page",
      "recommendation": "how to fix - specific actionable step",
      "priority": "critical|high|medium|low"
    }
  ],
  
  "strengths": [
    {
      "area": "what area is working well",
      "description": "why it's good - specific evidence"
    }
  ],
  
  "quickWins": [
    {
      "improvement": "quick fix to implement",
      "impact": "expected benefit",
      "effort": "low|medium|high"
    }
  ],
  
  "detailedRecommendations": {
    "title": {
      "current": "current title or empty string",
      "suggested": "better title under 60 chars with primary keyword",
      "reason": "why this is better for SEO and CTR"
    },
    
    "metaDescription": {
      "current": "current meta or empty string",
      "suggested": "compelling meta under 160 chars with call-to-action",
      "reason": "why this will improve click-through rates"
    },
    
    "headings": {
      "issues": ["issue1", "issue2", "issue3"],
      "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
    },
    
    "content": {
      "wordCount": "detailed assessment of content length with recommendations",
      "keywordUsage": "detailed analysis of keyword placement and density",
      "readability": "detailed readability assessment with Flesch-Kincaid score",
      "LSIKeywords": ["related keyword 1", "related keyword 2", "related keyword 3"],
      "contentGaps": ["missing content area 1", "missing content area 2"],
      "contentStructure": "assessment of heading hierarchy and content organization"
    },
    
    "keywords": {
      "primaryKeywords": [
        {"keyword": "main keyword", "count": 5, "density": "1.2%", "placement": ["title", "h1", "first paragraph"]}
      ],
      "secondaryKeywords": [
        {"keyword": "secondary keyword", "count": 3, "density": "0.8%"}
      ],
      "longTailKeywords": [
        {"keyword": "long tail keyword phrase", "count": 2}
      ],
      "missingKeywords": ["keyword you should target 1", "keyword you should target 2"],
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
      "linkEquity": "assessment of how link equity is distributed across the site"
    },
    
    "technical": {
      "imageOptimization": "detailed assessment of image optimization",
      "internalLinking": "assessment of internal linking structure",
      "urlStructure": "assessment of URL structure and readability",
      "structuredData": "assessment of structured data implementation",
      "metaTags": "assessment of all meta tags"
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
    
    "coreWebVitals": {
      "lcp": 2.5,
      "inp": 100,
      "cls": 0.1
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
    "schemaTypes": ["WebSite", "Organization", "BreadcrumbList"]
  },
  
  "nextSteps": [
    "priority 1 action item",
    "priority 2 action item", 
    "priority 3 action item"
  ]
}

## COMPREHENSIVE AUDIT REQUIREMENTS:

### For Keywords Section:
- Identify primary keywords (main focus)
- Identify secondary keywords (supporting)
- Identify long-tail keyword opportunities
- Analyze keyword density and placement
- Suggest missing keywords to target
- Check for keyword stuffing

### For Content Analysis:
- Detailed word count assessment
- Readability score (Flesch-Kincaid)
- LSI keywords (latent semantic indexing)
- Content gaps identification
- Content structure analysis
- Topic coverage assessment

### For Links Section:
- Internal link analysis with examples
- External link analysis with nofollow status
- Broken link identification
- Orphaned pages detection
- Link equity distribution assessment
- Anchor text analysis

### For Technical SEO:
- Image alt text coverage
- URL structure optimization
- Canonical tag implementation
- Open Graph tags assessment
- Twitter Cards implementation
- Robots.txt configuration
- XML sitemap status
- Favicon availability
- Language declaration
- Viewport meta tag

### For Performance (PageSpeed):
- Detailed Core Web Vitals analysis
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Interaction to Next Paint (INP)
- Cumulative Layout Shift (CLS)
- Time to First Byte (TTFB)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Speed Index

### For Schema Markup:
- Identify existing schema types
- Suggest additional schema opportunities
- Provide JSON-LD examples
- Assess schema implementation quality

Focus on actionable, technical, and comprehensive recommendations. Be specific with evidence and recommendations.`;
};
