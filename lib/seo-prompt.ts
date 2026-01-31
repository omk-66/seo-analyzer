export const generateSEOPrompt = (websiteContent: any, pageSpeedData?: any, sitemapData?: any) => `
You are an expert SEO technical analyst. Analyze the provided website data and provide actionable technical SEO recommendations based on ACTUAL HTML parsing and real performance data.

## TECHNICAL SEO AUDIT FRAMEWORK

Focus on REAL technical issues that can be identified and fixed, not estimated metrics.

### 1. CRITICAL TECHNICAL ISSUES (Must Fix)
- Missing or improper HTML structure
- Blocked crawling/indexing issues
- Performance problems affecting user experience
- Mobile usability issues
- Security vulnerabilities

### 2. ON-PAGE SEO OPTIMIZATION (Should Fix)
- Title tag optimization
- Meta description issues
- Heading structure problems
- Image optimization needs
- Internal linking improvements

### 3. CONTENT & STRUCTURE (Nice to Fix)
- Content quality indicators
- Schema markup opportunities
- User experience enhancements

### 4. CONTENT OPTIMIZATION (Enhance Content)
- Title tag improvement with keywords
- Meta description optimization for CTR
- Heading structure improvements
- Content length and depth recommendations
- Keyword placement and density
- Readability improvements
- Internal linking opportunities

## CONTENT OPTIMIZATION REQUIREMENTS

For each content section identified (Hero, About, Services, etc.), provide:

1. **Current Content Analysis**: What the current text says
2. **Suggested Improvements**: Better SEO-optimized version
3. **Keyword Integration**: How to naturally include target keywords
4. **Readability Enhancement**: How to make content more readable
5. **User Intent Alignment**: How to better match search intent
6. **Call-to-Action Optimization**: How to improve conversion

### Content Optimization Examples:
- **Headlines**: Add primary keywords and benefit statements
- **Descriptions**: Include secondary keywords and value propositions
- **Body Content**: Add semantic keywords and improve readability
- **CTAs**: Make them more compelling and action-oriented

## WEBSITE ANALYSIS DATA

**URL:** ${websiteContent.url}
**Title:** "${websiteContent.title}"
**Meta Description:** "${websiteContent.metaDescription}"

### TECHNICAL SEO METRICS:
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

### HEADING STRUCTURE ANALYSIS:
H1 Tags: ${websiteContent.headings.h1.length ? websiteContent.headings.h1.map((h: any) => `"${h}"`).join(', ') : 'None'}
H2 Tags: ${websiteContent.headings.h2.length ? websiteContent.headings.h2.map((h: any) => `"${h}"`).join(', ') : 'None'}
H3 Tags: ${websiteContent.headings.h3.length ? websiteContent.headings.h3.map((h: any) => `"${h}"`).join(', ') : 'None'}
H4-H6 Tags: Combined ${websiteContent.headings.h4.length + websiteContent.headings.h5.length + websiteContent.headings.h6.length} tags

**Heading Structure Issues:**
- H1 Count: ${websiteContent.technical.headingStructure.h1Count} (should be exactly 1)
- H2 Count: ${websiteContent.technical.headingStructure.h2Count}
- H3 Count: ${websiteContent.technical.headingStructure.h3Count}
- Proper Hierarchy: ${websiteContent.technical.headingStructure.properHierarchy ? '✅ Yes' : '❌ No'}
- Skipped Heading Levels: ${websiteContent.technical.headingStructure.skippedLevels ? '❌ Yes' : '✅ No'}

### CONTENT ANALYSIS:
- Content Length: ${websiteContent.performance.contentLength} characters
- Word Count: ${websiteContent.performance.wordCount} words
- Reading Level: ${websiteContent.technical.readabilityScore.readingLevel} (${websiteContent.technical.readabilityScore.fleschKincaid} grade level)
- Average Words Per Sentence: ${websiteContent.technical.readabilityScore.avgWordsPerSentence}

### IMAGES & MEDIA ANALYSIS:
- Total Images: ${websiteContent.performance.imageCount}
- Images with Alt Text: ${websiteContent.technical.imagesWithAlt} (${websiteContent.performance.imageCount > 0 ? Math.round((websiteContent.technical.imagesWithAlt / websiteContent.performance.imageCount) * 100) : 0}%)
- Images Missing Alt Text: ${websiteContent.technical.imagesWithoutAlt}
- Images Missing Dimensions: ${websiteContent.technical.imagesWithoutDimensions}

### LINKS & NAVIGATION:
- Total Links: ${websiteContent.performance.linkCount}
- Internal Links: ${websiteContent.performance.internalLinkCount}
- External Links: ${websiteContent.performance.externalLinkCount}
- Nofollow Links: ${websiteContent.performance.nofollowLinkCount}
- Internal Link Ratio: ${websiteContent.performance.linkCount > 0 ? Math.round((websiteContent.performance.internalLinkCount / websiteContent.performance.linkCount) * 100) : 0}%

### TECHNICAL SEO ELEMENTS:
- Has Favicon: ${websiteContent.technical.technicalSEO.hasFavicon ? '✅ Yes' : '❌ No'}
- Has Manifest: ${websiteContent.technical.technicalSEO.hasManifest ? '✅ Yes' : '❌ No'}
- Language Declared: ${websiteContent.technical.technicalSEO.languageDeclared ? '✅ Yes' : '❌ No'}

${sitemapData ? `
### SITEMAP ANALYSIS:
- Sitemap Found: ${sitemapData.found ? '✅ Yes' : '❌ No'}
- Sitemap URL: ${sitemapData.url || 'Not found'}
- Sitemap Size: ${sitemapData.urlCount || 0} URLs
- Last Modified: ${sitemapData.lastModified || 'Unknown'}
` : `
### SITEMAP ANALYSIS:
- Sitemap Status: ❌ Not checked or not found
`}

${pageSpeedData ? `
### GOOGLE PAGESPEED INSIGHTS:
**Performance Score: ${pageSpeedData.lighthouseResult?.categories?.performance?.score || 'N/A'}/100**

