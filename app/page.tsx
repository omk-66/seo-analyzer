'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Globe2,
  Zap,
  Lock,
  BarChart3,
  FileText,
  Link2,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SEOAnalysisTabbed } from '@/components/seo-analysis-tabbed'
import { Marquee } from '@/components/ui/marquee'

// Text reveal animation component
const AnimatedText = ({ text }: { text: string }) => {
  const words = text.match(/[\p{L}\p{N}]+[^\s\p{L}\p{N}]?|[^\s]/gu) || []

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
    }),
  }

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: "inline-block" }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ marginRight: "0.25em", display: "inline-block" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Testimonials data for marquee
const reviews = [
  {
    name: "Sarah Chen",
    username: "@sarahchen",
    body: "WebsiteScore helped me identify critical SEO issues that were killing my rankings. My organic traffic increased by 40% in just 2 weeks.",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "Mike Rodriguez",
    username: "@mikero",
    body: "Finally, an SEO audit tool that gives actionable insights instead of confusing data. The prioritized recommendations are pure gold.",
    img: "https://avatar.vercel.sh/mike",
  },
  {
    name: "Emily Watson",
    username: "@emilyw",
    body: "As a developer, I love how WebsiteScore pinpoints exact technical issues. No more guesswork - just clear, actionable fixes.",
    img: "https://avatar.vercel.sh/emily",
  },
  {
    name: "David Kim",
    username: "@davidk",
    body: "The Core Web Vitals analysis alone saved our site from a major ranking drop. Essential tool for any serious website owner.",
    img: "https://avatar.vercel.sh/david",
  },
  {
    name: "Lisa Thompson",
    username: "@lisat",
    body: "WebsiteScore's audit reports are so clear that even non-technical team members can understand and implement the fixes.",
    img: "https://avatar.vercel.sh/lisa",
  },
  {
    name: "Alex Johnson",
    username: "@alexj",
    body: "I've tried dozens of SEO tools. WebsiteScore is the only one that actually tells you what to fix first. Game changer!",
    img: "https://avatar.vercel.sh/alex",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className="relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 border-gray-950/10 bg-gray-950/1 hover:bg-gray-950/5 dark:border-gray-50/10 dark:bg-gray-50/10 dark:hover:bg-gray-50/15"
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

export default function Home() {
  const [domain, setDomain] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState('')

  const extractedDomain = useMemo(() => {
    if (!domain) return ''
    let cleanDomain = domain.replace(/^https?:\/\//, '')
    cleanDomain = cleanDomain.split('/')[0]
    cleanDomain = cleanDomain.split(':')[0]
    return cleanDomain
  }, [domain])

  const faviconUrl = extractedDomain
    ? `https://www.google.com/s2/favicons?domain=${extractedDomain}&sz=64`
    : ''

  const handleAnalyze = async () => {
    if (!domain || isAnalyzing) return

    setIsAnalyzing(true)
    setError('')
    setAnalysis(null)

    try {
      const response = await fetch('/api/onpageseo', {
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
    } catch (err) {
      console.error('Analysis error:', err)
      setError('Failed to analyze website. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setAnalysis(null)
    setError('')
    setDomain('')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.24),transparent_55%),linear-gradient(to_bottom,#020617,#020617)]">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 md:px-6 flex items-center justify-between h-16">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xs font-semibold tracking-tight">WS</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                WebsiteScore
              </span>
              <span className="text-[11px] text-muted-foreground">
                AI SEO audit & website health
              </span>
            </div>
          </motion.div>

          <motion.nav 
            className="hidden md:flex items-center gap-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.a 
              href="#features" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ y: -2 }}
            >
              Features
            </motion.a>
            <motion.a 
              href="#pricing" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ y: -2 }}
            >
              Pricing
            </motion.a>
            <motion.a 
              href="#testimonials" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ y: -2 }}
            >
              Testimonials
            </motion.a>
            <motion.div className="flex items-center gap-2 text-[11px]">
              <motion.span 
                className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-300"
                whileHover={{ scale: 1.05 }}
              >
                On-page SEO
              </motion.span>
              <motion.span 
                className="rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Technical checks
              </motion.span>
              <motion.span 
                className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Core Web Vitals
              </motion.span>
            </motion.div>
          </motion.nav>

          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button
              className="hidden sm:inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
            <motion.button
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 h-9 px-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-14">
        {/* Hero + input + value props */}
        <motion.section 
          className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-start mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Left: hero copy and form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </motion.div>
              Instant website audit (SEO, performance, trust)
            </motion.div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
              <AnimatedText text="Find what's broken." />
              <br className="hidden sm:block" />{' '}
              <AnimatedText text="Fix what matters — with" />{' '}
              <span className="bg-linear-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                <AnimatedText text="WebsiteScore" />
              </span>
              .
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mb-6">
              <AnimatedText text="Paste a URL and get a clear, prioritized report: what's hurting rankings, performance, and trust — plus the exact next steps your team can ship." />
            </p>

            <Card className="border border-border/80 bg-card/80 shadow-sm mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-emerald-400" />
                  Run an audit
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Works with landing pages, blogs, docs, and marketing sites.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 flex items-center rounded-lg border border-input bg-background/60 pr-2 shadow-[0_1px_0_rgba(15,23,42,0.4)]">
                    {extractedDomain && (
                      <span className="pl-3 shrink-0">
                        <img
                          src={faviconUrl}
                          alt=""
                          className="h-4 w-4 rounded-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </span>
                    )}
                    <Input
                      type="text"
                      placeholder="https://your-landing-page.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                      className="flex-1 h-11 border-0 bg-transparent text-sm placeholder:text-muted-foreground shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    disabled={!domain || isAnalyzing}
                    className="h-11 px-6 w-full sm:w-auto rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing…
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Run audit
                      </>
                    )}
                  </Button>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  No signup required. We don't crawl behind logins or gated content.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mt-4">
              <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-2">
                <div className="text-[11px] font-medium text-muted-foreground mb-0.5">
                  Technical SEO
                </div>
                <div className="text-sm font-semibold text-foreground">Crawl, tags, structure</div>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-2">
                <div className="text-[11px] font-medium text-muted-foreground mb-0.5">
                  Content & on-page
                </div>
                <div className="text-sm font-semibold text-foreground">Titles, copy, headings</div>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-2 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-medium text-muted-foreground mb-0.5">
                  Performance & UX
                </div>
                <div className="text-sm font-semibold text-foreground">Core Web Vitals, mobile</div>
              </div>
            </div>
          </motion.div>

          {/* Right: SaaS-style "sample score" panel when idle */}
          {!analysis && (
            <Card className="border border-border/80 bg-card/90 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Sample WebsiteScore report
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                    Demo data
                  </span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  See the kind of insight you&apos;ll get after running a real audit.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="flex items-center justify-between rounded-lg bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-emerald-50">
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wide text-emerald-100/80">
                      WebsiteScore
                    </span>
                    <span className="text-2xl font-semibold">86 / 100</span>
                  </div>
                  <div className="text-right text-[11px] text-emerald-50/90">
                    <div>Strong technical foundations</div>
                    <div>Needs content depth & schema</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-900/20 px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-emerald-200">
                        Technical SEO
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-300">
                        91%
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-100/80">
                      HTTPS, canonical tags, and indexability are correctly configured.
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-900/10 px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-amber-100">
                        Content quality
                      </span>
                      <span className="text-[11px] font-semibold text-amber-600">
                        72%
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-100/80">
                      Good keyword coverage but missing depth for comparison queries.
                    </p>
                  </div>
                  <div className="rounded-lg border border-sky-500/30 bg-sky-900/10 px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-sky-100">
                        Performance
                      </span>
                      <span className="text-[11px] font-semibold text-sky-600">
                        79%
                      </span>
                    </div>
                    <p className="text-[11px] text-sky-100/80">
                      Images and JS can be optimized further for mobile networks.
                    </p>
                  </div>
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-900/20 px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-emerald-200">
                        Accessibility
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-300">
                        88%
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-100/80">
                      Minor issues with alt text and heading hierarchy.
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-[11px] font-medium text-foreground mb-1">
                    Example next steps
                  </p>
                  <ul className="space-y-1.5 text-[11px] text-muted-foreground list-disc list-inside">
                    <li>Add Organization & Website schema for rich results.</li>
                    <li>Consolidate duplicate blog posts targeting the same keyword.</li>
                    <li>Compress hero images and lazy-load below-the-fold media.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.section>

        {/* Landing v2 sections (shown only before running an audit) */}
        {!analysis && (
          <div className="space-y-14 md:space-y-16">
            {/* Live stats */}
            <motion.section 
              className="ws-fade-up" 
              style={{ animationDelay: '20ms' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="flex items-end justify-between gap-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div>
                  <h2 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
                    How websites actually perform
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Benchmarks to set expectations before you optimize.
                  </p>
                </div>
                <motion.div 
                  className="hidden md:flex items-center gap-2 text-[11px] text-muted-foreground"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="rounded-full border border-border bg-background/40 px-3 py-1">
                    Updated on demand
                  </span>
                </motion.div>
              </motion.div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Websites analyzed', value: '28,000+', icon: BarChart3 },
                  { label: 'Avg WebsiteScore', value: '79 / 100', icon: ShieldCheck },
                  { label: 'Avg PageSpeed', value: '92 / 100', icon: Zap },
                  { label: 'Avg Trust & Security', value: '59 / 100', icon: Lock },
                ].map((s, index) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="border border-border/70 bg-card/60 hover:border-emerald-500/30 transition-colors">
                      <CardContent className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <s.icon className="h-5 w-5" />
                          </motion.div>
                          <div className="min-w-0">
                            <motion.div 
                              className="text-xl font-semibold text-foreground leading-tight"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                            >
                              {s.value}
                            </motion.div>
                            <div className="text-[11px] text-muted-foreground">
                              {s.label}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* What we check (5 pillars) */}
            <motion.section 
              id="features"
              className="ws-fade-up" 
              style={{ animationDelay: '60ms' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
                  Everything you need to rank higher
                </h2>
                <p className="text-sm text-muted-foreground">
                  Five pillars, one score, and an action plan you can follow.
                </p>
              </motion.div>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                {[
                  {
                    title: 'On-page SEO',
                    desc: 'Titles, descriptions, headings, canonicals, language.',
                    icon: FileText,
                  },
                  {
                    title: 'Performance',
                    desc: 'Core Web Vitals, render blockers, resource weight.',
                    icon: Zap,
                  },
                  {
                    title: 'Links & authority',
                    desc: 'Internal/external links, backlinks, referring domains.',
                    icon: Link2,
                  },
                  {
                    title: 'Trust & security',
                    desc: 'HTTPS, crawl signals, and trust indicators.',
                    icon: Lock,
                  },
                  {
                    title: 'Social & previews',
                    desc: 'Open Graph, Twitter Cards, profiles, contact info.',
                    icon: Globe2,
                  },
                ].map((p, index) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="border border-border/70 bg-card/60 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <motion.div 
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <p.icon className="h-4 w-4" />
                          </motion.div>
                          {p.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {p.desc}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* How it works */}
            <motion.section 
              className="ws-fade-up" 
              style={{ animationDelay: '100ms' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border border-border/70 bg-card/60 overflow-hidden">
                <CardContent className="p-5 md:p-6">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
                        From URL → roadmap in minutes
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Clear statuses, clear evidence, clear fixes. No fluff.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          title: 'Analyze',
                          desc: 'We fetch the page, run checks, and compute scores.',
                        },
                        {
                          title: 'Prioritize',
                          desc: 'Critical issues first, quick wins next, then long-term improvements.',
                        },
                        {
                          title: 'Ship fixes',
                          desc: 'Use the report as a ticket list for dev + content.',
                        },
                      ].map((step, i) => (
                        <motion.div
                          key={step.title}
                          className="flex items-start gap-3 rounded-xl border border-border bg-background/30 p-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-200 text-xs font-semibold">
                            {i + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground">
                              {step.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {step.desc}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      Ready to see your score? Run an audit above.
                    </p>
                    <Button
                      onClick={handleAnalyze}
                      disabled={!domain || isAnalyzing}
                      className="rounded-lg"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Run audit now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Testimonials marquee */}
            <motion.section 
              id="testimonials"
              className="ws-fade-up" 
              style={{ animationDelay: '140ms' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
                  Trusted by thousands of users
                </h2>
                <p className="text-sm text-muted-foreground">
                  See what website owners and SEO professionals are saying about WebsiteScore.
                </p>
              </motion.div>

              <motion.div 
                className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-card/60 p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Marquee pauseOnHover className="[--duration:20s]">
                  {firstRow.map((review) => (
                    <motion.div
                      key={review.username}
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ReviewCard {...review} />
                    </motion.div>
                  ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="[--duration:20s]">
                  {secondRow.map((review) => (
                    <motion.div
                      key={review.username}
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ReviewCard {...review} />
                    </motion.div>
                  ))}
                </Marquee>
                <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r"></div>
                <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"></div>
              </motion.div>
            </motion.section>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Live analysis results */}
        {analysis && (
          <section className="max-w-6xl mx-auto">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Showing live audit for{' '}
                <span className="font-medium text-foreground">
                  {analysis.url || domain}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs"
              >
                Run another audit
              </Button>
            </div>

            <div className="ws-report">
              <SEOAnalysisTabbed analysis={analysis} url={analysis.url || domain} />
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
