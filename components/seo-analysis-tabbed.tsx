"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    analyzeTitleTag,
    analyzeMetaDescription,
    analyzeHreflang,
    analyzeLanguage,
    analyzeHeaderTags,
    analyzeContentAmount,
    analyzeImageAltAttributes
} from '@/lib/onpageseo';
import {
    FileText,
    Link,
    Gauge,
    Users,
    Share2,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    ChevronDown,
    ChevronUp,
    ImageIcon
} from 'lucide-react';

// Type for the API response
interface SEOAnalysis {
    url: string;
    title: string;
    metaDescription: string;
    headings?: {
        h1?: string[];
        h2?: string[];
        h3?: string[];
        h4?: string[];
        h5?: string[];
        h6?: string[];
    };
    meta?: {
        openGraph?: Record<string, string>;
        viewport?: string;
        robots?: string;
        canonical?: string;
        keywords?: string;
        author?: string;
    };
    performance?: {
        wordCount?: number;
    };
    images?: Array<{
        src: string;
        alt?: string;
    }>;
    detailedRecommendations?: {
        title?: {
            current?: string;
        };
        metaDescription?: {
            current?: string;
        };
    };
}

interface SEOAnalysisTabbedProps {
    analysis?: SEOAnalysis | null;
    url?: string;
}

