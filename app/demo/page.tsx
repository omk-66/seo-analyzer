"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Globe2, Loader2, CheckCircle, AlertCircle, XCircle, TrendingUp, Shield, Zap } from "lucide-react"

// Mock analysis data
const mockAnalysisData = {
  url: "example.com",
  overallScore: 85,
  categories: [
    {
      title: "Technical SEO",
      score: 92,
      icon: <Globe2 className="h-5 w-5" />,
      issues: [
        { type: "success", message: "XML sitemap found and accessible" },
        { type: "success", message: "Robots.txt configured correctly" },
        { type: "warning", message: "Missing structured data markup" },
        { type: "error", message: "Slow page load speed detected" }
      ]
    },
    {
      title: "On-Page SEO",
      score: 78,
      icon: <TrendingUp className="h-5 w-5" />,
      issues: [
        { type: "success", message: "Title tags are optimized" },
        { type: "warning", message: "Meta descriptions could be improved" },
        { type: "error", message: "H1 tags missing on some pages" },
        { type: "warning", message: "Image alt text incomplete" }
      ]
    },
    {
      title: "Performance",
      score: 88,
      icon: <Zap className="h-5 w-5" />,
      issues: [
        { type: "success", message: "Images are properly optimized" },
        { type: "success", message: "Browser caching enabled" },
        { type: "warning", message: "CSS could be minified" },
        { type: "success", message: "JavaScript loading optimized" }
      ]
    },
    {
      title: "Security",
      score: 95,
      icon: <Shield className="h-5 w-5" />,
      issues: [
        { type: "success", message: "HTTPS properly configured" },
        { type: "success", message: "Security headers implemented" },
        { type: "success", message: "No mixed content detected" },
        { type: "warning", message: "Consider implementing CSP" }
      ]
    }
  ]
}

function IssueItem({ issue }: { issue: any }) {
  const getIcon = () => {
    switch (issue.type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex items-center gap-3 py-2">
      {getIcon()}
      <span className="text-sm text-foreground">{issue.message}</span>
    </div>
  )
}

function CategoryCard({ category }: { category: any }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {category.icon}
            </div>
            <CardTitle className="text-lg">{category.title}</CardTitle>
          </div>
          <Badge variant={category.score >= 80 ? "default" : category.score >= 60 ? "secondary" : "destructive"}>
            {category.score}/100
          </Badge>
        </div>
        <Progress value={category.score} className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {category.issues.map((issue: any, index: number) => (
            <IssueItem key={index} issue={issue} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Demo() {
  const [domain, setDomain] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [analysisData, setAnalysisData] = useState(mockAnalysisData)

  const handleAnalyze = async () => {
    if (!domain || isAnalyzing) return
    
    setIsAnalyzing(true)
    
    // Simulate analysis process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update with entered domain
    setAnalysisData({
      ...mockAnalysisData,
      url: domain
    })
    
    setIsAnalyzing(false)
    setShowResults(true)
  }

  const handleReset = () => {
    setDomain("")
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            WebsiteScore Live Demo
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter any domain to see how our SEO analysis works
          </p>
        </motion.div>

        {/* Input Section */}
        {!showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="example.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="pl-10 h-12 text-lg"
                      onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
                    />
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    disabled={!domain || isAnalyzing}
                    className="h-12 px-8"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Website"
                    )}
                  </Button>
                </div>
                
                {/* Quick Demo Options */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Try:</span>
                  {["github.com", "stackoverflow.com", "medium.com"].map((site) => (
                    <Button
                      key={site}
                      variant="outline"
                      size="sm"
                      onClick={() => setDomain(site)}
                      className="text-xs"
                    >
                      {site}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Results Section */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Results Header */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
                  <p className="text-muted-foreground">
                    SEO audit for <span className="font-mono text-primary">{analysisData.url}</span>
                  </p>
                </div>
                <Button onClick={handleReset} variant="outline">
                  Analyze Another Site
                </Button>
              </div>
              
              {/* Overall Score */}
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
                  <span className="text-3xl font-bold text-primary">{analysisData.overallScore}</span>
                </div>
                <p className="text-lg font-semibold">Overall Score</p>
                <p className="text-muted-foreground">Out of 100</p>
              </div>
            </Card>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysisData.categories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <Card className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Get Detailed Insights</h3>
              <p className="text-muted-foreground mb-4">
                Sign up for free to get unlimited analyses, historical tracking, and advanced features
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Free Analysis
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