**Core Web Vitals:**
- Largest Contentful Paint (LCP): ${pageSpeedData.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue || 'N/A'}
- First Input Delay (FID): ${pageSpeedData.lighthouseResult?.audits?.['max-potential-fid']?.displayValue || 'N/A'}
- Cumulative Layout Shift (CLS): ${pageSpeedData.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue || 'N/A'}

**Other Metrics:**
- First Contentful Paint: ${pageSpeedData.lighthouseResult?.audits?.['first-contentful-paint']?.displayValue || 'N/A'}
- Speed Index: ${pageSpeedData.lighthouseResult?.audits?.['speed-index']?.displayValue || 'N/A'}
- Time to Interactive: ${pageSpeedData.lighthouseResult?.audits?.['interactive']?.displayValue || 'N/A'}

**Opportunities:**
${pageSpeedData.lighthouseResult?.audits ? Object.entries(pageSpeedData.lighthouseResult.audits)
            .filter(([key, audit]: [string, any]) =>
                audit.score !== null && audit.score < 0.9 &&
                ['uses-webp-images', 'modern-image-formats', 'offscreen-images', 'render-blocking-resources', 'unused-css-rules'].includes(key)
            )
            .map(([key, audit]: [string, any]) => `- ${audit.title}: ${audit.displayValue || 'Needs improvement'}`)
            .join('\n') : '- No specific opportunities identified'}
` : `
### GOOGLE PAGESPEED INSIGHTS:
- Performance Data: ❌ Not available
`}

## ANALYSIS REQUIREMENTS

Provide a technical SEO audit focusing on:

### 1. CRITICAL BUGS (Must Fix Immediately)
- Missing H1 tags or multiple H1s
- No meta description or poor length
- Missing canonical tags
- No viewport meta tag
- HTTPS issues
- Missing alt text on important images
- Broken heading hierarchy

### 2. IMPORTANT IMPROVEMENTS (Should Fix)
- Title tag optimization
- Meta description improvements
- Image optimization needs
- Internal linking opportunities
- Schema markup additions
- Performance optimizations

### 3. GOOD PRACTICES (What's Working Well)
- Proper technical implementation
- Good content structure
- Effective SEO elements
- Strong technical foundation

### 4. NICE TO HAVE (Future Enhancements)
- Advanced schema markup
- Additional performance optimizations
- Enhanced user experience features

## RESPONSE FORMAT

Return ONLY valid JSON with this structure:

{
  "overallScore": 85,
  "criticalIssues": [
    {
      "issue": "Missing H1 Tag",
      "impact": "Search engines cannot identify the main topic of the page",
      "priority": "critical",
      "currentCode": "<div class=\"title\">Welcome to Our Site</div>",
      "suggestedCode": "<h1>Welcome to Our Site</h1>",
      "implementation": "Replace the div with a semantic h1 tag in the HTML"
    }
  ],
  "importantImprovements": [
    {
      "issue": "Title Tag Too Long",
      "impact": "Title gets truncated in search results, reducing CTR",
      "priority": "high",
      "currentCode": "<title>This is a very long title that exceeds the recommended 60 characters and gets cut off</title>",
      "suggestedCode": "<title>This is a properly optimized title under 60 chars</title>",
      "implementation": "Shorten the title to 50-60 characters"
    }
  ],
  "goodPractices": [
    {
      "practice": "HTTPS Implementation",
      "reason": "Secure connection improves user trust and search rankings",
      "details": "Site properly uses HTTPS across all pages"
    }
  ],
  "niceToHave": [
    {
      "enhancement": "Add FAQ Schema",
      "benefit": "Rich snippets in search results",
      "implementation": "Add JSON-LD FAQ schema to the page"
    }
  ],
  "technicalSummary": {
    "hasH1": true,
    "hasMetaDescription": true,
    "hasCanonical": true,
    "hasViewport": true,
    "hasHttps": true,
    "hasStructuredData": true,
    "imageAltTextCoverage": 85,
    "headingHierarchyCorrect": true,
    "performanceScore": 75
  },
  "contentOptimizations": [
    {
      "section": "Hero Section",
      "type": "Headline",
      "currentContent": "Welcome to Our Website",
      "suggestedContent": "Professional Web Design Services - Transform Your Online Presence",
      "reason": "Includes primary keywords 'web design services' and benefit 'transform online presence' for better SEO and CTR"
    }
  ],
  "pageSpeedData": ${pageSpeedData ? JSON.stringify(pageSpeedData) : 'null'},
  "nextSteps": [
    "Fix critical H1 and meta description issues",
    "Optimize images with missing alt text",
    "Improve page speed based on PageSpeed Insights",
    "Add structured data for better SERP appearance"
  ]
}

Focus on actionable, specific recommendations that can be implemented immediately. Avoid estimated metrics and focus on technical facts.
`;
