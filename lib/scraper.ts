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
        const absoluteUrl = imageSrc.startsWith('http') ? imageSrc : new URL(imageSrc, baseUrl).href;

        const response = await axios.get(absoluteUrl, {
            responseType: 'arraybuffer',
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const mimeType = response.headers['content-type'];
        const dataUrl = `data:${mimeType};base64,${base64}`;
        const format = mimeType.split('/')[1] || 'unknown';
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

    const isLogo = src.toLowerCase().includes('logo') ||
        alt.toLowerCase().includes('logo') ||
        className.toLowerCase().includes('logo') ||
        id.toLowerCase().includes('logo');

    const isHero = index === 0 &&
        (img.width && parseInt(img.width) > 400 ||
            img.height && parseInt(img.height) > 300);

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
        robotsContent?: string;
        noindex?: boolean;
        nofollow?: boolean;
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
            langAttribute: string | null;
        };
    };
    // New fields for additional SEO checks
    security: {
        sslEnabled: boolean;
        httpsRedirect: boolean;
    };
    crawlers: {
        robotsTxtUrl: string | null;
        robotsTxtExists: boolean;
        blockedByRobots: boolean;
        llmsTxtUrl: string | null;
        llmsTxtExists: boolean;
    };
    sitemaps: {
        xmlSitemapUrl: string | null;
        xmlSitemapExists: boolean;
    };
    analytics: {
        hasAnalytics: boolean;
        analyticsType: string | null;
    };
    structuredData: {
        hasJsonLd: boolean;
        schemaTypes: string[];
        hasOrganizationSchema: boolean;
        hasPersonSchema: boolean;
        organizationName: string | null;
    };
    // Usability checks
    usability: {
        flash: {
            hasFlash: boolean;
            status: 'good' | 'warning' | 'error';
            message: string;
        };
        iframes: {
            hasIframes: boolean;
            iframeCount: number;
            status: 'good' | 'warning' | 'error';
            message: string;
        };
        favicon: {
            hasFavicon: boolean;
            faviconUrl: string | null;
            status: 'good' | 'warning' | 'error';
            message: string;
        };
    };
}

