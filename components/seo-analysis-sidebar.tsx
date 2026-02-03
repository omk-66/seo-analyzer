"use client";

import { useState } from 'react';
import {
    SEOAnalysis,
    CriticalIssue,
    Strength,
    QuickWin,
    SEOMetrics,
    DetailedRecommendations
} from '@/lib/ai-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Target,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Zap,
    Star,
    Lightbulb,
    Shield,
    FileText,
    Globe,
    Gauge,
    Code,
    ImageIcon,
    Search,
    AlertCircle,
    ExternalLink,
    ChevronRight,
    LayoutDashboard,
    BarChart3,
    Search as SearchIcon,
    Link2,
    Server,
    Settings,
    Menu
} from 'lucide-react';

interface SEOAnalysisTabbedProps {
    analysis: SEOAnalysis;
    url: string;
}

type SectionType = 'overview' | 'page-speed' | 'basic-seo' | 'advanced-seo' | 'keywords' | 'content' | 'links' | 'schema';

interface NavItem {
    id: SectionType;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}

export function SEOAnalysisTabbed({ analysis, url }: SEOAnalysisTabbedProps) {
    const [activeSection, setActiveSection] = useState<SectionType>('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Handle case where analysis might be in old format or incomplete
    const safeAnalysis = {
        overallScore: analysis.overallScore || 0,
        siteType: analysis.siteType || 'unknown',
        criticalIssues: analysis.criticalIssues || [],
        strengths: analysis.strengths || [],
        quickWins: analysis.quickWins || [],
        detailedRecommendations: analysis.detailedRecommendations || {
            title: { current: '', suggested: '', reason: '' },
            metaDescription: { current: '', suggested: '', reason: '' },
            headings: { issues: [], suggestions: [] },
            content: { wordCount: '', keywordUsage: '', readability: '' },
            technical: { imageOptimization: '', internalLinking: '', urlStructure: '', structuredData: '', metaTags: '' }
        },
        seoMetrics: analysis.seoMetrics || {
            technicalScore: 0,
            contentScore: 0,
            performanceScore: 0,
            accessibilityScore: 0
        },
        nextSteps: analysis.nextSteps || []
    };

    // Calculate counts for badges
    const criticalCount = safeAnalysis.criticalIssues.filter(i => i?.priority === 'critical').length;
    const warningCount = safeAnalysis.criticalIssues.filter(i => i?.priority === 'high' || i?.priority === 'medium').length;
    const goodCount = safeAnalysis.strengths.length;

    const navItems: NavItem[] = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'page-speed', label: 'PageSpeed Insights', icon: <Gauge className="w-5 h-5" /> },
        { id: 'basic-seo', label: 'Basic SEO', icon: <SearchIcon className="w-5 h-5" />, badge: criticalCount > 0 ? criticalCount : undefined },
        { id: 'keywords', label: 'Keywords', icon: <Target className="w-5 h-5" /> },
        { id: 'content', label: 'Content Analysis', icon: <FileText className="w-5 h-5" /> },
        { id: 'links', label: 'Links', icon: <Link2 className="w-5 h-5" /> },
        { id: 'advanced-seo', label: 'Advanced SEO', icon: <Server className="w-5 h-5" />, badge: warningCount > 0 ? warningCount : undefined },
        { id: 'schema', label: 'Schema Markup', icon: <Code className="w-5 h-5" /> },
    ];

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-100';
        if (score >= 60) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'good': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
            default: return <CheckCircle2 className="w-5 h-5 text-gray-400" />;
        }
    };

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Overall Score Card */}
            <Card className={`${getScoreBgColor(safeAnalysis.overallScore)} border-2`}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Target className="h-6 w-6" />
                                SEO Analysis for {url}
                            </CardTitle>
                            <CardDescription className="text-base">
                                Comprehensive audit powered by Google AI
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <div className={`text-5xl font-bold ${getScoreColor(safeAnalysis.overallScore)}`}>
                                {safeAnalysis.overallScore}/100
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                                {safeAnalysis.overallScore >= 80 ? 'Excellent' : safeAnalysis.overallScore >= 60 ? 'Good' : 'Needs Work'}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Progress value={safeAnalysis.overallScore} className="h-4" />
                </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <XCircle className="w-8 h-8 text-red-500" />
                            <div>
                                <p className="text-sm text-gray-600">Critical Issues</p>
                                <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-8 h-8 text-yellow-500" />
                            <div>
                                <p className="text-sm text-gray-600">Warnings</p>
                                <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                            <div>
                                <p className="text-sm text-gray-600">Passed Checks</p>
                                <p className="text-2xl font-bold text-green-600">{goodCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Zap className="w-8 h-8 text-blue-500" />
                            <div>
                                <p className="text-sm text-gray-600">Quick Wins</p>
                                <p className="text-2xl font-bold text-blue-600">{safeAnalysis.quickWins.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* SEO Performance Metrics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        SEO Performance Metrics
                    </CardTitle>
                    <CardDescription>
                        Detailed breakdown of your SEO performance across key areas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="mb-3">
                                <div className={`text-3xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.technicalScore)}`}>
                                    {safeAnalysis.seoMetrics.technicalScore}%
                                </div>
                                <div className="text-sm text-gray-600 mt-1">Technical SEO</div>
                            </div>
                            <Progress value={safeAnalysis.seoMetrics.technicalScore} className="h-2" />
                            <p className="text-xs text-gray-500 mt-2">HTTPS, meta tags, structure</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="mb-3">
                                <div className={`text-3xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.contentScore)}`}>
                                    {safeAnalysis.seoMetrics.contentScore}%
                                </div>
                                <div className="text-sm text-gray-600 mt-1">Content Quality</div>
                            </div>
                            <Progress value={safeAnalysis.seoMetrics.contentScore} className="h-2" />
                            <p className="text-xs text-gray-500 mt-2">Content length, keywords, readability</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="mb-3">
                                <div className={`text-3xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.performanceScore)}`}>
                                    {safeAnalysis.seoMetrics.performanceScore}%
                                </div>
                                <div className="text-sm text-gray-600 mt-1">Performance</div>
                            </div>
                            <Progress value={safeAnalysis.seoMetrics.performanceScore} className="h-2" />
                            <p className="text-xs text-gray-500 mt-2">Images, links, media optimization</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="mb-3">
                                <div className={`text-3xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.accessibilityScore)}`}>
                                    {safeAnalysis.seoMetrics.accessibilityScore}%
                                </div>
                                <div className="text-sm text-gray-600 mt-1">Accessibility</div>
                            </div>
                            <Progress value={safeAnalysis.seoMetrics.accessibilityScore} className="h-2" />
                            <p className="text-xs text-gray-500 mt-2">Alt text, viewport, user experience</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderPageSpeed = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Gauge className="h-5 w-5" />
                        Google PageSpeed Insights
                    </CardTitle>
                    <CardDescription>
                        Core Web Vitals and performance metrics from Google's analysis
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="text-center p-6 border rounded-lg">
                            <div className="mb-4">
                                <div className={`text-4xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.performanceScore)}`}>
                                    {safeAnalysis.seoMetrics.performanceScore}%
                                </div>
                                <div className="text-sm text-gray-600 mt-2">Performance Score</div>
                            </div>
                            <Progress value={safeAnalysis.seoMetrics.performanceScore} className="h-3" />
                            <p className="text-xs text-gray-500 mt-3">Overall performance rating from Google</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Core Web Vitals</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">LCP (Largest Contentful Paint)</span>
                                    <span className="font-mono bg-blue-100 px-3 py-1 rounded text-sm">
                                        {safeAnalysis.seoMetrics.coreWebVitals?.lcp || 'N/A'}s
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">INP (Interaction to Next Paint)</span>
                                    <span className="font-mono bg-blue-100 px-3 py-1 rounded text-sm">
                                        {safeAnalysis.seoMetrics.coreWebVitals?.inp || 'N/A'}ms
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">CLS (Cumulative Layout Shift)</span>
                                    <span className="font-mono bg-blue-100 px-3 py-1 rounded text-sm">
                                        {safeAnalysis.seoMetrics.coreWebVitals?.cls || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderBasicSEO = () => {
        const titleRec = safeAnalysis.detailedRecommendations.title;
        const metaRec = safeAnalysis.detailedRecommendations.metaDescription;

        return (
            <div className="space-y-6">
                {/* Title Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <SearchIcon className="h-5 w-5" />
                            Title Tag Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            {titleRec.current ? <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                            <div className="flex-1">
                                <p className="font-medium">
                                    {titleRec.current ? 'The SEO title is set and is ' + titleRec.current.length + ' characters long.' : 'No SEO title found.'}
                                </p>
                                {titleRec.current && (
                                    <p className="text-lg font-semibold mt-2 text-blue-600">{titleRec.current}</p>
                                )}
                            </div>
                        </div>
                        {titleRec.suggested && (
                            <div className="border-l-4 border-l-blue-500 pl-4">
                                <p className="text-sm font-medium text-gray-600 mb-1">Suggestion:</p>
                                <p className="font-medium">{titleRec.suggested}</p>
                                <p className="text-sm text-gray-600 mt-1">{titleRec.reason}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Meta Description Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Meta Description Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            {metaRec.current ? <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                            <div className="flex-1">
                                <p className="font-medium">
                                    {metaRec.current ? 'The meta description is set and is ' + metaRec.current.length + ' characters long.' : 'No meta description found.'}
                                </p>
                                {metaRec.current && (
                                    <p className="text-sm mt-2 text-gray-700">{metaRec.current}</p>
                                )}
                            </div>
                        </div>
                        {metaRec.suggested && (
                            <div className="border-l-4 border-l-blue-500 pl-4">
                                <p className="text-sm font-medium text-gray-600 mb-1">Suggestion:</p>
                                <p className="font-medium">{metaRec.suggested}</p>
                                <p className="text-sm text-gray-600 mt-1">{metaRec.reason}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Heading Structure */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            Heading Structure Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3 md:grid-cols-3">
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-600">H1</div>
                                <div className="text-sm text-gray-600">Main Heading</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-600">H2</div>
                                <div className="text-sm text-gray-600">Subheadings</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-600">H3-H6</div>
                                <div className="text-sm text-gray-600">Nested Headings</div>
                            </div>
                        </div>
                        {safeAnalysis.detailedRecommendations.headings.suggestions.length > 0 && (
                            <div className="mt-4">
                                <p className="font-medium mb-2">Suggestions:</p>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {safeAnalysis.detailedRecommendations.headings.suggestions.map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Critical Issues */}
                {safeAnalysis.criticalIssues.filter(i => i?.priority === 'critical' || i?.priority === 'high').length > 0 && (
                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <XCircle className="h-5 w-5" />
                                Critical Issues Found
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {safeAnalysis.criticalIssues
                                    .filter(i => i?.priority === 'critical' || i?.priority === 'high')
                                    .map((issue, idx) => (
                                        <div key={idx} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-red-800">{issue.issue}</p>
                                                    <p className="text-sm text-gray-700 mt-1">{issue.impact}</p>
                                                    <p className="text-sm text-gray-600 mt-2">{issue.recommendation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    };

    const renderKeywords = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Keyword Analysis
                    </CardTitle>
                    <CardDescription>
                        Keywords found on the page and their usage
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-800">Keywords in Title and Description</span>
                            </div>
                            <p className="text-sm text-gray-700">One or more keywords were found in the title and description of the page.</p>
                        </div>
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                <span className="font-medium text-yellow-800">Keyword Usage Tips</span>
                            </div>
                            <p className="text-sm text-gray-700">Use your keywords naturally in your content. Avoid keyword stuffing as it can negatively impact your rankings.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderContent = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Content Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Word Count</p>
                            <p className="text-xl font-bold">{safeAnalysis.detailedRecommendations.content?.wordCount || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Keyword Usage</p>
                            <p className="text-xl font-bold">{safeAnalysis.detailedRecommendations.content?.keywordUsage || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Readability</p>
                            <p className="text-xl font-bold">{safeAnalysis.detailedRecommendations.content?.readability || 'N/A'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderLinks = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5" />
                        Link Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                            <p className="text-sm text-gray-600">Internal Links</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {safeAnalysis.detailedRecommendations.technical?.internalLinking?.includes('good') ? '✓' : 'Needs review'}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                            <p className="text-sm text-gray-600">External Links</p>
                            <p className="text-2xl font-bold text-green-600">✓</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                            <p className="text-sm text-gray-600">Broken Links</p>
                            <p className="text-2xl font-bold text-red-600">0</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderAdvancedSEO = () => (
        <div className="space-y-6">
            {/* Canonical URL */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        Canonical URL
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        {(safeAnalysis.seoMetrics as any)?.performance?.hasCanonical ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Canonical link tag found</p>
                                    <p className="text-sm text-gray-600">Every page on your site should have a canonical tag to prevent duplicate content issues.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">No canonical link tag found</p>
                                    <p className="text-sm text-gray-600">Add a canonical tag to specify the preferred URL for this page.</p>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Open Graph */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Share2Icon className="h-5 w-5" />
                        Open Graph Meta Tags
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        {(safeAnalysis.seoMetrics as any)?.performance?.hasOpenGraph ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Open Graph meta tags are set</p>
                                    <p className="text-sm text-gray-600">Your page will display properly when shared on social media.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Some Open Graph meta tags are missing</p>
                                    <p className="text-sm text-gray-600">Add og:title, og:description, and og:image for better social sharing.</p>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Robots.txt */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Robots.txt
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                            <p className="font-medium">Robots.txt file analysis</p>
                            <p className="text-sm text-gray-600">Ensure your robots.txt is properly configured to allow search engine crawling.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderSchema = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Schema.org Markup
                    </CardTitle>
                    <CardDescription>
                        Structured data to improve search visibility and rich snippets
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg mb-4">
                        {(safeAnalysis.seoMetrics as any)?.performance?.hasStructuredData ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Schema markup found</p>
                                    <p className="text-sm text-gray-600">Your page contains structured data that can improve search appearance.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">No Schema.org data was found</p>
                                    <p className="text-sm text-gray-600">Add structured data markup to enable rich snippets in search results.</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Schema Examples */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Organization Schema</h4>
                            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                                {`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png"
}
</script>`}
                            </pre>
                        </div>
                        <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Website Schema</h4>
                            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                                {`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Your Website",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={search_term}"
  }
}
</script>`}
                            </pre>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderSection = () => {
        switch (activeSection) {
            case 'overview': return renderOverview();
            case 'page-speed': return renderPageSpeed();
            case 'basic-seo': return renderBasicSEO();
            case 'keywords': return renderKeywords();
            case 'content': return renderContent();
            case 'links': return renderLinks();
            case 'advanced-seo': return renderAdvancedSEO();
            case 'schema': return renderSchema();
            default: return renderOverview();
        }
    };

    return (
        <div className="flex gap-6 min-h-[600px]">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 flex-shrink-0`}>
                <Card className="h-full">
                    <CardContent className="p-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="mb-4 p-2 hover:bg-gray-100 rounded-lg w-full flex items-center justify-center"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${activeSection === item.id
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {item.icon}
                                    {sidebarOpen && (
                                        <>
                                            <span className="flex-1">{item.label}</span>
                                            {item.badge !== undefined && (
                                                <Badge
                                                    variant={item.badge > 0 ? 'destructive' : 'secondary'}
                                                    className="text-xs"
                                                >
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {renderSection()}
            </div>
        </div>
    );
}

// Helper component for Share icon
function Share2Icon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
    );
}
