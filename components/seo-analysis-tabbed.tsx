"use client";

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    FileText,
    Link as LinkIcon,
    Gauge,
    Users,
    Share2,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    ChevronDown,
    ChevronUp,
    ImageIcon,
    Lock,
    RefreshCw,
    FileSearch,
    Shield,
    BarChart,
    Code,
    Building,
    FileText as FileTextIcon,
    Monitor,
    Smartphone,
    Youtube,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Globe,
    MapPin,
    Anchor,
    ArrowRight,
    ChevronRight,
    Info,
    Sparkles,
    Zap
} from 'lucide-react';
import { ProgressCircle } from './ui/progressCircle';
import { JsFile } from './assests/svgs';
import { TechnologyCard } from './technology-card';

interface OnPageSEOData {
    titleTag: {
        exists: boolean;
        title: string;
        length: number;
        isOptimalLength: boolean;
        minLength: number;
        maxLength: number;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    metaDescription: {
        exists: boolean;
        description: string;
        length: number;
        isOptimalLength: boolean;
        minLength: number;
        maxLength: number;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    hreflang: {
        hasHreflang: boolean;
        hreflangEntries: string[];
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    language: {
        hasLangAttribute: boolean;
        declaredLanguage: string | null;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    headers: {
        hasH1: boolean;
        h1Tags: string[];
        headerFrequency: {
            h1: number;
            h2: number;
            h3: number;
            h4: number;
            h5: number;
            h6: number;
        };
        hasMultipleH1: boolean;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    contentAmount: {
        wordCount: number;
        status: 'good' | 'warning' | 'error';
        message: string;
        minWords: number;
        maxWords: number;
    };
    imageAlt: {
        totalImages: number;
        imagesWithAlt: number;
        imagesWithoutAlt: number;
        missingPercentage: number;
        status: 'good' | 'warning' | 'error';
        message: string;
        images: Array<{
            src: string;
            alt?: string;
            hasAlt: boolean;
        }>;
    };
    canonicalTag: {
        hasCanonical: boolean;
        canonicalUrl: string | null;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    noindexTag: {
        hasNoindex: boolean;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    noindexHeader: {
        hasNoindexInHeader: boolean;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    sslEnabled: {
        isSSLEnabled: boolean;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    httpsRedirect: {
        isHttpsRedirect: boolean;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    robotsTxt: {
        hasRobotsTxt: boolean;
        robotsTxtUrl: string | null;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    blockedByRobots: {
        isBlocked: boolean;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    llmsTxt: {
        hasLlmsTxt: boolean;
        llmsTxtUrl: string | null;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    xmlSitemap: {
        hasXmlSitemap: boolean;
        xmlSitemapUrl: string | null;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    analytics: {
        hasAnalytics: boolean;
        analyticsType: string | null;
        detectedTools: Array<{
            name: string;
            category: 'analytics' | 'marketing' | 'heatmap' | 'all-in-one';
            confidence: 'high' | 'medium' | 'low';
            detectedBy: string;
            details?: string;
        }>;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    schemaOrg: {
        hasJsonLd: boolean;
        schemaTypes: string[];
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    identitySchema: {
        hasOrganizationSchema: boolean;
        hasPersonSchema: boolean;
        organizationName: string | null;
        status: 'good' | 'warning' | 'error';
        message: string;
    };
}

interface UsabilityData {
    desktopScreenshot: {
        exists: boolean;
        dataUrl: string | null;
        width: number;
        height: number;
    };
    mobileScreenshot: {
        exists: boolean;
        dataUrl: string | null;
        width: number;
        height: number;
    };
    mobileFriendly: boolean;
    viewportConfigured: boolean;
    touchElementsSize: {
        tooSmall: number;
        appropriate: number;
    };
    desktopMetrics: {
        firstContentfulPaint: { value: number | null; displayValue: string };
        speedIndex: { value: number | null; displayValue: string };
        largestContentfulPaint: { value: number | null; displayValue: string };
        timeToInteractive: { value: number | null; displayValue: string };
        totalBlockingTime: { value: number | null; displayValue: string };
        cumulativeLayoutShift: { value: number | null; displayValue: string };
    };
    mobileMetrics: {
        firstContentfulPaint: { value: number | null; displayValue: string };
        speedIndex: { value: number | null; displayValue: string };
        largestContentfulPaint: { value: number | null; displayValue: string };
        timeToInteractive: { value: number | null; displayValue: string };
        totalBlockingTime: { value: number | null; displayValue: string };
        cumulativeLayoutShift: { value: number | null; displayValue: string };
    };
    // Additional usability checks
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
    // Desktop and Mobile Scores
    desktopScores: {
        performance: number;
        accessibility: number;
        bestPractices: number;
        seo: number;
    };
    mobileScores: {
        performance: number;
        accessibility: number;
        bestPractices: number;
        seo: number;
    };
}

interface SEOAnalysisTabbedProps {
    analysis?: {
        url?: string;
        onPageSEO?: OnPageSEOData;
        performance?: {
            url: string;
            strategy: string;
            scores: { [key: string]: number };
            performance: {
                serverResponseTimeMs: number | null;
                firstContentfulPaintMs: number | null;
                largestContentfulPaintMs: number | null;
                speedIndexMs: number | null;
                timeToInteractiveMs: number | null;
                totalBlockingTimeMs: number | null;
                cumulativeLayoutShift: number | null;
            };
            webVitals: {
                LCP: number | null;
                CLS: number | null;
                INP: number | null;
            } | null;
            resourceBreakdown: {
                totalRequests: number;
                html: { count: number; sizeKB: number };
                js: { count: number; sizeKB: number };
                css: { count: number; sizeKB: number };
                images: { count: number; sizeKB: number };
                fonts: { count: number; sizeKB: number };
                media: { count: number; sizeKB: number };
                xhr: { count: number; sizeKB: number };
                other: { count: number; sizeKB: number };
            };
            imageSummary: {
                totalImages: number;
                totalTransferSizeMB: number;
                totalOriginalSizeMB: number;
                avgImageSizeKB: number;
            };
            images: Array<{
                url: string;
                format: string;
                transferSizeKB: number;
                originalSizeKB: number;
                compressionPercent: number;
            }>;
            imageOpportunities: {
                oversizedImages: any[];
                nextGenFormats: any[];
                lazyLoadingIssues: any[];
                imageCompressionIssues: any[];
            };
        } | null;
        usability?: UsabilityData | null;
        social?: {
            openGraph: {
                hasOpenGraph: boolean;
                openGraph: Record<string, string>;
                status: 'good' | 'warning' | 'error';
                message: string;
            };
            twitterCards: {
                hasTwitterCards: boolean;
                twitter: Record<string, string>;
                status: 'good' | 'warning' | 'error';
                message: string;
            };
            socialProfiles: {
                links: {
                    youtube: string | null;
                    facebook: string | null;
                    linkedin: string | null;
                    instagram: string | null;
                    twitter: string | null;
                    pinterest: string | null;
                    tiktok: string | null;
                };
                count: number;
                status: 'good' | 'warning' | 'error';
                message: string;
            };
            contactInfo: {
                hasPhone: boolean;
                phoneNumbers: string[];
                hasAddress: boolean;
                addresses: string[];
                hasContactPage: boolean;
                status: 'good' | 'warning' | 'error';
                message: string;
            };
        } | null;
        // Backlinks data
        backlinks?: {
            counts: {
                total: number;
                doFollow: number;
                fromHomePage: number;
                doFollowFromHomePage: number;
                text: number;
                toHomePage: number;
            };
            domains: {
                total: number;
                doFollow: number;
                fromHomePage: number;
                toHomePage: number;
            };
            ips: number | null;
            cBlocks: number | null;
            anchors: number | null;
            anchorUrls: number | null;
            topTLD: string | null;
            topCountry: string | null;
            topAnchorsByBacklinks: Array<{
                anchor: string;
                count: number;
            }>;
            topAnchorsByDomains: Array<{
                anchor: string;
                domains: number;
            }>;
            topAnchorUrlsByBacklinks: Array<{
                url: string;
                count: number;
            }>;
            topAnchorUrlsByDomains: Array<{
                url: string;
                domains: number;
            }>;
        } | null;
        // Individual backlinks list
        backlinkList?: Array<{
            url_from: string;
            url_to: string;
            title: string;
            anchor: string;
            alt: string;
            nofollow: boolean;
            image: boolean;
            image_source: string;
            inlink_rank: number;
            domain_inlink_rank: number;
            first_seen: string;
            last_visited: string;
        }> | null;
        // Referral domains data
        referralDomains?: {
            referrers: Array<{
                refdomain: string;
                backlinks: number;
                dofollow_backlinks: number;
                first_seen: string;
                domain_inlink_rank: number;
            }>;
            totalDomains: number;
            totalBacklinks: number;
            tldBreakdown: Array<{
                tld: string;
                count: number;
                percentage: number;
            }>;
        } | null;
        // AI-powered SEO suggestions
        suggestions?: {
            overallScore: number;
            summary: string;
            suggestions: Array<{
                id: string;
                category: string;
                priority: string;
                title: string;
                description: string;
                impact: string;
                recommendation: string;
                effort: string;
                estimatedImpact: string;
            }>;
            prioritizedActions: string[];
            categoryBreakdown: {
                technical: number;
                onpage: number;
                content: number;
                performance: number;
                backlinks: number;
                security: number;
            };
        } | null;
        url?: string;
    } | null;
    url?: string;
}

function getStatusIcon(status: 'good' | 'warning' | 'error') {
    switch (status) {
        case 'good':
            return <CheckCircle2 className="w-5 h-5 text-green-500" />;
        case 'warning':
            return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        case 'error':
            return <XCircle className="w-5 h-5 text-red-500" />;
    }
}

function getStatusColor(status: 'good' | 'warning' | 'error') {
    switch (status) {
        case 'good':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'warning':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'error':
            return 'bg-red-100 text-red-800 border-red-200';
    }
}

// Metric Card Component for displaying performance metrics
function MetricCard({ label, value, unit = '', displayValue }: {
    label: string;
    value: number | null | undefined;
    unit?: string;
    displayValue?: string
}) {
    return (
        <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600">{label}</div>
            <div className="text-xl font-semibold">
                {value !== null && value !== undefined
                    ? `${value}${unit}`
                    : displayValue || 'N/A'}
            </div>
        </div>
    );
}

function TitleTagCard({ data }: { data: OnPageSEOData['titleTag'] }) {
    const [showInfo, setShowInfo] = useState(false);

    const getLengthStatus = () => {
        if (data.length < data.minLength) {
            return { color: 'text-orange-500', text: 'Too Short' };
        } else if (data.length > data.maxLength) {
            return { color: 'text-red-500', text: 'Too Long' };
        } else {
            return { color: 'text-green-500', text: 'Optimal' };
        }
    };

    const lengthStatus = getLengthStatus();
    const idealRange = `${data.minLength}–${data.maxLength} characters`;

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Title Tag
                    </CardTitle>
                    {getStatusIcon(data.status)}
                </div>
            </CardHeader>
            <CardContent>
                <Badge className={getStatusColor(data.status)}>
                    {data.status.toUpperCase()}
                </Badge>
                <p className="mt-2 text-sm">{data.message}</p>

                {data.exists && (
                    <div className="mt-4">
                        <table className="w-full">
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-2 px-3 font-medium w-32">Title</td>
                                    <td className="py-2 px-3">{data.title}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 px-3 font-medium">Length</td>
                                    <td className="py-2 px-3">
                                        <span className="font-medium">{data.length}</span> characters
                                        <span className={`ml-2 ${lengthStatus.color}`}>
                                            ({lengthStatus.text})
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 px-3 font-medium">Ideal Range</td>
                                    <td className="py-2 px-3 text-gray-600">{idealRange}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Collapsible Info Section */}
                <div className="mt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowInfo(!showInfo)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                        <Info className="w-4 h-4" />
                        {showInfo ? 'Less Info' : 'More Info'}
                        {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${showInfo ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-medium text-blue-900 mb-2">About Title Tags</h4>
                            <p className="text-sm text-blue-800">
                                The Title Tag is an important HTML element that tells users and Search Engines what the topic of the webpage is and the type of keywords the page should rank for. The Title will appear in the Header Bar of a user's browser. It is also one of the most important (and easiest to improve) On-Page SEO factors.
                            </p>
                            <div className="mt-3 space-y-2 text-sm text-blue-700">
                                <p>• <strong>Ideal Length:</strong> {idealRange} (including spaces)</p>
                                <p>• <strong>Purpose:</strong> Helps search engines understand your page topic</p>
                                <p>• <strong>Display:</strong> Shown in browser tabs and search results</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function MetaDescriptionCard({ data }: { data: OnPageSEOData['metaDescription'] }) {
    const [showInfo, setShowInfo] = useState(false);

    const getLengthStatus = () => {
        if (data.length < data.minLength) {
            return { color: 'text-orange-500', text: 'Too Short' };
        } else if (data.length > data.maxLength) {
            return { color: 'text-red-500', text: 'Too Long' };
        } else {
            return { color: 'text-green-500', text: 'Optimal' };
        }
    };

    const lengthStatus = getLengthStatus();
    const idealRange = `${data.minLength} - ${data.maxLength} characters`;

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Meta Description Tag
                    </CardTitle>
                    {getStatusIcon(data.status)}
                </div>
            </CardHeader>
            <CardContent>
                <Badge className={getStatusColor(data.status)}>
                    {data.status.toUpperCase()}
                </Badge>
                <p className="mt-2 text-sm">{data.message}</p>

                {data.exists && (
                    <div className="mt-4">
                        <table className="w-full">
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-2 px-3 font-medium w-32">Description</td>
                                    <td className="py-2 px-3">{data.description}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 px-3 font-medium">Length</td>
                                    <td className="py-2 px-3">
                                        <span className="font-medium">{data.length}</span> characters
                                        <span className={`ml-2 ${lengthStatus.color}`}>
                                            ({lengthStatus.text})
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 px-3 font-medium">Ideal Range</td>
                                    <td className="py-2 px-3 text-gray-600">{idealRange}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Collapsible Info Section */}
                <div className="mt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowInfo(!showInfo)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                        <Info className="w-4 h-4" />
                        {showInfo ? 'Less Info' : 'More Info'}
                        {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${showInfo ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-medium text-blue-900 mb-2">About Meta Descriptions</h4>
                            <p className="text-sm text-blue-800">
                                A Meta Description is important for search engines to understand the content of your page,
                                and is often shown as the description text blurb in search results.
                            </p>
                            <div className="mt-3 space-y-2 text-sm text-blue-700">
                                <p>• <strong>Ideal Length:</strong> {idealRange} (including spaces)</p>
                                <p>• <strong>Purpose:</strong> Helps search engines understand your page content</p>
                                <p>• <strong>Display:</strong> Shown in search engine results below the title</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function LanguageCard({ data }: { data: OnPageSEOData['language'] }) {
    const [showInfo, setShowInfo] = useState(false);

    // Map of common language codes to full names
    const languageNames: Record<string, string> = {
        'en': 'English', 'en-us': 'English (US)', 'en-gb': 'English (UK)',
        'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian',
        'pt': 'Portuguese', 'pt-br': 'Portuguese (Brazil)', 'nl': 'Dutch',
        'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean', 'zh': 'Chinese',
        'zh-cn': 'Chinese (Simplified)', 'zh-tw': 'Chinese (Traditional)',
        'ar': 'Arabic', 'hi': 'Hindi', 'tr': 'Turkish', 'pl': 'Polish',
        'uk': 'Ukrainian', 'vi': 'Vietnamese', 'th': 'Thai', 'id': 'Indonesian',
        'ms': 'Malay', 'fil': 'Filipino', 'fi': 'Finnish', 'sv': 'Swedish',
        'no': 'Norwegian', 'da': 'Danish', 'cs': 'Czech', 'el': 'Greek',
        'he': 'Hebrew', 'hu': 'Hungarian', 'ro': 'Romanian', 'sk': 'Slovak',
        'bg': 'Bulgarian', 'hr': 'Croatian', 'sr': 'Serbian', 'sl': 'Slovenian',
        'lt': 'Lithuanian', 'lv': 'Latvian', 'et': 'Estonian',
    };

    const getFullLanguageName = (code: string): string => {
        return languageNames[code.toLowerCase()] ||
            languageNames[code.split('-')[0].toLowerCase()] || code;
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Language Declaration
                    </CardTitle>
                    {getStatusIcon(data.status)}
                </div>
            </CardHeader>
            <CardContent>
                <Badge className={getStatusColor(data.status)}>
                    {data.status.toUpperCase()}
                </Badge>
                <p className="mt-2 text-sm">{data.message}</p>

                {data.hasLangAttribute && data.declaredLanguage && (
                    <div className="mt-4">
                        <table className="w-full">
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-2 px-3 font-medium w-32">Declared Language</td>
                                    <td className="py-2 px-3">{getFullLanguageName(data.declaredLanguage)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Collapsible Info Section */}
                <div className="mt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowInfo(!showInfo)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                        <Info className="w-4 h-4" />
                        {showInfo ? 'Less Info' : 'More Info'}
                        {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${showInfo ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-medium text-blue-900 mb-2">About Language Declaration</h4>
                            <p className="text-sm text-blue-800">
                                The Lang Attribute is used to describe the intended language of the current page to user's browsers and Search Engines. Search Engines may use the Lang Attribute to return language specific search results to a searcher, and in the browser, Lang Attribute can signal the need to switch to a different language if it is different to the user's own preferred language.
                            </p>
                            <div className="mt-3 space-y-2 text-sm text-blue-700">
                                <p>• <strong>Recommendation:</strong> Add the Lang Attribute to the HTML tag of every page</p>
                                <p>• <strong>Purpose:</strong> Helps search engines serve language-specific results</p>
                                <p>• <strong>Example:</strong> lang="en" for English pages</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusCard({ title, data, icon: Icon, showUrl = false, infoContent }: {
    title: string;
    data: {
        status: 'good' | 'warning' | 'error';
        message: string;
        robotsTxtUrl?: string | null;
        llmsTxtUrl?: string | null;
        xmlSitemapUrl?: string | null;
        canonicalUrl?: string | null;
    };
    icon?: React.ElementType<React.SVGProps<SVGSVGElement>>;
    showUrl?: boolean;
    infoContent?: React.ReactNode;
}) {
    const [showInfo, setShowInfo] = useState(false);

    const getUrl = () => {
        if (data.robotsTxtUrl) return data.robotsTxtUrl;
        if (data.llmsTxtUrl) return data.llmsTxtUrl;
        if (data.xmlSitemapUrl) return data.xmlSitemapUrl;
        if (data.canonicalUrl) return data.canonicalUrl;
        return null;
    };

    const url = getUrl();

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        {Icon && <Icon className="w-5 h-5" />}
                        {title}
                    </CardTitle>
                    {getStatusIcon(data.status)}
                </div>
            </CardHeader>
            <CardContent>
                <Badge className={getStatusColor(data.status)}>
                    {data.status.toUpperCase()}
                </Badge>
                <p className="mt-2 text-sm">{data.message}</p>

                {showUrl && url && (
                    <div className="mt-3">
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs underline break-all"
                        >
                            {url}
                        </a>
                    </div>
                )}

                {infoContent && (
                    <>
                        <div className="mt-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowInfo(!showInfo)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                                <Info className="w-4 h-4" />
                                {showInfo ? 'Less Info' : 'More Info'}
                                {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${showInfo ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                {infoContent}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function CanonicalCard({ data, baseUrl }: { data: { status: 'good' | 'warning' | 'error'; message: string; canonicalUrl: string | null }; baseUrl?: string }) {
    const [showInfo, setShowInfo] = useState(false);

    const displayUrl = data.canonicalUrl || (baseUrl && !data.canonicalUrl ? baseUrl : null);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <LinkIcon className="w-5 h-5" />
                        Canonical Tag
                    </CardTitle>
                    {getStatusIcon(data.status)}
                </div>
            </CardHeader>
            <CardContent>
                <Badge className={getStatusColor(data.status)}>
                    {data.status.toUpperCase()}
                </Badge>
                <p className="mt-2 text-sm">{data.message}</p>

                {displayUrl && (
                    <div className="mt-3">
                        <a
                            href={displayUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs underline break-all"
                        >
                            {displayUrl}
                        </a>
                    </div>
                )}

                {!data.canonicalUrl && baseUrl && (
                    <p className="mt-2 text-xs text-gray-500">
                        Suggested canonical: {baseUrl}
                    </p>
                )}

                {/* Collapsible Info Section */}
                <div className="mt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowInfo(!showInfo)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                        <Info className="w-4 h-4" />
                        {showInfo ? 'Less Info' : 'More Info'}
                        {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${showInfo ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-medium text-blue-900 mb-2">About Canonical Tags</h4>
                            <p className="text-sm text-blue-800">
                                The Canonical Tag is a HTML Tag that tells Search Engines the primary URL of a page. URLs can have multiple versions due to things like parameters being passed or www and non-www versions, resulting in potential duplicate content. Google recommends all pages specify a Canonical for this reason.
                            </p>
                            <div className="mt-3 space-y-2 text-sm text-blue-700">
                                <p>• <strong>Recommendation:</strong> Specify a canonical URL for every page</p>
                                <p>• <strong>Purpose:</strong> Prevents duplicate content issues</p>
                                <p>• <strong>Note:</strong> CMS may manage this automatically</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Custom Analytics Card to display detected analytics tools
function AnalyticsCard({ data }: {
    data: {
        hasAnalytics: boolean;
        analyticsType: string | null;
        detectedTools: Array<{
            name: string;
            category: 'analytics' | 'marketing' | 'heatmap' | 'all-in-one';
            confidence: 'high' | 'medium' | 'low';
            detectedBy: string;
            details?: string;
        }>;
        status: 'good' | 'warning' | 'error';
        message: string;
    }
}) {
    const tools = data.detectedTools || [];

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'analytics': return 'bg-blue-100 text-blue-800';
            case 'marketing': return 'bg-purple-100 text-purple-800';
            case 'heatmap': return 'bg-orange-100 text-orange-800';
            case 'all-in-one': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'analytics': return <BarChart className="w-4 h-4" />;
            case 'marketing': return <Share2 className="w-4 h-4" />;
            case 'heatmap': return <Gauge className="w-4 h-4" />;
            case 'all-in-one': return <Code className="w-4 h-4" />;
            default: return <BarChart className="w-4 h-4" />;
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart className="w-5 h-5" />
                        Analytics
                    </CardTitle>
                    {getStatusIcon(data.status)}
                </div>
            </CardHeader>
            <CardContent>
                <Badge className={getStatusColor(data.status)}>
                    {data.status.toUpperCase()}
                </Badge>
                <p className="mt-2 text-sm">{data.message}</p>

                {tools.length > 0 && (
                    <div className="mt-4 space-y-3">
                        <p className="text-sm font-medium text-gray-700">Detected Tools:</p>
                        {tools.map((tool, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                            >
                                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getCategoryColor(tool.category)}`}>
                                    {getCategoryIcon(tool.category)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {tool.name}
                                        </p>
                                        <Badge variant="outline" className="text-xs">
                                            {tool.category}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Detected by: {tool.detectedBy}
                                    </p>
                                    {tool.details && (
                                        <p className="text-xs text-gray-600 mt-1 font-mono bg-gray-100 px-2 py-1 rounded">
                                            {tool.details}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tools.length === 0 && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800">
                            <AlertTriangle className="w-4 h-4" />
                            <p className="text-sm font-medium">No Analytics Tools Detected</p>
                        </div>
                        <p className="text-xs text-yellow-700 mt-1">
                            Consider adding analytics tools like Google Analytics, Facebook Pixel, or Hotjar to track your website performance.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function SEOAnalysisTabbed({ analysis, url }: SEOAnalysisTabbedProps) {
    const [activeTab, setActiveTab] = useState('onpage');
    const [showInfo, setShowInfo] = useState(false);
    const [showH2Info, setShowH2Info] = useState(false);
    const [showImages, setShowImages] = useState(false);
    const [showImageInfo, setShowImageInfo] = useState(false);
    const [showAllBacklinks, setShowAllBacklinks] = useState(false);
    const [showAllReferralDomains, setShowAllReferralDomains] = useState(false);
    const [showFlashInfo, setShowFlashInfo] = useState(false);
    const [showIframesInfo, setShowIframesInfo] = useState(false);
    const [showFaviconInfo, setShowFaviconInfo] = useState(false);

    const onPageSEO = analysis?.onPageSEO;
    const defaultStatusData = { status: 'warning' as const, message: 'No data available' };

    return (
        <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Right side tabs */}
                <TabsList className="grid w-full grid-cols-5 mb-6 sticky top-0 z-50 bg-card/80 backdrop-blur-sm border border-border/60 shadow-[0_1px_0_rgba(0,0,0,0.35)]">
                    <TabsTrigger value="onpage" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="hidden sm:inline">On-page SEO</span>
                        <span className="sm:hidden">SEO</span>
                    </TabsTrigger>
                    <TabsTrigger value="links" className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        <span>Links</span>
                    </TabsTrigger>
                    <TabsTrigger value="usability" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="hidden sm:inline">Usability</span>
                        <span className="sm:hidden">Use</span>
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        <span className="hidden sm:inline">Performance</span>
                        <span className="sm:hidden">Perf</span>
                    </TabsTrigger>
                    <TabsTrigger value="social" className="flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        <span>Social</span>
                    </TabsTrigger>
                </TabsList>

                {/* On-page SEO Tab */}
                <TabsContent value="onpage">
                    <div className="space-y-6">
                        {/* Title Tag - Full Width */}
                        <TitleTagCard data={onPageSEO?.titleTag || {
                            exists: false,
                            title: '',
                            length: 0,
                            isOptimalLength: false,
                            minLength: 50,
                            maxLength: 60,
                            status: 'error',
                            message: 'Your page is missing a Title Tag. Title tags are crucial for search engines to understand your page content.'
                        }} />

                        {/* Meta Description - Full Width */}
                        <MetaDescriptionCard data={onPageSEO?.metaDescription || {
                            exists: false,
                            description: '',
                            length: 0,
                            isOptimalLength: false,
                            minLength: 120,
                            maxLength: 160,
                            status: 'error',
                            message: 'Your page is missing a Meta Description. Meta descriptions are important for search engines to understand your page content.'
                        }} />

                        {/* Language & Canonical - Separate Rows */}
                        <div className="space-y-4">
                            <LanguageCard
                                data={onPageSEO?.language || {
                                    hasLangAttribute: false,
                                    declaredLanguage: null,
                                    status: 'warning',
                                    message: 'No language declaration found'
                                }}
                            />
                            <CanonicalCard
                                data={{
                                    status: onPageSEO?.canonicalTag?.status || 'warning',
                                    message: onPageSEO?.canonicalTag?.message || 'No canonical tag found',
                                    canonicalUrl: onPageSEO?.canonicalTag?.canonicalUrl || null
                                }}
                                baseUrl={url}
                            />
                        </div>

                        {/* H1 Header Tag Usage */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        H1 Header Tag Usage
                                    </CardTitle>
                                    {onPageSEO && !onPageSEO.headers.hasH1 && (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                    {onPageSEO && onPageSEO.headers.hasH1 && (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {onPageSEO ? (
                                    <>
                                        {!onPageSEO.headers.hasH1 ? (
                                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                                <p className="text-sm text-red-700">
                                                    Your page is missing an H1 Tag. H1 tags help search engines understand the main topic of your page.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <p className="text-sm">
                                                    {onPageSEO.headers.hasMultipleH1
                                                        ? `Your page has ${onPageSEO.headers.h1Tags.length} H1 Tags.`
                                                        : 'Your page has one H1 Tag.'}
                                                </p>
                                                <div className="mt-2">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="border-b bg-gray-50">
                                                                <th className="text-left py-2 px-3 font-medium">#</th>
                                                                <th className="text-left py-2 px-3 font-medium">H1 Tag Content</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {onPageSEO.headers.h1Tags.map((tag, index) => (
                                                                <tr key={index} className="border-b hover:bg-gray-50">
                                                                    <td className="py-2 px-3 font-medium text-gray-500">{index + 1}</td>
                                                                    <td className="py-2 px-3">{tag}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* Collapsible Info Section */}
                                        <div className="mt-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowInfo(!showInfo)}
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                <Info className="w-4 h-4" />
                                                {showInfo ? 'Less Info' : 'More Info'}
                                                {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </Button>

                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${showInfo ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                                                    }`}
                                            >
                                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                                    <h4 className="font-medium text-blue-900 mb-2">About H1 Tags</h4>
                                                    <p className="text-sm text-blue-800">
                                                        The H1 Header Tag is one of the most important ways of signaling to Search Engines the topic of a page and subsequently the keywords it should rank for. The H1 Tag normally appears as visible text in the largest font size on the page.
                                                    </p>
                                                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                                                        <p>• <strong>Recommendation:</strong> Add one H1 tag near the top of your page</p>
                                                        <p>• <strong>Keywords:</strong> Include important keywords you want to rank for</p>
                                                        <p>• <strong>Count:</strong> Use only one H1 tag per page</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-gray-500">No header data available</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* H2-H6 Header Tag Usage */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        H2-H6 Header Tag Usage
                                    </CardTitle>
                                    {onPageSEO ? getStatusIcon(onPageSEO.headers.status) : null}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {onPageSEO ? (
                                    <>
                                        <p className="text-sm mb-4">
                                            {onPageSEO.headers.headerFrequency.h2 > 0 || onPageSEO.headers.headerFrequency.h3 > 0
                                                ? 'Your page is making use of multiple levels of Header Tags.'
                                                : 'Your page is not using multiple levels of Header Tags.'}
                                        </p>
                                        <div className="mt-4">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b bg-gray-50">
                                                        <th className="text-left py-2 px-3 font-medium w-20">Header Tag</th>
                                                        <th className="text-left py-2 px-3 font-medium w-20">Frequency</th>
                                                        <th className="text-left py-2 px-3 font-medium">Line</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[
                                                        { tag: 'H2', count: onPageSEO.headers.headerFrequency.h2 },
                                                        { tag: 'H3', count: onPageSEO.headers.headerFrequency.h3 },
                                                        { tag: 'H4', count: onPageSEO.headers.headerFrequency.h4 },
                                                        { tag: 'H5', count: onPageSEO.headers.headerFrequency.h5 },
                                                        { tag: 'H6', count: onPageSEO.headers.headerFrequency.h6 },
                                                    ].map((item) => (
                                                        <tr key={item.tag} className="border-b">
                                                            <td className="py-2 px-3 font-medium">{item.tag}</td>
                                                            <td className="py-2 px-3">{item.count}</td>
                                                            <td className="py-2 px-3">
                                                                <div className="flex items-center gap-2">
                                                                    <Progress
                                                                        value={(item.count / Math.max(...Object.values(onPageSEO.headers.headerFrequency))) * 100}
                                                                        className="h-2 flex-1"
                                                                    />
                                                                    <span className="text-xs text-gray-500 w-8">
                                                                        {item.count > 0 ? `${item.count}` : '-'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Collapsible Info Section */}
                                        <div className="mt-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowH2Info(!showH2Info)}
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                <Info className="w-4 h-4" />
                                                {showH2Info ? 'Less Info' : 'More Info'}
                                                {showH2Info ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </Button>

                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${showH2Info ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                                                    }`}
                                            >
                                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                                    <h4 className="font-medium text-blue-900 mb-2">About H2-H6 Tags</h4>
                                                    <p className="text-sm text-blue-800">
                                                        The H2-H6 Header Tags are an important way of organizing the content of your page and signaling to Search Engines the longer tail topics your page should rank for.
                                                    </p>
                                                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                                                        <p>• <strong>Recommendation:</strong> Include at least 2 other Header Tag levels (H2, H3) in addition to H1</p>
                                                        <p>• <strong>Keywords:</strong> Include important keywords in these Header Tags</p>
                                                        <p>• <strong>Content:</strong> These would be added to the core content section of your page</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-gray-500">No header data available</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Content Amount */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Content Amount
                                    </CardTitle>
                                    {onPageSEO ? getStatusIcon(onPageSEO.contentAmount.status) : null}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {onPageSEO ? (
                                    <>
                                        <Badge className={getStatusColor(onPageSEO.contentAmount.status)}>
                                            {onPageSEO.contentAmount.status.toUpperCase()}
                                        </Badge>
                                        <p className="mt-2 text-sm">{onPageSEO.contentAmount.message}</p>

                                        <div className="mt-4">
                                            <p className="text-lg font-semibold">
                                                Word Count: {onPageSEO.contentAmount.wordCount}
                                            </p>
                                            <Progress
                                                value={Math.min((onPageSEO.contentAmount.wordCount / 3500) * 100, 100)}
                                                className="h-3 mt-2"
                                            />
                                            <div className="flex justify-between text-xs mt-1">
                                                <span>0 words</span>
                                                <span>500 words</span>
                                                <span>3500+ words</span>
                                            </div>
                                        </div>

                                        {/* Collapsible Info Section */}
                                        <div className="mt-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowInfo(!showInfo)}
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                <Info className="w-4 h-4" />
                                                {showInfo ? 'Less Info' : 'More Info'}
                                                {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </Button>

                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${showInfo ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                                                    }`}
                                            >
                                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                                    <h4 className="font-medium text-blue-900 mb-2">About Content Length</h4>
                                                    <p className="text-sm text-blue-800">
                                                        Numerous studies have shown that there is a relationship between the amount of content on a page (typically measured in word count) and its ranking potential - generally longer content will rank higher. Obviously content also needs to be topically relevant, keyword rich and highly readable for the visitor.
                                                    </p>
                                                    <p className="text-sm text-blue-800 mt-2">
                                                        Note: We assess all selectable text on the page at load time, not hidden content.
                                                    </p>
                                                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                                                        <p>• <strong>Minimum:</strong> At least 500 words for ranking potential</p>
                                                        <p>• <strong>Consideration:</strong> Case by case - not relevant for all pages (e.g., Contact Us)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-gray-500">No content data available</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Image Alt Attributes */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5" />
                                        Image Alt Attributes
                                    </CardTitle>
                                    {onPageSEO ? getStatusIcon(onPageSEO.imageAlt.status) : null}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {onPageSEO ? (
                                    <>
                                        <Badge className={getStatusColor(onPageSEO.imageAlt.status)}>
                                            {onPageSEO.imageAlt.status.toUpperCase()}
                                        </Badge>
                                        <p className="mt-2 text-sm">{onPageSEO.imageAlt.message}</p>

                                        <div className="mt-4 grid grid-cols-3 gap-4">
                                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <p className="text-2xl font-bold">{onPageSEO.imageAlt.totalImages}</p>
                                                <p className="text-xs text-gray-500">Total Images</p>
                                            </div>
                                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                                <p className="text-2xl font-bold text-green-600">{onPageSEO.imageAlt.imagesWithAlt}</p>
                                                <p className="text-xs text-gray-500">With Alt</p>
                                            </div>
                                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                                <p className="text-2xl font-bold text-red-600">{onPageSEO.imageAlt.imagesWithoutAlt}</p>
                                                <p className="text-xs text-gray-500">Without Alt</p>
                                            </div>
                                        </div>

                                        {onPageSEO.imageAlt.totalImages > 0 && (
                                            <Button
                                                variant="outline"
                                                className="w-full mt-4"
                                                onClick={() => setShowImages(!showImages)}
                                            >
                                                {showImages ? (
                                                    <>
                                                        <ChevronUp className="w-4 h-4" />
                                                        Hide Images
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown className="w-4 h-4" />
                                                        View Images ({onPageSEO.imageAlt.totalImages})
                                                    </>
                                                )}
                                            </Button>
                                        )}

                                        {/* All Images Grid */}
                                        {showImages && (
                                            <div className="space-y-4">
                                                {onPageSEO.imageAlt.imagesWithoutAlt > 0 && (
                                                    <div>
                                                        <h4 className="font-medium text-red-600 mb-2">
                                                            Images Missing Alt ({onPageSEO.imageAlt.imagesWithoutAlt})
                                                        </h4>
                                                        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                                                            {onPageSEO.imageAlt.images.filter(img => !img.hasAlt).map((img, index) => (
                                                                <div key={index} className="bg-red-50 p-3 rounded border border-red-200">
                                                                    <Badge variant="destructive" className="mb-1">Missing Alt</Badge>
                                                                    <code className="text-xs block bg-gray-900 text-gray-100 p-2 rounded mt-2 overflow-x-auto font-mono">
                                                                        {`<img src="${img.src}" alt="" />`}
                                                                    </code>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {onPageSEO.imageAlt.imagesWithAlt > 0 && (
                                                    <div>
                                                        <h4 className="font-medium text-green-600 mb-2">
                                                            Images With Alt ({onPageSEO.imageAlt.imagesWithAlt})
                                                        </h4>
                                                        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                                                            {onPageSEO.imageAlt.images.filter(img => img.hasAlt).map((img, index) => (
                                                                <div key={index} className="bg-green-50 p-3 rounded border border-green-200">
                                                                    <Badge className="bg-green-500 mb-1">Has Alt</Badge>
                                                                    <code className="text-xs block bg-gray-900 text-gray-100 p-2 rounded mt-2 overflow-x-auto font-mono">
                                                                        {`<img src="${img.src}" alt="${img.alt || ''}" />`}
                                                                    </code>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Collapsible Info Section */}
                                        <div className="mt-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowImageInfo(!showImageInfo)}
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                <Info className="w-4 h-4" />
                                                {showImageInfo ? 'Less Info' : 'More Info'}
                                                {showImageInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </Button>

                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${showImageInfo ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                                                    }`}
                                            >
                                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                                    <h4 className="font-medium text-blue-900 mb-2">About Alt Text</h4>
                                                    <p className="text-sm text-blue-800">
                                                        Alternate Image Text or Alt Text is descriptive text that is displayed in place of an image if it can't be loaded, as well as a label when moused over. Additionally, Search Engines use Alt Text to better understand image content.
                                                    </p>
                                                    <p className="text-sm text-blue-800 mt-2">
                                                        Image SEO is an overlooked way of gaining traffic and backlinks through image searches.
                                                    </p>
                                                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                                                        <p>• <strong>Recommendation:</strong> Add useful, keyword-rich Alt Text for main images</p>
                                                        <p>• <strong>Consideration:</strong> Case by case - UI components or tracking pixels may not need Alt Text</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-gray-500">No image alt data available</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* ========== NEW SECTIONS APPENDED BELOW ========== */}

                        {/* Noindex Tags */}
                        <StatusCard
                            title="Noindex Tag Test"
                            data={onPageSEO?.noindexTag || defaultStatusData}
                            infoContent={
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-medium text-blue-900 mb-2">About Noindex Tags</h4>
                                    <p className="text-sm text-blue-800">
                                        A critical part of a page's ranking potential is ensuring it can be accessed by Search Engines. The Noindex Tag tells Search Engines to ignore a page, which can destroy its ranking ability.
                                    </p>
                                    <p className="text-sm text-blue-800 mt-2">
                                        Sometimes these tags are left over unintentionally from a theme/template or forgotten to be removed.
                                    </p>
                                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                                        <p>• <strong>To Fix:</strong> Remove the noindex tag from your page's HTML</p>
                                        <p>• <strong>CMS Users:</strong> Check for options preventing indexing and turn them off</p>
                                        <p>• <strong>Developer Help:</strong> May require access to frontend HTML code</p>
                                    </div>
                                </div>
                            }
                        />

                        <StatusCard
                            title="Noindex Header Test"
                            data={onPageSEO?.noindexHeader || defaultStatusData}
                            infoContent={
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-medium text-blue-900 mb-2">About Noindex Headers</h4>
                                    <p className="text-sm text-blue-800">
                                        The Noindex Header is another Noindexing method that tells Search Engines to ignore a page, which can destroy its ranking ability.
                                    </p>
                                    <p className="text-sm text-blue-800 mt-2">
                                        Sometimes these headers are left over unintentionally from a theme/template or forgotten to be removed.
                                    </p>
                                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                                        <p>• <strong>To Fix:</strong> Remove the Noindex Header from your page</p>
                                        <p>• <strong>Backend:</strong> May require access to backend code</p>
                                        <p>• <strong>CMS Users:</strong> Check for options preventing indexing and turn them off</p>
                                    </div>
                                </div>
                            }
                        />

                        {/* Security */}
                        <StatusCard
                            title="SSL Enabled"
                            data={onPageSEO?.sslEnabled || defaultStatusData}
                            icon={Lock}
                            infoContent={
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-medium text-blue-900 mb-2">About SSL</h4>
                                    <p className="text-sm text-blue-800">
                                        SSL (Secure Socket Layer) is a security technology that encrypts data between your website and visitors. It ensures secure transfer of sensitive data like passwords and credit cards.
                                    </p>
                                    <p className="text-sm text-blue-800 mt-2">
                                        Search Engines consider SSL a ranking signal in recent years.
                                    </p>
                                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                                        <p>• <strong>Easy Setup:</strong> Can be enabled simply in WordPress, Wix, etc.</p>
                                        <p>• <strong>Custom Sites:</strong> May require technical resource to install and configure</p>
                                        <p>• <strong>Test:</strong> Verify your site loads successfully at HTTPS:// location</p>
                                    </div>
                                </div>
                            }
                        />

                        <StatusCard
                            title="HTTPS Redirect"
                            data={onPageSEO?.httpsRedirect || defaultStatusData}
                            icon={RefreshCw}
                            infoContent={
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-medium text-blue-900 mb-2">About HTTPS Redirect</h4>
                                    <p className="text-sm text-blue-800">
                                        SSL ensures sensitive data is sent securely between your website and visitors. If SSL is enabled, it's important to redirect from HTTP to HTTPS to ensure users and Search Engines access the secure version.
                                    </p>
                                    <p className="text-sm text-blue-800 mt-2">
                                        Not doing this means insecure versions may be accessed, reducing your ranking ability.
                                    </p>
                                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                                        <p>• <strong>Easy Systems:</strong> Wix, Shopify often handle this automatically</p>
                                        <p>• <strong>WordPress/Custom:</strong> May require developer involvement</p>
                                        <p>• <strong>Configuration:</strong> Can be done in site config or htaccess rules</p>
                                    </div>
                                </div>
                            }
                        />

                        {/* Crawlers */}
                        <StatusCard
                            title="Robot txt url"
                            data={onPageSEO?.robotsTxt || defaultStatusData}
                            icon={FileSearch}
                            showUrl={true}
                            infoContent={
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-medium text-blue-900 mb-2">About Robots.txt</h4>
                                    <p className="text-sm text-blue-800">
                                        Robots.txt is a text file that provides instructions to Search Engine crawlers on how to crawl your site, including which pages to access or not. It is often the gatekeeper of your site and normally the first thing a Search Engine bot will access.
                                    </p>
                                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                                        <p>• <strong>Recommendation:</strong> Always have a robots.txt file in place</p>
                                        <p>• <strong>Creation:</strong> Can be automatically created using free online utilities</p>
                                        <p>• <strong>CMS:</strong> Use WordPress plugins or your CMS's robots.txt creation process</p>
                                    </div>
                                </div>
                            }
                        />

                        <StatusCard
                            title="Blocked by Robots.txt"
                            data={onPageSEO?.blockedByRobots || defaultStatusData}
                            infoContent={
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-medium text-blue-900 mb-2">About Blocked Pages</h4>
                                    <p className="text-sm text-blue-800">
                                        The robots.txt file includes instructions to Search Engines on how to crawl your site, including which pages to ignore. Sometimes these are added intentionally for low value pages, but sometimes left over by mistake when a website goes live.
                                    </p>
                                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                                        <p>• <strong>To Fix:</strong> Review your robots.txt rules to understand why it's blocked</p>
                                        <p>• <strong>Developer Help:</strong> May require developer to correct the rules</p>
                                        <p>• <strong>Caution:</strong> Incorrect rules can exclude more pages than desired</p>
                                    </div>
                                </div>
                            }
                        />

                        {/* Llms.txt & Sitemap */}
                        <StatusCard
                            title="Llms.txt"
                            data={onPageSEO?.llmsTxt || defaultStatusData}
                            icon={Shield}
                            showUrl={true}
                            infoContent={
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-medium text-blue-900 mb-2">About Llms.txt</h4>
                                    <p className="text-sm text-blue-800">
                                        Llms.txt is a proposed standard file for websites to help large language model (LLM) crawlers understand a site's content more efficiently. The file offers brief background information, guidance, and links to documentation sources.
                                    </p>
                                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                                        <p>• <strong>Recommendation:</strong> Add an llms.txt markdown file to your site</p>
                                        <p>• <strong>Creation:</strong> Can be automatically created with free utilities, plugins, or CMS</p>
                                    </div>
                                </div>
                            }
                        />

                        <StatusCard
                            title="XML Sitemaps"
                            data={onPageSEO?.xmlSitemap || defaultStatusData}
                            icon={FileTextIcon}
                            showUrl={true}
                            infoContent={
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-medium text-blue-900 mb-2">About XML Sitemaps</h4>
                                    <p className="text-sm text-blue-800">
                                        A Sitemap is an XML data file that lists all of your site's pages available for crawling, with useful information like last update times and crawling priority. Sitemaps help Search Engines find all your pages for indexing and ranking.
                                    </p>
                                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                                        <p>• <strong>Recommendation:</strong> Always have a Sitemap file in place</p>
                                        <p>• <strong>Creation:</strong> Can be created manually or with utilities, plugins, CMS</p>
                                        <p>• <strong>Best Practice:</strong> Reference Sitemap in your robots.txt file</p>
                                    </div>
                                </div>
                            }
                        />

                        {/* Analytics & Schema */}
                        <AnalyticsCard
                            data={onPageSEO?.analytics || {
                                hasAnalytics: false,
                                analyticsType: null,
                                detectedTools: [],
                                status: 'warning',
                                message: 'No analytics data available'
                            }}
                        />

                        <StatusCard
                            title="Schema.org Structured Data"
                            data={onPageSEO?.schemaOrg || defaultStatusData}
                            icon={Code}
                            infoContent={
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-medium text-blue-900 mb-2">About Schema.org</h4>
                                    <p className="text-sm text-blue-800">
                                        Schema.org Structured Data Markup is a collection of data tags added to your site to help Search Engines interpret content and enhance Search Results.
                                    </p>
                                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                                        <p>• <strong>Examples:</strong> Local Business info (address, phone), product info for e-commerce</p>
                                        <p>• <strong>Benefits:</strong> Products displayed in shopping aggregators like Google Shopping</p>
                                        <p>• <strong>Recommendation:</strong> Incorporate relevant Schema.org tags to improve interpretation</p>
                                    </div>
                                </div>
                            }
                        />

                        <StatusCard
                            title="Identity Schema"
                            data={onPageSEO?.identitySchema || defaultStatusData}
                            icon={Building}
                            infoContent={
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-medium text-blue-900 mb-2">About Identity Schema</h4>
                                    <p className="text-sm text-blue-800">
                                        Organization and Person Schema is Structured Data that signals to Search Engines and LLMs 'who you are'. This helps them confidently answer brand/company/person queries and avoid mixups with similarly named entities.
                                    </p>
                                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                                        <p>• <strong>CMS:</strong> Your CMS may have ability to input this directly</p>
                                        <p>• <strong>Plugins:</strong> Install a Schema app or plugin</p>
                                        <p>• <strong>Manual:</strong> Use online Schema Generator tool and copy to site code</p>
                                    </div>
                                </div>
                            }
                        />

                    </div>
                </TabsContent>

                {/* Links Tab */}
                <TabsContent value="links">
                    <div className="space-y-6">
                        {/* Backlinks Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <Card className="bg-liner-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {analysis?.backlinks?.counts?.total?.toLocaleString() || '0'}
                                        </div>
                                        <div className="text-sm text-blue-700 mt-1 font-medium">Total Backlinks</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-liner-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">
                                            {analysis?.backlinks?.counts?.doFollow?.toLocaleString() || '0'}
                                        </div>
                                        <div className="text-sm text-green-700 mt-1 font-medium">DoFollow Links</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-liner-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-600">
                                            {analysis?.backlinks?.domains?.total?.toLocaleString() || '0'}
                                        </div>
                                        <div className="text-sm text-purple-700 mt-1 font-medium">Unique Domains</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-liner-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-600">
                                            {analysis?.backlinks?.counts?.fromHomePage?.toLocaleString() || '0'}
                                        </div>
                                        <div className="text-sm text-orange-700 mt-1 font-medium">From Homepages</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-liner-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-teal-600">
                                            {analysis?.backlinks?.ips?.toLocaleString() || '0'}
                                        </div>
                                        <div className="text-sm text-teal-700 mt-1 font-medium">Total IPs</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Top Pages by Backlinks */}
                        {analysis?.backlinks?.topAnchorUrlsByBacklinks && analysis.backlinks.topAnchorUrlsByBacklinks.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Globe className="w-5 h-5 text-blue-600" />
                                        Top Pages by Backlinks
                                    </CardTitle>
                                    <CardDescription>
                                        Pages on this site receiving the most backlinks
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b bg-gray-50">
                                                    <th className="text-left py-3 px-3 font-medium text-gray-600">URL</th>
                                                    <th className="text-center py-3 px-3 font-medium text-gray-600">Backlinks</th>
                                                    <th className="text-left py-3 px-3 font-medium text-gray-600 w-1/3">Visualization</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analysis.backlinks?.topAnchorUrlsByBacklinks?.slice(0, 10).map((item: any, idx: number) => {
                                                    const maxCount = analysis.backlinks?.topAnchorUrlsByBacklinks?.[0]?.count || 1;
                                                    const percentage = (item.count / maxCount) * 100;
                                                    return (
                                                        <tr key={idx} className="border-b hover:bg-blue-50/50 transition-colors">
                                                            <td className="py-3 px-3">
                                                                <a
                                                                    href={item.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline font-medium truncate max-w-xs block"
                                                                    title={item.url}
                                                                >
                                                                    {item.url.length > 60 ? item.url.substring(0, 60) + '...' : item.url}
                                                                </a>
                                                            </td>
                                                            <td className="py-3 px-3 text-center">
                                                                <span className="font-bold text-blue-600">
                                                                    {item.count?.toLocaleString()}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-3">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                                        <div
                                                                            className="bg-liner-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                                                                            style={{ width: `${percentage}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-xs text-gray-500 min-w-[40px]">
                                                                        {percentage.toFixed(0)}%
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Top Anchor Texts by Backlinks */}
                        {analysis?.backlinks?.topAnchorsByBacklinks && analysis.backlinks.topAnchorsByBacklinks.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Anchor className="w-5 h-5 text-green-600" />
                                        Top Anchor Texts by Backlinks
                                    </CardTitle>
                                    <CardDescription>
                                        Most common anchor texts used in backlinks pointing to this site
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b bg-gray-50">
                                                    <th className="text-left py-3 px-3 font-medium text-gray-600">Anchor Text</th>
                                                    <th className="text-center py-3 px-3 font-medium text-gray-600">Total Backlinks</th>
                                                    <th className="text-left py-3 px-3 font-medium text-gray-600 w-1/3">Visualization</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analysis.backlinks?.topAnchorsByBacklinks?.slice(0, 10).map((item: any, idx: number) => {
                                                    const maxCount = analysis.backlinks?.topAnchorsByBacklinks?.[0]?.count || 1;
                                                    const percentage = (item.count / maxCount) * 100;
                                                    return (
                                                        <tr key={idx} className="border-b hover:bg-green-50/50 transition-colors">
                                                            <td className="py-3 px-3">
                                                                <span className="font-medium text-gray-700 truncate max-w-xs block" title={item.anchor}>
                                                                    {item.anchor || '(no anchor)'}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-3 text-center">
                                                                <span className="font-bold text-green-600">
                                                                    {item.count?.toLocaleString()}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-3">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                                        <div
                                                                            className="bg-liner-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                                                                            style={{ width: `${percentage}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-xs text-gray-500 min-w-[40px]">
                                                                        {percentage.toFixed(0)}%
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Backlink List Table */}
                        {analysis?.backlinkList && analysis.backlinkList.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <LinkIcon className="w-5 h-5 text-gray-600" />
                                                Backlink List
                                            </CardTitle>
                                            <CardDescription>
                                                Showing {showAllBacklinks ? analysis.backlinkList.length : Math.min(5, analysis.backlinkList.length)} of {analysis.backlinkList.length.toLocaleString()} total backlinks
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowAllBacklinks(!showAllBacklinks)}
                                            className="flex items-center gap-1"
                                        >
                                            {showAllBacklinks ? (
                                                <>
                                                    Show Less
                                                </>
                                            ) : (
                                                <>
                                                    Show All Backlinks
                                                    <ChevronRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b bg-gray-50">
                                                    <th className="text-left py-3 px-3 font-medium text-gray-600">Source URL</th>
                                                    <th className="text-left py-3 px-3 font-medium text-gray-600">Anchor</th>
                                                    <th className="text-center py-3 px-3 font-medium text-gray-600">Type</th>
                                                    <th className="text-center py-3 px-3 font-medium text-gray-600">Inlink Rank</th>
                                                    <th className="text-left py-3 px-3 font-medium text-gray-600">First Seen</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(showAllBacklinks ? analysis.backlinkList : analysis.backlinkList.slice(0, 5)).map((bl: any, idx: number) => (
                                                    <tr key={idx} className="border-b hover:bg-blue-50/50 transition-colors">
                                                        <td className="py-3 px-3 max-w-xs truncate">
                                                            <a
                                                                href={bl.url_from}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline font-medium"
                                                                title={bl.url_from}
                                                            >
                                                                {bl.url_from.length > 60 ? bl.url_from.substring(0, 60) + '...' : bl.url_from}
                                                            </a>
                                                        </td>
                                                        <td className="py-3 px-3 max-w-xs truncate" title={bl.anchor}>
                                                            <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                                                                {bl.anchor || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-3 text-center">
                                                            <div className="flex items-center justify-center gap-1">
                                                                {bl.nofollow ? (
                                                                    <Badge variant="destructive" className="text-xs">NF</Badge>
                                                                ) : (
                                                                    <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-200">DF</Badge>
                                                                )}
                                                                {bl.image && (
                                                                    <Badge variant="outline" className="text-xs bg-blue-50">IMG</Badge>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-3 text-center">
                                                            <span className="font-mono text-gray-600">
                                                                {bl.inlink_rank?.toLocaleString() || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-3 text-gray-500">
                                                            {bl.first_seen ? new Date(bl.first_seen).toLocaleDateString() : '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Referral Domains Section */}
                        {analysis?.referralDomains?.referrers && analysis.referralDomains.referrers.length > 0 && (
                            <div className="space-y-6">
                                {/* TLD Breakdown with Progress Circles */}
                                {analysis.referralDomains.tldBreakdown && analysis.referralDomains.tldBreakdown.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <Globe className="w-5 h-5 text-purple-600" />
                                                TLD Breakdown
                                            </CardTitle>
                                            <CardDescription>
                                                Distribution of referring domains by top-level domain
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                {analysis.referralDomains.tldBreakdown.slice(0, 6).map((tld: any, idx: number) => (
                                                    <div key={idx} className="flex flex-col items-center">
                                                        <ProgressCircle
                                                            value={tld.percentage}
                                                            variant={tld.percentage >= 50 ? 'success' : tld.percentage >= 25 ? 'warning' : 'default'}
                                                            radius={35}
                                                            strokeWidth={6}
                                                        >
                                                            <span className="text-lg font-bold text-gray-700">{tld.tld}</span>
                                                        </ProgressCircle>
                                                        <div className="text-center mt-2">
                                                            <div className="font-medium text-gray-700">{tld.count}</div>
                                                            <div className="text-xs text-gray-500">
                                                                {tld.percentage.toFixed(1)}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Top Referring Domains Table */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2 text-lg">
                                                    <LinkIcon className="w-5 h-5 text-blue-600" />
                                                    Top Referring Domains
                                                </CardTitle>
                                                <CardDescription>
                                                    Showing {showAllReferralDomains ? analysis.referralDomains.referrers.length : Math.min(5, analysis.referralDomains.referrers.length)} of {analysis.referralDomains.totalDomains?.toLocaleString() || analysis.referralDomains.referrers.length} total domains
                                                </CardDescription>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowAllReferralDomains(!showAllReferralDomains)}
                                                className="flex items-center gap-1"
                                            >
                                                {showAllReferralDomains ? (
                                                    "Show Less"
                                                ) : (
                                                    <>
                                                        Show More
                                                        <ChevronRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b bg-gray-50">
                                                        <th className="text-left py-3 px-3 font-medium text-gray-600">Referring Domain</th>
                                                        <th className="text-center py-3 px-3 font-medium text-gray-600">Backlinks</th>
                                                        <th className="text-center py-3 px-3 font-medium text-gray-600">DoFollow</th>
                                                        <th className="text-left py-3 px-3 font-medium text-gray-600 w-1/3">Visualization</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(showAllReferralDomains ? analysis.referralDomains.referrers : analysis.referralDomains.referrers.slice(0, 5)).map((ref: any, idx: number) => {
                                                        const maxBacklinks = analysis.referralDomains.referrers[0]?.backlinks || 1;
                                                        const percentage = maxBacklinks > 0 ? (ref.backlinks / maxBacklinks) * 100 : 0;
                                                        return (
                                                            <tr key={idx} className="border-b hover:bg-purple-50/50 transition-colors">
                                                                <td className="py-3 px-3">
                                                                    <a
                                                                        href={`https://${ref.refdomain}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:underline font-medium truncate max-w-xs block"
                                                                        title={ref.refdomain}
                                                                    >
                                                                        {ref.refdomain}
                                                                    </a>
                                                                </td>
                                                                <td className="py-3 px-3 text-center">
                                                                    <span className="font-bold text-blue-600">
                                                                        {ref.backlinks?.toLocaleString()}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-3 text-center">
                                                                    <span className="font-medium text-green-600">
                                                                        {ref.dofollow_backlinks?.toLocaleString()}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                                            <div
                                                                                className="bg-linear-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                                                                                style={{ width: `${percentage}%` }}
                                                                            />
                                                                        </div>
                                                                        <span className="text-xs text-gray-500 min-w-[40px]">
                                                                            {percentage.toFixed(0)}%
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Top TLD and Country */}
                        {(analysis?.backlinks?.topTLD || analysis?.backlinks?.topCountry) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {analysis?.backlinks?.topTLD && (
                                    <Card className="bg-liner-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-indigo-600" />
                                                Top TLD
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-indigo-600">
                                                {analysis.backlinks.topTLD}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {analysis?.backlinks?.topCountry && (
                                    <Card className="bg-liner-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-emerald-600" />
                                                Top Country
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-emerald-600">
                                                {analysis.backlinks.topCountry}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}

                        {/* No backlinks message */}
                        {(!analysis?.backlinks?.counts?.total || analysis.backlinks.counts.total === 0) && (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <LinkIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-500">
                                        No backlinks data available for this website.
                                    </p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Backlinks data is fetched from VEB API when available.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                {/* Usability Tab */}
                <TabsContent value="usability">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Google PageSpeed Screenshots
                                </CardTitle>
                                <CardDescription>
                                    Desktop and mobile view screenshots from Google PageSpeed Insights
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Desktop Screenshot */}
                                    <div className="space-y-2">
                                        <h3 className="font-medium flex items-center gap-2">
                                            <Monitor className="w-4 h-4" />
                                            Desktop View
                                        </h3>
                                        {analysis?.usability?.desktopScreenshot?.exists ? (
                                            <div className="border rounded-lg overflow-hidden">
                                                <img
                                                    src={analysis.usability.desktopScreenshot.dataUrl || ''}
                                                    alt="Desktop screenshot"
                                                    className="w-full h-auto"
                                                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="border rounded-lg p-8 text-center text-gray-500">
                                                <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p>Desktop screenshot not available</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile Screenshot */}
                                    <div className="space-y-2">
                                        <h3 className="font-medium flex items-center gap-2">
                                            <Smartphone className="w-4 h-4" />
                                            Mobile View
                                        </h3>
                                        {analysis?.usability?.mobileScreenshot?.exists ? (
                                            <div className="border rounded-lg overflow-hidden">
                                                <img
                                                    src={analysis.usability.mobileScreenshot.dataUrl || ''}
                                                    alt="Mobile screenshot"
                                                    className="w-full h-auto"
                                                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="border rounded-lg p-8 text-center text-gray-500">
                                                <Smartphone className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p>Mobile screenshot not available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile Friendliness Info */}
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            {analysis?.usability?.mobileFriendly ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                            <span className="font-medium">Mobile Friendly</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {analysis?.usability?.mobileFriendly
                                                ? 'Your page is mobile friendly'
                                                : 'Your page may not be mobile friendly'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            {analysis?.usability?.viewportConfigured ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-yellow-500" />
                                            )}
                                            <span className="font-medium">Viewport Configured</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {analysis?.usability?.viewportConfigured
                                                ? 'Viewport meta tag is configured'
                                                : 'Viewport meta tag is missing'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Desktop & Mobile Scores */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Gauge className="w-5 h-5" />
                                    Desktop & Mobile Scores
                                </CardTitle>
                                <CardDescription>
                                    Performance scores for both desktop and mobile
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Desktop Scores */}
                                <div className="mb-6">
                                    <h3 className="font-medium flex items-center gap-2 mb-4">
                                        <Monitor className="w-4 h-4" />
                                        Desktop Scores
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {analysis?.usability?.desktopScores ? (
                                            <>
                                                <div className="flex flex-col items-center">
                                                    <ProgressCircle
                                                        value={analysis.usability.desktopScores.performance}
                                                        variant={analysis.usability.desktopScores.performance >= 90 ? 'success' : analysis.usability.desktopScores.performance >= 70 ? 'warning' : 'error'}
                                                        radius={40}
                                                        strokeWidth={5}
                                                    >
                                                        <div className={`text-2xl font-bold ${analysis.usability.desktopScores.performance >= 90 ? 'text-green-600' :
                                                            analysis.usability.desktopScores.performance >= 70 ? 'text-yellow-500' :
                                                                'text-red-600'
                                                            }`}>
                                                            {analysis.usability.desktopScores.performance}
                                                        </div>
                                                    </ProgressCircle>
                                                    <div className="mt-2 text-sm font-medium text-gray-700">Performance</div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <ProgressCircle
                                                        value={analysis.usability.desktopScores.accessibility}
                                                        variant={analysis.usability.desktopScores.accessibility >= 90 ? 'success' : analysis.usability.desktopScores.accessibility >= 70 ? 'warning' : 'error'}
                                                        radius={40}
                                                        strokeWidth={5}
                                                    >
                                                        <div className={`text-2xl font-bold ${analysis.usability.desktopScores.accessibility >= 90 ? 'text-green-600' :
                                                            analysis.usability.desktopScores.accessibility >= 70 ? 'text-yellow-500' :
                                                                'text-red-600'
                                                            }`}>
                                                            {analysis.usability.desktopScores.accessibility}
                                                        </div>
                                                    </ProgressCircle>
                                                    <div className="mt-2 text-sm font-medium text-gray-700">Accessibility</div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <ProgressCircle
                                                        value={analysis.usability.desktopScores.bestPractices}
                                                        variant={analysis.usability.desktopScores.bestPractices >= 90 ? 'success' : analysis.usability.desktopScores.bestPractices >= 70 ? 'warning' : 'error'}
                                                        radius={40}
                                                        strokeWidth={5}
                                                    >
                                                        <div className={`text-2xl font-bold ${analysis.usability.desktopScores.bestPractices >= 90 ? 'text-green-600' :
                                                            analysis.usability.desktopScores.bestPractices >= 70 ? 'text-yellow-500' :
                                                                'text-red-600'
                                                            }`}>
                                                            {analysis.usability.desktopScores.bestPractices}
                                                        </div>
                                                    </ProgressCircle>
                                                    <div className="mt-2 text-sm font-medium text-gray-700">Best Practices</div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <ProgressCircle
                                                        value={analysis.usability.desktopScores.seo}
                                                        variant={analysis.usability.desktopScores.seo >= 90 ? 'success' : analysis.usability.desktopScores.seo >= 70 ? 'warning' : 'error'}
                                                        radius={40}
                                                        strokeWidth={5}
                                                    >
                                                        <div className={`text-2xl font-bold ${analysis.usability.desktopScores.seo >= 90 ? 'text-green-600' :
                                                            analysis.usability.desktopScores.seo >= 70 ? 'text-yellow-500' :
                                                                'text-red-600'
                                                            }`}>
                                                            {analysis.usability.desktopScores.seo}
                                                        </div>
                                                    </ProgressCircle>
                                                    <div className="mt-2 text-sm font-medium text-gray-700">SEO</div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="col-span-4 text-center text-gray-500 py-4">
                                                Desktop scores not available
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile Scores */}
                                <div>
                                    <h3 className="font-medium flex items-center gap-2 mb-4">
                                        <Smartphone className="w-4 h-4" />
                                        Mobile Scores
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {analysis?.usability?.mobileScores ? (
                                            <>
                                                <div className="flex flex-col items-center">
                                                    <ProgressCircle
                                                        value={analysis.usability.mobileScores.performance}
                                                        variant={analysis.usability.mobileScores.performance >= 90 ? 'success' : analysis.usability.mobileScores.performance >= 70 ? 'warning' : 'error'}
                                                        radius={40}
                                                        strokeWidth={5}
                                                    >
                                                        <div className={`text-2xl font-bold ${analysis.usability.mobileScores.performance >= 90 ? 'text-green-600' :
                                                            analysis.usability.mobileScores.performance >= 70 ? 'text-yellow-500' :
                                                                'text-red-600'
                                                            }`}>
                                                            {analysis.usability.mobileScores.performance}
                                                        </div>
                                                    </ProgressCircle>
                                                    <div className="mt-2 text-sm font-medium text-gray-700">Performance</div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <ProgressCircle
                                                        value={analysis.usability.mobileScores.accessibility}
                                                        variant={analysis.usability.mobileScores.accessibility >= 90 ? 'success' : analysis.usability.mobileScores.accessibility >= 70 ? 'warning' : 'error'}
                                                        radius={40}
                                                        strokeWidth={5}
                                                    >
                                                        <div className={`text-2xl font-bold ${analysis.usability.mobileScores.accessibility >= 90 ? 'text-green-600' :
                                                            analysis.usability.mobileScores.accessibility >= 70 ? 'text-yellow-500' :
                                                                'text-red-600'
                                                            }`}>
                                                            {analysis.usability.mobileScores.accessibility}
                                                        </div>
                                                    </ProgressCircle>
                                                    <div className="mt-2 text-sm font-medium text-gray-700">Accessibility</div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <ProgressCircle
                                                        value={analysis.usability.mobileScores.bestPractices}
                                                        variant={analysis.usability.mobileScores.bestPractices >= 90 ? 'success' : analysis.usability.mobileScores.bestPractices >= 70 ? 'warning' : 'error'}
                                                        radius={40}
                                                        strokeWidth={5}
                                                    >
                                                        <div className={`text-2xl font-bold ${analysis.usability.mobileScores.bestPractices >= 90 ? 'text-green-600' :
                                                            analysis.usability.mobileScores.bestPractices >= 70 ? 'text-yellow-500' :
                                                                'text-red-600'
                                                            }`}>
                                                            {analysis.usability.mobileScores.bestPractices}
                                                        </div>
                                                    </ProgressCircle>
                                                    <div className="mt-2 text-sm font-medium text-gray-700">Best Practices</div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <ProgressCircle
                                                        value={analysis.usability.mobileScores.seo}
                                                        variant={analysis.usability.mobileScores.seo >= 90 ? 'success' : analysis.usability.mobileScores.seo >= 70 ? 'warning' : 'error'}
                                                        radius={40}
                                                        strokeWidth={5}
                                                    >
                                                        <div className={`text-2xl font-bold ${analysis.usability.mobileScores.seo >= 90 ? 'text-green-600' :
                                                            analysis.usability.mobileScores.seo >= 70 ? 'text-yellow-500' :
                                                                'text-red-600'
                                                            }`}>
                                                            {analysis.usability.mobileScores.seo}
                                                        </div>
                                                    </ProgressCircle>
                                                    <div className="mt-2 text-sm font-medium text-gray-700">SEO</div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="col-span-4 text-center text-gray-500 py-4">
                                                Mobile scores not available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Performance Metrics - Desktop */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Monitor className="w-5 h-5" />
                                    Desktop Performance Metrics
                                </CardTitle>
                                <CardDescription>
                                    Core Web Vitals and performance metrics for desktop
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <MetricCard
                                        label="First Contentful Paint"
                                        value={analysis?.usability?.desktopMetrics?.firstContentfulPaint?.value}
                                        unit="s"
                                        displayValue={analysis?.usability?.desktopMetrics?.firstContentfulPaint?.displayValue}
                                    />
                                    <MetricCard
                                        label="Speed Index"
                                        value={analysis?.usability?.desktopMetrics?.speedIndex?.value}
                                        unit="s"
                                        displayValue={analysis?.usability?.desktopMetrics?.speedIndex?.displayValue}
                                    />
                                    <MetricCard
                                        label="Largest Contentful Paint"
                                        value={analysis?.usability?.desktopMetrics?.largestContentfulPaint?.value}
                                        unit="s"
                                        displayValue={analysis?.usability?.desktopMetrics?.largestContentfulPaint?.displayValue}
                                    />
                                    <MetricCard
                                        label="Time to Interactive"
                                        value={analysis?.usability?.desktopMetrics?.timeToInteractive?.value}
                                        unit="s"
                                        displayValue={analysis?.usability?.desktopMetrics?.timeToInteractive?.displayValue}
                                    />
                                    <MetricCard
                                        label="Total Blocking Time"
                                        value={analysis?.usability?.desktopMetrics?.totalBlockingTime?.value}
                                        unit="s"
                                        displayValue={analysis?.usability?.desktopMetrics?.totalBlockingTime?.displayValue}
                                    />
                                    <MetricCard
                                        label="Cumulative Layout Shift"
                                        value={analysis?.usability?.desktopMetrics?.cumulativeLayoutShift?.value}
                                        displayValue={analysis?.usability?.desktopMetrics?.cumulativeLayoutShift?.displayValue}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Performance Metrics - Mobile */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Smartphone className="w-5 h-5" />
                                    Mobile Performance Metrics
                                </CardTitle>
                                <CardDescription>
                                    Core Web Vitals and performance metrics for mobile
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <MetricCard
                                        label="First Contentful Paint"
                                        value={analysis?.usability?.mobileMetrics?.firstContentfulPaint?.value}
                                        unit="s"
                                        displayValue={analysis?.usability?.mobileMetrics?.firstContentfulPaint?.displayValue}
                                    />
                                    <MetricCard
                                        label="Speed Index"
                                        value={analysis?.usability?.mobileMetrics?.speedIndex?.value}
                                        unit="s"
                                        displayValue={analysis?.usability?.mobileMetrics?.speedIndex?.displayValue}
                                    />
                                    <MetricCard
                                        label="Largest Contentful Paint"
                                        value={analysis?.usability?.mobileMetrics?.largestContentfulPaint?.value}
                                        unit="s"
                                        displayValue={analysis?.usability?.mobileMetrics?.largestContentfulPaint?.displayValue}
                                    />
                                    <MetricCard
                                        label="Time to Interactive"
                                        value={analysis?.usability?.mobileMetrics?.timeToInteractive?.value}
                                        unit="s"
                                        displayValue={analysis?.usability?.mobileMetrics?.timeToInteractive?.displayValue}
                                    />
                                    <MetricCard
                                        label="Total Blocking Time"
                                        value={analysis?.usability?.mobileMetrics?.totalBlockingTime?.value}
                                        unit="s"
                                        displayValue={analysis?.usability?.mobileMetrics?.totalBlockingTime?.displayValue}
                                    />
                                    <MetricCard
                                        label="Cumulative Layout Shift"
                                        value={analysis?.usability?.mobileMetrics?.cumulativeLayoutShift?.value}
                                        displayValue={analysis?.usability?.mobileMetrics?.cumulativeLayoutShift?.displayValue}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Flash Check */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Flash Usage
                                    </CardTitle>
                                    <Badge className={getStatusColor(analysis?.usability?.flash?.status || 'good')}>
                                        {analysis?.usability?.flash?.status?.toUpperCase() || 'GOOD'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{analysis?.usability?.flash?.message || 'No Flash content has been identified on your page.'}</p>

                                {/* Collapsible Info Section */}
                                <div className="mt-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowFlashInfo(!showFlashInfo)}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                        <Info className="w-4 h-4" />
                                        {showFlashInfo ? 'Less Info' : 'More Info'}
                                        {showFlashInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </Button>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${showFlashInfo ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <h4 className="font-medium text-blue-900 mb-2">About Flash</h4>
                                            <p className="text-sm text-blue-800">
                                                Flash is an older technology that was used for interactive web content. Modern websites should avoid Flash as it's no longer supported by browsers.
                                            </p>
                                            <div className="mt-3 space-y-2 text-sm text-blue-700">
                                                <p>• <strong>Status:</strong> Good - No Flash detected</p>
                                                <p>• <strong>Recommendation:</strong> Avoid using Flash content</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* iFrames Check */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Code className="w-5 h-5" />
                                        iFrames Usage
                                    </CardTitle>
                                    <Badge className={getStatusColor(analysis?.usability?.iframes?.status || 'good')}>
                                        {analysis?.usability?.iframes?.status?.toUpperCase() || 'GOOD'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{analysis?.usability?.iframes?.message || 'There are no iFrames detected on your page.'}</p>

                                {/* Collapsible Info Section */}
                                <div className="mt-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowIframesInfo(!showIframesInfo)}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                        <Info className="w-4 h-4" />
                                        {showIframesInfo ? 'Less Info' : 'More Info'}
                                        {showIframesInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </Button>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${showIframesInfo ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <h4 className="font-medium text-blue-900 mb-2">About iFrames</h4>
                                            <p className="text-sm text-blue-800">
                                                iFrames are HTML tags that allow you to embed other webpages inside your page in a small frame.
                                            </p>
                                            <div className="mt-3 space-y-2 text-sm text-blue-700">
                                                <p>• <strong>Concerns:</strong> Older coding practice, can complicate mobile navigation</p>
                                                <p>• <strong>SEO:</strong> Harder for search engines to index</p>
                                                <p>• <strong>Recommendation:</strong> Remove if not critical, or replace with natural navigation</p>
                                                <p>• <strong>Exception:</strong> Google Tag Manager may use iFrames internally</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Favicon Check */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Monitor className="w-5 h-5" />
                                        Favicon
                                    </CardTitle>
                                    <Badge className={getStatusColor(analysis?.usability?.favicon?.status || 'good')}>
                                        {analysis?.usability?.favicon?.status?.toUpperCase() || 'GOOD'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{analysis?.usability?.favicon?.message || 'Your page has specified a Favicon.'}</p>

                                {/* Collapsible Info Section */}
                                <div className="mt-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowFaviconInfo(!showFaviconInfo)}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                        <Info className="w-4 h-4" />
                                        {showFaviconInfo ? 'Less Info' : 'More Info'}
                                        {showFaviconInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </Button>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${showFaviconInfo ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <h4 className="font-medium text-blue-900 mb-2">About Favicons</h4>
                                            <p className="text-sm text-blue-800">
                                                A Favicon is a small icon that serves as branding for your website. It helps visitors locate your page easier when they have multiple tabs open.
                                            </p>
                                            <div className="mt-3 space-y-2 text-sm text-blue-700">
                                                <p>• <strong>Benefits:</strong> Adds legitimacy, boosts branding, builds trust</p>
                                                <p>• <strong>Creation:</strong> Use online builder tool or graphic designer</p>
                                                <p>• <strong>Implementation:</strong> Load into website or CMS</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance">
                    <div className="space-y-6">
                        {analysis?.performance ? (
                            <>
                                {/* Performance Scores */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Gauge className="w-5 h-5" />
                                            Performance Scores
                                        </CardTitle>
                                        <CardDescription>
                                            Overall performance metrics for {analysis.performance.strategy} strategy
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {Object.entries(analysis.performance.scores).map(([category, score]) => (
                                                <div key={category} className="text-center">
                                                    <div className="text-sm text-gray-600 capitalize">{category}</div>
                                                    {/* varient from basing of score */}
                                        {/* <ProgressCircle value={score} variant={score >= 90 ? 'success' : score >= 70 ? 'warning' : 'error'} radius={45} strokeWidth={5} >
                                                        <div className={`text-2xl font-bold ${score >= 90 ? 'text-green-600' :
                                                            score >= 70 ? 'text-yellow-600' :
                                                                'text-red-600'
                                                            }`}>
                                                            {score}
                                                        </div>
                                                    </ProgressCircle> */}
                                        {/* </div> */}
                                        {/* ))} */}
                                        {/* </div>  */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            {Object.entries(analysis.performance.scores).map(([category, score]) => {
                                                const variant =
                                                    score >= 90 ? 'success' :
                                                        score >= 70 ? 'warning' :
                                                            'error';

                                                const color =
                                                    score >= 90 ? 'text-green-600' :
                                                        score >= 70 ? 'text-yellow-500' :
                                                            'text-red-600';

                                                return (
                                                    <div key={category} className="flex flex-col items-center">
                                                        <ProgressCircle
                                                            value={score}
                                                            variant={variant}
                                                            radius={48}
                                                            strokeWidth={6}
                                                        >
                                                            <div className="flex flex-col items-center">
                                                                <span className={`text-3xl font-bold ${color}`}>
                                                                    {score}
                                                                </span>
                                                                {/* <span className="text-xs text-gray-500">/ 100</span> */}
                                                            </div>
                                                        </ProgressCircle>

                                                        <div className="mt-3 text-sm font-medium text-gray-700 capitalize">
                                                            {category}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                    </CardContent>
                                </Card>

                                {/* Core Web Vitals with Radial Gauges */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Gauge className="w-5 h-5" />
                                            Core Web Vitals
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* LCP Gauge */}
                                            <LCPRadialGauge
                                                value={analysis?.performance?.performance?.largestContentfulPaintMs}
                                            />
                                            {/* CLS Gauge */}
                                            <CLSRadialGauge
                                                value={analysis?.performance?.performance?.cumulativeLayoutShift}
                                            />
                                            {/* TBT Gauge */}
                                            <TBTRadialGauge
                                                value={analysis?.performance?.performance?.totalBlockingTimeMs}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Performance Metrics */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Gauge className="w-5 h-5" />
                                            Performance Metrics
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Server Response Time</span>
                                                    <span className="font-medium">
                                                        {analysis.performance.performance.serverResponseTimeMs
                                                            ? `${analysis.performance.performance.serverResponseTimeMs}ms`
                                                            : 'N/A'
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">First Contentful Paint</span>
                                                    <span className="font-medium">
                                                        {analysis.performance.performance.firstContentfulPaintMs
                                                            ? `${(analysis.performance.performance.firstContentfulPaintMs / 1000).toFixed(2)}s`
                                                            : 'N/A'
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Speed Index</span>
                                                    <span className="font-medium">
                                                        {analysis.performance.performance.speedIndexMs
                                                            ? `${(analysis.performance.performance.speedIndexMs / 1000).toFixed(2)}s`
                                                            : 'N/A'
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Time to Interactive</span>
                                                    <span className="font-medium">
                                                        {analysis.performance.performance.timeToInteractiveMs
                                                            ? `${(analysis.performance.performance.timeToInteractiveMs / 1000).toFixed(2)}s`
                                                            : 'N/A'
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Resource Breakdown */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart className="w-5 h-5" />
                                            Resource Breakdown
                                        </CardTitle>
                                        <CardDescription>
                                            Total Requests: {analysis.performance.resourceBreakdown.totalRequests}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {analysis?.performance?.resourceBreakdown && Object.entries(analysis.performance.resourceBreakdown)
                                                .filter(([key]) => key !== 'totalRequests')
                                                .map(([resourceType, data]) => {
                                                    // Calculate total size from all resource types (excluding totalRequests)
                                                    const resourceEntries = Object.entries(analysis.performance?.resourceBreakdown || {})
                                                        .filter(([k]) => k !== 'totalRequests');
                                                    const totalSize = resourceEntries.reduce((sum, [, d]) => sum + (d as any).sizeKB, 0);
                                                    const percentage = totalSize > 0 ? ((data as any).sizeKB / totalSize) * 100 : 0;

                                                    const getIcon = (type: string) => {
                                                        switch (type) {
                                                            case 'html': return <FileText className="w-4 h-4 text-orange-200" />;
                                                            case 'js': return <JsFile width={16} height={16} className="text-yellow-200" />;
                                                            case 'css': return <FileText className="w-4 h-4 text-sky-200" />;
                                                            case 'images': return <ImageIcon className="w-4 h-4 text-emerald-200" />;
                                                            case 'fonts': return <FileText className="w-4 h-4 text-violet-200" />;
                                                            case 'media': return <FileText className="w-4 h-4 text-rose-200" />;
                                                            case 'xhr': return <RefreshCw className="w-4 h-4 text-muted-foreground" />;
                                                            default: return <FileText className="w-4 h-4 text-muted-foreground" />;
                                                        }
                                                    };

                                                    const getColor = (type: string) => {
                                                        switch (type) {
                                                            case 'html': return 'bg-orange-500/10 border-orange-500/25';
                                                            case 'js': return 'bg-yellow-500/10 border-yellow-500/25';
                                                            case 'css': return 'bg-sky-500/10 border-sky-500/25';
                                                            case 'images': return 'bg-emerald-500/10 border-emerald-500/25';
                                                            case 'fonts': return 'bg-violet-500/10 border-violet-500/25';
                                                            case 'media': return 'bg-rose-500/10 border-rose-500/25';
                                                            case 'xhr': return 'bg-muted/40 border-border';
                                                            default: return 'bg-muted/30 border-border';
                                                        }
                                                    };

                                                    return (
                                                        <div key={resourceType} className={`p-4 rounded-lg border ${getColor(resourceType)} hover:shadow-md transition-shadow`}>
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    {getIcon(resourceType)}
                                                                    <div>
                                                                        <div className="font-semibold text-foreground capitalize">{resourceType}</div>
                                                                        <div className="text-xs text-muted-foreground">{(data as any).count} files</div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="font-bold text-foreground">{(data as any).sizeKB.toFixed(1)} KB</div>
                                                                    <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                                                                </div>
                                                            </div>

                                                            {/* Size bar visualization */}
                                                            <div className="w-full bg-muted/60 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full transition-all duration-300 ${resourceType === 'html' ? 'bg-orange-500' :
                                                                        resourceType === 'js' ? 'bg-yellow-500' :
                                                                            resourceType === 'css' ? 'bg-sky-500' :
                                                                                resourceType === 'images' ? 'bg-emerald-500' :
                                                                                    resourceType === 'fonts' ? 'bg-purple-500' :
                                                                                        resourceType === 'media' ? 'bg-red-500' :
                                                                                            resourceType === 'xhr' ? 'bg-muted-foreground/60' :
                                                                                                'bg-muted-foreground/40'
                                                                        }`}
                                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                            {/* Summary row */}
                                            <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <BarChart className="w-4 h-4 text-muted-foreground" />
                                                        <span className="font-medium text-foreground">Total Resources</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-foreground">
                                                            {Object.entries(analysis.performance.resourceBreakdown)
                                                                .filter(([k]) => k !== 'totalRequests')
                                                                .reduce((sum, [, d]) => sum + (d as any).count, 0)} files
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {Object.entries(analysis.performance.resourceBreakdown)
                                                                .filter(([k]) => k !== 'totalRequests')
                                                                .reduce((sum, [, d]) => sum + (d as any).sizeKB, 0).toFixed(1)} KB
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Image Analysis */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5" />
                                            Image Analysis
                                        </CardTitle>
                                        <CardDescription>
                                            {analysis.performance.imageSummary.totalImages} images found
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{analysis.performance.imageSummary.totalImages}</div>
                                                <div className="text-sm text-gray-600">Total Images</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{analysis.performance.imageSummary.totalTransferSizeMB} MB</div>
                                                <div className="text-sm text-gray-600">Transfer Size</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{analysis.performance.imageSummary.avgImageSizeKB} KB</div>
                                                <div className="text-sm text-gray-600">Average Size</div>
                                            </div>
                                        </div>

                                        {analysis.performance.images.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="font-medium">Top Images by Size</h4>
                                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                                    {analysis.performance.images
                                                        .sort((a, b) => b.transferSizeKB - a.transferSizeKB)
                                                        .slice(0, 10)
                                                        .map((img, index) => (
                                                            <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                                                                <div className="flex-1 truncate">
                                                                    <div className="font-medium">{img.format}</div>
                                                                    <div className="text-gray-600 truncate">{img.url}</div>
                                                                </div>
                                                                <div className="text-right ml-4">
                                                                    <div className="font-medium">{img.transferSizeKB} KB</div>
                                                                    <div className="text-xs text-gray-600">
                                                                        {img.compressionPercent > 0 ? `Compressed ${img.compressionPercent}%` : 'No compression'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <Card>
                                <CardContent className="text-center py-8">
                                    <p className="text-gray-500">
                                        Performance data not available. Make sure the Google PageSpeed API key is configured.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                {/* Social Tab */}
                <TabsContent value="social">
                    <div className="space-y-6 animate-fadeIn">
                        {/* Open Graph Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Share2 className="w-5 h-5" />
                                    Open Graph Analysis
                                </CardTitle>
                                <CardDescription>
                                    Open Graph protocol for social sharing
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className={`p-4 rounded-lg border ${getStatusColor(analysis?.social?.openGraph?.status || 'warning')}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        {getStatusIcon(analysis?.social?.openGraph?.status || 'warning')}
                                        <span className="font-medium">Open Graph Status</span>
                                    </div>
                                    <p className="text-sm">
                                        {analysis?.social?.openGraph?.message || 'No Open Graph data available'}
                                    </p>
                                </div>

                                {analysis?.social?.openGraph?.hasOpenGraph && (
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        {Object.entries(analysis.social.openGraph.openGraph || {}).map(([key, value]) => (
                                            <div key={key} className="p-3 rounded border border-border bg-muted/30 text-sm">
                                                <div className="font-medium text-foreground capitalize">{key.replace('og:', '')}</div>
                                                <div className="text-muted-foreground truncate" title={value as string}>{value as string}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Twitter Cards Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Share2 className="w-5 h-5" />
                                    Twitter Cards Analysis
                                </CardTitle>
                                <CardDescription>
                                    Twitter Card metadata for social sharing
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className={`p-4 rounded-lg border ${getStatusColor(analysis?.social?.twitterCards?.status || 'warning')}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        {getStatusIcon(analysis?.social?.twitterCards?.status || 'warning')}
                                        <span className="font-medium">Twitter Cards Status</span>
                                    </div>
                                    <p className="text-sm">
                                        {analysis?.social?.twitterCards?.message || 'No Twitter Cards data available'}
                                    </p>
                                </div>

                                {analysis?.social?.twitterCards?.hasTwitterCards && (
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        {Object.entries(analysis.social.twitterCards.twitter || {}).map(([key, value]) => (
                                            <div key={key} className="p-3 rounded border border-border bg-muted/30 text-sm">
                                                <div className="font-medium text-foreground capitalize">{key.replace('twitter:', '')}</div>
                                                <div className="text-muted-foreground truncate" title={value as string}>{value as string}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Social Profiles Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Share2 className="w-5 h-5" />
                                    Social Media Profiles
                                </CardTitle>
                                <CardDescription>
                                    Social media profiles linked from your website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className={`p-4 rounded-lg border ${getStatusColor(analysis?.social?.socialProfiles?.status || 'error')}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {getStatusIcon(analysis?.social?.socialProfiles?.status || 'error')}
                                        <span className="font-medium">Profiles Found: {analysis?.social?.socialProfiles?.count || 0}</span>
                                    </div>
                                    <p className="text-sm">
                                        {analysis?.social?.socialProfiles?.message || 'No social media profiles found'}
                                    </p>
                                </div>

                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { key: 'youtube', label: 'YouTube', icon: <Youtube /> },
                                        { key: 'facebook', label: 'Facebook', icon: <Facebook /> },
                                        { key: 'twitter', label: 'Twitter/X', icon: <Twitter /> },
                                        { key: 'instagram', label: 'Instagram', icon: <Instagram /> },
                                        { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin /> },
                                        { key: 'pinterest', label: 'Pinterest', icon: <LinkIcon /> },
                                        { key: 'tiktok', label: 'TikTok', icon: <LinkIcon /> },
                                    ].map(({ key, label, icon }) => {
                                        const link = analysis?.social?.socialProfiles?.links?.[key as keyof typeof analysis.social.socialProfiles.links];
                                        return (
                                            <div
                                                key={key}
                                                className={`p-3 rounded border ${
                                                    link
                                                        ? 'bg-green-50 border-green-200'
                                                        : 'bg-red-50 border-red-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span>{icon}</span>
                                                    <span className="font-medium text-sm">{label}</span>
                                                </div>
                                                <div className="text-xs mt-1 text-muted-foreground truncate" title={link || 'Not found'}>
                                                    {link ? (
                                                        <a
                                                            href={link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-emerald-300 hover:text-emerald-200 underline-offset-4 hover:underline"
                                                        >
                                                            Found
                                                        </a>
                                                    ) : 'Not found'}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Share2 className="w-5 h-5" />
                                    Contact Information
                                </CardTitle>
                                <CardDescription>
                                    Contact details found on your website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className={`p-4 rounded-lg border ${getStatusColor(analysis?.social?.contactInfo?.status || 'warning')}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {getStatusIcon(analysis?.social?.contactInfo?.status || 'warning')}
                                        <span className="font-medium">Contact Status</span>
                                    </div>
                                    <p className="text-sm">
                                        {analysis?.social?.contactInfo?.message || 'No contact information available'}
                                    </p>
                                </div>

                                <div className="mt-4 space-y-3">
                                    {/* Phone Numbers */}
                                    {analysis?.social?.contactInfo?.hasPhone && (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg">📞</span>
                                                <span className="font-medium text-green-800">Phone Numbers</span>
                                            </div>
                                            <div className="space-y-1">
                                                {analysis.social.contactInfo.phoneNumbers.map((phone, i) => (
                                                    <div key={i} className="text-sm text-green-700">{phone}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Addresses */}
                                    {analysis?.social?.contactInfo?.hasAddress && (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg">📍</span>
                                                <span className="font-medium text-green-800">Addresses</span>
                                            </div>
                                            <div className="space-y-1">
                                                {analysis.social.contactInfo.addresses.map((address, i) => (
                                                    <div key={i} className="text-sm text-green-700">{address}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Contact Page */}
                                    <div className={`p-3 rounded border ${analysis?.social?.contactInfo?.hasContactPage ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">🔗</span>
                                            <span className={`font-medium ${analysis?.social?.contactInfo?.hasContactPage ? 'text-green-800' : 'text-yellow-800'}`}>
                                                Contact/About Page
                                            </span>
                                        </div>
                                        <div className="text-sm mt-1 text-gray-600">
                                            {analysis?.social?.contactInfo?.hasContactPage ? 'Found' : 'Not found'}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <TechnologyCard analysis={analysis} />
                    </div>
                </TabsContent>

                {/* AI Suggestions Tab - Premium Feature */}
                <TabsContent value="suggestions-disabled">
                    <div className="space-y-6">
                        {/* Premium Header */}
                        <Card className="bg-linear-to-r from-purple-50 to-indigo-50 border-purple-200">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Sparkles className="w-6 h-6 text-purple-600" />
                                        AI-Powered SEO Insights
                                    </CardTitle>
                                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                                        PRO
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Personalized recommendations based on comprehensive analysis
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analysis?.suggestions ? (
                                    <div className="space-y-6">
                                        {/* Overall Score */}
                                        <div className="flex items-center justify-center">
                                            <div className="relative w-32 h-32">
                                                <svg className="w-32 h-32 transform -rotate-90">
                                                    <circle
                                                        cx="64"
                                                        cy="64"
                                                        r="56"
                                                        stroke="currentColor"
                                                        strokeWidth="8"
                                                        fill="none"
                                                        className="text-gray-200"
                                                    />
                                                    <circle
                                                        cx="64"
                                                        cy="64"
                                                        r="56"
                                                        stroke="currentColor"
                                                        strokeWidth="8"
                                                        fill="none"
                                                        strokeDasharray={`${(analysis.suggestions.overallScore / 100) * 351} 351`}
                                                        className={`${analysis.suggestions.overallScore >= 70 ? 'text-green-500' :
                                                            analysis.suggestions.overallScore >= 50 ? 'text-yellow-500' :
                                                                'text-red-500'
                                                            }`}
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-3xl font-bold text-gray-800">
                                                        {analysis.suggestions.overallScore}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        <div className="text-center">
                                            <p className="text-lg font-medium text-gray-700">
                                                {analysis.suggestions.summary}
                                            </p>
                                        </div>

                                        {/* Category Breakdown */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {analysis.suggestions.categoryBreakdown?.technical || 0}
                                                </div>
                                                <div className="text-xs text-gray-500">Technical</div>
                                            </div>
                                            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {analysis.suggestions.categoryBreakdown?.onpage || 0}
                                                </div>
                                                <div className="text-xs text-gray-500">On-Page</div>
                                            </div>
                                            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                                <div className="text-2xl font-bold text-purple-600">
                                                    {analysis.suggestions.categoryBreakdown?.content || 0}
                                                </div>
                                                <div className="text-xs text-gray-500">Content</div>
                                            </div>
                                        </div>

                                        {/* Suggestions List */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Recommended Actions
                                            </h3>
                                            {analysis.suggestions.suggestions?.slice(0, 8).map((suggestion: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className={`p-4 rounded-lg border-l-4 ${suggestion.priority === 'critical' ? 'border-l-red-500 bg-red-50' :
                                                        suggestion.priority === 'high' ? 'border-l-orange-500 bg-orange-50' :
                                                            suggestion.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                                                                'border-l-blue-500 bg-blue-50'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`${suggestion.priority === 'critical' ? 'text-red-600 border-red-300' :
                                                                        suggestion.priority === 'high' ? 'text-orange-600 border-orange-300' :
                                                                            suggestion.priority === 'medium' ? 'text-yellow-600 border-yellow-300' :
                                                                                'text-blue-600 border-blue-300'
                                                                        }`}
                                                                >
                                                                    {suggestion.priority}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-gray-600">
                                                                    {suggestion.category}
                                                                </Badge>
                                                            </div>
                                                            <h4 className="font-medium text-gray-900">
                                                                {suggestion.title}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {suggestion.description}
                                                            </p>
                                                            <p className="text-sm text-gray-700 mt-2 font-medium">
                                                                💡 {suggestion.recommendation}
                                                            </p>
                                                        </div>
                                                        <div className="ml-4 shrink-0">
                                                            <div className={`text-xs px-2 py-1 rounded ${suggestion.estimatedImpact === 'high' ? 'bg-green-100 text-green-700' :
                                                                suggestion.estimatedImpact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                Impact: {suggestion.estimatedImpact}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Prioritized Actions */}
                                        {analysis.suggestions.prioritizedActions && analysis.suggestions.prioritizedActions.length > 0 && (
                                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                                <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                                    <Zap className="w-4 h-4" />
                                                    Top Priority Actions
                                                </h4>
                                                <ol className="list-decimal list-inside space-y-2">
                                                    {analysis.suggestions.prioritizedActions.map((action: string, index: number) => (
                                                        <li key={index} className="text-sm text-purple-700">
                                                            {action}
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            Analyzing your website to generate personalized insights...
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Custom SVG Radial Gauge Component
function RadialGauge({
    value,
    min = 0,
    max = 100,
    label,
    unit,
    thresholds
}: {
    value: number | null | undefined;
    min?: number;
    max?: number;
    label: string;
    unit: string;
    thresholds: { good: number; warning: number };
}) {
    const gaugeValue = value || 0;
    const percentage = Math.min(Math.max((gaugeValue - min) / (max - min), 0), 1);

    const getColor = () => {
        if (gaugeValue <= thresholds.good) return '#22c55e';
        if (gaugeValue <= thresholds.warning) return '#eab308';
        return '#ef4444';
    };

    const radius = 55;
    const strokeWidth = 14;
    const centerX = 80;
    const centerY = 70;
    const startAngle = -135; // Start from top-left (225 degrees in standard position)
    const endAngle = 45; // End at bottom-right (45 degrees in standard position)

    // Calculate the needle angle based on percentage
    // The arc goes from -135° to +45° (a 270° sweep)
    const needleAngle = startAngle + (percentage * 270);

    // Convert angle to radians for needle tip position
    const needleRadians = (needleAngle * Math.PI) / 180;

    // Calculate needle tip position
    const needleTipX = centerX + (radius - 8) * Math.cos(needleRadians);
    const needleTipY = centerY + (radius - 8) * Math.sin(needleRadians);

    // Helper function to create arc path
    const createArcPath = (startPct: number, endPct: number) => {
        const arcStartAngle = startAngle + (startPct * 270);
        const arcEndAngle = startAngle + (endPct * 270);

        const startRad = (arcStartAngle * Math.PI) / 180;
        const endRad = (arcEndAngle * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);

        const largeArcFlag = endPct - startPct > 0.5 ? 1 : 0;

        return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
    };

    return (
        <div className="flex flex-col items-center p-2">
            <svg width="160" height="120" viewBox="0 0 160 120">
                {/* Background arc */}
                <path
                    d={createArcPath(0, 1)}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Green zone (0 to good threshold) */}
                <path
                    d={createArcPath(0, (thresholds.good - min) / (max - min))}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth={strokeWidth}
                    strokeLinecap="butt"
                />

                {/* Yellow zone (good to warning threshold) */}
                {thresholds.warning > thresholds.good && (
                    <path
                        d={createArcPath((thresholds.good - min) / (max - min), (thresholds.warning - min) / (max - min))}
                        fill="none"
                        stroke="#eab308"
                        strokeWidth={strokeWidth}
                        strokeLinecap="butt"
                    />
                )}

                {/* Red zone (warning to max) */}
                <path
                    d={createArcPath((thresholds.warning - min) / (max - min), 1)}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Needle */}
                <line
                    x1={centerX} y1={centerY} x2={needleTipX} y2={needleTipY}
                    stroke={getColor()}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <circle cx={centerX} cy={centerY} r="5" fill={getColor()} />

                {/* Labels */}
                <text x={centerX - 45} y={centerY + radius + 18} fontSize="9" fill="#6b7280" textAnchor="middle">{min}</text>
                <text x={centerX} y={centerY + radius + 18} fontSize="9" fill="#6b7280" textAnchor="middle">{((min + max) / 2).toFixed(0)}</text>
                <text x={centerX + 45} y={centerY + radius + 18} fontSize="9" fill="#6b7280" textAnchor="middle">{max}</text>

                {/* Value display */}
                <text x={centerX} y={centerY - 5} fontSize="14" fontWeight="bold" fill={getColor()} textAnchor="middle">
                    {gaugeValue > 0 ? `${gaugeValue.toFixed(1)}${unit}` : 'N/A'}
                </text>
                <text x={centerX} y={centerY + 28} fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">{label}</text>
            </svg>

            <div className="mt-1 text-center">
                <div className="text-xs text-gray-500">
                    <span className="text-green-600">Good: ≤{thresholds.good}{unit}</span> •
                    <span className="text-yellow-600 ml-1">Warning: ≤{thresholds.warning}{unit}</span> •
                    <span className="text-red-600 ml-1">Poor: &gt;{thresholds.warning}{unit}</span>
                </div>
            </div>
        </div>
    );
}

// LCP Radial Gauge Component
function LCPRadialGauge({ value }: { value: number | null | undefined }) {
    const lcpValue = value ? value / 1000 : 0;

    return (
        <RadialGauge
            value={lcpValue}
            min={0}
            max={5}
            label="LCP"
            unit="s"
            thresholds={{ good: 2.5, warning: 4 }}
        />
    );
}

// CLS Radial Gauge Component
function CLSRadialGauge({ value }: { value: number | null | undefined }) {
    const clsValue = value || 0;

    return (
        <RadialGauge
            value={clsValue}
            min={0}
            max={0.5}
            label="CLS"
            unit=""
            thresholds={{ good: 0.1, warning: 0.25 }}
        />
    );
}

// TBT Radial Gauge Component
function TBTRadialGauge({ value }: { value: number | null | undefined }) {
    const tbtValue = value || 0;

    return (
        <RadialGauge
            value={tbtValue}
            min={0}
            max={1000}
            label="TBT"
            unit="ms"
            thresholds={{ good: 200, warning: 600 }}
        />
    );
}

export default SEOAnalysisTabbed;
