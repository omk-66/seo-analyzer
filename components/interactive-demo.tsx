"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgressCircle } from "@/components/ui/progressCircle"
import {
  Globe,
  FileText,
  Link2,
  Users,
  Gauge,
  Share2,
  ExternalLink,
  Monitor,
  Smartphone,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Linkedin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Anchor,
  BarChart,
  Code,
  Building,
  ImageIcon,
  Lock,
  Server,
  FileSearch,
  Zap,
  ArrowRight,
  RefreshCw,
  Maximize2,
  LockIcon
} from "lucide-react"

// Detailed dummy data for www.laughlogiclabs.com
const demoAnalysisData = {
  url: "www.laughlogiclabs.com",
  overallScore: 87,
  siteType: "SaaS Website",
  onPageSEO: {
    titleTag: {
      exists: true,
      title: "Laugh Logic Labs - Innovative Software Solutions",
      length: 48,
      isOptimalLength: true,
      minLength: 50,
      maxLength: 60,
      status: "good" as const,
      message: "Your title tag is well optimized"
    },
    metaDescription: {
      exists: true,
      description: "Laugh Logic Labs provides cutting-edge software solutions, web development, and digital transformation services. Transform your business with our innovative technology solutions.",
      length: 162,
      isOptimalLength: true,
      minLength: 120,
      maxLength: 160,
      status: "good" as const,
      message: "Your meta description is well optimized"
    },
    headers: {
      hasH1: true,
      h1Tags: ["Welcome to Laugh Logic Labs"],
      headerFrequency: { h1: 1, h2: 5, h3: 12, h4: 8, h5: 3, h6: 1 },
      hasMultipleH1: false,
      status: "good" as const,
      message: "Your page has proper header structure"
    },
    contentAmount: {
      wordCount: 2847,
      status: "good" as const,
      message: "Your content length is excellent for SEO"
    },
    imageAlt: {
      totalImages: 24,
      imagesWithAlt: 22,
      imagesWithoutAlt: 2,
      altTextExamples: ["team photo", "office building", "coding session"],
      status: "warning" as const,
      message: "2 images are missing alt text"
    },
    language: {
      hasLangAttribute: true,
      declaredLanguage: "en",
      status: "good" as const,
      message: "Language properly declared"
    },
    canonicalTag: {
      exists: true,
      status: "good" as const,
      message: "Canonical tag is properly configured",
      canonicalUrl: "https://www.laughlogiclabs.com/"
    },
    schemaOrg: {
      exists: true,
      status: "good" as const,
      message: "Schema.org structured data is present"
    },
    identitySchema: {
      exists: true,
      status: "good" as const,
      message: "Organization schema is present"
    },
    robotsTxt: {
      exists: true,
      status: "good" as const,
      message: "robots.txt is accessible"
    },
    sitemap: {
      exists: true,
      status: "good" as const,
      message: "XML sitemap is accessible"
    },
    favicon: {
      exists: true,
      status: "good" as const,
      message: "Favicon is configured"
    }
  },
  backlinks: {
    counts: {
      total: 3847,
      doFollow: 2841,
      noFollow: 1006,
      fromHomePage: 892,
      fromBlog: 1234,
      fromSocial: 567
    },
    domains: {
      total: 234,
      doFollow: 189,
      noFollow: 45,
      gov: 3,
      edu: 7
    },
    ips: 178,
    authority: {
      domainAuthority: 42,
      pageAuthority: 56,
      citationFlow: 45,
      trustFlow: 38
    },
    topAnchorUrlsByBacklinks: [
      { url: "/services", count: 234, doFollow: 189 },
      { url: "/about", count: 189, doFollow: 156 },
      { url: "/blog/software-development", count: 156, doFollow: 134 },
      { url: "/contact", count: 134, doFollow: 98 },
      { url: "/portfolio", count: 98, doFollow: 87 },
      { url: "/pricing", count: 87, doFollow: 76 },
      { url: "/blog/web-design-tips", count: 76, doFollow: 65 },
      { url: "/team", count: 65, doFollow: 54 }
    ],
    topAnchorsByBacklinks: [
      { anchor: " Laugh Logic Labs ", count: 456, doFollow: 389 },
      { anchor: "software development company", count: 312, doFollow: 267 },
      { anchor: "web development services", count: 278, doFollow: 234 },
      { anchor: "learn more", count: 234, doFollow: 198 },
      { anchor: "click here", count: 189, doFollow: 156 },
      { anchor: "innovative solutions", count: 167, doFollow: 145 },
      { anchor: "digital transformation", count: 145, doFollow: 123 }
    ],
    topReferralDomains: [
      { domain: "techcrunch.com", backlinks: 234, authority: 89 },
      { domain: "forbes.com", backlinks: 189, authority: 95 },
      { domain: "github.com", backlinks: 156, authority: 92 },
      { domain: "stackoverflow.com", backlinks: 134, authority: 88 },
      { domain: "medium.com", backlinks: 98, authority: 82 }
    ]
  },
  performance: {
    strategy: "desktop",
    scores: {
      performance: 78,
      accessibility: 92,
      bestPractices: 89,
      seo: 95
    },
    performance: {
      largestContentfulPaintMs: 2340,
      largestContentfulPaintCategory: "needs-improvement",
      cumulativeLayoutShift: 0.08,
      cumulativeLayoutShiftCategory: "good",
      totalBlockingTimeMs: 145,
      totalBlockingTimeCategory: "needs-improvement",
      serverResponseTimeMs: 320,
      firstContentfulPaintMs: 1120,
      speedIndexMs: 2890,
      timeToInteractiveMs: 3450,
      renderBlockingResourcesMs: 89
    },
    resourceBreakdown: {
      totalRequests: 67,
      javascript: { requests: 28, size: 1250 },
      css: { requests: 12, size: 234 },
      images: { requests: 18, size: 3450 },
      fonts: { requests: 4, size: 156 },
      other: { requests: 5, size: 45 }
    },
    metrics: {
      mainDocumentTransferSize: 45,
      htmlTransferSize: 12,
      staticAssetsTransferSize: 4235
    }
  },
  social: {
    facebook: { found: true, url: "https://facebook.com/laughlogiclabs", followers: 5234, likes: 4890 },
    twitter: { found: true, url: "https://twitter.com/laughlogic", followers: 3421, tweets: 1234 },
    linkedin: { found: true, url: "https://linkedin.com/company/laughlogiclabs", followers: 1876, employees: 45 },
    instagram: { found: true, url: "https://instagram.com/laughlogiclabs", followers: 4521, posts: 234 },
    youtube: { found: false, url: null, subscribers: 0, videos: 0 }
  },
  usability: {
    mobileScore: 72,
    desktopScore: 94,
    viewport: { configured: true, width: "device-width" },
    tapTargets: { good: 45, needsImprovement: 3, tooClose: 1 },
    fontSize: { readable: true, baseSize: 16 },
    plugins: { used: 0 },
    viewportMeta: { found: true, content: "width=device-width, initial-scale=1" }
  }
}