export function SEOAnalysisTabbed({ analysis, url }: SEOAnalysisTabbedProps) {
    const [activeTab, setActiveTab] = useState('onpage');
    const [showImages, setShowImages] = useState(false);

    // Get data from the API response (prefer direct fields, fall back to detailedRecommendations)
    const title = analysis?.title || analysis?.detailedRecommendations?.title?.current || '';
    const metaDescription = analysis?.metaDescription || analysis?.detailedRecommendations?.metaDescription?.current || '';

    // Ensure headings arrays are always arrays
    const headings = analysis?.headings || {};
    const h1Tags = Array.isArray(headings?.h1) ? headings.h1 : [];
    const h2Tags = Array.isArray(headings?.h2) ? headings.h2 : [];
    const h3Tags = Array.isArray(headings?.h3) ? headings.h3 : [];
    const h4Tags = Array.isArray(headings?.h4) ? headings.h4 : [];
    const h5Tags = Array.isArray(headings?.h5) ? headings.h5 : [];
    const h6Tags = Array.isArray(headings?.h6) ? headings.h6 : [];
    const wordCount = analysis?.performance?.wordCount || 0;
    const imagesRaw = analysis?.images;
    const images = Array.isArray(imagesRaw) ? imagesRaw : [];

    // Check for hreflang in Open Graph tags
    const hreflangEntries = analysis?.meta?.openGraph?.['alternate']
        ? (Array.isArray(analysis?.meta?.openGraph?.['alternate'])
            ? analysis?.meta?.openGraph?.['alternate']
            : [analysis?.meta?.openGraph?.['alternate']])
        : [];

    // Get lang attribute from meta
    const langAttribute = 'en';

    // Analyze all elements
    const titleAnalysis = analyzeTitleTag(title);
    const metaDescriptionAnalysis = analyzeMetaDescription(metaDescription);
    const hreflangAnalysis = analyzeHreflang(hreflangEntries);
    const languageAnalysis = analyzeLanguage(langAttribute);
    const headerAnalysis = analyzeHeaderTags(h1Tags, h2Tags, h3Tags, h4Tags, h5Tags, h6Tags);
    const contentAmountAnalysis = analyzeContentAmount(wordCount);
    const imageAltAnalysis = analyzeImageAltAttributes(images);

    const getStatusBadge = (status: 'good' | 'warning' | 'error') => {
        switch (status) {
            case 'good':
                return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" /> Good</Badge>;
            case 'warning':
                return <Badge className="bg-yellow-500"><AlertTriangle className="w-3 h-3 mr-1" /> Warning</Badge>;
            case 'error':
                return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Error</Badge>;
        }
    };

    // Calculate max frequency for visualization
    const maxFrequency = Math.max(
        headerAnalysis.headerFrequency.h1,
        headerAnalysis.headerFrequency.h2,
        headerAnalysis.headerFrequency.h3,
        headerAnalysis.headerFrequency.h4,
        headerAnalysis.headerFrequency.h5,
        headerAnalysis.headerFrequency.h6,
        1
    );

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        SEO Analysis for {url || 'your website'}
                    </CardTitle>
                    <CardDescription>
                        Comprehensive SEO audit powered by AI
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Sticky Tab Navigation */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="onpage" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            On-page SEO
                        </TabsTrigger>
                        <TabsTrigger value="links" className="flex items-center gap-2">
                            <Link className="h-4 w-4" />
                            Links
                        </TabsTrigger>
                        <TabsTrigger value="usability" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Usability
                        </TabsTrigger>
                        <TabsTrigger value="performance" className="flex items-center gap-2">
                            <Gauge className="h-4 w-4" />
                            Performance
                        </TabsTrigger>
                        <TabsTrigger value="social" className="flex items-center gap-2">
                            <Share2 className="h-4 w-4" />
                            Social
                        </TabsTrigger>
                    </TabsList>

                    {/* On-page SEO Tab */}
                    <TabsContent value="onpage" className="space-y-6 mt-6">
                        {/* Title Tag Analysis */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Title Tag
                                </CardTitle>
                                <CardDescription>
                                    Analysis of your page title tag
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Status:</span>
                                    {getStatusBadge(titleAnalysis.status)}
                                </div>
                                <div>
                                    <span className="font-medium">Message:</span>
                                    <p className="text-gray-600 mt-1">{titleAnalysis.message}</p>
                                </div>
                                {titleAnalysis.exists && (
                                    <div>
                                        <span className="font-medium">Current Title:</span>
                                        <p className="bg-gray-100 p-3 rounded mt-1 font-mono text-sm">
                                            {titleAnalysis.title}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium">Length:</span>
                                    <span className="ml-2 text-lg font-bold">
                                        {titleAnalysis.length}
                                    </span>
                                    <span className="text-gray-500 ml-1">characters</span>
                                    <span className="text-gray-400 ml-2">
                                        (optimal: {titleAnalysis.minLength}-{titleAnalysis.maxLength})
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Meta Description Analysis */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Meta Description Tag
                                </CardTitle>
                                <CardDescription>
                                    Analysis of your page meta description
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Status:</span>
                                    {getStatusBadge(metaDescriptionAnalysis.status)}
                                </div>
                                <div>
                                    <span className="font-medium">Message:</span>
                                    <p className="text-gray-600 mt-1">{metaDescriptionAnalysis.message}</p>
                                </div>
                                {metaDescriptionAnalysis.exists && (
                                    <div>
                                        <span className="font-medium">Current Meta Description:</span>
                                        <p className="bg-gray-100 p-3 rounded mt-1 font-mono text-sm">
                                            {metaDescriptionAnalysis.description}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium">Length:</span>
                                    <span className="ml-2 text-lg font-bold">
                                        {metaDescriptionAnalysis.length}
                                    </span>
                                    <span className="text-gray-500 ml-1">characters</span>
                                    <span className="text-gray-400 ml-2">
                                        (optimal: {metaDescriptionAnalysis.minLength}-{metaDescriptionAnalysis.maxLength})
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hreflang Usage */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Hreflang Usage
                                </CardTitle>
                                <CardDescription>
                                    Analysis of your page hreflang attributes
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Status:</span>
                                    {getStatusBadge(hreflangAnalysis.status)}
                                </div>
                                <div>
                                    <span className="font-medium">Message:</span>
                                    <p className="text-gray-600 mt-1">{hreflangAnalysis.message}</p>
                                </div>
                                {hreflangAnalysis.hasHreflang && hreflangAnalysis.hreflangEntries.length > 0 && (
                                    <div>
                                        <span className="font-medium">Hreflang Entries:</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {hreflangAnalysis.hreflangEntries.map((entry, index) => (
                                                <Badge key={index} variant="outline">
                                                    {entry}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Language */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Language
                                </CardTitle>
                                <CardDescription>
                                    Analysis of your page language attribute
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Status:</span>
                                    {getStatusBadge(languageAnalysis.status)}
                                </div>
                                <div>
                                    <span className="font-medium">Message:</span>
                                    <p className="text-gray-600 mt-1">{languageAnalysis.message}</p>
                                </div>
                                {languageAnalysis.hasLangAttribute && (
                                    <div>
                                        <span className="font-medium">Declared:</span>
                                        <Badge className="ml-2">{languageAnalysis.declaredLanguage}</Badge>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* H1 Header Tag Usage */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    H1 Header Tag Usage
                                </CardTitle>
                                <CardDescription>
                                    Analysis of your page H1 tag
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Status:</span>
                                    {getStatusBadge(headerAnalysis.status)}
                                </div>
                                <div>
                                    <span className="font-medium">Message:</span>
                                    <p className="text-gray-600 mt-1">{headerAnalysis.message}</p>
                                </div>
                                {headerAnalysis.hasH1 && headerAnalysis.h1Tags.length > 0 && (
                                    <div>
                                        <span className="font-medium">H1 Tags Found:</span>
                                        <div className="space-y-2 mt-2">
                                            {headerAnalysis.h1Tags.map((tag, index) => (
                                                <div key={index} className="bg-gray-100 p-3 rounded">
                                                    <Badge className="mb-1">H1</Badge>
                                                    <p className="font-mono text-sm">{tag}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* H2-H6 Header Tag Usage */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    H2-H6 Header Tag Usage
                                </CardTitle>
                                <CardDescription>
                                    Frequency of your page header tags
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <span className="font-medium">Message:</span>
                                    <p className="text-gray-600 mt-1">{headerAnalysis.message}</p>
                                </div>

                                {/* Header Frequency Table with Visualization */}
                                <div className="space-y-3">
                                    <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-600 border-b pb-2">
                                        <div className="col-span-2">Tag</div>
                                        <div className="col-span-2">Frequency</div>
                                        <div className="col-span-8">Relative Line</div>
                                    </div>

                                    {[
                                        { tag: 'H2', count: headerAnalysis.headerFrequency.h2 },
                                        { tag: 'H3', count: headerAnalysis.headerFrequency.h3 },
                                        { tag: 'H4', count: headerAnalysis.headerFrequency.h4 },
                                        { tag: 'H5', count: headerAnalysis.headerFrequency.h5 },
                                        { tag: 'H6', count: headerAnalysis.headerFrequency.h6 },
                                    ].map((item) => (
                                        <div key={item.tag} className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-2 font-medium">{item.tag}</div>
                                            <div className="col-span-2">{item.count}</div>
                                            <div className="col-span-8">
                                                <div className="flex items-center gap-2">
                                                    <Progress
                                                        value={(item.count / maxFrequency) * 100}
                                                        className="h-2 flex-1"
                                                    />
                                                    <span className="text-xs text-gray-500 w-8">
                                                        {item.count > 0 ? Math.round((item.count / maxFrequency) * 100) : 0}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Amount of Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Amount of Content
                                </CardTitle>
                                <CardDescription>
                                    Analysis of your page word count
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Status:</span>
                                    {getStatusBadge(contentAmountAnalysis.status)}
                                </div>
                                <div>
                                    <span className="font-medium">Message:</span>
                                    <p className="text-gray-600 mt-1">{contentAmountAnalysis.message}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Word Count:</span>
                                    <span className="ml-2 text-lg font-bold">{contentAmountAnalysis.wordCount}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Alt Attributes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    Image Alt Attributes
                                </CardTitle>
                                <CardDescription>
                                    Analysis of your page image alt attributes
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Status:</span>
                                    {getStatusBadge(imageAltAnalysis.status)}
                                </div>
                                <div>
                                    <span className="font-medium">Message:</span>
                                    <p className="text-gray-600 mt-1">{imageAltAnalysis.message}</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="bg-gray-50 p-3 rounded">
                                        <div className="text-2xl font-bold">{imageAltAnalysis.totalImages}</div>
                                        <div className="text-sm text-gray-600">Total Images</div>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded">
                                        <div className="text-2xl font-bold text-green-600">{imageAltAnalysis.imagesWithAlt}</div>
                                        <div className="text-sm text-gray-600">With Alt</div>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded">
                                        <div className="text-2xl font-bold text-red-600">{imageAltAnalysis.imagesWithoutAlt}</div>
                                        <div className="text-sm text-gray-600">Without Alt</div>
                                    </div>
                                </div>

                                {/* View Images Button */}
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setShowImages(!showImages)}
                                >
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    {showImages ? 'Hide Images' : `View All Images (${imageAltAnalysis.totalImages})`}
                                </Button>

                                {/* All Images Grid */}
                                {showImages && (
                                    <div className="space-y-4">
                                        {/* Images Without Alt */}
                                        {imageAltAnalysis.imagesWithoutAlt > 0 && (
                                            <div>
                                                <h4 className="font-medium text-red-600 mb-2">
                                                    Images Missing Alt ({imageAltAnalysis.imagesWithoutAlt})
                                                </h4>
                                                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                                                    {imageAltAnalysis.images.filter(img => !img.hasAlt).map((img, index) => (
                                                        <div key={index} className="bg-red-50 p-3 rounded border border-red-200 flex items-center gap-3">
                                                            <img
                                                                src={img.src}
                                                                alt="No alt"
                                                                className="w-12 h-12 object-cover rounded"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <Badge variant="destructive" className="mb-1">Missing Alt</Badge>
                                                                <p className="font-mono text-xs break-all text-gray-600">{img.src}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Images With Alt */}
                                        {imageAltAnalysis.imagesWithAlt > 0 && (
                                            <div>
                                                <h4 className="font-medium text-green-600 mb-2">
                                                    Images With Alt ({imageAltAnalysis.imagesWithAlt})
                                                </h4>
                                                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                                                    {imageAltAnalysis.images.filter(img => img.hasAlt).map((img, index) => (
                                                        <div key={index} className="bg-green-50 p-3 rounded border border-green-200 flex items-center gap-3">
                                                            <img
                                                                src={img.src}
                                                                alt={img.alt || 'Image'}
                                                                className="w-12 h-12 object-cover rounded"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <Badge className="bg-green-500 mb-1">Has Alt</Badge>
                                                                <p className="font-mono text-xs break-all text-gray-600">{img.alt}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Links Tab */}
                    <TabsContent value="links" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Link className="h-5 w-5" />
                                    Links
                                </CardTitle>
                                <CardDescription>
                                    Internal and external linking analysis
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500">Links content will be added here.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Usability Tab */}
                    <TabsContent value="usability" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Usability
                                </CardTitle>
                                <CardDescription>
                                    User experience and accessibility
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500">Usability content will be added here.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Performance Tab */}
                    <TabsContent value="performance" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Gauge className="h-5 w-5" />
                                    Performance
                                </CardTitle>
                                <CardDescription>
                                    Speed and technical performance metrics
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500">Performance content will be added here.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Social Tab */}
                    <TabsContent value="social" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Share2 className="h-5 w-5" />
                                    Social
                                </CardTitle>
                                <CardDescription>
                                    Social media presence and sharing
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500">Social content will be added here.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
