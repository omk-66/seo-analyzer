"use client";

import { SEOAnalysis, CriticalIssue, Strength, QuickWin, SEOMetrics, DetailedRecommendations } from '@/lib/ai-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Lightbulb,
    Target,
    TrendingUp,
    Shield,
    Zap,
    ArrowRight,
    Globe,
    FileText,
    Image,
    Link,
    Star
} from 'lucide-react';

interface SEOAnalysisEnhancedProps {
    analysis: SEOAnalysis;
    url: string;
}

export function SEOAnalysisEnhanced({ analysis, url }: SEOAnalysisEnhancedProps) {
    // Handle case where analysis might be in old format or incomplete
    const safeAnalysis = {
        overallScore: analysis.overallScore || 0,
        siteType: analysis.siteType || 'unknown',
        generalSuggestions: analysis.generalSuggestions || [],
        sectionAnalysis: analysis.sectionAnalysis || [],
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

    return (
        <div className="space-y-6 max-h-screen overflow-y-auto p-4">
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

            {/* SEO Metrics Dashboard - Always Visible */}
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

            {/* Advanced SEO Metrics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Advanced SEO Metrics & Authority
                    </CardTitle>
                    <CardDescription>
                        Comprehensive analysis of domain authority, backlinks, and competitive positioning
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Authority Metrics */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-purple-600 flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Domain Authority
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Domain Authority</span>
                                    <span className="font-bold text-purple-600">
                                        {safeAnalysis.seoMetrics.domainAuthority || 'N/A'} / 100
                                    </span>
                                </div>
                                <Progress value={safeAnalysis.seoMetrics.domainAuthority || 0} className="h-2" />

                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Page Authority</span>
                                    <span className="font-bold text-purple-600">
                                        {safeAnalysis.seoMetrics.pageAuthority || 'N/A'} / 100
                                    </span>
                                </div>
                                <Progress value={safeAnalysis.seoMetrics.pageAuthority || 0} className="h-2" />
                            </div>
                        </div>

                        {/* Backlink Profile */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                                <Link className="h-4 w-4" />
                                Backlink Profile
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Total Backlinks</span>
                                    <span className="font-bold text-blue-600">
                                        {safeAnalysis.seoMetrics.backlinksCount?.toLocaleString() || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Referring Domains</span>
                                    <span className="font-bold text-blue-600">
                                        {safeAnalysis.seoMetrics.referringDomains?.toLocaleString() || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Organic Keywords</span>
                                    <span className="font-bold text-green-600">
                                        {safeAnalysis.seoMetrics.organicKeywords?.toLocaleString() || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Est. Monthly Traffic</span>
                                    <span className="font-bold text-orange-600">
                                        {safeAnalysis.seoMetrics.organicTraffic ? `${Math.round(safeAnalysis.seoMetrics.organicTraffic).toLocaleString()}` : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-green-600 flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Performance & Speed
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Mobile Speed</span>
                                    <span className={`font-bold ${getScoreColor(safeAnalysis.seoMetrics.pageSpeed?.mobile || 0)}`}>
                                        {safeAnalysis.seoMetrics.pageSpeed?.mobile || 'N/A'} / 100
                                    </span>
                                </div>
                                <Progress value={safeAnalysis.seoMetrics.pageSpeed?.mobile || 0} className="h-2" />

                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Desktop Speed</span>
                                    <span className={`font-bold ${getScoreColor(safeAnalysis.seoMetrics.pageSpeed?.desktop || 0)}`}>
                                        {safeAnalysis.seoMetrics.pageSpeed?.desktop || 'N/A'} / 100
                                    </span>
                                </div>
                                <Progress value={safeAnalysis.seoMetrics.pageSpeed?.desktop || 0} className="h-2" />

                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Mobile Friendly</span>
                                    <Badge variant={safeAnalysis.seoMetrics.mobileFriendliness ? "default" : "destructive"}>
                                        {safeAnalysis.seoMetrics.mobileFriendliness ? "Yes" : "No"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Core Web Vitals */}
                    {safeAnalysis.seoMetrics.coreWebVitals && (
                        <div className="mt-6 pt-6 border-t">
                            <h4 className="font-semibold text-orange-600 mb-4 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Core Web Vitals
                            </h4>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="text-center p-3 bg-orange-50 rounded-lg">
                                    <div className="text-lg font-bold text-orange-600">
                                        {safeAnalysis.seoMetrics.coreWebVitals.lcp || 'N/A'}s
                                    </div>
                                    <div className="text-sm text-gray-600">LCP</div>
                                    <p className="text-xs text-gray-500">Largest Contentful Paint</p>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="text-lg font-bold text-blue-600">
                                        {safeAnalysis.seoMetrics.coreWebVitals.inp || 'N/A'}ms
                                    </div>
                                    <div className="text-sm text-gray-600">INP</div>
                                    <p className="text-xs text-gray-500">Interaction to Next Paint</p>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="text-lg font-bold text-green-600">
                                        {safeAnalysis.seoMetrics.coreWebVitals.cls || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-600">CLS</div>
                                    <p className="text-xs text-gray-500">Cumulative Layout Shift</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column - Issues & Strengths */}
                <div className="space-y-6">
                    {/* General Suggestions */}
                    {safeAnalysis.generalSuggestions?.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-orange-600">
                                    <AlertTriangle className="h-5 w-5" />
                                    General Issues ({safeAnalysis.generalSuggestions.length})
                                </CardTitle>
                                <CardDescription>
                                    Overall website issues that need attention
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {safeAnalysis.generalSuggestions.map((suggestion, index: number) => (
                                        <div key={index} className="border-l-4 border-orange-500 pl-3 py-2 bg-orange-50 rounded-r">
                                            <div className="flex items-start justify-between mb-1">
                                                <h4 className="font-semibold text-orange-800 text-sm">{suggestion.issue}</h4>
                                                <Badge variant={getPriorityColor(suggestion.priority)} className="text-xs">
                                                    {suggestion.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-gray-700">{suggestion.recommendation}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Critical Issues */}
                    {safeAnalysis.criticalIssues.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">
                                    <XCircle className="h-5 w-5" />
                                    Critical Issues ({safeAnalysis.criticalIssues.length})
                                </CardTitle>
                                <CardDescription>
                                    Fix these issues immediately
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {safeAnalysis.criticalIssues.map((issue: CriticalIssue, index: number) => (
                                        <div key={index} className="border-l-4 border-red-500 pl-3 py-2 bg-red-50 rounded-r">
                                            <div className="flex items-start justify-between mb-1">
                                                <h4 className="font-semibold text-red-800 text-sm">{issue.issue}</h4>
                                                <Badge variant={getPriorityColor(issue.priority)} className="text-xs">
                                                    {issue.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-gray-700">{issue.recommendation}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Strengths */}
                    {safeAnalysis.strengths.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-600">
                                    <CheckCircle2 className="h-5 w-5" />
                                    What's Working Well ({safeAnalysis.strengths.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {safeAnalysis.strengths.map((strength: Strength, index: number) => (
                                        <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                            <div>
                                                <h4 className="font-medium text-green-800 text-sm">{strength.area}</h4>
                                                <p className="text-xs text-gray-700">{strength.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column - Section Analysis */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Section-by-Section Analysis
                            </CardTitle>
                            <CardDescription>
                                Detailed breakdown of each website section
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {safeAnalysis.sectionAnalysis?.length > 0 ? (
                                <div className="space-y-4">
                                    {safeAnalysis.sectionAnalysis.map((section, sectionIndex: number) => (
                                        <div key={sectionIndex} className="border rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-semibold text-sm">{section.sectionName}</h4>
                                                <Badge variant="outline" className="text-xs">
                                                    {section.sectionType}
                                                </Badge>
                                            </div>

                                            {/* Issues */}
                                            {section.issues.length > 0 && (
                                                <div className="mb-3">
                                                    <h5 className="text-xs font-medium text-red-600 mb-1">Issues ({section.issues.length})</h5>
                                                    <div className="space-y-1">
                                                        {section.issues.map((issue, issueIndex: number) => (
                                                            <div key={issueIndex} className="bg-red-50 p-2 rounded text-xs">
                                                                <p className="font-medium text-red-800">{issue.problem}</p>
                                                                <p className="text-gray-600 mt-1">{issue.recommendation}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Strengths */}
                                            {section.strengths.length > 0 && (
                                                <div className="mb-3">
                                                    <h5 className="text-xs font-medium text-green-600 mb-1">Strengths ({section.strengths.length})</h5>
                                                    <div className="space-y-1">
                                                        {section.strengths.map((strength, strengthIndex: number) => (
                                                            <div key={strengthIndex} className="bg-green-50 p-2 rounded text-xs">
                                                                <p className="font-medium text-green-800">{strength.positive}</p>
                                                                <p className="text-gray-600">{strength.reason}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Suggestions */}
                                            {section.suggestions.length > 0 && (
                                                <div>
                                                    <h5 className="text-xs font-medium text-blue-600 mb-1">Suggestions ({section.suggestions.length})</h5>
                                                    <div className="space-y-1">
                                                        {section.suggestions.map((suggestion, suggestionIndex: number) => (
                                                            <div key={suggestionIndex} className="bg-blue-50 p-2 rounded text-xs">
                                                                <p className="font-medium text-blue-800">{suggestion.improvement}</p>
                                                                <p className="text-gray-600">{suggestion.benefit}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">No detailed section analysis available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Wins */}
                    {safeAnalysis.quickWins.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-600">
                                    <Zap className="h-5 w-5" />
                                    Quick Wins ({safeAnalysis.quickWins.length})
                                </CardTitle>
                                <CardDescription>
                                    Easy improvements with immediate benefits
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {safeAnalysis.quickWins.map((win: QuickWin, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-blue-800 text-sm">{win.improvement}</h4>
                                                <p className="text-xs text-gray-700">{win.impact}</p>
                                            </div>
                                            <Badge variant={win.effort === 'low' ? 'secondary' : 'default'} className="text-xs">
                                                {win.effort}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Detailed Recommendations */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Detailed Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Title Optimization */}
                        <div className="border rounded-lg p-3">
                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4" />
                                Title Tag
                            </h4>
                            <div className="space-y-2 text-xs">
                                <div>
                                    <span className="font-medium text-gray-600">Current:</span>
                                    <p className="bg-gray-100 p-1 rounded font-mono">{safeAnalysis.detailedRecommendations.title.current}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-green-600">Suggested:</span>
                                    <p className="bg-green-100 p-1 rounded font-mono">{safeAnalysis.detailedRecommendations.title.suggested}</p>
                                </div>
                                <p className="text-gray-700">{safeAnalysis.detailedRecommendations.title.reason}</p>
                            </div>
                        </div>

                        {/* Meta Description */}
                        <div className="border rounded-lg p-3">
                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4" />
                                Meta Description
                            </h4>
                            <div className="space-y-2 text-xs">
                                <div>
                                    <span className="font-medium text-gray-600">Current:</span>
                                    <p className="bg-gray-100 p-1 rounded font-mono">{safeAnalysis.detailedRecommendations.metaDescription.current}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-green-600">Suggested:</span>
                                    <p className="bg-green-100 p-1 rounded font-mono">{safeAnalysis.detailedRecommendations.metaDescription.suggested}</p>
                                </div>
                                <p className="text-gray-700">{safeAnalysis.detailedRecommendations.metaDescription.reason}</p>
                            </div>
                        </div>
                    </div>

                    {/* Technical Recommendations */}
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mt-4">
                        <div className="border rounded p-3">
                            <h4 className="font-semibold mb-1 flex items-center gap-2 text-sm">
                                <Image className="h-4 w-4" />
                                Images
                            </h4>
                            <p className="text-xs text-gray-700">{safeAnalysis.detailedRecommendations.technical.imageOptimization}</p>
                        </div>

                        <div className="border rounded p-3">
                            <h4 className="font-semibold mb-1 flex items-center gap-2 text-sm">
                                <Link className="h-4 w-4" />
                                Internal Links
                            </h4>
                            <p className="text-xs text-gray-700">{safeAnalysis.detailedRecommendations.technical.internalLinking}</p>
                        </div>

                        <div className="border rounded p-3">
                            <h4 className="font-semibold mb-1 flex items-center gap-2 text-sm">
                                <Globe className="h-4 w-4" />
                                URL Structure
                            </h4>
                            <p className="text-xs text-gray-700">{safeAnalysis.detailedRecommendations.technical.urlStructure}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Plan */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRight className="h-5 w-5" />
                        Action Plan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {safeAnalysis.nextSteps.map((step: string, index: number) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-semibold">
                                    {index + 1}
                                </div>
                                <p className="text-sm text-gray-800">{step}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Summary Alert */}
            <Alert>
                <Star className="h-4 w-4" />
                <AlertDescription className="text-sm">
                    <strong>Pro Tip:</strong> Focus on fixing critical issues first, then implement quick wins for immediate SEO improvements.
                </AlertDescription>
            </Alert>
        </div>
    );
}
