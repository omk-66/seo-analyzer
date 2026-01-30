'use client'

import { useState } from 'react'
import { Search, Play, Loader2, BarChart3, Monitor, Zap, ChevronRight, Activity, FileText, Shield, Globe } from 'lucide-react'
import axios from 'axios'

// Performance metrics function using Google PageSpeed API
async function getPerformance(url: string) {
  try {
    const res = await axios.get(
      'https://www.googleapis.com/pagespeedonline/v5/runPagespeed',
      {
        params: {
          key: process.env.GOOGLE_INSIGHTS_API_KEY,
          url,
          category: 'performance',
          strategy: 'mobile',
        },
      }
    );

    // console.log('✅ PageSpeed API response received');
    const lighthouse = res.data.lighthouse;
    const audits = lighthouse.audits;
    console.log("audits ---> 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢", audits)

    // Safe extraction for performance audits only
    const getAuditValue = (auditName: string) => audits[auditName]?.displayValue ?? 'N/A';

    return {
      performanceScore: Math.round(lighthouse.categories.performance.score * 100),

      // Core Web Vitals
      FCP: getAuditValue('first-contentful-paint'),
      LCP: getAuditValue('largest-contentful-paint'),
      CLS: getAuditValue('cumulative-layout-shift'),

      // Key performance metrics
      TTFB: getAuditValue('server-response-time'),
      TBT: getAuditValue('total-blocking-time'),
      SpeedIndex: getAuditValue('speed-index'),

      // Numeric values (for charts)
      FCP_ms: audits['first-contentful-paint']?.numericValue ?? null,
      LCP_ms: audits['largest-contentful-paint']?.numericValue ?? null,
      CLS_score: audits['cumulative-layout-shift']?.numericValue ?? null,

      url: lighthouse.requestedUrl,
      testedAt: lighthouse.fetchTime
    };
  } catch (error) {
    console.error('Performance API error:', error);
    return {
      performanceScore: 0,
      FCP: 'N/A',
      LCP: 'N/A',
      CLS: 'N/A',
      TTFB: 'N/A',
      FID: 'N/A'
    };
  }
}

