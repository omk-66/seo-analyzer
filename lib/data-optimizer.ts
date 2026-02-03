export const optimizeWebsiteContent = (websiteContent: any) => {
  // Create a summarized version of website content for AI processing
  const optimized = {
    // Keep essential URL and metadata
    url: websiteContent.url,
    title: websiteContent.title,
    metaDescription: websiteContent.metaDescription,
    
    // Keep technical metrics (these are small numbers/booleans)
    technical: {
      hasHttps: websiteContent.technical.hasHttps,
      hasH1: websiteContent.technical.hasH1,
      hasMultipleH1: websiteContent.technical.hasMultipleH1,
      hasTitle: websiteContent.technical.hasTitle,
      hasMetaDescription: websiteContent.technical.hasMetaDescription,
      titleLength: websiteContent.technical.titleLength,
      metaDescriptionLength: websiteContent.technical.metaDescriptionLength,
      imagesWithoutAlt: websiteContent.technical.imagesWithoutAlt,
      imagesWithAlt: websiteContent.technical.imagesWithAlt,
      headingStructure: websiteContent.technical.headingStructure,
      readabilityScore: websiteContent.technical.readabilityScore,
      technicalSEO: websiteContent.technical.technicalSEO
    },
    
    // Summarize headings - keep only first few of each type
    headings: {
      h1: websiteContent.headings.h1.slice(0, 2), // Max 2 H1s
      h2: websiteContent.headings.h2.slice(0, 5), // Max 5 H2s
      h3: websiteContent.headings.h3.slice(0, 3), // Max 3 H3s
      h4: [], // Skip H4-H6 to save tokens
      h5: [],
      h6: []
    },
    
    // Truncate content - keep only first 1000 characters
    content: websiteContent.content.length > 1000 
      ? websiteContent.content.substring(0, 1000) + '...'
      : websiteContent.content,
    
    // Summarize images - keep only counts and sample data
    images: {
      total: websiteContent.images.length,
      withAlt: websiteContent.images.filter((img: any) => img.alt).length,
      withoutAlt: websiteContent.images.filter((img: any) => !img.alt).length,
      sample: websiteContent.images.slice(0, 3).map((img: any) => ({
        hasAlt: !!img.alt,
        hasDimensions: !!(img.width && img.height)
      }))
    },
    
    // Summarize links - keep only counts and sample data
    links: {
      total: websiteContent.links.length,
      internal: websiteContent.links.filter((link: any) => !link.isExternal).length,
      external: websiteContent.links.filter((link: any) => link.isExternal).length,
      nofollow: websiteContent.links.filter((link: any) => link.isNofollow).length,
      sample: websiteContent.links.slice(0, 5).map((link: any) => ({
        isExternal: link.isExternal,
        hasText: !!link.text.trim(),
        isNofollow: link.isNofollow
      }))
    },
    
    // Keep performance metrics (these are just numbers)
    performance: {
      contentLength: websiteContent.performance.contentLength,
      wordCount: websiteContent.performance.wordCount,
      headingCount: websiteContent.performance.headingCount,
      imageCount: websiteContent.performance.imageCount,
      linkCount: websiteContent.performance.linkCount,
      internalLinkCount: websiteContent.performance.internalLinkCount,
      externalLinkCount: websiteContent.performance.externalLinkCount,
      nofollowLinkCount: websiteContent.performance.nofollowLinkCount,
      hasStructuredData: websiteContent.performance.hasStructuredData,
      hasViewportMeta: websiteContent.performance.hasViewportMeta,
      hasRobotsMeta: websiteContent.performance.hasRobotsMeta,
      hasCanonical: websiteContent.performance.hasCanonical,
      hasOpenGraph: websiteContent.performance.hasOpenGraph,
      hasTwitterCards: websiteContent.performance.hasTwitterCards,
      structuredDataTypes: websiteContent.performance.structuredDataTypes.slice(0, 5) // Max 5 types
    },
    
    // Keep meta tags (they're usually small)
    meta: websiteContent.meta
  };
  
  return optimized;
};

export const optimizePageSpeedData = (pageSpeedData: any) => {
  if (!pageSpeedData?.lighthouseResult) return null;
  
  // Extract only the most important metrics
  const audits = pageSpeedData.lighthouseResult.audits || {};
  const categories = pageSpeedData.lighthouseResult.categories || {};
  
  return {
    performanceScore: categories.performance?.score ? Math.round(categories.performance.score * 100) : null,
    coreWebVitals: {
      lcp: audits['largest-contentful-paint']?.displayValue || null,
      fid: audits['max-potential-fid']?.displayValue || null,
      cls: audits['cumulative-layout-shift']?.displayValue || null,
      fcp: audits['first-contentful-paint']?.displayValue || null,
      ttfb: audits['server-response-time']?.displayValue || null
    },
    keyOpportunities: Object.entries(audits)
      .filter(([key, audit]: [string, any]) => 
        audit.score !== null && 
        audit.score < 0.9 && 
        audit.scoreDisplayMode === 'numeric' &&
        ['uses-webp-images', 'modern-image-formats', 'offscreen-images', 'render-blocking-resources', 'unused-css-rules', 'unused-javascript', 'total-blocking-time'].includes(key)
      )
      .slice(0, 5) // Max 5 opportunities
      .map(([key, audit]: [string, any]) => ({
        id: key,
        title: audit.title,
        description: audit.description?.substring(0, 200) + (audit.description?.length > 200 ? '...' : ''),
        score: audit.score,
        displayValue: audit.displayValue
      }))
  };
};

export const optimizeSitemapData = (sitemapData: any) => {
  if (!sitemapData) return null;
  
  return {
    found: sitemapData.found,
    url: sitemapData.url,
    urlCount: sitemapData.urlCount,
    lastModified: sitemapData.lastModified
  };
};
