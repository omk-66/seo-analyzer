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
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Zap,
    Star,
    FileText,
    Globe,
    Gauge,
    Code,
    Search,
    AlertCircle,
    LayoutDashboard,
    BarChart3,
    Link2,
    Server,
    Settings,
    Menu,
    Smartphone,
    Monitor,
    Eye,
    TrendingUp,
    Shield,
    Clock,
    RefreshCw,
    ArrowUpRight,
    BookOpen,
    ChevronRight,
    ChevronLeft,
    Filter,
    List,
    Grid
} from 'lucide-react';

interface SEOAnalysisTabbedProps {
    analysis: SEOAnalysis;
    url: string;
}

type SectionType =
    | 'overview'
    | 'page-speed'
    | 'critical-issues'
    | 'warnings'
    | 'passed-checks'
    | 'quick-wins'
    | 'basic-seo'
    | 'keywords'
    | 'content'
    | 'links'
    | 'advanced-seo'
    | 'schema';

interface NavItem {
    id: SectionType;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: 'red' | 'yellow' | 'green' | 'blue';
}

export function SEOAnalysisTabbed({ analysis, url }: SEOAnalysisTabbedProps) {
    const [activeSection, setActiveSection] = useState<SectionType>('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    // Handle mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
    const passedCount = safeAnalysis.strengths.length;
    const quickWinsCount = safeAnalysis.quickWins.length;

    const navItems: NavItem[] = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'page-speed', label: 'PageSpeed', icon: <Gauge className="w-5 h-5" /> },
        { id: 'critical-issues', label: 'Critical Issues', icon: <XCircle className="w-5 h-5" />, badge: criticalCount, badgeColor: 'red' },
        { id: 'warnings', label: 'Warnings', icon: <AlertTriangle className="w-5 h-5" />, badge: warningCount, badgeColor: 'yellow' },
        { id: 'passed-checks', label: 'Passed Checks', icon: <CheckCircle2 className="w-5 h-5" />, badge: passedCount, badgeColor: 'green' },
        { id: 'quick-wins', label: 'Quick Wins', icon: <Zap className="w-5 h-5" />, badge: quickWinsCount, badgeColor: 'blue' },
        { id: 'basic-seo', label: 'Basic SEO', icon: <Search className="w-5 h-5" /> },
        { id: 'keywords', label: 'Keywords', icon: <Target className="w-5 h-5" /> },
        { id: 'content', label: 'Content', icon: <FileText className="w-5 h-5" /> },
        { id: 'links', label: 'Links', icon: <Link2 className="w-5 h-5" /> },
        { id: 'advanced-seo', label: 'Advanced SEO', icon: <Server className="w-5 h-5" /> },
        { id: 'schema', label: 'Schema', icon: <Code className="w-5 h-5" /> },
    ];

    const handleSectionChange = (section: SectionType) => {
        setActiveSection(section);
        if (isMobile) {
            setMobileMenuOpen(false);
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

    const getBadgeVariant = (color?: string) => {
        switch (color) {
            case 'red': return 'destructive';
            case 'yellow': return 'default';
            case 'green': return 'default';
            case 'blue': return 'secondary';
            default: return 'secondary';
        }
    };

    const getBadgeStyle = (color?: string) => {
        switch (color) {
            case 'red': return 'bg-red-100 text-red-700';
            case 'yellow': return 'bg-yellow-100 text-yellow-700';
            case 'green': return 'bg-green-100 text-green-700';
            case 'blue': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Render functions for each section
    const renderOverview = () => (
        <div className="space-y-6 animate-fadeIn">
            {/* Overall Score Card */}
            <Card className={`${getScoreBgColor(safeAnalysis.overallScore)} border-2 transition-all duration-300`}>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                                <Target className="h-5 w-5 md:h-6 md:w-6" />
                                SEO Analysis for {safeAnalysis.url}
                            </CardTitle>
                            <CardDescription className="text-sm md:text-base">
                                Comprehensive audit powered by Google AI • {safeAnalysis.siteType}
                            </CardDescription>
                        </div>
                        <div className="text-center md:text-right">
                            <div className={`text-4xl md:text-5xl font-bold ${getScoreColor(safeAnalysis.overallScore)} transition-all duration-500`}>
                                {safeAnalysis.overallScore}/100
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 md:gap-3">
                            <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
                            <div>
                                <p className="text-xs md:text-sm text-gray-600">Critical</p>
                                <p className="text-xl md:text-2xl font-bold text-red-600">{criticalCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 md:gap-3">
                            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
                            <div>
                                <p className="text-xs md:text-sm text-gray-600">Warnings</p>
                                <p className="text-xl md:text-2xl font-bold text-yellow-600">{warningCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 md:gap-3">
                            <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
                            <div>
                                <p className="text-xs md:text-sm text-gray-600">Passed</p>
                                <p className="text-xl md:text-2xl font-bold text-green-600">{passedCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 md:gap-3">
                            <Zap className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
                            <div>
                                <p className="text-xs md:text-sm text-gray-600">Quick Wins</p>
                                <p className="text-xl md:text-2xl font-bold text-blue-600">{quickWinsCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* SEO Performance Metrics */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <BarChart3 className="h-5 w-5" />
                        SEO Performance Metrics
                    </CardTitle>
                    <CardDescription>
                        Detailed breakdown of your SEO performance across key areas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { label: 'Technical SEO', score: safeAnalysis.seoMetrics.technicalScore, desc: 'HTTPS, meta tags, structure' },
                            { label: 'Content Quality', score: safeAnalysis.seoMetrics.contentScore, desc: 'Content length, keywords, readability' },
                            { label: 'Performance', score: safeAnalysis.seoMetrics.performanceScore, desc: 'Images, links, media' },
                            { label: 'Accessibility', score: safeAnalysis.seoMetrics.accessibilityScore, desc: 'Alt text, viewport, UX' },
                        ].map((metric, idx) => (
                            <div key={idx} className="text-center p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="mb-2 md:mb-3">
                                    <div className={`text-2xl md:text-3xl font-bold ${getScoreColor(metric.score)}`}>
                                        {metric.score}%
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">{metric.label}</div>
                                </div>
                                <Progress value={metric.score} className="h-2" />
                                <p className="text-xs text-gray-500 mt-2">{metric.desc}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Extended Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {[
                    { icon: Shield, label: 'Security', score: safeAnalysis.seoMetrics.securityScore || 0, color: 'text-green-600' },
                    { icon: Smartphone, label: 'Mobile', score: safeAnalysis.seoMetrics.mobileSpeedScore || 0, color: 'text-blue-600' },
                    { icon: BookOpen, label: 'Readability', score: safeAnalysis.seoMetrics.readabilityScore || 0, color: 'text-purple-600' },
                    { icon: FileText, label: 'Words', score: safeAnalysis.seoMetrics.wordCount || 0, color: 'text-gray-600', isCount: true },
                ].map((metric, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-3 md:p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                                <span className="text-xs md:text-sm text-gray-600">{metric.label}</span>
                            </div>
                            <p className={`text-xl md:text-2xl font-bold ${metric.isCount ? 'text-gray-800' : getScoreColor(metric.score)}`}>
                                {metric.isCount ? metric.score : `${metric.score}%`}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderCriticalIssues = () => {
        const criticalIssues = safeAnalysis.criticalIssues.filter(i => i?.priority === 'critical' || i?.priority === 'high');

        return (
            <div className="space-y-6 animate-fadeIn">
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <XCircle className="h-5 w-5" />
                            Critical Issues ({criticalIssues.length})
                        </CardTitle>
                        <CardDescription>
                            These issues require immediate attention to improve your SEO performance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {criticalIssues.length > 0 ? (
                            <div className="space-y-4">
                                {criticalIssues.map((issue, idx) => (
                                    <div key={idx} className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <Badge variant="destructive" className="text-xs">{issue.priority}</Badge>
                                                    <Badge variant="outline" className="text-xs">{issue.category}</Badge>
                                                </div>
                                                <p className="font-medium text-red-800">{issue.issue}</p>
                                                <p className="text-sm text-gray-700 mt-1">{issue.impact}</p>
                                                <div className="mt-3 p-2 bg-white rounded border border-red-100">
                                                    <p className="text-xs text-gray-500 mb-1">Evidence:</p>
                                                    <p className="text-sm text-gray-700">{issue.evidence}</p>
                                                </div>
                                                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
                                                    <p className="text-xs text-blue-600 mb-1">Recommendation:</p>
                                                    <p className="text-sm text-gray-700">{issue.recommendation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <p className="text-green-700 font-medium">No critical issues found!</p>
                                <p className="text-sm text-gray-600">Your website doesn't have any critical SEO issues.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderWarnings = () => {
        const warnings = safeAnalysis.criticalIssues.filter(i => i?.priority === 'medium' || i?.priority === 'low');

        return (
            <div className="space-y-6 animate-fadeIn">
                <Card className="border-yellow-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-600">
                            <AlertTriangle className="h-5 w-5" />
                            Warnings ({warnings.length})
                        </CardTitle>
                        <CardDescription>
                            These issues should be addressed to improve your SEO performance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {warnings.length > 0 ? (
                            <div className="space-y-4">
                                {warnings.map((issue, idx) => (
                                    <div key={idx} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <Badge className="bg-yellow-100 text-yellow-700 text-xs">{issue.priority}</Badge>
                                                    <Badge variant="outline" className="text-xs">{issue.category}</Badge>
                                                </div>
                                                <p className="font-medium text-yellow-800">{issue.issue}</p>
                                                <p className="text-sm text-gray-700 mt-1">{issue.impact}</p>
                                                <p className="text-sm text-blue-600 mt-2">{issue.recommendation}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <p className="text-green-700 font-medium">No warnings!</p>
                                <p className="text-sm text-gray-600">Your website has no warnings to address.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderPassedChecks = () => (
        <div className="space-y-6 animate-fadeIn">
            <Card className="border-green-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        Passed Checks ({safeAnalysis.strengths.length})
                    </CardTitle>
                    <CardDescription>
                        These are the positive aspects of your website's SEO
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {safeAnalysis.strengths.length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2">
                            {safeAnalysis.strengths.map((strength, idx) => (
                                <div key={idx} className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-medium text-green-800">{strength.area}</p>
                                            <p className="text-sm text-gray-700 mt-1">{strength.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium">No passed checks yet</p>
                            <p className="text-sm text-gray-500">Fix critical issues and warnings to see passed checks.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );

    const renderQuickWins = () => (
        <div className="space-y-6 animate-fadeIn">
            <Card className="border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                        <Zap className="h-5 w-5" />
                        Quick Wins ({safeAnalysis.quickWins.length})
                    </CardTitle>
                    <CardDescription>
                        Easy improvements that can boost your SEO performance quickly
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {safeAnalysis.quickWins.length > 0 ? (
                        <div className="space-y-4">
                            {safeAnalysis.quickWins.map((win, idx) => (
                                <div key={idx} className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <Zap className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="font-medium text-blue-800">{win.improvement}</p>
                                            <p className="text-sm text-gray-700 mt-1">{win.impact}</p>
                                            <Badge
                                                variant="outline"
                                                className={`mt-2 text-xs ${win.effort === 'low' ? 'border-green-300 text-green-700' :
                                                    win.effort === 'medium' ? 'border-yellow-300 text-yellow-700' :
                                                        'border-red-300 text-red-700'
                                                    }`}
                                            >
                                                {win.effort} effort
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium">No quick wins available</p>
                            <p className="text-sm text-gray-500">Check back after fixing some issues.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );

    const renderPageSpeed = () => {
        const metrics = safeAnalysis.seoMetrics;
        const coreWebVitals = metrics.coreWebVitals;
        const pageSpeed = metrics.pageSpeed;

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
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Performance Score */}
                            <div className="text-center p-4 border rounded-lg">
                                <div className="mb-4">
                                    <div className={`text-4xl font-bold ${getScoreColor(metrics.performanceScore)}`}>
                                        {metrics.performanceScore}%
                                    </div>
                                    <div className="text-sm text-gray-600 mt-2">Performance Score</div>
                                </div>
                                <Progress value={metrics.performanceScore} className="h-3" />
                            </div>

                            {/* Core Web Vitals */}
                            <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Core Web Vitals
                                </h4>
                                {[
                                    { label: 'LCP', value: coreWebVitals?.lcp, unit: 's', threshold: 2.5, good: (coreWebVitals?.lcp || 0) <= 2.5 },
                                    { label: 'INP', value: coreWebVitals?.inp, unit: 'ms', threshold: 200, good: (coreWebVitals?.inp || 0) <= 200 },
                                    { label: 'CLS', value: coreWebVitals?.cls, unit: '', threshold: 0.1, good: (coreWebVitals?.cls || 0) <= 0.1 },
                                ].map((vital, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium">{vital.label}</span>
                                        <span className={`font-mono px-3 py-1 rounded text-sm ${vital.good ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {vital.value?.toFixed(1) || 'N/A'}{vital.unit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Metrics */}
                        {pageSpeed && (
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { label: 'FCP', value: pageSpeed.firstContentfulPaint },
                                    { label: 'LCP', value: pageSpeed.largestContentfulPaint },
                                    { label: 'TTI', value: pageSpeed.timeToInteractive },
                                    { label: 'TBT', value: pageSpeed.totalBlockingTime, suffix: 'ms' },
                                ].map((metric, idx) => (
                                    <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-lg font-bold text-blue-600">
                                            {metric.value?.toFixed(1) || 'N/A'}{metric.suffix || 's'}
                                        </div>
                                        <div className="text-xs text-gray-600">{metric.label}</div>
                                    </div>
                                ))}
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
                                        <p className="font-medium text-green-700">Mobile Friendly</p>
                                        <p className="text-sm text-gray-600">Your page is optimized for mobile devices</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-6 h-6 text-red-600" />
                                    <div>
                                        <p className="font-medium text-red-700">Not Mobile Friendly</p>
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
                                            {titleRec.current.length < 50 ? 'Title is too short' :
                                                titleRec.current.length > 60 ? 'Title may be truncated' : 'Optimal length'}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-red-700">No SEO title found</p>
                                    </div>
                                </>
                            )}
                        </div>
                        {titleRec.suggested && (
                            <div className="border-l-4 border-l-blue-500 pl-4">
                                <p className="text-sm font-medium text-gray-600 mb-1">💡 Suggestion:</p>
                                <p className="font-medium">{titleRec.suggested}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Meta Description */}
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
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-red-700">No meta description found</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Headings */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            Heading Structure
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {[
                                { label: 'H1', count: safeAnalysis.seoMetrics.contentDepthScore ? 1 : 0, color: 'bg-blue-100 text-blue-700' },
                                { label: 'H2', count: 3, color: 'bg-green-100 text-green-700' },
                                { label: 'H3+', count: 5, color: 'bg-purple-100 text-purple-700' },
                            ].map((h, idx) => (
                                <div key={idx} className="p-3 text-center rounded-lg bg-gray-50">
                                    <div className="text-xl font-bold text-gray-700">{h.count}</div>
                                    <div className="text-xs text-gray-500">{h.label} Tags</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
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
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Primary Keywords
                            </h4>
                            {keywords?.primaryKeywords && keywords.primaryKeywords.length > 0 ? (
                                <div className="space-y-2">
                                    {keywords.primaryKeywords.map((kw, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{kw.keyword}</p>
                                                <p className="text-xs text-gray-500">{kw.count} times, Density: {kw.density}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                {kw.placement.map((p, i) => (
                                                    <Badge key={i} variant="outline" className="text-xs">{p}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No primary keywords identified yet.</p>
                            )}
                        </div>

                        {/* Secondary Keywords */}
                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <ChevronRight className="h-5 w-5 text-blue-500" />
                                Secondary Keywords
                            </h4>
                            {keywords?.secondaryKeywords && keywords.secondaryKeywords.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {keywords.secondaryKeywords.map((kw, idx) => (
                                        <Badge key={idx} variant="outline" className="px-3 py-1">{kw.keyword}</Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No secondary keywords identified yet.</p>
                            )}
                        </div>

                        {/* Missing Keywords */}
                        {keywords?.missingKeywords && keywords.missingKeywords.length > 0 && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <h4 className="font-medium text-yellow-800 mb-2">📋 Consider Adding:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {keywords.missingKeywords.map((kw, idx) => (
                                        <Badge key={idx} variant="outline" className="border-yellow-300 text-yellow-700">{kw}</Badge>
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
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <div className="text-2xl md:text-3xl font-bold text-blue-600">{safeAnalysis.seoMetrics.wordCount || 0}</div>
                                <div className="text-sm text-gray-600">Words</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <div className="text-2xl md:text-3xl font-bold text-green-600">{safeAnalysis.seoMetrics.readabilityScore || 0}%</div>
                                <div className="text-sm text-gray-600">Readability</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <div className="text-2xl md:text-3xl font-bold text-purple-600">{safeAnalysis.seoMetrics.contentDepthScore || 0}%</div>
                                <div className="text-sm text-gray-600">Depth Score</div>
                            </div>
                        </div>

                        {/* Content Assessment */}
                        <div className="space-y-3">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-2">Word Count</h4>
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
                        </div>
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
                            Internal and external link analysis
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Link Statistics */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-600">{safeAnalysis.seoMetrics.internalLinkingScore || 0}%</div>
                                <div className="text-sm text-gray-600">Internal Links</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg text-center">
                                <div className="text-2xl font-bold text-green-600">{safeAnalysis.seoMetrics.externalLinkingScore || 0}%</div>
                                <div className="text-sm text-gray-600">External Links</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg text-center">
                                <div className="text-2xl font-bold text-purple-600">{safeAnalysis.seoMetrics.orphanedPagesCount || 0}</div>
                                <div className="text-sm text-gray-600">Orphaned Pages</div>
                            </div>
                        </div>

                        {/* Link Equity */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">Link Equity Distribution</h4>
                            <p className="text-gray-700">{links?.linkEquity || 'Review your internal linking structure.'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderAdvancedSEO = () => (
        <div className="space-y-6 animate-fadeIn">
            {/* SSL */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security (SSL)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        {safeAnalysis.seoMetrics.sslStatus === 'valid' ? (
                            <>
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                                <div>
                                    <p className="font-medium text-green-700">SSL Certificate Valid</p>
                                    <p className="text-sm text-gray-600">Your site is using HTTPS</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-6 h-6 text-red-600" />
                                <div>
                                    <p className="font-medium text-red-700">SSL Issue</p>
                                    <p className="text-sm text-gray-600">Install SSL certificate</p>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Canonical & Open Graph */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        Advanced SEO
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Canonical URL</span>
                        {safeAnalysis.seoMetrics && (safeAnalysis.seoMetrics as any)?.performance?.hasCanonical ? (
                            <Badge className="bg-green-100 text-green-700">Found</Badge>
                        ) : (
                            <Badge variant="destructive">Missing</Badge>
                        )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Open Graph Tags</span>
                        {safeAnalysis.seoMetrics && (safeAnalysis.seoMetrics as any)?.performance?.hasOpenGraph ? (
                            <Badge className="bg-green-100 text-green-700">Found</Badge>
                        ) : (
                            <Badge variant="destructive">Missing</Badge>
                        )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Structured Data</span>
                        {safeAnalysis.seoMetrics.schemaTypes && safeAnalysis.seoMetrics.schemaTypes.length > 0 ? (
                            <Badge className="bg-green-100 text-green-700">{safeAnalysis.seoMetrics.schemaTypes.length} types</Badge>
                        ) : (
                            <Badge variant="destructive">Missing</Badge>
                        )}
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
                        Structured data for rich snippets
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg mb-4">
                        {safeAnalysis.seoMetrics.schemaTypes && safeAnalysis.seoMetrics.schemaTypes.length > 0 ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-green-700">Schema found ({safeAnalysis.seoMetrics.schemaTypes.length} types)</p>
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
                                    <p className="font-medium text-yellow-700">No Schema.org data found</p>
                                    <p className="text-sm text-gray-600">Add structured data for rich snippets</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Schema Examples */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Organization Schema</h4>
                            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                                {`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company"
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
  "name": "Your Website"
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
            case 'critical-issues': return renderCriticalIssues();
            case 'warnings': return renderWarnings();
            case 'passed-checks': return renderPassedChecks();
            case 'quick-wins': return renderQuickWins();
            case 'basic-seo': return renderBasicSEO();
            case 'keywords': return renderKeywords();
            case 'content': return renderContent();
            case 'links': return renderLinks();
            case 'advanced-seo': return renderAdvancedSEO();
            case 'schema': return renderSchema();
            default: return renderOverview();
        }
    };

    // Mobile sidebar content
    const SidebarContent = () => (
        <Card className="h-full">
            <CardContent className="p-3 md:p-4">
                {/* Mobile header */}
                <div className="flex items-center justify-between mb-3 md:mb-4">
                    <span className="font-semibold text-sm md:text-base">SEO Audit</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                            className="p-1.5 hover:bg-gray-100 rounded-lg"
                            title="Toggle view"
                        >
                            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <nav className={viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-1'}>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleSectionChange(item.id)}
                            className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-all duration-200 ${activeSection === item.id
                                ? 'bg-primary text-white'
                                : 'hover:bg-gray-100 text-gray-700'
                                } ${viewMode === 'grid' ? 'justify-center' : ''}`}
                        >
                            {item.icon}
                            {sidebarOpen && (
                                <>
                                    <span className="flex-1 text-xs md:text-sm truncate">{item.label}</span>
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <Badge
                                            className={`text-xs ${getBadgeStyle(item.badgeColor)}`}
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
    );

    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 min-h-[500px]">
            {/* Mobile Menu Button */}
            {isMobile && (
                <div className="md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow"
                    >
                        <span className="font-medium">SEO Audit Menu</span>
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Sidebar - Desktop & Mobile */}
            <div className={`
                ${isMobile ? (mobileMenuOpen ? 'block' : 'hidden') : 'block'} 
                ${sidebarOpen ? 'w-full md:w-64' : 'w-16'} 
                shrink-0 transition-all duration-300
                ${!isMobile ? 'sticky top-4 h-fit' : ''}
            `}>
                <SidebarContent />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {renderSection()}
            </div>
        </div>
    );
}
