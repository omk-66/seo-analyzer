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
      lcp: audits['largest-contentful-paint']?.displayValue || null,
      fid: audits['max-potential-fid']?.displayValue || null,
      cls: audits['cumulative-layout-shift']?.displayValue || null,
      fcp: audits['first-contentful-paint']?.displayValue || null
    };
  };

  return `You are an expert SEO analyst providing AIOSEO-style audit results. Analyze this website and provide detailed recommendations.

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
H2: ${summarizeHeadings(websiteContent.headings.h2, 3)}
H3: ${summarizeHeadings(websiteContent.headings.h3, 3)}

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
## PERFORMANCE
Score: ${extractKeyPageSpeedMetrics(pageSpeedData)?.performanceScore || 'N/A'}/100
LCP: ${extractKeyPageSpeedMetrics(pageSpeedData)?.lcp || 'N/A'}
FID: ${extractKeyPageSpeedMetrics(pageSpeedData)?.fid || 'N/A'}
CLS: ${extractKeyPageSpeedMetrics(pageSpeedData)?.cls || 'N/A'}
FCP: ${extractKeyPageSpeedMetrics(pageSpeedData)?.fcp || 'N/A'}
` : ''}

## TASK
Provide AIOSEO-style audit report with this exact structure:

{
  "overallScore": 0-100,
  "siteType": "website type",
  "criticalIssues": [
    {
      "category": "technical|on-page|content|advanced",
      "issue": "specific issue name",
      "impact": "why it matters - 1-2 sentences",
      "evidence": "what we found on the page",
      "recommendation": "how to fix - specific action",
      "priority": "critical|high|medium|low"
    }
  ],
  "strengths": [
    {
      "area": "what area is working well",
      "description": "why it's good - 1-2 sentences",
      "status": "good"
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
      "suggested": "better title under 60 chars",
      "reason": "why this is better"
    },
    "metaDescription": {
      "current": "current meta or empty string",
      "suggested": "better meta under 160 chars",
      "reason": "why this is better"
    },
    "headings": {
      "issues": ["issue1", "issue2"],
      "suggestions": ["suggestion1", "suggestion2"]
    },
    "content": {
      "wordCount": "assessment of content length",
      "keywordUsage": "assessment of keyword usage",
      "readability": "assessment of readability"
    },
    "technical": {
      "imageOptimization": "assessment of image optimization",
      "internalLinking": "assessment of internal linking",
      "urlStructure": "assessment of URL structure",
      "structuredData": "assessment of structured data",
      "metaTags": "assessment of meta tags"
    }
  },
  "seoMetrics": {
    "technicalScore": 0-100,
    "contentScore": 0-100,
    "performanceScore": 0-100,
    "accessibilityScore": 0-100,
    "coreWebVitals": {
      "lcp": "2.5s",
      "fid": "100ms",
      "cls": "0.1",
      "fcp": "1.8s"
    }
  },
  "nextSteps": ["step1", "step2", "step3"]
}

## AIOSEO STYLE REQUIREMENTS:

For Basic SEO section:
- Title: Include current title with character count, then suggested improved title
- Meta Description: Include current meta with character count, then suggested improved version
- Headings: Analyze H1, H2, H3 tags and their hierarchy
- Keywords: Identify keywords found and their usage
- Content: Assess word count, readability, and keyword density

For Advanced SEO section:
- Canonical URL: Check if present
- Open Graph: Check og:title, og:description, og:image tags
- Twitter Cards: Check twitter:card, twitter:title, twitter:description
- Robots.txt: Check if accessible and properly configured
- Sitemap: Check if sitemap.xml exists
- Schema.org: Check for structured data markup

For Keywords section:
- List most common keywords found on the page
- Analyze keyword density and placement
- Suggest target keywords for title and description

Focus on actionable technical issues. Keep response concise but comprehensive.`;
};
