'use client'

import { useState } from 'react'
import { Search, Loader2, AlertCircle, CheckCircle, XCircle, ExternalLink, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { SEOAnalysisTabbed } from '@/components/seo-analysis-sidebar'
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
    <div className="min-h-screen bg-liner-to-br from-slate-50 to-slate-100">
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
          <div className="max-w-6xl mx-auto">
            <SEOAnalysisTabbed analysis={analysis} url={analysis.url || domain} />

            {/* Action Button */}
            <div className="text-center mt-8">
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
