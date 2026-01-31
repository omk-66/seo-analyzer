'use client'

import { useState } from 'react'
import { Search, Loader2, AlertCircle, CheckCircle, XCircle, ExternalLink, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import axios from 'axios'

export default function Home() {
  const [domain, setDomain] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!domain) return

    setIsAnalyzing(true)
    setError("")
    setAnalysis(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: domain }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setAnalysis(data)
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setError('Failed to analyze website. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            SEO Audit Tool
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Enter your domain below to get a comprehensive SEO analysis and identify optimization opportunities
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Enter domain (e.g., example.com)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                  className="flex-1 h-12 text-base"
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={!domain || isAnalyzing}
                  className="h-12 px-8 bg-primary hover:bg-primary/90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Overall Score */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>SEO Analysis Results</span>
                  <Badge variant="secondary" className="text-sm">
                    {analysis.overallScore || 0}/100
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Analysis for {analysis.url || domain}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Technical Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Technical SEO Summary</CardTitle>
                <CardDescription>
                  Overview of technical SEO health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {analysis.technicalSummary?.hasH1 ? '✅' : '❌'}
                    </div>
                    <div className="text-xs text-green-600">H1 Tag</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {analysis.technicalSummary?.hasMetaDescription ? '✅' : '❌'}
                    </div>
                    <div className="text-xs text-blue-600">Meta Description</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {analysis.technicalSummary?.hasHttps ? '✅' : '❌'}
                    </div>
                    <div className="text-xs text-purple-600">HTTPS</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">
                      {analysis.technicalSummary?.imageAltTextCoverage || 0}%
                    </div>
                    <div className="text-xs text-orange-600">Alt Text Coverage</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google PageSpeed Performance */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>🚀 Google PageSpeed Performance</CardTitle>
                <CardDescription>
                  Real performance metrics from Google PageSpeed Insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysis.pageSpeedData ? (
                  <div className="space-y-4">
                    {/* Overall Performance Score */}
                    <div className="text-center p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {Math.round((analysis.pageSpeedData.lighthouseResult?.categories?.performance?.score || 0) * 100)}%
                      </div>
                      <div className="text-sm text-blue-600">Performance Score</div>
                    </div>

                    {/* Core Web Vitals */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {analysis.pageSpeedData.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-600">LCP (Loading)</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold text-orange-600">
                          {analysis.pageSpeedData.lighthouseResult?.audits?.['max-potential-fid']?.displayValue || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-600">FID (Interactivity)</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold text-red-600">
                          {analysis.pageSpeedData.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-600">CLS (Stability)</div>
                      </div>
                    </div>

                    {/* Performance Opportunities */}
                    {analysis.pageSpeedData.lighthouseResult?.audits && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Performance Opportunities</h4>
                        {Object.entries(analysis.pageSpeedData.lighthouseResult.audits)
                          .filter(([key, audit]: [string, any]) =>
                            audit.score !== null && audit.score < 0.9 &&
                            ['uses-webp-images', 'modern-image-formats', 'offscreen-images', 'render-blocking-resources', 'unused-css-rules', 'unused-javascript'].includes(key)
                          )
                          .map(([key, audit]: [string, any]) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{audit.title}</p>
                                <p className="text-sm text-gray-600">{audit.description}</p>
                              </div>
                              <Badge variant="secondary">
                                {audit.displayValue || 'Needs improvement'}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-yellow-700 font-medium">PageSpeed data not available</p>
                    <p className="text-slate-600 text-sm">Add GOOGLE_PAGESPEED_API_KEY to enable performance analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Content Optimization */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>📝 Content Optimization</CardTitle>
                <CardDescription>
                  Detailed suggestions for improving your content for better SEO
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.contentOptimizations && analysis.contentOptimizations.length > 0 ? (
                  analysis.contentOptimizations.map((content: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-slate-900">{content.section}</h3>
                        <Badge variant="outline">{content.type}</Badge>
                      </div>

                      {content.currentContent && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Current Content:</p>
                          <div className="bg-gray-50 p-3 rounded border-l-4 border-gray-400">
                            <p className="text-sm text-gray-700">{content.currentContent}</p>
                          </div>
                        </div>
                      )}

                      {content.suggestedContent && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-green-700 mb-1">Suggested Content:</p>
                          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                            <p className="text-sm text-green-800">{content.suggestedContent}</p>
                          </div>
                        </div>
                      )}

                      <div className="bg-blue-50 rounded p-3">
                        <p className="text-sm font-medium text-blue-900 mb-1">Why this works better:</p>
                        <p className="text-sm text-blue-700">{content.reason}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <p className="text-blue-700 font-medium">Content optimization suggestions will appear here</p>
                    <p className="text-slate-600 text-sm">Based on your current content analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Critical Issues */}
            <Card className="shadow-lg border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">🚨 Critical Issues (Must Fix)</CardTitle>
                <CardDescription>
                  These issues are blocking your SEO performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.criticalIssues && analysis.criticalIssues.length > 0 ? (
                  analysis.criticalIssues.map((issue: any, index: number) => (
                    <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-red-900">{issue.issue}</h3>
                        <Badge variant="destructive">Critical</Badge>
                      </div>
                      <p className="text-red-700 mb-3">{issue.impact}</p>

                      {issue.currentCode && (
                        <div className="bg-red-100 rounded p-3 mb-3">
                          <p className="text-sm font-medium text-red-900 mb-1">Current Code:</p>
                          <code className="text-sm text-red-700 block bg-red-200 p-2 rounded">
                            {issue.currentCode}
                          </code>
                        </div>
                      )}

                      {issue.suggestedCode && (
                        <div className="bg-green-50 rounded p-3 mb-3">
                          <p className="text-sm font-medium text-green-900 mb-1">Suggested Code:</p>
                          <code className="text-sm text-green-700 block bg-green-100 p-2 rounded">
                            {issue.suggestedCode}
                          </code>
                        </div>
                      )}

                      <div className="bg-blue-50 rounded p-3">
                        <p className="text-sm font-medium text-blue-900 mb-1">How to Fix:</p>
                        <p className="text-sm text-blue-700">{issue.implementation}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-green-700 font-medium">No critical issues found!</p>
                    <p className="text-slate-600 text-sm">Your site has a solid technical foundation.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Important Improvements */}
            <Card className="shadow-lg border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-700">⚡ Important Improvements (Should Fix)</CardTitle>
                <CardDescription>
                  These improvements will significantly boost your SEO
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.importantImprovements && analysis.importantImprovements.length > 0 ? (
                  analysis.importantImprovements.map((improvement: any, index: number) => (
                    <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-orange-900">{improvement.issue}</h3>
                        <Badge variant="secondary">High Priority</Badge>
                      </div>
                      <p className="text-orange-700 mb-3">{improvement.impact}</p>

                      {improvement.currentCode && (
                        <div className="bg-orange-100 rounded p-3 mb-3">
                          <p className="text-sm font-medium text-orange-900 mb-1">Current Code:</p>
                          <code className="text-sm text-orange-700 block bg-orange-200 p-2 rounded">
                            {improvement.currentCode}
                          </code>
                        </div>
                      )}

                      {improvement.suggestedCode && (
                        <div className="bg-green-50 rounded p-3 mb-3">
                          <p className="text-sm font-medium text-green-900 mb-1">Suggested Code:</p>
                          <code className="text-sm text-green-700 block bg-green-100 p-2 rounded">
                            {improvement.suggestedCode}
                          </code>
                        </div>
                      )}

                      <div className="bg-blue-50 rounded p-3">
                        <p className="text-sm font-medium text-blue-900 mb-1">Implementation:</p>
                        <p className="text-sm text-blue-700">{improvement.implementation}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-green-700 font-medium">Great job on optimizations!</p>
                    <p className="text-slate-600 text-sm">No major improvements needed right now.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Good Practices */}
            <Card className="shadow-lg border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">✅ Good Practices (What's Working)</CardTitle>
                <CardDescription>
                  Things you're doing well that help your SEO
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.goodPractices && analysis.goodPractices.length > 0 ? (
                  analysis.goodPractices.map((practice: any, index: number) => (
                    <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <h3 className="font-semibold text-green-900 mb-2">{practice.practice}</h3>
                      <p className="text-green-700">{practice.reason}</p>
                      {practice.details && (
                        <p className="text-sm text-green-600 mt-2">{practice.details}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-600">Keep working on building good SEO practices!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Technical SEO Status */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Technical SEO Status</CardTitle>
                <CardDescription>
                  Technical elements affecting your SEO performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'HTTPS Security', status: analysis.technical?.hasHttps, icon: '🔒' },
                    { label: 'Mobile Friendly', status: analysis.technical?.mobileFriendliness, icon: '📱' },
                    { label: 'Structured Data', status: analysis.performance?.hasStructuredData, icon: '📊' },
                    { label: 'Meta Description', status: analysis.technical?.hasMetaDescription, icon: '📝' },
                    { label: 'H1 Tag Present', status: analysis.technical?.hasH1, icon: '🏷️' },
                    { label: 'Canonical URL', status: analysis.performance?.hasCanonical, icon: '🔗' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.status ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <div className="text-center">
              <Button
                onClick={() => {
                  setAnalysis(null)
                  setError("")
                  setDomain("")
                }}
                variant="outline"
                size="lg"
              >
                Analyze Another Website
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
