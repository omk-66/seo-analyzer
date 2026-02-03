"use client";

import { useState, useEffect } from 'react';
import {
    SEOAnalysis,
    CriticalIssue,
    Strength,
    QuickWin,
    DetailedRecommendations,
    ExtendedSEOMetrics
} from '@/lib/ai-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Target,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Zap,
    Star,
    FileText,
    Globe,
    Gauge,
    Code,
    ImageIcon,
    Search,
    AlertCircle,
    ExternalLink,
    LayoutDashboard,
    BarChart3,
    Link2,
    Server,
    Settings,
    Menu,
    ChevronRight,
    RefreshCw,
    Shield,
    Smartphone,
    Eye,
    Clock,
    ArrowUpRight,
    BookOpen
} from 'lucide-react';

interface SEOAnalysisTabbedProps {
    analysis: SEOAnalysis;
    url: string;
}

type SectionType = 'overview' | 'page-speed' | 'basic-seo' | 'keywords' | 'content' | 'links' | 'advanced-seo' | 'schema';

interface NavItem {
    id: SectionType;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}

export function SEOAnalysisTabbed({ analysis, url }: SEOAnalysisTabbedProps) {
    const [activeSection, setActiveSection] = useState<SectionType>('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [animating, setAnimating] = useState(false);

    // Handle case where analysis might be in old format or incomplete
    const safeAnalysis: SEOAnalysis = {
        overallScore: analysis.overallScore || 0,
        siteType: analysis.siteType || 'unknown',
        url: analysis.url || url,
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
        seoMetrics: (analysis.seoMetrics as ExtendedSEOMetrics) || {
            technicalScore: 0,
            contentScore: 0,
            performanceScore: 0,
            accessibilityScore: 0,
            sslStatus: 'missing',
            wordCount: 0,
            readabilityScore: 0,
            topKeywords: [],
            schemaTypes: []
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
        { id: 'basic-seo', label: 'Basic SEO', icon: <Search className="w-5 h-5" />, badge: criticalCount > 0 ? criticalCount : undefined },
        { id: 'keywords', label: 'Keywords', icon: <Target className="w-5 h-5" /> },
        { id: 'content', label: 'Content Analysis', icon: <FileText className="w-5 h-5" /> },
        { id: 'links', label: 'Links', icon: <Link2 className="w-5 h-5" /> },
        { id: 'advanced-seo', label: 'Advanced SEO', icon: <Server className="w-5 h-5" />, badge: warningCount > 0 ? warningCount : undefined },
        { id: 'schema', label: 'Schema Markup', icon: <Code className="w-5 h-5" /> },
    ];

    // Handle section change with animation
    const handleSectionChange = (section: SectionType) => {
        if (section !== activeSection) {
            setAnimating(true);
            setTimeout(() => {
                setActiveSection(section);
                setAnimating(false);
            }, 150);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        if (score >= 40) return 'text-orange-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-50 border-green-200';
        if (score >= 60) return 'bg-yellow-50 border-yellow-200';
        if (score >= 40) return 'bg-orange-50 border-orange-200';
        return 'bg-red-50 border-red-200';
    };

    const getScoreProgressColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        if (score >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getStatusBadge = (status: boolean | undefined, trueText: string, falseText: string) => {
        if (status) {
            return <Badge variant="default" className="bg-green-100 text-green-700">{trueText}</Badge>;
        }
        return <Badge variant="destructive">{falseText}</Badge>;
    };

    const renderOverview = () => (
        <div className="space-y-6 animate-fadeIn">
            {/* Overall Score Card */}
            <Card className={`${getScoreBgColor(safeAnalysis.overallScore)} border-2 transition-all duration-300`}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Target className="h-6 w-6" />
                                SEO Analysis for {safeAnalysis.url}
                            </CardTitle>
                            <CardDescription className="text-base">
                                Comprehensive audit powered by Google AI
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <div className={`text-5xl font-bold ${getScoreColor(safeAnalysis.overallScore)} transition-all duration-500`}>
                                {safeAnalysis.overallScore}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                                {safeAnalysis.overallScore >= 80 ? 'Excellent' : safeAnalysis.overallScore >= 60 ? 'Good' : safeAnalysis.overallScore >= 40 ? 'Needs Improvement' : 'Poor'}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Progress value={safeAnalysis.overallScore} className="h-3 transition-all duration-1000" />
                </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
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
                <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
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
                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
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
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
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
            <Card className="hover:shadow-lg transition-shadow">
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
                        <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="mb-3">
                                <div className={`text-3xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.technicalScore)}`}>
                                    {safeAnalysis.seoMetrics.technicalScore}%
                                </div>
                                <div className="text-sm text-gray-600 mt-1">Technical SEO</div>
                            </div>
                            <Progress value={safeAnalysis.seoMetrics.technicalScore} className="h-2" />
                            <p className="text-xs text-gray-500 mt-2">HTTPS, meta tags, structure</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="mb-3">
                                <div className={`text-3xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.contentScore)}`}>
                                    {safeAnalysis.seoMetrics.contentScore}%
                                </div>
                                <div className="text-sm text-gray-600 mt-1">Content Quality</div>
                            </div>
                            <Progress value={safeAnalysis.seoMetrics.contentScore} className="h-2" />
                            <p className="text-xs text-gray-500 mt-2">Content length, keywords, readability</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="mb-3">
                                <div className={`text-3xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.performanceScore)}`}>
                                    {safeAnalysis.seoMetrics.performanceScore}%
                                </div>
                                <div className="text-sm text-gray-600 mt-1">Performance</div>
                            </div>
                            <Progress value={safeAnalysis.seoMetrics.performanceScore} className="h-2" />
                            <p className="text-xs text-gray-500 mt-2">Images, links, media optimization</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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

            {/* Extended Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-600">Security Score</span>
                        </div>
                        <p className={`text-2xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.securityScore || 0)}`}>
                            {safeAnalysis.seoMetrics.securityScore || 0}%
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Smartphone className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-600">Mobile Score</span>
                        </div>
                        <p className={`text-2xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.mobileSpeedScore || 0)}`}>
                            {safeAnalysis.seoMetrics.mobileSpeedScore || 0}%
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-gray-600">Readability</span>
                        </div>
                        <p className={`text-2xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.readabilityScore || 0)}`}>
                            {safeAnalysis.seoMetrics.readabilityScore || 0}%
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Word Count</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">
                            {safeAnalysis.seoMetrics.wordCount || 0}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderPageSpeed = () => {
        const metrics = safeAnalysis.seoMetrics;
        const pageSpeed = metrics.pageSpeed;
        const coreWebVitals = metrics.coreWebVitals;

        return (
            <div className="space-y-6 animate-fadeIn">
                <Card className="hover:shadow-lg transition-shadow">
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
                            {/* Performance Scores */}
                            <div className="space-y-4">
                                <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="mb-4">
                                        <div className={`text-4xl font-bold ${getScoreColor(metrics.performanceScore)} transition-all duration-500`}>
                                            {metrics.performanceScore}%
                                        </div>
                                        <div className="text-sm text-gray-600 mt-2">Overall Performance Score</div>
                                    </div>
                                    <Progress value={metrics.performanceScore} className="h-3" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <div className="text-lg font-bold text-blue-600">{pageSpeed?.desktop || 'N/A'}</div>
                                        <div className="text-xs text-gray-600">Desktop Score</div>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-lg font-bold text-green-600">{pageSpeed?.mobile || 'N/A'}</div>
                                        <div className="text-xs text-gray-600">Mobile Score</div>
                                    </div>
                                </div>
                            </div>

                            {/* Core Web Vitals */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-lg flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Core Web Vitals
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">LCP</span>
                                            <span className="text-xs text-gray-500">(Largest Contentful Paint)</span>
                                        </div>
                                        <span className={`font-mono px-3 py-1 rounded text-sm ${(coreWebVitals?.lcp || 0) <= 2.5 ? 'bg-green-100 text-green-700' :
                                            (coreWebVitals?.lcp || 0) <= 4.0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {coreWebVitals?.lcp ? coreWebVitals.lcp.toFixed(1) + 's' : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">INP</span>
                                            <span className="text-xs text-gray-500">(Interaction to Next Paint)</span>
                                        </div>
                                        <span className={`font-mono px-3 py-1 rounded text-sm ${(coreWebVitals?.inp || 0) <= 200 ? 'bg-green-100 text-green-700' :
                                            (coreWebVitals?.inp || 0) <= 500 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {coreWebVitals?.inp ? coreWebVitals.inp + 'ms' : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">CLS</span>
                                            <span className="text-xs text-gray-500">(Cumulative Layout Shift)</span>
                                        </div>
                                        <span className={`font-mono px-3 py-1 rounded text-sm ${(coreWebVitals?.cls || 0) <= 0.1 ? 'bg-green-100 text-green-700' :
                                            (coreWebVitals?.cls || 0) <= 0.25 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {coreWebVitals?.cls ? coreWebVitals.cls.toFixed(3) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Metrics */}
                        {pageSpeed && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-lg mb-3">Additional Performance Metrics</h4>
                                <div className="grid gap-3 md:grid-cols-4">
                                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                                        <div className="text-lg font-bold text-blue-600">{pageSpeed.firstContentfulPaint?.toFixed(1) || 'N/A'}s</div>
                                        <div className="text-xs text-gray-600">FCP</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                                        <div className="text-lg font-bold text-blue-600">{pageSpeed.largestContentfulPaint?.toFixed(1) || 'N/A'}s</div>
                                        <div className="text-xs text-gray-600">LCP</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                                        <div className="text-lg font-bold text-blue-600">{pageSpeed.timeToInteractive?.toFixed(1) || 'N/A'}s</div>
                                        <div className="text-xs text-gray-600">TTI</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                                        <div className="text-lg font-bold text-blue-600">{pageSpeed.totalBlockingTime || 'N/A'}ms</div>
                                        <div className="text-xs text-gray-600">TBT</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Mobile Friendliness */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5" />
                            Mobile Friendliness
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            {metrics.mobileFriendliness ? (
                                <>
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    <div>
                                        <p className="font-medium">Mobile Friendly</p>
                                        <p className="text-sm text-gray-600">Your page is optimized for mobile devices</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-6 h-6 text-red-600" />
                                    <div>
                                        <p className="font-medium">Not Mobile Friendly</p>
                                        <p className="text-sm text-gray-600">Add viewport meta tag and ensure responsive design</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderBasicSEO = () => {
        const titleRec = safeAnalysis.detailedRecommendations.title;
        const metaRec = safeAnalysis.detailedRecommendations.metaDescription;

        return (
            <div className="space-y-6 animate-fadeIn">
                {/* Title Analysis */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Title Tag Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            {titleRec.current ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-medium text-green-700">
                                            The SEO title is set and is {titleRec.current.length} characters long.
                                        </p>
                                        <p className="text-lg font-semibold mt-2 text-blue-600">{titleRec.current}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {titleRec.current.length < 50 ? 'Title is too short (aim for 50-60 characters)' :
                                                titleRec.current.length > 60 ? 'Title may be truncated in search results' :
                                                    'Title length is optimal'}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-red-700">No SEO title found</p>
                                        <p className="text-sm text-gray-600">Add a title tag to improve search visibility</p>
                                    </div>
                                </>
                            )}
                        </div>
                        {titleRec.suggested && (
                            <div className="border-l-4 border-l-blue-500 pl-4">
                                <p className="text-sm font-medium text-gray-600 mb-1">💡 Suggestion:</p>
                                <p className="font-medium text-lg">{titleRec.suggested}</p>
                                <p className="text-sm text-gray-600 mt-1">{titleRec.reason}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Meta Description Analysis */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Meta Description Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            {metaRec.current ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-medium text-green-700">
                                            The meta description is set and is {metaRec.current.length} characters long.
                                        </p>
                                        <p className="text-sm mt-2 text-gray-700">{metaRec.current}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {metaRec.current.length < 120 ? 'Meta description is too short (aim for 150-160 characters)' :
                                                metaRec.current.length > 160 ? 'Meta description may be truncated' :
                                                    'Meta description length is optimal'}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-red-700">No meta description found</p>
                                        <p className="text-sm text-gray-600">Add a meta description to improve click-through rates</p>
                                    </div>
                                </>
                            )}
                        </div>
                        {metaRec.suggested && (
                            <div className="border-l-4 border-l-blue-500 pl-4">
                                <p className="text-sm font-medium text-gray-600 mb-1">💡 Suggestion:</p>
                                <p className="font-medium text-lg">{metaRec.suggested}</p>
                                <p className="text-sm text-gray-600 mt-1">{metaRec.reason}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Heading Structure */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            Heading Structure Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3 md:grid-cols-3">
                            <div className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
                                <div className="text-2xl font-bold text-blue-600">H1</div>
                                <div className="text-sm text-gray-600">Main Heading</div>
                                <div className="text-xs text-gray-500 mt-1">Should have exactly 1</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors">
                                <div className="text-2xl font-bold text-green-600">H2</div>
                                <div className="text-sm text-gray-600">Subheadings</div>
                                <div className="text-xs text-gray-500 mt-1">Section headers</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors">
                                <div className="text-2xl font-bold text-purple-600">H3-H6</div>
                                <div className="text-sm text-gray-600">Nested Headings</div>
                                <div className="text-xs text-gray-500 mt-1">Sub-sections</div>
                            </div>
                        </div>

                        {safeAnalysis.detailedRecommendations.headings.suggestions.length > 0 && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="font-medium text-yellow-800 mb-2">📋 Suggestions:</p>
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
                    <Card className="border-red-200 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <XCircle className="h-5 w-5" />
                                Critical Issues Found ({safeAnalysis.criticalIssues.filter(i => i?.priority === 'critical' || i?.priority === 'high').length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {safeAnalysis.criticalIssues
                                    .filter(i => i?.priority === 'critical' || i?.priority === 'high')
                                    .map((issue, idx) => (
                                        <div key={idx} className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-red-800">{issue.issue}</p>
                                                    <p className="text-sm text-gray-700 mt-1">{issue.impact}</p>
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        <span className="font-medium">Evidence:</span> {issue.evidence}
                                                    </p>
                                                    <p className="text-sm text-blue-600 mt-2">
                                                        <span className="font-medium">Recommendation:</span> {issue.recommendation}
                                                    </p>
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

    const renderKeywords = () => {
        const keywords = safeAnalysis.detailedRecommendations.keywords;

        return (
            <div className="space-y-6 animate-fadeIn">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Keyword Analysis
                        </CardTitle>
                        <CardDescription>
                            Keywords found on the page and their usage patterns
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Primary Keywords */}
                        <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Primary Keywords
                            </h4>
                            {keywords?.primaryKeywords && keywords.primaryKeywords.length > 0 ? (
                                <div className="space-y-2">
                                    {keywords.primaryKeywords.map((kw, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div>
                                                <p className="font-medium">{kw.keyword}</p>
                                                <p className="text-sm text-gray-500">Found {kw.count} times, Density: {kw.density}</p>
                                            </div>
                                            <Badge variant="secondary">{kw.placement.join(', ')}</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No primary keywords identified yet.</p>
                            )}
                        </div>

                        {/* Secondary Keywords */}
                        <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <ChevronRight className="h-5 w-5 text-blue-500" />
                                Secondary Keywords
                            </h4>
                            {keywords?.secondaryKeywords && keywords.secondaryKeywords.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {keywords.secondaryKeywords.map((kw, idx) => (
                                        <Badge key={idx} variant="outline" className="px-3 py-1">
                                            {kw.keyword} ({kw.count})
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No secondary keywords identified yet.</p>
                            )}
                        </div>

                        {/* Long-tail Keywords */}
                        <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <ArrowUpRight className="h-5 w-5 text-green-500" />
                                Long-tail Keywords
                            </h4>
                            {keywords?.longTailKeywords && keywords.longTailKeywords.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {keywords.longTailKeywords.map((kw, idx) => (
                                        <Badge key={idx} variant="secondary" className="px-3 py-1">
                                            {kw.keyword}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No long-tail keywords identified yet.</p>
                            )}
                        </div>

                        {/* Keyword Stuffing Warning */}
                        {keywords?.keywordStuffing && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-2 text-red-700 font-medium">
                                    <AlertTriangle className="h-5 w-5" />
                                    Warning: Possible Keyword Stuffing Detected
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    Your keyword density may be too high. Use more natural language and related terms.
                                </p>
                            </div>
                        )}

                        {/* Missing Keywords */}
                        {keywords?.missingKeywords && keywords.missingKeywords.length > 0 && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="font-medium text-yellow-800 mb-2">📋 Consider Adding These Keywords:</p>
                                <div className="flex flex-wrap gap-2">
                                    {keywords.missingKeywords.map((kw, idx) => (
                                        <Badge key={idx} variant="outline" className="px-3 py-1 border-yellow-300 text-yellow-700">
                                            {kw}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderContent = () => {
        const content = safeAnalysis.detailedRecommendations.content;

        return (
            <div className="space-y-6 animate-fadeIn">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Content Analysis
                        </CardTitle>
                        <CardDescription>
                            Detailed analysis of your content quality and structure
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Content Metrics */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                <div className="text-3xl font-bold text-blue-600">{safeAnalysis.seoMetrics.wordCount || 0}</div>
                                <div className="text-sm text-gray-600">Total Words</div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {safeAnalysis.seoMetrics.wordCount < 300 ? 'Consider adding more content' :
                                        safeAnalysis.seoMetrics.wordCount < 1000 ? 'Good content length' :
                                            'Excellent content depth'}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                <div className="text-3xl font-bold text-green-600">{safeAnalysis.seoMetrics.readabilityScore || 0}%</div>
                                <div className="text-sm text-gray-600">Readability Score</div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {safeAnalysis.seoMetrics.readabilityScore >= 60 ? 'Easy to read' :
                                        safeAnalysis.seoMetrics.readabilityScore >= 40 ? 'Moderate readability' :
                                            'Consider simplifying'}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                <div className="text-3xl font-bold text-purple-600">{safeAnalysis.seoMetrics.contentDepthScore || 0}%</div>
                                <div className="text-sm text-gray-600">Content Depth</div>
                                <p className="text-xs text-gray-500 mt-1">Content comprehensiveness</p>
                            </div>
                        </div>

                        {/* Content Assessment */}
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-2">Word Count Assessment</h4>
                                <p className="text-gray-700">{content.wordCount}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-2">Keyword Usage</h4>
                                <p className="text-gray-700">{content.keywordUsage}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-2">Readability</h4>
                                <p className="text-gray-700">{content.readability}</p>
                            </div>
                            {content.contentStructure && (
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-medium mb-2">Content Structure</h4>
                                    <p className="text-gray-700">{content.contentStructure}</p>
                                </div>
                            )}
                        </div>

                        {/* LSI Keywords */}
                        {content.LSIKeywords && content.LSIKeywords.length > 0 && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h4 className="font-medium text-green-800 mb-2">🔍 Related Keywords (LSI)</h4>
                                <div className="flex flex-wrap gap-2">
                                    {content.LSIKeywords.map((kw, idx) => (
                                        <Badge key={idx} variant="secondary" className="px-2 py-1">
                                            {kw}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Content Gaps */}
                        {content.contentGaps && content.contentGaps.length > 0 && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <h4 className="font-medium text-yellow-800 mb-2">📝 Content Gaps Identified</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {content.contentGaps.map((gap, idx) => (
                                        <li key={idx}>{gap}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderLinks = () => {
        const links = safeAnalysis.detailedRecommendations.links;

        return (
            <div className="space-y-6 animate-fadeIn">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Link2 className="h-5 w-5" />
                            Link Analysis
                        </CardTitle>
                        <CardDescription>
                            Internal and external link analysis for your page
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Link Statistics */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
                                <div className="text-3xl font-bold text-blue-600">
                                    {safeAnalysis.seoMetrics.internalLinkingScore || 0}%
                                </div>
                                <div className="text-sm text-gray-600">Internal Linking Score</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors">
                                <div className="text-3xl font-bold text-green-600">
                                    {safeAnalysis.seoMetrics.externalLinkingScore || 0}%
                                </div>
                                <div className="text-sm text-gray-600">External Linking Score</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors">
                                <div className="text-3xl font-bold text-purple-600">
                                    {safeAnalysis.seoMetrics.orphanedPagesCount || 0}
                                </div>
                                <div className="text-sm text-gray-600">Orphaned Pages</div>
                            </div>
                        </div>

                        {/* Link Equity */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">Link Equity Distribution</h4>
                            <p className="text-gray-700">{links?.linkEquity || 'Review your internal linking structure to ensure proper link equity distribution.'}</p>
                        </div>

                        {/* Internal Links */}
                        {links?.internalLinks && links.internalLinks.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-lg mb-3">Internal Links</h4>
                                <div className="space-y-2">
                                    {links.internalLinks.slice(0, 10).map((link, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <Link2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                <span className="text-sm truncate">{link.anchor}</span>
                                            </div>
                                            <span className="text-xs text-gray-500 truncate max-w-[200px]">{link.url}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* External Links */}
                        {links?.externalLinks && links.externalLinks.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-lg mb-3">External Links</h4>
                                <div className="space-y-2">
                                    {links.externalLinks.slice(0, 10).map((link, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <ExternalLink className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span className="text-sm truncate">{link.anchor}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {link.isNofollow && (
                                                    <Badge variant="outline" className="text-xs">nofollow</Badge>
                                                )}
                                                <span className="text-xs text-gray-500 truncate max-w-[150px]">external</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Broken Links */}
                        {links?.brokenLinks && links.brokenLinks.length > 0 && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <h4 className="font-medium text-red-800 mb-2">⚠️ Broken Links Found</h4>
                                <div className="space-y-2">
                                    {links.brokenLinks.map((link, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 bg-red-100 rounded">
                                            <span className="text-sm text-red-700 truncate">{link.url}</span>
                                            <Badge variant="destructive">{link.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Links Message */}
                        {(!links?.internalLinks?.length && !links?.externalLinks?.length) && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center gap-2 text-yellow-700 font-medium">
                                    <AlertTriangle className="h-5 w-5" />
                                    Limited Link Data
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    The analysis couldn't extract detailed link information. Ensure your content has proper internal and external links.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderAdvancedSEO = () => (
        <div className="space-y-6 animate-fadeIn">
            {/* Canonical URL */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        Canonical URL
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        {safeAnalysis.seoMetrics && (safeAnalysis.seoMetrics as any)?.performance?.hasCanonical ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-green-700">Canonical link tag found</p>
                                    <p className="text-sm text-gray-600">Every page on your site should have a canonical tag to prevent duplicate content issues.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-red-700">No canonical link tag found</p>
                                    <p className="text-sm text-gray-600">Add a canonical tag to specify the preferred URL for this page.</p>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Open Graph */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Share2Icon className="h-5 w-5" />
                        Open Graph Meta Tags
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        {safeAnalysis.seoMetrics && (safeAnalysis.seoMetrics as any)?.performance?.hasOpenGraph ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-green-700">Open Graph meta tags are set</p>
                                    <p className="text-sm text-gray-600">Your page will display properly when shared on social media.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-yellow-700">Some Open Graph meta tags are missing</p>
                                    <p className="text-sm text-gray-600">Add og:title, og:description, and og:image for better social sharing.</p>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* SSL Status */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        SSL/HTTPS Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        {safeAnalysis.seoMetrics.sslStatus === 'valid' ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-green-700">SSL Certificate is Valid</p>
                                    <p className="text-sm text-gray-600">Your site is using HTTPS which is important for security and SEO.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-red-700">SSL Certificate Issue</p>
                                    <p className="text-sm text-gray-600">
                                        {safeAnalysis.seoMetrics.sslStatus === 'missing'
                                            ? 'Your site is not using HTTPS. Install an SSL certificate.'
                                            : 'There is an issue with your SSL certificate.'}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Robots.txt */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Robots.txt & Sitemaps
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Robots.txt</span>
                            {getStatusBadge(true, 'Found', 'Missing')}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">XML Sitemap</span>
                            {getStatusBadge(true, 'Found', 'Missing')}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderSchema = () => (
        <div className="space-y-6 animate-fadeIn">
            <Card className="hover:shadow-lg transition-shadow">
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
                        {safeAnalysis.seoMetrics.schemaTypes && safeAnalysis.seoMetrics.schemaTypes.length > 0 ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-green-700">Schema markup found ({safeAnalysis.seoMetrics.schemaTypes.length} types)</p>
                                    <p className="text-sm text-gray-600">Your page contains structured data that can improve search appearance.</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {safeAnalysis.seoMetrics.schemaTypes.map((type, idx) => (
                                            <Badge key={idx} variant="secondary">{type}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-yellow-700">No Schema.org data was found</p>
                                    <p className="text-sm text-gray-600">Add structured data markup to enable rich snippets in search results.</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Structured Data Score */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Structured Data Score</span>
                            <span className={`font-bold ${getScoreColor(safeAnalysis.seoMetrics.structuredDataScore || 0)}`}>
                                {safeAnalysis.seoMetrics.structuredDataScore || 0}%
                            </span>
                        </div>
                        <Progress value={safeAnalysis.seoMetrics.structuredDataScore || 0} className="h-2" />
                    </div>

                    {/* Schema Examples */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
                            className="mb-4 p-2 hover:bg-gray-100 rounded-lg w-full flex items-center justify-center transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSectionChange(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${activeSection === item.id
                                        ? 'bg-primary text-white shadow-md'
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
            <div className={`flex-1 transition-opacity duration-150 ${animating ? 'opacity-50' : 'opacity-100'}`}>
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