export default function Home() {
  const [domain, setDomain] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState("")
  const [websiteData, setWebsiteData] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('metrics')
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [isPerformanceLoading, setIsPerformanceLoading] = useState(false)

  const handlePreview = async () => {
    if (!domain) return

    setIsAnalyzing(true)
    setError("")
    setWebsiteData(null)

    try {
      const url = domain.startsWith('http') ? domain : `https://${domain}`
      setWebsiteData({ url, title: '', content: '' })
      setShowPreview(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid domain")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAnalyze = async () => {
    if (!websiteData?.url) return

    setIsAnalyzing(true)
    setError("")
    setPerformanceData(null)

    try {
      // Fetch performance data in parallel
      const [analysisResponse, performanceResponse] = await Promise.all([
        fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: websiteData.url
          }),
        }),
        getPerformance(websiteData.url)
      ])

      const analysisData = await analysisResponse.json()
      const perfData = performanceResponse
      console.log("performanceResponse ---> 🟢", perfData)

      if (analysisData.error) {
        setError(analysisData.error)
      } else {
        setAnalysis(analysisData)
        setPerformanceData(perfData)
        setShowAnalysis(true)
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setError('Failed to analyze website. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (showAnalysis && websiteData && analysis) {
    // Define navigation sections
    const navigationSections = [
      { id: 'metrics', name: 'Metrics', icon: Activity },
      { id: 'general', name: 'General Issues', icon: FileText },
      { id: 'technical', name: 'Technical SEO', icon: Shield },
      { id: 'onpage', name: 'On-Page SEO', icon: Globe },
      { id: 'offpage', name: 'Off-Page SEO', icon: BarChart3 },
      { id: 'content', name: 'Content Quality', icon: Monitor },
      { id: 'performance', name: 'Performance', icon: BarChart3 }
    ]

    // Add section analysis to navigation if available
    if (analysis.sectionAnalysis && analysis.sectionAnalysis.length > 0) {
      analysis.sectionAnalysis.forEach((section: any, index: number) => {
        navigationSections.push({
          id: `section-${index}`,
          name: section.sectionName,
          icon: FileText
        })
      })
    }

    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Main Content Area - Website Preview */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">SEO Audit Tool</h1>
                      <p className="text-sm text-gray-500">Live Website Preview</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Analyzing: {websiteData.url}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      setShowAnalysis(false)
                      setShowPreview(false)
                      setWebsiteData(null)
                      setAnalysis(null)
                      setPerformanceData(null)
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    New Analysis
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Website Preview */}
          <div className="flex-1 bg-gray-100 p-4">
            <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">Live Preview</span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Score: {analysis.overallScore || 65}/100</span>
                      <span>DR: {analysis.seoMetrics?.domainAuthority || analysis.technical?.domainAuthority || 0}</span>
                      <span>Issues: {analysis.generalSuggestions?.length || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <iframe
                    src={websiteData.url}
                    className="w-full h-full border-0"
                    title="Website Preview"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Analysis Results */}
        <div
          className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-lg transition-all duration-300 hover:shadow-xl"
          style={{
            resize: 'horizontal',
            minWidth: '320px',
            maxWidth: '600px',
            overflow: 'auto'
          }}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 bg-linear-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-blue-600" />
                </div>
                <h1 className="text-lg font-bold">SEO Analysis</h1>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Live</span>
              </div>
            </div>

            {/* Overall Score */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{analysis.overallScore || 65}/100</div>
                <div className="text-xs opacity-90">
                  {analysis.overallScore >= 80 ? 'Excellent' : analysis.overallScore >= 60 ? 'Good' : 'Needs Work'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-75">{websiteData.url}</div>
                <div className="text-xs opacity-90 capitalize">{analysis.siteType || 'website'}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.overallScore || 65}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gray-50 border-b border-gray-200 p-2">
            <div className="flex flex-wrap gap-1">
              {navigationSections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{section.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {/* Metrics Section */}
              {activeSection === 'metrics' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-blue-600" />
                    SEO Metrics
                  </h3>

                  <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Domain Authority</span>
                          <span className="text-xs font-bold text-blue-600">
                            {analysis.seoMetrics?.domainAuthority || analysis.technical?.domainAuthority || 0}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-linear-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
                            style={{ width: `${analysis.seoMetrics?.domainAuthority || analysis.technical?.domainAuthority || 0}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Backlinks</span>
                          <span className="text-xs font-bold text-purple-600">
                            {analysis.seoMetrics?.backlinksCount || analysis.technical?.estimatedBacklinks || 0}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Estimated total</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Organic Traffic</span>
                          <span className="text-xs font-bold text-green-600">
                            {Math.round((analysis.seoMetrics?.organicTraffic || analysis.technical?.estimatedOrganicTraffic || 0) / 1000)}K/mo
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Monthly visitors</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Technical Score</span>
                          <span className="text-xs font-bold text-orange-600">
                            {analysis.seoMetrics?.technicalScore || 0}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Overall health</div>
                      </div>
                    </div>
                  </div>

                  {/* Technical SEO Health Check */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-green-600" />
                      Technical SEO Health
                    </h4>
                    <div className="space-y-2">
                      {[
                        { label: 'HTTPS Security', status: analysis.technical?.hasHttps || websiteData?.technical?.hasHttps, icon: '🔒' },
                        { label: 'Mobile Friendly', status: analysis.technical?.mobileFriendliness || websiteData?.technical?.mobileFriendliness, icon: '📱' },
                        { label: 'Structured Data', status: analysis.performance?.hasStructuredData || websiteData?.performance?.hasStructuredData, icon: '📊' },
                        { label: 'Social Media Ready', status: (analysis.performance?.hasOpenGraph || websiteData?.performance?.hasOpenGraph) && (analysis.performance?.hasTwitterCards || websiteData?.performance?.hasTwitterCards), icon: '📱' },
                        { label: 'Favicon', status: analysis.technical?.technicalSEO?.hasFavicon || websiteData?.technical?.technicalSEO?.hasFavicon, icon: '🎨' },
                        { label: 'Language Declared', status: analysis.technical?.technicalSEO?.languageDeclared || websiteData?.technical?.technicalSEO?.languageDeclared, icon: '🌍' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded p-2">
                          <div className="flex items-center">
                            <span className="mr-2">{item.icon}</span>
                            <span className="text-xs text-gray-700">{item.label}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {item.status ? 'Good' : 'Missing'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* General Issues Section */}
              {activeSection === 'general' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-blue-600" />
                    General Issues
                  </h3>

                  {analysis.generalSuggestions && analysis.generalSuggestions.length > 0 ? (
                    <div className="space-y-3">
                      {analysis.generalSuggestions.map((suggestion: any, index: number) => (
                        <div key={index} className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{suggestion.issue}</h4>
                            <span className={`text-xs px-2 py-1 rounded ${suggestion.priority === 'critical' ? 'bg-red-100 text-red-800' :
                              suggestion.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                              {suggestion.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{suggestion.impact}</p>
                          <div className="bg-white rounded p-2 mb-2">
                            <p className="text-xs font-medium text-gray-700 mb-1">Suggestion:</p>
                            <p className="text-xs text-gray-600">{suggestion.recommendation}</p>
                          </div>

                          {/* Code Examples */}
                          {suggestion.currentCode && (
                            <div className="bg-white rounded p-2 mb-2">
                              <p className="text-xs font-medium text-gray-700 mb-1">Current Code:</p>
                              <code className="text-xs text-red-600 block bg-red-50 p-2 rounded">{suggestion.currentCode}</code>
                            </div>
                          )}

                          {suggestion.suggestedCode && (
                            <div className="bg-green-50 rounded p-2 mb-2">
                              <p className="text-xs font-medium text-gray-700 mb-1">Suggested Code:</p>
                              <code className="text-xs text-green-600 block bg-green-100 p-2 rounded">{suggestion.suggestedCode}</code>
                            </div>
                          )}

                          {suggestion.implementation && (
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-xs font-medium text-gray-700 mb-1">Implementation:</p>
                              <p className="text-xs text-gray-600">{suggestion.implementation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-green-700 text-sm">No general issues found!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Technical SEO Section */}
              {activeSection === 'technical' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-600" />
                    Technical SEO Analysis
                  </h3>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Technical Health Score</h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Overall Technical Score</span>
                      <span className="text-sm font-bold text-green-600">
                        {analysis.seoMetrics?.technicalScore || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${analysis.seoMetrics?.technicalScore || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: 'HTTPS Security', status: analysis.technical?.hasHttps || websiteData?.technical?.hasHttps, icon: '🔒', description: 'Secure connection enabled' },
                      { label: 'Mobile Friendly', status: analysis.technical?.mobileFriendliness || websiteData?.technical?.mobileFriendliness, icon: '📱', description: 'Optimized for mobile devices' },
                      { label: 'Structured Data', status: analysis.performance?.hasStructuredData || websiteData?.performance?.hasStructuredData, icon: '📊', description: 'Schema markup detected' },
                      { label: 'Canonical URL', status: analysis.technical?.hasCanonical || websiteData?.technical?.hasCanonical, icon: '🔗', description: 'Canonical tag present' },
                      { label: 'Meta Robots', status: analysis.technical?.hasRobotsMeta || websiteData?.technical?.hasRobotsMeta, icon: '🤖', description: 'Robots meta tag configured' },
                      { label: 'Viewport Meta', status: analysis.technical?.hasViewportMeta || websiteData?.technical?.hasViewportMeta, icon: '📱', description: 'Viewport tag configured' }
                    ].map((item, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="mr-2">{item.icon}</span>
                            <div>
                              <span className="text-xs font-medium text-gray-700">{item.label}</span>
                              <p className="text-xs text-gray-500">{item.description}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {item.status ? 'Good' : 'Missing'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* On-Page SEO Section */}
              {activeSection === 'onpage' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-blue-600" />
                    On-Page SEO Analysis
                  </h3>

                  <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Title & Meta Optimization</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Title Length</span>
                          <span className="text-xs font-bold text-blue-600">
                            {websiteData?.technical?.titleLength || 0} chars
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Optimal: 50-60 chars</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Meta Description</span>
                          <span className="text-xs font-bold text-green-600">
                            {websiteData?.technical?.metaDescriptionLength || 0} chars
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Optimal: 150-160 chars</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">H1 Tags</span>
                          <span className="text-xs font-bold text-orange-600">
                            {websiteData?.technical?.headingStructure?.h1Count || 0}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Should be 1 per page</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Heading Hierarchy</span>
                          <span className={`text-xs font-bold ${websiteData?.technical?.headingStructure?.properHierarchy ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {websiteData?.technical?.headingStructure?.properHierarchy ? 'Good' : 'Issues'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">H1 → H2 → H3</div>
                      </div>
                    </div>
                  </div>

                  {/* Image Optimization Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Image Optimization</h4>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">Alt Text Coverage</span>
                          <span className="text-xs font-bold text-purple-600">
                            {websiteData?.performance?.imageCount > 0 ?
                              Math.round((websiteData?.technical?.imagesWithAlt / websiteData?.performance?.imageCount) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{
                              width: `${websiteData?.performance?.imageCount > 0 ?
                                Math.round((websiteData?.technical?.imagesWithAlt / websiteData?.performance?.imageCount) * 100) : 0}%`
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded p-2">
                          <span className="text-xs text-gray-600">Images Missing Alt:</span>
                          <span className="text-xs font-bold text-red-600">{websiteData?.technical?.imagesWithoutAlt || 0}</span>
                        </div>
                        <div className="bg-white rounded p-2">
                          <span className="text-xs text-gray-600">Missing Dimensions:</span>
                          <span className="text-xs font-bold text-orange-600">{websiteData?.technical?.imagesWithoutDimensions || 0}</span>
                        </div>
                      </div>

                      {/* Image Optimization Code Example */}
                      <div className="bg-yellow-50 rounded p-3 border border-yellow-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">Image Optimization Example:</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Current:</p>
                            <code className="text-xs text-red-600 block bg-red-100 p-2 rounded">&lt;img src="image.jpg" alt="" /&gt;</code>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Suggested:</p>
                            <code className="text-xs text-green-600 block bg-green-100 p-2 rounded">&lt;img src="image.webp" alt="Descriptive alt text" width="800" height="600" loading="lazy" /&gt;</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Off-Page SEO Section */}
              {activeSection === 'offpage' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-purple-600" />
                    Off-Page SEO Analysis
                  </h3>

                  <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Authority & Backlinks</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Domain Authority</span>
                          <span className="text-xs font-bold text-purple-600">
                            {analysis.seoMetrics?.domainAuthority || analysis.technical?.domainAuthority || 0}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-linear-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
                            style={{ width: `${analysis.seoMetrics?.domainAuthority || analysis.technical?.domainAuthority || 0}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Backlinks</span>
                          <span className="text-xs font-bold text-blue-600">
                            {analysis.seoMetrics?.backlinksCount || analysis.technical?.estimatedBacklinks || 0}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Estimated total</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Referring Domains</span>
                          <span className="text-xs font-bold text-green-600">
                            {analysis.seoMetrics?.referringDomains || Math.round((analysis.technical?.estimatedBacklinks || 0) * 0.3)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Unique domains</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Organic Keywords</span>
                          <span className="text-xs font-bold text-orange-600">
                            {analysis.seoMetrics?.organicKeywords || Math.round((analysis.technical?.estimatedOrganicTraffic || 0) * 0.1)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Ranking keywords</div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Optimization */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Social Media Optimization</h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Open Graph Tags', status: analysis.performance?.hasOpenGraph || websiteData?.performance?.hasOpenGraph, icon: '📘' },
                        { label: 'Twitter Cards', status: analysis.performance?.hasTwitterCards || websiteData?.performance?.hasTwitterCards, icon: '🐦' },
                        { label: 'Facebook Shareable', status: analysis.technical?.socialSharing?.facebookShareable, icon: '📘' },
                        { label: 'Twitter Shareable', status: analysis.technical?.socialSharing?.twitterShareable, icon: '🐦' },
                        { label: 'LinkedIn Shareable', status: analysis.technical?.socialSharing?.linkedinShareable, icon: '💼' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded p-2">
                          <div className="flex items-center">
                            <span className="mr-2">{item.icon}</span>
                            <span className="text-xs text-gray-700">{item.label}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {item.status ? 'Good' : 'Missing'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Social Media Code Example */}
                    <div className="bg-blue-50 rounded p-3 border border-blue-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">Social Media Tags Example:</p>
                      <code className="text-xs text-blue-600 block bg-blue-100 p-2 rounded">
                        &lt;meta property="og:title" content="Page Title" /&gt;<br />
                        &lt;meta property="og:description" content="Page Description" /&gt;<br />
                        &lt;meta name="twitter:card" content="summary_large_image" /&gt;
                      </code>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Quality Section */}
              {activeSection === 'content' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Monitor className="w-4 h-4 mr-2 text-green-600" />
                    Content Quality & E-E-A-T Analysis
                  </h3>

                  <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Content Quality Metrics</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Content Score</span>
                          <span className="text-xs font-bold text-green-600">
                            {analysis.seoMetrics?.contentDepthScore || 0}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Overall quality</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Readability</span>
                          <span className="text-xs font-bold text-indigo-600">
                            {analysis.technical?.readabilityScore?.readingLevel || 'Standard'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Grade level</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Word Count</span>
                          <span className="text-xs font-bold text-blue-600">
                            {analysis.performance?.wordCount || 0}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Total words</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Content Length</span>
                          <span className="text-xs font-bold text-purple-600">
                            {analysis.performance?.contentLength || 0}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Characters</div>
                      </div>
                    </div>
                  </div>

                  {/* E-E-A-T Signals */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">E-E-A-T Signals</h4>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-gray-700">Experience</span>
                            <span className="ml-2 text-xs text-gray-500">First-hand knowledge</span>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                            {analysis.detailedRecommendations?.content?.experience ? 'Present' : 'Needs Work'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">Original insights and real examples</p>
                      </div>

                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-gray-700">Expertise</span>
                            <span className="ml-2 text-xs text-gray-500">Author credentials</span>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {analysis.detailedRecommendations?.content?.expertise ? 'Present' : 'Needs Work'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">Accurate, well-sourced information</p>
                      </div>

                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-gray-700">Authoritativeness</span>
                            <span className="ml-2 text-xs text-gray-500">Industry recognition</span>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                            {analysis.detailedRecommendations?.content?.authoritativeness ? 'Present' : 'Needs Work'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">Cited by others, thought leadership</p>
                      </div>

                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-gray-700">Trustworthiness</span>
                            <span className="ml-2 text-xs text-gray-500">Transparency</span>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                            {analysis.detailedRecommendations?.content?.trustworthiness ? 'Present' : 'Needs Work'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">Accurate info, contact details</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Optimization Suggestions */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Content Optimization</h4>
                    <div className="space-y-3">
                      <div className="bg-white rounded p-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Font Size Optimization:</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Current Issue:</p>
                            <code className="text-xs text-red-600 block bg-red-100 p-2 rounded">font-size: 12px (too small for mobile)</code>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Suggested Fix:</p>
                            <code className="text-xs text-green-600 block bg-green-100 p-2 rounded">font-size: 16px (mobile-friendly)</code>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded p-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Content Depth Enhancement:</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Current:</p>
                            <code className="text-xs text-red-600 block bg-red-100 p-2 rounded">Content length: {analysis.performance?.contentLength || 0} chars</code>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Recommendation:</p>
                            <code className="text-xs text-green-600 block bg-green-100 p-2 rounded">Target: 2000+ words for comprehensive coverage</code>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded p-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Readability Improvements:</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Current:</p>
                            <code className="text-xs text-red-600 block bg-red-100 p-2 rounded">Reading Level: {analysis.technical?.readabilityScore?.readingLevel || 'Standard'}</code>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Suggested:</p>
                            <code className="text-xs text-green-600 block bg-green-100 p-2 rounded">Target: 8th-10th grade for broad audience</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeSection === 'performance' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-orange-600" />
                    Performance Metrics
                  </h3>

                  {performanceData ? (
                    <div className="space-y-4">
                      <div className="bg-linear-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Google PageSpeed Insights</h4>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-gray-600">Performance Score</span>
                          <span className={`text-lg font-bold ${performanceData.performanceScore >= 90 ? 'text-green-600' :
                            performanceData.performanceScore >= 50 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                            {performanceData.performanceScore}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${performanceData.performanceScore >= 90 ? 'bg-green-500' :
                              performanceData.performanceScore >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                            style={{ width: `${performanceData.performanceScore}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600">FCP</span>
                            <span className="text-xs font-bold text-blue-600">
                              {performanceData.FCP}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">First Contentful Paint</div>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600">LCP</span>
                            <span className="text-xs font-bold text-orange-600">
                              {performanceData.LCP}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">Largest Contentful Paint</div>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600">CLS</span>
                            <span className="text-xs font-bold text-red-600">
                              {performanceData.CLS}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">Cumulative Layout Shift</div>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600">TTFB</span>
                            <span className="text-xs font-bold text-green-600">
                              {performanceData.TTFB}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">Time to First Byte</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-gray-600 text-sm">Performance data loading...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Section Analysis from LLM */}
              {activeSection.startsWith('section-') && analysis.sectionAnalysis && (
                <div className="space-y-4">
                  {(() => {
                    const sectionIndex = parseInt(activeSection.split('-')[1])
                    const section = analysis.sectionAnalysis[sectionIndex]
                    if (!section) return null

                    return (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-purple-600" />
                          {section.sectionName}
                        </h3>

                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-linear-to-r from-purple-50 to-indigo-50 px-3 py-2 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {section.sectionType}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 space-y-3">
                            {/* Issues */}
                            {section.issues && section.issues.length > 0 && (
                              <div>
                                <h5 className="text-xs font-medium text-red-700 mb-2">Issues ({section.issues.length})</h5>
                                <div className="space-y-2">
                                  {section.issues.map((issue: any, issueIndex: number) => (
                                    <div key={issueIndex} className="bg-red-50 rounded p-2 border border-red-100">
                                      <p className="text-xs font-medium text-red-900">{issue.problem}</p>
                                      <p className="text-xs text-gray-600 mt-1">{issue.recommendation}</p>

                                      {/* Code Examples for Issues */}
                                      {issue.evidence && (
                                        <div className="mt-2">
                                          <p className="text-xs font-medium text-gray-700 mb-1">Current Code:</p>
                                          <code className="text-xs text-red-600 block bg-red-100 p-2 rounded mt-1">{issue.evidence}</code>
                                        </div>
                                      )}

                                      {issue.suggestedCode && (
                                        <div className="mt-2">
                                          <p className="text-xs font-medium text-gray-700 mb-1">Suggested Code:</p>
                                          <code className="text-xs text-green-600 block bg-green-100 p-2 rounded mt-1">{issue.suggestedCode}</code>
                                        </div>
                                      )}

                                      {issue.implementation && (
                                        <div className="mt-2 bg-gray-50 rounded p-2">
                                          <p className="text-xs font-medium text-gray-700 mb-1">Implementation:</p>
                                          <p className="text-xs text-gray-600">{issue.implementation}</p>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Strengths */}
                            {section.strengths && section.strengths.length > 0 && (
                              <div>
                                <h5 className="text-xs font-medium text-green-700 mb-2">Strengths ({section.strengths.length})</h5>
                                <div className="space-y-2">
                                  {section.strengths.map((strength: any, strengthIndex: number) => (
                                    <div key={strengthIndex} className="bg-green-50 rounded p-2 border border-green-100">
                                      <p className="text-xs text-green-900">{strength.positive}</p>
                                      <p className="text-xs text-gray-600 mt-1">{strength.reason}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Suggestions */}
                            {section.suggestions && section.suggestions.length > 0 && (
                              <div>
                                <h5 className="text-xs font-medium text-blue-700 mb-2">Suggestions ({section.suggestions.length})</h5>
                                <div className="space-y-2">
                                  {section.suggestions.map((suggestion: any, suggestionIndex: number) => (
                                    <div key={suggestionIndex} className="bg-blue-50 rounded p-2 border border-blue-100">
                                      <p className="text-xs text-blue-900">{suggestion.improvement}</p>
                                      <p className="text-xs text-gray-600 mt-1">{suggestion.benefit}</p>

                                      {/* Code Examples for Suggestions */}
                                      {suggestion.currentCode && (
                                        <div className="mt-2">
                                          <p className="text-xs font-medium text-gray-700 mb-1">Current Code:</p>
                                          <code className="text-xs text-red-600 block bg-red-100 p-2 rounded mt-1">{suggestion.currentCode}</code>
                                        </div>
                                      )}

                                      {suggestion.suggestedCode && (
                                        <div className="mt-2">
                                          <p className="text-xs font-medium text-gray-700 mb-1">Suggested Code:</p>
                                          <code className="text-xs text-green-600 block bg-green-100 p-2 rounded mt-1">{suggestion.suggestedCode}</code>
                                        </div>
                                      )}

                                      {suggestion.implementation && (
                                        <div className="mt-2 bg-gray-50 rounded p-2">
                                          <p className="text-xs font-medium text-gray-700 mb-1">Implementation:</p>
                                          <p className="text-xs text-gray-600">{suggestion.implementation}</p>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showPreview && websiteData) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">SEO Audit Tool</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setShowPreview(false)
                    setWebsiteData(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Analyze Website</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Website Preview */}
        <div className="h-[calc(100vh-4rem)]">
          <iframe
            src={websiteData.url}
            className="w-full h-full border-0"
            title="Website Preview"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    )
  }

  // Professional Landing Page
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Search className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              SEO Audit Tool
              <span className="block text-3xl md:text-4xl mt-2 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                Professional Website Analysis
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Get real-time SEO suggestions as you browse your website.
              Fix issues side-by-side with your live content and watch your rankings improve.
            </p>

            {/* Domain Input */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Enter your website domain (e.g., example.com)"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-3 outline-none text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handlePreview()}
                  />
                  <button
                    onClick={handlePreview}
                    disabled={!domain || isAnalyzing}
                    className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Preview Website</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div className="mt-4 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg text-center">
                  {error}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10K+</div>
                <div className="text-gray-400">Websites Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">95%</div>
                <div className="text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-400">Live Analysis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-gray-400">SEO Checks</div>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                <Monitor className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Live Website Preview</h3>
                <p className="text-gray-300">See your website in real-time with SEO suggestions overlay. No code viewing required.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                <BarChart3 className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Side-by-Side Analysis</h3>
                <p className="text-gray-300">Get actionable suggestions as you scroll through your site with before/after code examples.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">One-Click Fixes</h3>
                <p className="text-gray-300">Apply SEO improvements instantly with our AI-powered recommendation engine.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-300">Get professional SEO insights in 3 simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Enter Domain</h3>
            <p className="text-gray-300">Simply input your website URL and we'll load a live preview</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Analysis</h3>
            <p className="text-gray-300">Our AI analyzes your site for 500+ SEO factors in real-time</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Fix Issues</h3>
            <p className="text-gray-300">Get step-by-step instructions to improve your rankings</p>
          </div>
        </div>
      </div>
    </div>
  )
}