export function InteractiveDemo() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("onpage")
  const [showTitleInfo, setShowTitleInfo] = useState(false)
  const [showDescInfo, setShowDescInfo] = useState(false)
  const [showH1Info, setShowH1Info] = useState(false)
  const [showH2Info, setShowH2Info] = useState(false)
  const [showContentInfo, setShowContentInfo] = useState(false)
  const [showImageInfo, setShowImageInfo] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning": return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "error": return <XCircle className="w-5 h-5 text-red-500" />
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-green-500/10 text-green-500 border-green-500/20"
      case "warning": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "error": return "bg-red-500/10 text-red-500 border-red-500/20"
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getScoreVariant = (score: number) => {
    if (score >= 90) return "success"
    if (score >= 70) return "warning"
    return "error"
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="w-full max-w-6xl 2xl:max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          Interactive Demo
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          See WebsiteScore in Action
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Comprehensive SEO audit powered by Google AI • {demoAnalysisData.siteType}
        </p>
      </div>

      {/* Demo Container with Browser Frame */}
      <div className="rounded-[1.3rem] border border-base-content/5 bg-neutral/5 p-1.5 dark:bg-neutral/50 w-full max-w-6xl 2xl:max-w-7xl mx-auto">
        <div className="relative hidden md:block">
          {/* Speech Bubble - Top */}
          <div className="absolute -top-4 right-4 flex -translate-y-full animate-pulse items-center gap-2 z-10">
            <svg className="fill-base-secondary mt-2 w-8 -rotate-[24deg] opacity-60" viewBox="0 0 219 41" fill="none">
              <g clipPath="url(#clip0_3_248)">
                <path d="M21.489 29.4305C36.9333 31.3498 51.3198 33.0559 65.7063 34.9753C66.7641 35.1885 67.6104 36.4681 69.9376 38.3875C63.1675 39.2406 57.8783 40.3069 52.5892 40.5201C38.6259 40.9467 24.8741 40.9467 10.9107 40.9467C9.21821 40.9467 7.5257 41.1599 5.83317 40.7334C0.332466 39.6671 -1.57164 36.0416 1.39028 31.1365C2.87124 28.7906 4.56377 26.658 6.46786 24.7386C13.6611 17.4876 21.0659 10.4499 28.4707 3.41224C29.7401 2.13265 31.6442 1.49285 34.183 0C34.6061 10.8765 23.8162 13.8622 21.489 22.3927C23.3931 21.9662 25.0856 21.7529 26.5666 21.3264C83.6894 5.54486 140.601 7.25099 197.3 22.606C203.224 24.0988 208.936 26.4447 214.649 28.5773C217.61 29.6437 220.149 31.9896 218.457 35.6151C216.976 39.2406 214.014 39.2406 210.629 37.7477C172.759 20.6866 132.561 18.7672 91.9404 19.407C70.7838 19.6203 50.0504 21.9662 29.5285 26.8713C26.9897 27.5111 24.4509 28.3641 21.489 29.4305Z"></path>
              </g>
              <defs><clipPath id="clip0_3_248"><rect width="219" height="41"></rect></clipPath></defs>
            </svg>
            <span className="text-base-secondary text-sm">Interactive demo</span>
          </div>

          {/* Browser Frame Container */}
          <div className="custom-card group relative mx-auto flex flex-col overflow-hidden bg-base-100 rounded-[1rem]" style={{ aspectRatio: '5 / 3.6' }}>

            {/* Browser Header */}
            <div className="relative z-10 flex w-full items-center border-b-[0.5px] border-base-content/5 bg-base-100 px-4 py-2 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
              {/* Traffic Lights */}
              <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center justify-start space-x-1.5">
                <span className="size-2.5 rounded-full bg-red-400"></span>
                <span className="size-2.5 rounded-full bg-yellow-400"></span>
                <span className="size-2.5 rounded-full bg-green-400"></span>
              </div>

              {/* URL Bar */}
              <div className="w-full text-center text-sm flex items-center justify-center">
                <span className="text-base-content/50">https://</span>
                <span className="text-base-content font-medium">{demoAnalysisData.url}</span>
              </div>

              {/* Fullscreen Button */}
              <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center md:flex">
                <button className="btn btn-square btn-ghost btn-sm" title="Enter fullscreen">
                  <Maximize2 className="size-[18px]" />
                </button>
              </div>
            </div>

            {/* Main Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto bg-base-300">

              {isLoading ? (
                // Loading Animation
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="w-8 h-8 text-emerald-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-base-content mb-2">Analyzing {demoAnalysisData.url}...</h3>
                    <p className="text-base-content/60 text-center max-w-md mb-6">
                      Comprehensive audit powered by Google AI • {demoAnalysisData.siteType}
                    </p>
                    <div className="flex flex-col gap-2 text-sm w-full max-w-xs">
                      {[
                        "Analyzing page structure",
                        "Checking meta tags",
                        "Evaluating content quality",
                        "Measuring performance metrics",
                        "Analyzing backlinks profile",
                        "Checking social signals"
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-base-content/70">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: `${idx * 200}ms` }}></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                // Results - with padding
                <div className="p-4">
                  {/* Domain Header */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-base-content/10 bg-base-100 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <Globe className="w-6 h-6 text-emerald-500" />
                      <div>
                        <h3 className="font-semibold text-base-content">{demoAnalysisData.url}</h3>
                        <p className="text-sm text-base-content/60">Full SEO Analysis Report</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" className="gap-1">
                        <RefreshCw className="w-3 h-3" />
                        Re-analyze
                      </Button>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-500">{demoAnalysisData.overallScore}</div>
                        <div className="text-xs text-base-content/60">Overall Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="bg-base-100 rounded-lg p-2 mb-4 border border-gray-300">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-5 mb-2 bg-base-200/50">
                        {[
                          { id: "onpage", icon: FileText, label: "Page SEO" },
                          { id: "links", icon: Link2, label: "Links" },
                          { id: "usability", icon: Users, label: "Usability" },
                          { id: "performance", icon: Gauge, label: "Performance" },
                          { id: "social", icon: Share2, label: "Social" }
                        ].map(tab => (
                          <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1 text-xs">
                            <tab.icon className="w-3 h-3" />
                            <span className="hidden lg:inline">{tab.label}</span>
                            <span className="lg:hidden">{tab.label.slice(0, 2)}</span>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {/* Page SEO Tab */}
                      <TabsContent value="onpage">
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                          <Card className="mb-3">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">On-Page SEO Score</CardTitle>
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">92/100</Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <Progress value={92} className="h-2" />
                            </CardContent>
                          </Card>

                          <Card className="mb-3">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-sm flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  Title Tag
                                </CardTitle>
                                {getStatusIcon(demoAnalysisData.onPageSEO.titleTag.status)}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xs bg-green-50 p-2 rounded border border-green-200">{demoAnalysisData.onPageSEO.titleTag.title}</p>
                              <p className="text-xs text-green-600 mt-1">{demoAnalysisData.onPageSEO.titleTag.length} chars • Optimal</p>
                            </CardContent>
                          </Card>

                          <Card className="mb-3">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-sm flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  Meta Description
                                </CardTitle>
                                {getStatusIcon(demoAnalysisData.onPageSEO.metaDescription.status)}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xs bg-green-50 p-2 rounded border border-green-200">{demoAnalysisData.onPageSEO.metaDescription.description.slice(0, 100)}...</p>
                              <p className="text-xs text-green-600 mt-1">{demoAnalysisData.onPageSEO.metaDescription.length} chars • Optimal</p>
                            </CardContent>
                          </Card>

                          <Card className="mb-3">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Content & Headers
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex justify-between p-2 bg-green-50 rounded">
                                  <span>Words</span>
                                  <span className="font-medium">{demoAnalysisData.onPageSEO.contentAmount.wordCount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-green-50 rounded">
                                  <span>H1</span>
                                  <span className="font-medium">{demoAnalysisData.onPageSEO.headers.h1Tags.length}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-green-50 rounded">
                                  <span>H2-H6</span>
                                  <span className="font-medium">{demoAnalysisData.onPageSEO.headers.headerFrequency.h2 + demoAnalysisData.onPageSEO.headers.headerFrequency.h3}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-yellow-50 rounded">
                                  <span>Images no alt</span>
                                  <span className="font-medium">{demoAnalysisData.onPageSEO.imageAlt.imagesWithoutAlt}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="mb-3">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <Server className="w-4 h-4" />
                                Technical SEO
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-1 text-xs">
                                {[
                                  { label: "Language", status: demoAnalysisData.onPageSEO.language.status, value: demoAnalysisData.onPageSEO.language.declaredLanguage?.toUpperCase() },
                                  { label: "Canonical", status: demoAnalysisData.onPageSEO.canonicalTag.status, value: "✓" },
                                  { label: "Schema.org", status: demoAnalysisData.onPageSEO.schemaOrg.status, value: "✓" },
                                ].map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-1.5 bg-gray-50 rounded">
                                    <span>{item.label}</span>
                                    {getStatusIcon(item.status)}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      {/* Links Tab */}
                      <TabsContent value="links">
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                          <Card className="mb-3">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Links Score</CardTitle>
                                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">78/100</Badge>
                              </div>
                            </CardHeader>
                            <CardContent><Progress value={78} className="h-2" /></CardContent>
                          </Card>

                          <div className="grid grid-cols-4 gap-2 mb-3">
                            {[
                              { label: "Backlinks", value: demoAnalysisData.backlinks.counts.total, color: "blue" },
                              { label: "DoFollow", value: demoAnalysisData.backlinks.counts.doFollow, color: "green" },
                              { label: "Domains", value: demoAnalysisData.backlinks.domains.total, color: "purple" },
                              { label: "IPs", value: demoAnalysisData.backlinks.ips, color: "teal" }
                            ].map((item, idx) => (
                              <Card key={idx} className="text-center py-2">
                                <div className="text-lg font-bold">{item.value.toLocaleString()}</div>
                                <div className="text-xs text-base-content/60">{item.label}</div>
                              </Card>
                            ))}
                          </div>

                          <Card className="mb-3">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">Authority Metrics</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                                <div><div className="font-bold text-green-600">{demoAnalysisData.backlinks.authority.domainAuthority}</div><div>DA</div></div>
                                <div><div className="font-bold text-green-600">{demoAnalysisData.backlinks.authority.pageAuthority}</div><div>PA</div></div>
                                <div><div className="font-bold text-blue-600">{demoAnalysisData.backlinks.authority.citationFlow}</div><div>CF</div></div>
                                <div><div className="font-bold text-purple-600">{demoAnalysisData.backlinks.authority.trustFlow}</div><div>TF</div></div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      {/* Usability Tab */}
                      <TabsContent value="usability">
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                          <Card className="mb-3">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Usability Score</CardTitle>
                                <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">83/100</Badge>
                              </div>
                            </CardHeader>
                            <CardContent><Progress value={83} className="h-2" /></CardContent>
                          </Card>

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <Card className="text-center py-4">
                              <ProgressCircle value={demoAnalysisData.usability.desktopScore} variant="success" radius={35} strokeWidth={5}>
                                <span className="text-xl font-bold text-green-600">{demoAnalysisData.usability.desktopScore}</span>
                              </ProgressCircle>
                              <div className="text-xs mt-2">Desktop</div>
                            </Card>
                            <Card className="text-center py-4">
                              <ProgressCircle value={demoAnalysisData.usability.mobileScore} variant="warning" radius={35} strokeWidth={5}>
                                <span className="text-xl font-bold text-yellow-600">{demoAnalysisData.usability.mobileScore}</span>
                              </ProgressCircle>
                              <div className="text-xs mt-2">Mobile</div>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Performance Tab */}
                      <TabsContent value="performance">
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                          <Card className="mb-3">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Performance Score</CardTitle>
                                <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">78/100</Badge>
                              </div>
                            </CardHeader>
                            <CardContent><Progress value={78} className="h-2" /></CardContent>
                          </Card>

                          <div className="grid grid-cols-4 gap-2 mb-3">
                            {[
                              { label: "Performance", score: demoAnalysisData.performance.scores.performance },
                              { label: "Access", score: demoAnalysisData.performance.scores.accessibility },
                              { label: "Best Prac", score: demoAnalysisData.performance.scores.bestPractices },
                              { label: "SEO", score: demoAnalysisData.performance.scores.seo }
                            ].map((item, idx) => (
                              <div key={idx} className="text-center p-2 bg-gray-50 rounded">
                                <ProgressCircle value={item.score} variant={getScoreVariant(item.score)} radius={25} strokeWidth={4}>
                                  <span className={`text-sm font-bold ${getScoreColor(item.score)}`}>{item.score}</span>
                                </ProgressCircle>
                                <div className="text-xs mt-1">{item.label}</div>
                              </div>
                            ))}
                          </div>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">Core Web Vitals</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div className="p-2 bg-yellow-50 rounded">
                                  <div className="font-bold">{(demoAnalysisData.performance.performance.largestContentfulPaintMs / 1000).toFixed(1)}s</div>
                                  <div>LCP</div>
                                </div>
                                <div className="p-2 bg-green-50 rounded">
                                  <div className="font-bold">{demoAnalysisData.performance.performance.cumulativeLayoutShift}</div>
                                  <div>CLS</div>
                                </div>
                                <div className="p-2 bg-yellow-50 rounded">
                                  <div className="font-bold">{demoAnalysisData.performance.performance.totalBlockingTimeMs}ms</div>
                                  <div>TBT</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      {/* Social Tab */}
                      <TabsContent value="social">
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                          <Card className="mb-3">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Social Signals</CardTitle>
                                <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">85/100</Badge>
                              </div>
                            </CardHeader>
                            <CardContent><Progress value={85} className="h-2" /></CardContent>
                          </Card>

                          <div className="space-y-2">
                            {[
                              { platform: "Facebook", data: demoAnalysisData.social.facebook, icon: Facebook, color: "text-blue-600", found: demoAnalysisData.social.facebook.found },
                              { platform: "Twitter", data: demoAnalysisData.social.twitter, icon: Twitter, color: "text-sky-500", found: demoAnalysisData.social.twitter.found },
                              { platform: "LinkedIn", data: demoAnalysisData.social.linkedin, icon: Linkedin, color: "text-blue-700", found: demoAnalysisData.social.linkedin.found },
                              { platform: "Instagram", data: demoAnalysisData.social.instagram, icon: Instagram, color: "text-pink-500", found: demoAnalysisData.social.instagram.found },
                              { platform: "YouTube", data: demoAnalysisData.social.youtube, icon: Youtube, color: "text-red-600", found: demoAnalysisData.social.youtube.found },
                            ].map((item, idx) => (
                              <div key={idx} className={`flex items-center justify-between p-2 rounded ${item.found ? 'bg-green-50' : 'bg-red-50'}`}>
                                <div className="flex items-center gap-2">
                                  <item.icon className={`w-4 h-4 ${item.color}`} />
                                  <span className="text-sm font-medium">{item.platform}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {item.found ? (
                                    <>
                                      <span className="text-xs">{(item.data as any).followers?.toLocaleString()}</span>
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    </>
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* CTA */}
                    <div className="mt-3 pt-3 border-t border-base-content/10 flex items-center justify-between bg-base-100 rounded-lg p-2">
                      <div className="text-xs text-base-content/60">
                        Want detailed report? <span className="text-emerald-500 font-medium">Create free account</span>
                      </div>
                      <Button className="bg-emerald-500 hover:bg-emerald-600 gap-1 h-8 text-xs">
                        <span>Analyze</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Speech Bubble - Bottom */}
          <div className="absolute -bottom-5 left-1/2 flex -translate-x-[15%] translate-y-full items-center gap-0">
            <svg className="fill-base-secondary opacity- -mt-14 w-11 -rotate-[-50deg] scale-y-[-1]" viewBox="0 0 219 41" fill="none">
              <g clipPath="url(#clip0_3_248)">
                <path d="M21.489 29.4305C36.9333 31.3498 51.3198 33.0559 65.7063 34.9753C66.7641 35.1885 67.6104 36.4681 69.9376 38.3875C63.1675 39.2406 57.8783 40.3069 52.5892 40.5201C38.6259 40.9467 24.8741 40.9467 10.9107 40.9467C9.21821 40.9467 7.5257 41.1599 5.83317 40.7334C0.332466 39.6671 -1.57164 36.0416 1.39028 31.1365C2.87124 28.7906 4.56377 26.658 6.46786 24.7386C13.6611 17.4876 21.0659 10.4499 28.4707 3.41224C29.7401 2.13265 31.6442 1.49285 34.183 0C34.6061 10.8765 23.8162 13.8622 21.489 22.3927C23.3931 21.9662 25.0856 21.7529 26.5666 21.3264C83.6894 5.54486 140.601 7.25099 197.3 22.606C203.224 24.0988 208.936 26.4447 214.649 28.5773C217.61 29.6437 220.149 31.9896 218.457 35.6151C216.976 39.2406 214.014 39.2406 210.629 37.7477C172.759 20.6866 132.561 18.7672 91.9404 19.407C70.7838 19.6203 50.0504 21.9662 29.5285 26.8713C26.9897 27.5111 24.4509 28.3641 21.489 29.4305Z"></path>
              </g>
              <defs><clipPath id="clip0_3_248"><rect width="219" height="41"></rect></clipPath></defs>
            </svg>
            <span className="text-base-secondary text-center text-sm">Try this ✨<br /> (people are addicted)</span>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-4">
          <Card className="p-6 text-center">
            <Globe className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
            <h3 className="font-semibold text-base-content mb-2">See WebsiteScore in Action</h3>
            <p className="text-sm text-base-content/60 mb-4">Comprehensive SEO audit powered by Google AI</p>
            <Button className="bg-emerald-500 w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              Try Demo
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
