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
    FileText as FileTextIcon
} from 'lucide-react';

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

interface SEOAnalysisTabbedProps {
    analysis?: {
        url?: string;
        onPageSEO?: OnPageSEOData;
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

function getLanguageFullName(languageCode: string): string {
    // Common language code to full name mapping
    const languageMap: { [key: string]: string } = {
        'en': 'English',
        'en-US': 'English (United States)',
        'en-GB': 'English (United Kingdom)',
        'es': 'Spanish',
        'es-ES': 'Spanish (Spain)',
        'fr': 'French',
        'fr-FR': 'French (France)',
        'de': 'German',
        'de-DE': 'German (Germany)',
        'it': 'Italian',
        'it-IT': 'Italian (Italy)',
        'pt': 'Portuguese',
        'pt-BR': 'Portuguese (Brazil)',
        'pt-PT': 'Portuguese (Portugal)',
        'ru': 'Russian',
        'ja': 'Japanese',
        'zh': 'Chinese',
        'zh-CN': 'Chinese (Simplified)',
        'zh-TW': 'Chinese (Traditional)',
        'ko': 'Korean',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'nl': 'Dutch',
        'nl-NL': 'Dutch (Netherlands)',
        'sv': 'Swedish',
        'da': 'Danish',
        'no': 'Norwegian',
        'fi': 'Finnish',
        'pl': 'Polish',
        'tr': 'Turkish',
        'vi': 'Vietnamese',
        'id': 'Indonesian',
        'ms': 'Malay',
        'tl': 'Filipino',
        'he': 'Hebrew',
        'cs': 'Czech',
        'sk': 'Slovak',
        'hu': 'Hungarian',
        'ro': 'Romanian',
        'bg': 'Bulgarian',
        'hr': 'Croatian',
        'sr': 'Serbian',
        'sl': 'Slovenian',
        'et': 'Estonian',
        'lv': 'Latvian',
        'lt': 'Lithuanian',
        'el': 'Greek',
        'uk': 'Ukrainian',
        'be': 'Belarusian',
        'ka': 'Georgian',
        'hy': 'Armenian',
        'az': 'Azerbaijani',
        'kk': 'Kazakh',
        'ky': 'Kyrgyz',
        'uz': 'Uzbek',
        'mn': 'Mongolian',
        'ne': 'Nepali',
        'si': 'Sinhala',
        'my': 'Burmese',
        'km': 'Khmer',
        'lo': 'Lao'
    };

    return languageMap[languageCode] || languageCode;
}

function LanguageCard({ data }: { data: OnPageSEOData['language'] }) {
    const fullLanguageName = data.declaredLanguage ? getLanguageFullName(data.declaredLanguage) : 'Not declared';

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" />
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

                {data.declaredLanguage && (
                    <div className="mt-4">
                        <table className="w-full">
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-2 px-3 font-medium w-32">Language Code</td>
                                    <td className="py-2 px-3 font-mono">{data.declaredLanguage}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 px-3 font-medium">Full Name</td>
                                    <td className="py-2 px-3">{fullLanguageName}</td>
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
    const defaultLanguageData = {
        hasLangAttribute: false,
        declaredLanguage: null,
        status: 'warning' as const,
        message: 'No language data available'
    };

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
                            <LanguageCard
                                data={onPageSEO?.language || defaultLanguageData}
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
                                            <div className="mb-2">
                                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                    <span>Words: {onPageSEO.contentAmount.wordCount}</span>
                                                    <span>Optimal: {onPageSEO.contentAmount.minWords}-{onPageSEO.contentAmount.maxWords}</span>
                                                </div>
                                                <Progress
                                                    value={Math.min((onPageSEO.contentAmount.wordCount / onPageSEO.contentAmount.maxWords) * 100, 100)}
                                                    className="h-3"
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs mt-2 text-gray-500">
                                                <span className={onPageSEO.contentAmount.wordCount < onPageSEO.contentAmount.minWords ? 'text-red-600 font-medium' : ''}>
                                                    {onPageSEO.contentAmount.wordCount < onPageSEO.contentAmount.minWords ? 'Below minimum' : 'Good length'}
                                                </span>
                                                <span>
                                                    {onPageSEO.contentAmount.wordCount >= onPageSEO.contentAmount.maxWords ? 'Above maximum' : 'Within range'}
                                                </span>
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Usability Analysis
                            </CardTitle>
                            <CardDescription>
                                Usability metrics for {url || analysis?.url || 'your website'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500 text-center py-8">
                                Usability analysis will be added here in the next task.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Gauge className="w-5 h-5" />
                                Performance Analysis
                            </CardTitle>
                            <CardDescription>
                                Performance metrics for {url || analysis?.url || 'your website'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500 text-center py-8">
                                Performance analysis will be added here in the next task.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Social Tab */}
                <TabsContent value="social">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Share2 className="w-5 h-5" />
                                Social Media Analysis
                            </CardTitle>
                            <CardDescription>
                                Social media presence for {url || analysis?.url || 'your website'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500 text-center py-8">
                                Social media analysis will be added here in the next task.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default SEOAnalysisTabbed;
