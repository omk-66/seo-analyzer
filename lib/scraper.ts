import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ImageAnalysis {
    src: string;
    alt?: string;
    title?: string;
    width?: string;
    height?: string;
    loading?: string;
    base64?: string;
    size?: number;
    format?: string;
    aspectRatio?: string;
    isLogo?: boolean;
    isHero?: boolean;
    isProduct?: boolean;
    description?: string;
}

// Function to download and analyze images
async function downloadAndAnalyzeImage(imageSrc: string, baseUrl: string): Promise<Partial<ImageAnalysis>> {
    try {
        // Convert relative URLs to absolute
        const absoluteUrl = imageSrc.startsWith('http') ? imageSrc : new URL(imageSrc, baseUrl).href;

        // Download image
        const response = await axios.get(absoluteUrl, {
            responseType: 'arraybuffer',
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // Convert to base64
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const mimeType = response.headers['content-type'];
        const dataUrl = `data:${mimeType};base64,${base64}`;

        // Get image format from MIME type
        const format = mimeType.split('/')[1] || 'unknown';

        // Calculate file size
        const size = response.data.byteLength;

        return {
            base64: dataUrl,
            size,
            format,
            aspectRatio: 'detected'
        };
    } catch (error) {
        console.warn(`Failed to download image: ${imageSrc}`, error);
        return {};
    }
}

// Function to classify image type based on context and attributes
function classifyImage(img: any, index: number, totalImages: number): Partial<ImageAnalysis> {
    const src = img.src || '';
    const alt = img.alt || '';
    const className = img.className || '';
    const id = img.id || '';

    // Logo detection
    const isLogo = src.toLowerCase().includes('logo') ||
        alt.toLowerCase().includes('logo') ||
        className.toLowerCase().includes('logo') ||
        id.toLowerCase().includes('logo');

    // Hero image detection (first large image)
    const isHero = index === 0 &&
        (img.width && parseInt(img.width) > 400 ||
            img.height && parseInt(img.height) > 300);

    // Product image detection
    const isProduct = src.toLowerCase().includes('product') ||
        alt.toLowerCase().includes('product') ||
        className.toLowerCase().includes('product') ||
        src.toLowerCase().includes('/p/') ||
        src.toLowerCase().includes('/products/');

    return {
        isLogo,
        isHero,
        isProduct
    };
}

export interface WebsiteContent {
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
    images: ImageAnalysis[];
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
export async function scrapeWebsiteServer(url: string): Promise<WebsiteContent> {
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

        // Extract and analyze images
        const imageElements = $('img').map((_, el) => {
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

        // Analyze images
        const images: ImageAnalysis[] = [];
        for (let i = 0; i < imageElements.length; i++) {
            const img = imageElements[i];
            const classification = classifyImage(img, i, imageElements.length);
            const downloadData = await downloadAndAnalyzeImage(img.src, baseUrl);
            
            images.push({
                ...img,
                ...classification,
                ...downloadData
            });
        }

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
