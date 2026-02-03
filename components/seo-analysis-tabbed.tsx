"use client";

import { useState } from 'react';
import { SEOAnalysis, CriticalIssue, Strength, QuickWin, SEOMetrics, DetailedRecommendations } from '@/lib/ai-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    ArrowRight,
    Search,
    AlertCircle,
    ExternalLink
} from 'lucide-react';

interface SEOAnalysisTabbedProps {
    analysis: SEOAnalysis;
    url: string;
}

export function SEOAnalysisTabbed({ analysis, url }: SEOAnalysisTabbedProps) {
    const [activeTab, setActiveTab] = useState('overview');

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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'destructive';
            case 'high':
                return 'destructive';
            case 'medium':
                return 'default';
            case 'low':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'critical':
                return <XCircle className="h-4 w-4" />;
            case 'high':
                return <AlertTriangle className="h-4 w-4" />;
            case 'medium':
                return <AlertTriangle className="h-4 w-4" />;
            case 'low':
                return <Lightbulb className="h-4 w-4" />;
            default:
                return <Lightbulb className="h-4 w-4" />;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'technical':
                return <Globe className="h-4 w-4" />;
            case 'on-page':
                return <FileText className="h-4 w-4" />;
            case 'content':
                return <FileText className="h-4 w-4" />;
            case 'authority':
                return <Shield className="h-4 w-4" />;
            default:
                return <AlertTriangle className="h-4 w-4" />;
        }
    };

    // Calculate tab counts
    const criticalIssuesCount = safeAnalysis.criticalIssues.filter(issue => issue?.priority === 'critical').length;
    const improvementsCount = safeAnalysis.criticalIssues.filter(issue => issue?.priority === 'medium' || issue?.priority === 'high').length;
    const quickWinsCount = safeAnalysis.quickWins.length;
    const strengthsCount = safeAnalysis.strengths.length;

    return (
        <div className="space-y-6 p-4">
            {/* Header with Score */}
            <Card className={`${getScoreBgColor(safeAnalysis.overallScore)} border-2`}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Target className="h-6 w-6" />
                                SEO Analysis for {url}
                            </CardTitle>
                            <CardDescription className="text-base">
                                Comprehensive audit powered by Google AI • Site Type: <span className="font-semibold">{safeAnalysis.siteType}</span>
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <div className={`text-4xl font-bold ${getScoreColor(safeAnalysis.overallScore)}`}>
                                {safeAnalysis.overallScore}/100
                            </div>
                            <div className="text-sm text-gray-600">
                                {safeAnalysis.overallScore >= 80 ? 'Excellent' : safeAnalysis.overallScore >= 60 ? 'Good' : 'Needs Work'}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Progress value={safeAnalysis.overallScore} className="h-3" />
                </CardContent>
            </Card>

            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="critical" className="flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Critical
                        {criticalIssuesCount > 0 && (
                            <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                                {criticalIssuesCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="improvements" className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Improvements
                        {improvementsCount > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                                {improvementsCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="quickwins" className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Quick Wins
                        {quickWinsCount > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                                {quickWinsCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="strengths" className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Strengths
                        {strengthsCount > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                                {strengthsCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="technical" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Technical
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* SEO Performance Metrics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                SEO Performance Metrics
                            </CardTitle>
                            <CardDescription>
                                Detailed breakdown of your SEO performance across key areas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <div className="text-center">
                                    <div className="mb-2">
                                        <div className={`text-2xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.technicalScore)}`}>
                                            {safeAnalysis.seoMetrics.technicalScore}%
                                        </div>
                                        <div className="text-sm text-gray-600">Technical SEO</div>
                                    </div>
                                    <Progress value={safeAnalysis.seoMetrics.technicalScore} className="h-2" />
                                    <p className="text-xs text-gray-500 mt-1">HTTPS, meta tags, structure</p>
                                </div>

                                <div className="text-center">
                                    <div className="mb-2">
                                        <div className={`text-2xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.contentScore)}`}>
                                            {safeAnalysis.seoMetrics.contentScore}%
                                        </div>
                                        <div className="text-sm text-gray-600">Content Quality</div>
                                    </div>
                                    <Progress value={safeAnalysis.seoMetrics.contentScore} className="h-2" />
                                    <p className="text-xs text-gray-500 mt-1">Content length, keywords, readability</p>
                                </div>

                                <div className="text-center">
                                    <div className="mb-2">
                                        <div className={`text-2xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.performanceScore)}`}>
                                            {safeAnalysis.seoMetrics.performanceScore}%
                                        </div>
                                        <div className="text-sm text-gray-600">Performance</div>
                                    </div>
                                    <Progress value={safeAnalysis.seoMetrics.performanceScore} className="h-2" />
                                    <p className="text-xs text-gray-500 mt-1">Images, links, media optimization</p>
                                </div>

                                <div className="text-center">
                                    <div className="mb-2">
                                        <div className={`text-2xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.accessibilityScore)}`}>
                                            {safeAnalysis.seoMetrics.accessibilityScore}%
                                        </div>
                                        <div className="text-sm text-gray-600">Accessibility</div>
                                    </div>
                                    <Progress value={safeAnalysis.seoMetrics.accessibilityScore} className="h-2" />
                                    <p className="text-xs text-gray-500 mt-1">Alt text, viewport, user experience</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Google PageSpeed Insights */}
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
                                {/* Performance Score */}
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="mb-2">
                                        <div className={`text-3xl font-bold ${getScoreColor(safeAnalysis.seoMetrics.performanceScore)}`}>
                                            {safeAnalysis.seoMetrics.performanceScore}%
                                        </div>
                                        <div className="text-sm text-gray-600">Performance Score</div>
                                    </div>
                                    <Progress value={safeAnalysis.seoMetrics.performanceScore} className="h-3" />
                                    <p className="text-xs text-gray-500 mt-2">Overall performance rating</p>
                                </div>

                                {/* Core Web Vitals */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm">Core Web Vitals</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <span className="text-sm font-medium">LCP</span>
                                            <span className="text-sm font-mono bg-blue-100 px-2 py-1 rounded">
                                                {safeAnalysis.seoMetrics.coreWebVitals?.lcp || 'N/A'}s
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <span className="text-sm font-medium">FID</span>
                                            <span className="text-sm font-mono bg-blue-100 px-2 py-1 rounded">
                                                {safeAnalysis.seoMetrics.coreWebVitals?.fid || 'N/A'}ms
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <span className="text-sm font-medium">CLS</span>
                                            <span className="text-sm font-mono bg-blue-100 px-2 py-1 rounded">
                                                {safeAnalysis.seoMetrics.coreWebVitals?.cls || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <span className="text-sm font-medium">FCP</span>
                                            <span className="text-sm font-mono bg-blue-100 px-2 py-1 rounded">
                                                {safeAnalysis.seoMetrics.coreWebVitals?.fcp || 'N/A'}s
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schema.org Implementation Examples */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code className="h-5 w-5" />
                                Schema.org Implementation
                            </CardTitle>
                            <CardDescription>
                                Structured data examples to improve search visibility and rich snippets
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Service Schema */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Service Schema Markup
                                    </h4>
                                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                                        <pre className="text-xs">
                                            <code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "SEO Services",
  "provider": {
    "@type": "Organization",
    "name": "Your Company Name"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "description": "Professional SEO services to improve search visibility and organic traffic."
}
</script>`}</code>
                                        </pre>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">
                                        💡 Use for service-based businesses to appear in rich results
                                    </p>
                                </div>

                                {/* Organization Schema */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        Organization Schema Markup
                                    </h4>
                                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                                        <pre className="text-xs">
                                            <code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company Name",
  "url": "https://yourwebsite.com",
  "logo": "https://yourwebsite.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://facebook.com/yourcompany",
    "https://twitter.com/yourcompany"
  ]
}
</script>`}</code>
                                        </pre>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">
                                        💡 Essential for business knowledge panel in Google search
                                    </p>
                                </div>

                                {/* Testimonial Schema */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <Star className="h-4 w-4" />
                                        Testimonial Schema Markup
                                    </h4>
                                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                                        <pre className="text-xs">
                                            <code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Service",
    "name": "SEO Services"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5"
  },
  "author": {
    "@type": "Person",
    "name": "John Doe"
  },
  "reviewBody": "Excellent SEO service! Improved our rankings significantly."
}
</script>`}</code>
                                        </pre>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">
                                        💡 Display star ratings and reviews directly in search results
                                    </p>
                                </div>

                                {/* Product Schema */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4" />
                                        Product Schema Markup
                                    </h4>
                                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                                        <pre className="text-xs">
                                            <code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Wireless Headphones",
  "image": "https://example.com/headphones.jpg",
  "description": "Premium noise-cancelling wireless headphones",
  "brand": {
    "@type": "Brand",
    "name": "AudioBrand"
  },
  "offers": {
    "@type": "Offer",
    "price": "299.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
</script>`}</code>
                                        </pre>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">
                                        💡 Show product details, prices, and availability in search
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-red-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    <div>
                                        <p className="text-sm font-medium">Critical Issues</p>
                                        <p className="text-2xl font-bold text-red-600">{criticalIssuesCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-orange-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                    <div>
                                        <p className="text-sm font-medium">Improvements</p>
                                        <p className="text-2xl font-bold text-orange-600">{improvementsCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-blue-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium">Quick Wins</p>
                                        <p className="text-2xl font-bold text-blue-600">{quickWinsCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-green-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium">Strengths</p>
                                        <p className="text-2xl font-bold text-green-600">{strengthsCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Critical Issues Tab */}
                <TabsContent value="critical" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <XCircle className="h-5 w-5" />
                                Critical Issues ({criticalIssuesCount})
                            </CardTitle>
                            <CardDescription>
                                Fix these issues immediately - they are blocking your SEO performance
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Critical Issues - only show critical priority */}
                                {safeAnalysis.criticalIssues.filter(issue => issue?.priority === 'critical').map((issue: CriticalIssue, index: number) => (
                                    <div key={`critical-${index}`} className="border-l-4 border-red-500 pl-3 py-2 bg-red-50 rounded-r">
                                        <div className="flex items-start justify-between mb-1">
                                            <h4 className="font-semibold text-red-800 text-sm">{issue?.issue || 'Critical issue identified'}</h4>
                                            <Badge variant="destructive" className="text-xs">
                                                {issue?.priority || 'critical'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-700">{issue?.recommendation || 'No specific recommendation available'}</p>
                                    </div>
                                ))}

                                {criticalIssuesCount === 0 && (
                                    <div className="text-center py-8">
                                        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                        <p className="text-green-700 font-medium">No critical issues found!</p>
                                        <p className="text-slate-600 text-sm">Your site is in good shape with no blocking issues.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Improvements Tab */}
                <TabsContent value="improvements" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-600">
                                <AlertTriangle className="h-5 w-5" />
                                Important Improvements ({improvementsCount})
                            </CardTitle>
                            <CardDescription>
                                These improvements will significantly boost your SEO performance
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Show medium priority critical issues as improvements */}
                                {safeAnalysis.criticalIssues.filter(issue => issue?.priority === 'medium' || issue?.priority === 'high').map((issue: CriticalIssue, index: number) => (
                                    <div key={`improvement-${index}`} className="border-l-4 border-orange-500 pl-3 py-2 bg-orange-50 rounded-r">
                                        <div className="flex items-start justify-between mb-1">
                                            <h4 className="font-semibold text-orange-800 text-sm">{issue?.issue || 'Improvement needed'}</h4>
                                            <Badge variant={getPriorityColor(issue?.priority || 'medium')} className="text-xs">
                                                {issue?.priority || 'medium'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-700">{issue?.recommendation || 'No specific recommendation available'}</p>
                                    </div>
                                ))}

                                {improvementsCount === 0 && (
                                    <div className="text-center py-8">
                                        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                        <p className="text-green-700 font-medium">Great job on optimizations!</p>
                                        <p className="text-slate-600 text-sm">No major improvements needed right now.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Quick Wins Tab */}
                <TabsContent value="quickwins" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-600">
                                <Zap className="h-5 w-5" />
                                Quick Wins ({quickWinsCount})
                            </CardTitle>
                            <CardDescription>
                                Easy improvements with immediate benefits
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {safeAnalysis.quickWins.map((win: QuickWin, index: number) => (
                                    <div key={`quickwin-${index}`} className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-blue-800 text-sm">{win?.improvement || 'Quick win available'}</h4>
                                            <p className="text-xs text-gray-700">{win?.impact || 'Positive impact expected'}</p>
                                        </div>
                                        <Badge variant={win?.effort === 'low' ? 'secondary' : 'default'} className="text-xs">
                                            {win?.effort || 'medium'}
                                        </Badge>
                                    </div>
                                ))}

                                {quickWinsCount === 0 && (
                                    <div className="text-center py-8">
                                        <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-700 font-medium">No quick wins available</p>
                                        <p className="text-slate-600 text-sm">Focus on critical issues and improvements first.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Strengths Tab */}
                <TabsContent value="strengths" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="h-5 w-5" />
                                What's Working Well ({strengthsCount})
                            </CardTitle>
                            <CardDescription>
                                Things you're doing well that help your SEO
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {safeAnalysis.strengths.map((strength: Strength, index: number) => (
                                    <div key={`strength-${index}`} className="flex items-center gap-2 p-3 bg-green-50 rounded border border-green-200">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-green-800 text-sm">{strength?.area || 'Strength identified'}</h4>
                                            <p className="text-xs text-gray-700">{strength?.description || 'Positive aspect found'}</p>
                                        </div>
                                    </div>
                                ))}

                                {strengthsCount === 0 && (
                                    <div className="text-center py-8">
                                        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-700 font-medium">Keep building good SEO practices!</p>
                                        <p className="text-slate-600 text-sm">Focus on implementing the suggested improvements.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Technical Tab */}
                <TabsContent value="technical" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Technical SEO Analysis
                            </CardTitle>
                            <CardDescription>
                                Detailed technical SEO elements and performance metrics
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-4">Detailed Recommendations</h4>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {/* Title Optimization */}
                                        <div className="border rounded-lg p-4">
                                            <h5 className="font-semibold mb-3 flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Title Tag
                                            </h5>
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-600">Current:</span>
                                                    <p className="bg-gray-100 p-2 rounded font-mono text-xs">{safeAnalysis.detailedRecommendations.title?.current || 'Not available'}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-green-600">Suggested:</span>
                                                    <p className="bg-green-100 p-2 rounded font-mono text-xs">{safeAnalysis.detailedRecommendations.title?.suggested || 'Not available'}</p>
                                                </div>
                                                <p className="text-gray-700 text-xs">{safeAnalysis.detailedRecommendations.title?.reason || 'No specific reason provided'}</p>
                                            </div>
                                        </div>

                                        {/* Meta Description */}
                                        <div className="border rounded-lg p-4">
                                            <h5 className="font-semibold mb-3 flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Meta Description
                                            </h5>
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-600">Current:</span>
                                                    <p className="bg-gray-100 p-2 rounded font-mono text-xs">{safeAnalysis.detailedRecommendations.metaDescription?.current || 'Not available'}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-green-600">Suggested:</span>
                                                    <p className="bg-green-100 p-2 rounded font-mono text-xs">{safeAnalysis.detailedRecommendations.metaDescription?.suggested || 'Not available'}</p>
                                                </div>
                                                <p className="text-gray-700 text-xs">{safeAnalysis.detailedRecommendations.metaDescription?.reason || 'No specific reason provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Technical SEO Status Grid */}
                                <div>
                                    <h4 className="font-semibold mb-4">Technical SEO Status</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            { label: 'HTTPS Security', status: true, icon: '🔒' }, // Default to true for demo
                                            { label: 'Mobile Friendly', status: true, icon: '📱' }, // Default to true for demo
                                            { label: 'Structured Data', status: safeAnalysis.detailedRecommendations?.technical?.structuredData !== 'Add structured data for better search visibility', icon: '📊' },
                                            { label: 'Meta Description', status: safeAnalysis.detailedRecommendations?.metaDescription?.current !== 'Missing', icon: '📝' },
                                            { label: 'H1 Tag Present', status: (safeAnalysis.detailedRecommendations?.headings?.issues?.length || 0) === 0, icon: '🏷️' },
                                            { label: 'Content Quality', status: (safeAnalysis.seoMetrics?.contentScore || 0) > 60, icon: '📄' }
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{item.icon}</span>
                                                    <span className="font-medium text-sm">{item.label}</span>
                                                </div>
                                                {item.status ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-500" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
