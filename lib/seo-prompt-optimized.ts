export const generateOptimizedSEOPrompt = (websiteContent: any, pageSpeedData?: any, sitemapData?: any) => {
  // Truncate and summarize content to reduce tokens
  const truncateText = (text: string, maxLength: number = 200) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const summarizeHeadings = (headings: string[], maxCount: number = 5) => {
    return headings.slice(0, maxCount).map(h => `"${truncateText(h, 50)}"`).join(', ');
  };

  const summarizeImages = (images: any[], maxCount: number = 3) => {
    const sample = images.slice(0, maxCount);
    return sample.map(img => ({
      hasAlt: !!img.alt,
      hasDimensions: !!(img.width && img.height)
    }));
  };

  const summarizeLinks = (links: any[], maxCount: number = 5) => {
    const sample = links.slice(0, maxCount);
    return sample.map(link => ({
      isExternal: link.isExternal,
      hasText: !!link.text.trim()
    }));
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

  return `You are an expert SEO analyst. Analyze this website data and provide actionable recommendations.

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
Provide JSON response with this exact structure:
{
  "overallScore": 0-100,
  "siteType": "website type",
  "criticalIssues": [
    {
      "category": "technical",
      "issue": "specific issue",
      "impact": "why it matters",
      "evidence": "what we found",
      "recommendation": "how to fix",
      "priority": "critical"
    }
  ],
  "strengths": [
    {
      "area": "what area",
      "description": "why it's good"
    }
  ],
  "quickWins": [
    {
      "improvement": "what to do",
      "impact": "benefit expected",
      "effort": "low/medium/high"
    }
  ],
  "detailedRecommendations": {
    "title": {
      "current": "current title",
      "suggested": "better title",
      "reason": "why better"
    },
    "metaDescription": {
      "current": "current meta",
      "suggested": "better meta", 
      "reason": "why better"
    },
    "headings": {
      "issues": ["issue1", "issue2"],
      "suggestions": ["suggestion1", "suggestion2"]
    },
    "content": {
      "wordCount": "assessment",
      "keywordUsage": "assessment",
      "readability": "assessment"
    },
    "technical": {
      "imageOptimization": "assessment",
      "internalLinking": "assessment",
      "urlStructure": "assessment",
      "structuredData": "assessment",
      "metaTags": "assessment",
      "schemaMarkup": {
        "organization": "Add Organization schema for business knowledge panel",
        "service": "Implement Service schema for service-based businesses",
        "product": "Use Product schema for e-commerce items",
        "review": "Add Review/ReviewRating schema for customer testimonials"
      }
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
  "nextSteps": ["step1", "step2"]
}

Focus on actionable technical issues. Keep response concise.`;
};
