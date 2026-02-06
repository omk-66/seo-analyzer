"use client";

import { useState } from 'react';
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
    Smartphone
} from 'lucide-react';
import { ProgressCircle } from './ui/progressCircle';
import { JsFile } from './assests/svgs';

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
                                    <td className="py-2 px-3">{data.length} characters</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                <p className="mt-4 text-xs text-gray-500">
                    Title Tags are very important for search engines to correctly understand and categorize your content.
                </p>
            </CardContent>
        </Card>
    );
}

function MetaDescriptionCard({ data }: { data: OnPageSEOData['metaDescription'] }) {
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
                                    <td className="py-2 px-3">{data.length} characters</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                <p className="mt-4 text-xs text-gray-500">
                    A Meta Description is important for search engines to understand the content of your page, and is often shown as the description text blurb in search results.
                </p>
            </CardContent>
        </Card>
    );
}

function StatusCard({ title, data, icon: Icon, showUrl = false }: {
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
}) {
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
            </CardContent>
        </Card>
    );
}

export function SEOAnalysisTabbed({ analysis, url }: SEOAnalysisTabbedProps) {
    const [activeTab, setActiveTab] = useState('onpage');
    const [showImages, setShowImages] = useState(false);

    const onPageSEO = analysis?.onPageSEO;
    const defaultStatusData = { status: 'warning' as const, message: 'No data available' };

    return (
        <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Right side tabs - 5 tabs */}
                <TabsList className="grid w-full grid-cols-5 mb-6 sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
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

                        {/* Language & Canonical - 2 columns */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <StatusCard
                                title="Language Declaration"
                                data={onPageSEO?.language || defaultStatusData}
                            />
                            <StatusCard
                                title="Canonical Tag"
                                data={onPageSEO?.canonicalTag || defaultStatusData}
                                showUrl={true}
                            />
                        </div>

                        {/* H1 Header Tag Usage */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        H1 Header Tag Usage
                                    </CardTitle>
                                    {onPageSEO ? getStatusIcon(onPageSEO.headers.status) : null}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {onPageSEO ? (
                                    <>
                                        <p className="text-sm mb-4">
                                            {onPageSEO.headers.hasH1
                                                ? onPageSEO.headers.hasMultipleH1
                                                    ? `Your page has ${onPageSEO.headers.h1Tags.length} H1 Tags.`
                                                    : 'Your page has a H1 Tag.'
                                                : 'Your page is missing an H1 Tag.'}
                                        </p>
                                        <div className="mt-4">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b bg-gray-50">
                                                        <th className="text-left py-2 px-3 font-medium">Tag</th>
                                                        <th className="text-left py-2 px-3 font-medium">Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {onPageSEO.headers.h1Tags.map((tag, index) => (
                                                        <tr key={index} className="border-b">
                                                            <td className="py-2 px-3 font-medium">H1</td>
                                                            <td className="py-2 px-3">{tag}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
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
                                                        { tag: 'H2', count: onPageSEO.headers.headerFrequency.h2, max: 10 },
                                                        { tag: 'H3', count: onPageSEO.headers.headerFrequency.h3, max: 10 },
                                                        { tag: 'H4', count: onPageSEO.headers.headerFrequency.h4, max: 5 },
                                                        { tag: 'H5', count: onPageSEO.headers.headerFrequency.h5, max: 3 },
                                                        { tag: 'H6', count: onPageSEO.headers.headerFrequency.h6, max: 3 },
                                                    ].map((item) => (
                                                        <tr key={item.tag} className="border-b">
                                                            <td className="py-2 px-3 font-medium">{item.tag}</td>
                                                            <td className="py-2 px-3">{item.count}</td>
                                                            <td className="py-2 px-3">
                                                                <div className="flex items-center gap-2">
                                                                    <Progress
                                                                        value={(item.count / item.max) * 100}
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
                                            <Progress
                                                value={Math.min((onPageSEO.contentAmount.wordCount / 3500) * 100, 100)}
                                                className="h-3"
                                            />
                                            <div className="flex justify-between text-xs mt-1">
                                                <span>0 words</span>
                                                <span>{onPageSEO.contentAmount.wordCount} words</span>
                                                <span>3500+ words</span>
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
                        />

                        <StatusCard
                            title="Noindex Header Test"
                            data={onPageSEO?.noindexHeader || defaultStatusData}
                        />

                        {/* Security */}
                        <StatusCard
                            title="SSL Enabled"
                            data={onPageSEO?.sslEnabled || defaultStatusData}
                            icon={Lock}
                        />

                        <StatusCard
                            title="HTTPS Redirect"
                            data={onPageSEO?.httpsRedirect || defaultStatusData}
                            icon={RefreshCw}
                        />

                        {/* Crawlers */}
                        <StatusCard
                            title="Robots.txt"
                            data={onPageSEO?.robotsTxt || defaultStatusData}
                            icon={FileSearch}
                            showUrl={true}
                        />

                        <StatusCard
                            title="Blocked by Robots.txt"
                            data={onPageSEO?.blockedByRobots || defaultStatusData}
                        />

                        {/* Llms.txt & Sitemap */}
                        <StatusCard
                            title="Llms.txt"
                            data={onPageSEO?.llmsTxt || defaultStatusData}
                            icon={Shield}
                            showUrl={true}
                        />

                        <StatusCard
                            title="XML Sitemaps"
                            data={onPageSEO?.xmlSitemap || defaultStatusData}
                            icon={FileTextIcon}
                            showUrl={true}
                        />

                        {/* Analytics & Schema */}
                        <StatusCard
                            title="Analytics"
                            data={onPageSEO?.analytics || defaultStatusData}
                            icon={BarChart}
                        />

                        <StatusCard
                            title="Schema.org Structured Data"
                            data={onPageSEO?.schemaOrg || defaultStatusData}
                            icon={Code}
                        />

                        <StatusCard
                            title="Identity Schema"
                            data={onPageSEO?.identitySchema || defaultStatusData}
                            icon={Building}
                        />

                    </div>
                </TabsContent>

                {/* Links Tab */}
                <TabsContent value="links">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LinkIcon className="w-5 h-5" />
                                Links Analysis
                            </CardTitle>
                            <CardDescription>
                                Analysis of internal and external links for {url || analysis?.url || 'your website'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500 text-center py-8">
                                Links analysis will be added here in the next task.
                            </p>
                        </CardContent>
                    </Card>
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

                        {/* Flash, iFrames, and Favicon Checks */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileSearch className="w-5 h-5" />
                                    Flash, iFrames & Favicon
                                </CardTitle>
                                <CardDescription>
                                    Additional usability checks for your page
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Flash Check */}
                                    <div className={`p-4 rounded-lg border ${getStatusColor(analysis?.usability?.flash?.status || 'good')}`}>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(analysis?.usability?.flash?.status || 'good')}
                                            <span className="font-medium">Flash Used?</span>
                                        </div>
                                        <p className="text-sm mt-1">
                                            {analysis?.usability?.flash?.message || 'No Flash content has been identified on your page.'}
                                        </p>
                                    </div>

                                    {/* iFrames Check */}
                                    <div className={`p-4 rounded-lg border ${getStatusColor(analysis?.usability?.iframes?.status || 'good')}`}>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(analysis?.usability?.iframes?.status || 'good')}
                                            <span className="font-medium">iFrames Used?</span>
                                        </div>
                                        <p className="text-sm mt-1">
                                            {analysis?.usability?.iframes?.message || 'There are no iFrames detected on your page.'}
                                        </p>
                                    </div>

                                    {/* Favicon Check */}
                                    <div className={`p-4 rounded-lg border ${getStatusColor(analysis?.usability?.favicon?.status || 'good')}`}>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(analysis?.usability?.favicon?.status || 'good')}
                                            <span className="font-medium">Favicon</span>
                                        </div>
                                        <p className="text-sm mt-1">
                                            {analysis?.usability?.favicon?.message || 'Your page has specified a Favicon.'}
                                        </p>
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

                                {/* Core Web Vitals */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Gauge className="w-5 h-5" />
                                            Core Web Vitals
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="p-4 border rounded-lg">
                                                <div className="text-sm text-gray-600">Largest Contentful Paint</div>
                                                <div className="text-xl font-semibold">
                                                    {analysis.performance.performance.largestContentfulPaintMs
                                                        ? `${(analysis.performance.performance.largestContentfulPaintMs / 1000).toFixed(2)}s`
                                                        : 'N/A'
                                                    }
                                                </div>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <div className="text-sm text-gray-600">Cumulative Layout Shift</div>
                                                <div className="text-xl font-semibold">
                                                    {analysis.performance.performance.cumulativeLayoutShift !== null
                                                        ? analysis.performance.performance.cumulativeLayoutShift.toFixed(3)
                                                        : 'N/A'
                                                    }
                                                </div>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <div className="text-sm text-gray-600">Total Blocking Time</div>
                                                <div className="text-xl font-semibold">
                                                    {analysis.performance.performance.totalBlockingTimeMs !== null
                                                        ? `${analysis.performance.performance.totalBlockingTimeMs}ms`
                                                        : 'N/A'
                                                    }
                                                </div>
                                            </div>
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
                                            {Object.entries(analysis.performance.resourceBreakdown)
                                                .filter(([key]) => key !== 'totalRequests')
                                                .map(([resourceType, data]) => {
                                                    // Calculate total size from all resource types (excluding totalRequests)
                                                    const resourceEntries = Object.entries(analysis.performance.resourceBreakdown)
                                                        .filter(([k]) => k !== 'totalRequests');
                                                    const totalSize = resourceEntries.reduce((sum, [, d]) => sum + (d as any).sizeKB, 0);
                                                    const percentage = totalSize > 0 ? ((data as any).sizeKB / totalSize) * 100 : 0;

                                                    const getIcon = (type: string) => {
                                                        switch (type) {
                                                            case 'html': return <FileText className="w-4 h-4 text-orange-500" />;
                                                            case 'js': return <JsFile width={16} height={16} className="text-yellow-500" />;
                                                            case 'css': return <FileText className="w-4 h-4 text-blue-500" />;
                                                            case 'images': return <ImageIcon className="w-4 h-4 text-green-500" />;
                                                            case 'fonts': return <FileText className="w-4 h-4 text-purple-500" />;
                                                            case 'media': return <FileText className="w-4 h-4 text-red-500" />;
                                                            case 'xhr': return <RefreshCw className="w-4 h-4 text-gray-500" />;
                                                            default: return <FileText className="w-4 h-4 text-gray-400" />;
                                                        }
                                                    };

                                                    const getColor = (type: string) => {
                                                        switch (type) {
                                                            case 'html': return 'bg-orange-100 border-orange-200';
                                                            case 'js': return 'bg-yellow-100 border-yellow-200';
                                                            case 'css': return 'bg-blue-100 border-blue-200';
                                                            case 'images': return 'bg-green-100 border-green-200';
                                                            case 'fonts': return 'bg-purple-100 border-purple-200';
                                                            case 'media': return 'bg-red-100 border-red-200';
                                                            case 'xhr': return 'bg-gray-100 border-gray-200';
                                                            default: return 'bg-gray-50 border-gray-200';
                                                        }
                                                    };

                                                    return (
                                                        <div key={resourceType} className={`p-4 rounded-lg border ${getColor(resourceType)} hover:shadow-md transition-shadow`}>
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    {getIcon(resourceType)}
                                                                    <div>
                                                                        <div className="font-semibold text-gray-800 capitalize">{resourceType}</div>
                                                                        <div className="text-xs text-gray-500">{(data as any).count} files</div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="font-bold text-gray-800">{(data as any).sizeKB.toFixed(1)} KB</div>
                                                                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                                                                </div>
                                                            </div>

                                                            {/* Size bar visualization */}
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full transition-all duration-300 ${resourceType === 'html' ? 'bg-orange-500' :
                                                                        resourceType === 'js' ? 'bg-yellow-500' :
                                                                            resourceType === 'css' ? 'bg-blue-500' :
                                                                                resourceType === 'images' ? 'bg-green-500' :
                                                                                    resourceType === 'fonts' ? 'bg-purple-500' :
                                                                                        resourceType === 'media' ? 'bg-red-500' :
                                                                                            resourceType === 'xhr' ? 'bg-gray-500' :
                                                                                                'bg-gray-400'
                                                                        }`}
                                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                            {/* Summary row */}
                                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <BarChart className="w-4 h-4 text-gray-600" />
                                                        <span className="font-medium text-gray-700">Total Resources</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-gray-800">
                                                            {Object.entries(analysis.performance.resourceBreakdown)
                                                                .filter(([k]) => k !== 'totalRequests')
                                                                .reduce((sum, [, d]) => sum + (d as any).count, 0)} files
                                                        </div>
                                                        <div className="text-sm text-gray-600">
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
                    <div className="space-y-6">
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
                                            <div key={key} className="p-3 bg-gray-50 rounded text-sm">
                                                <div className="font-medium text-gray-700 capitalize">{key.replace('og:', '')}</div>
                                                <div className="text-gray-600 truncate" title={value as string}>{value as string}</div>
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
                                            <div key={key} className="p-3 bg-gray-50 rounded text-sm">
                                                <div className="font-medium text-gray-700 capitalize">{key.replace('twitter:', '')}</div>
                                                <div className="text-gray-600 truncate" title={value as string}>{value as string}</div>
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
                                        { key: 'youtube', label: 'YouTube', icon: '▶️' },
                                        { key: 'facebook', label: 'Facebook', icon: '📘' },
                                        { key: 'twitter', label: 'Twitter/X', icon: '🐦' },
                                        { key: 'instagram', label: 'Instagram', icon: '📷' },
                                        { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
                                        { key: 'pinterest', label: 'Pinterest', icon: '📌' },
                                        { key: 'tiktok', label: 'TikTok', icon: '🎵' },
                                    ].map(({ key, label, icon }) => {
                                        const link = analysis?.social?.socialProfiles?.links?.[key as keyof typeof analysis.social.socialProfiles.links];
                                        return (
                                            <div
                                                key={key}
                                                className={`p-3 rounded border ${link ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span>{icon}</span>
                                                    <span className="font-medium text-sm">{label}</span>
                                                </div>
                                                <div className="text-xs mt-1 text-gray-600 truncate" title={link || 'Not found'}>
                                                    {link ? (
                                                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default SEOAnalysisTabbed;