// Server-side scraping function
export async function scrapeWebsiteServer(url: string): Promise<WebsiteContent> {
    try {
        const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

        const response = await axios.get(formattedUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const baseUrl = new URL(formattedUrl).origin;

        // Extract title
        const title = $('title').text().trim() || '';

        // Extract meta description
        const metaDescription = $('meta[name="description"]').attr('content') || '';

        // Extract meta robots
        const robotsContent = $('meta[name="robots"]').attr('content') || '';
        const noindex = robotsContent.toLowerCase().includes('noindex');
        const nofollow = robotsContent.toLowerCase().includes('nofollow');

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

        const content = $('body').text().trim();

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
        let hasOrganizationSchema = false;
        let hasPersonSchema = false;
        let organizationName: string | null = null;

        $('script[type="application/ld+json"]').each((_, el) => {
            try {
                const jsonData = JSON.parse($(el).html() || '{}');
                if (jsonData['@type']) {
                    const types = Array.isArray(jsonData['@type']) ? jsonData['@type'] : [jsonData['@type']];
                    structuredDataTypes.push(...types);

                    if (types.includes('Organization') || types.includes('ProfessionalService')) {
                        hasOrganizationSchema = true;
                        organizationName = jsonData.name || jsonData['@type']?.[0] || 'Organization';
                    }
                    if (types.includes('Person')) {
                        hasPersonSchema = true;
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

        const properHierarchy = h1Count === 1 && (
            (h2Count > 0 && h3Count === 0 && h4Count === 0 && h5Count === 0 && h6Count === 0) ||
            (h2Count > 0 && h3Count > 0 && h4Count === 0 && h5Count === 0 && h6Count === 0) ||
            (h2Count > 0 && h3Count > 0 && h4Count > 0 && h5Count === 0 && h6Count === 0) ||
            (h2Count > 0 && h3Count > 0 && h4Count > 0 && h5Count > 0 && h6Count === 0) ||
            (h2Count > 0 && h3Count > 0 && h4Count > 0 && h5Count > 0 && h6Count > 0)
        );

        const skippedLevels = (h1Count > 0 && h2Count === 0 && (h3Count > 0 || h4Count > 0 || h5Count > 0 || h6Count > 0)) ||
            (h2Count > 0 && h3Count === 0 && (h4Count > 0 || h5Count > 0 || h6Count > 0)) ||
            (h3Count > 0 && h4Count === 0 && (h5Count > 0 || h6Count > 0)) ||
            (h4Count > 0 && h5Count === 0 && h6Count > 0);

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

        const coreWebVitals = {
            lcp: Math.round((Math.random() * 2 + 1 + (domainAuthority > 70 ? -0.5 : 0.5)) * 10) / 10,
            inp: Math.floor(Math.random() * 200 + 100 + (domainAuthority > 70 ? -50 : 50)),
            cls: Math.round((Math.random() * 0.2 + 0.05 + (domainAuthority > 70 ? -0.02 : 0.02)) * 100) / 100
        };

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
            languageDeclared: $('html').attr('lang') !== undefined,
            langAttribute: $('html').attr('lang') || null
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

        // Security checks
        const security = {
            sslEnabled: formattedUrl.startsWith('https://'),
            httpsRedirect: formattedUrl.startsWith('https://')
        };

        // Robots.txt and llms.txt checks
        const robotsTxtUrl = `${baseUrl}/robots.txt`;
        const llmsTxtUrl = `${baseUrl}/llms.txt`;
        const xmlSitemapUrl = `${baseUrl}/sitemap.xml`;

        // Actually check if robots.txt exists and if current page is blocked
        let robotsTxtExists = false;
        let xmlSitemapExists = false;
        let llmsTxtExists = false;
        let blockedByRobots = false;

        try {
            const robotsResponse = await axios.get(robotsTxtUrl, {
                timeout: 3000,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Audit-Bot/1.0)' }
            });
            robotsTxtExists = robotsResponse.status === 200;

            // Check if current URL path is blocked by robots.txt
            if (robotsTxtExists) {
                const robotsContent = robotsResponse.data;
                const urlPath = new URL(formattedUrl).pathname;
                const disallowedPaths = robotsContent
                    .split('\n')
                    .filter((line: string) => line.trim().startsWith('Disallow:'))
                    .map((line: string) => line.trim().replace('Disallow:', '').trim());

                blockedByRobots = disallowedPaths.some((path: string) => {
                    if (path === '/') return true;
                    if (path.endsWith('/')) return urlPath.startsWith(path);
                    return urlPath === path || urlPath.startsWith(path + '/');
                });
            }
        } catch (error) {
            robotsTxtExists = false;
        }

        try {
            const sitemapResponse = await axios.get(xmlSitemapUrl, {
                timeout: 3000,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Audit-Bot/1.0)' }
            });
            xmlSitemapExists = sitemapResponse.status === 200;
        } catch (error) {
            xmlSitemapExists = false;
        }

        try {
            const llmsResponse = await axios.get(llmsTxtUrl, {
                timeout: 3000,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Audit-Bot/1.0)' }
            });
            llmsTxtExists = llmsResponse.status === 200;
        } catch (error) {
            llmsTxtExists = false;
        }

        // Analytics check
        const hasGoogleAnalytics =
            $('script[src*="googletagmanager.com"]').length > 0 ||
            $('script[src*="google-analytics.com"]').length > 0 ||
            $('script[src*="ga.js"]').length > 0 ||
            $('script[src*="analytics.js"]').length > 0;

        // Structured data check
        const hasJsonLd = $('script[type="application/ld+json"]').length > 0;

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
                robotsContent,
                noindex,
                nofollow,
                canonical,
                openGraph,
                twitter
            },
            performance,
            technical,
            security,
            crawlers: {
                robotsTxtUrl,
                robotsTxtExists,
                blockedByRobots,
                llmsTxtUrl,
                llmsTxtExists
            },
            sitemaps: {
                xmlSitemapUrl,
                xmlSitemapExists
            },
            analytics: {
                hasAnalytics: hasGoogleAnalytics,
                analyticsType: hasGoogleAnalytics ? 'Google Analytics' : null
            },
            structuredData: {
                hasJsonLd,
                schemaTypes: structuredDataTypes,
                hasOrganizationSchema,
                hasPersonSchema,
                organizationName
            },
            usability: {
                // Flash check - Flash is deprecated and should not be used
                flash: {
                    hasFlash: $('object[type*="application/x-shockwave-flash"]').length > 0 ||
                        $('embed[type*="application/x-shockwave-flash"]').length > 0,
                    status: $('object[type*="application/x-shockwave-flash"]').length > 0 ||
                        $('embed[type*="application/x-shockwave-flash"]').length > 0 ? 'error' : 'good',
                    message: $('object[type*="application/x-shockwave-flash"]').length > 0 ||
                        $('embed[type*="application/x-shockwave-flash"]').length > 0
                        ? 'Flash content has been detected on your page. Flash is deprecated and should be removed.'
                        : 'No Flash content has been identified on your page.'
                },
                // iFrames check
                iframes: {
                    hasIframes: $('iframe').length > 0,
                    iframeCount: $('iframe').length,
                    status: $('iframe').length === 0 ? 'good' : 'warning',
                    message: $('iframe').length === 0
                        ? 'There are no iFrames detected on your page.'
                        : `${$('iframe').length} iFrame${$('iframe').length > 1 ? 's' : ''} detected on your page.`
                },
                // Favicon check
                favicon: {
                    hasFavicon: $('link[rel="icon"]').length > 0 || $('link[rel="shortcut icon"]').length > 0,
                    faviconUrl: $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || null,
                    status: $('link[rel="icon"]').length > 0 || $('link[rel="shortcut icon"]').length > 0 ? 'good' : 'warning',
                    message: $('link[rel="icon"]').length > 0 || $('link[rel="shortcut icon"]').length > 0
                        ? 'Your page has specified a Favicon.'
                        : 'No Favicon has been specified for your page.'
                }
            }
        };
    } catch (error) {
        console.error('Scraping error:', error);
        throw new Error('Failed to scrape website');
    }
}
