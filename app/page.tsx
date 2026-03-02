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
import { AvatarGroup } from "@/components/avatar-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FeaturedOn } from "@/components/featured-on"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Footer as ModernFooter } from "@/components/footer-new"
import { LeaderboardSection } from "@/components/leaderboard-section"
import { RatingBadge } from "@/components/foundations/rating-badge"
import { TestimonialsSection } from "@/components/testimonials-section"
import { StatsSection } from "@/components/stats-section"
import { InteractiveDemo } from "@/components/interactive-demo"

// FAQ Data
const faqData = [
  {
    question: "What is WebsiteScore and how does it work?",
    answer: "WebsiteScore is an all-in-one SEO analysis tool. Simply enter any domain and we instantly generate a comprehensive report covering On-Page SEO, Backlinks, Performance, Social signals, and AI-powered suggestions — all in one place, in seconds."
  },
  {
    question: "What does the On-Page SEO section analyze?",
    answer: "The On-Page SEO section audits everything that lives on your website — meta titles, descriptions, heading structure (H1–H6), keyword usage, image alt texts, canonical tags, robots.txt, sitemap, and more. You'll get a clear score and actionable fixes for each issue."
  },
  {
    question: "How does WebsiteScore analyze backlinks?",
    answer: "The Links section shows your backlink profile — total backlinks, referring domains, domain authority, toxic/spammy links, and anchor text distribution. Understanding your link profile is essential for building SEO authority and outranking competitors."
  },
  {
    question: "What does the Performance section measure?",
    answer: "Performance covers your site's Core Web Vitals (LCP, FID, CLS), page load speed, mobile responsiveness, and technical health. Slow or poorly optimized sites rank lower on Google — our report shows exactly where to improve."
  },
  {
    question: "What does the Social section include?",
    answer: "The Social section tracks your website's presence and engagement across social platforms — including social shares, signals, and how your content is being distributed. Strong social signals can indirectly boost your SEO rankings."
  },
  {
    question: "What are the AI SEO Suggestions?",
    answer: "After analyzing all sections, our AI generates a personalized action plan for your domain. It prioritizes the highest-impact improvements you can make — from fixing technical issues to content gaps and link-building opportunities — so you know exactly what to do next."
  },
  {
    question: "Do I need to create an account to analyze a website?",
    answer: "You can run a quick analysis without signing up. Creating a free account unlocks your full detailed report, lets you track multiple domains over time, and gives you access to historical score comparisons."
  },
  {
    question: "Can I analyze competitor websites?",
    answer: "Absolutely! You can enter any domain — including your competitors' — and get a full SEO breakdown. Comparing your score against competitors is one of the fastest ways to find gaps and opportunities in your SEO strategy."
  },
  {
    question: "How often is the SEO data updated?",
    answer: "We refresh your website's data regularly so your scores always reflect the latest state of your site. You can also manually trigger a re-analysis anytime to see the impact of recent changes you've made."
  },
  {
    question: "Is WebsiteScore suitable for beginners or only SEO experts?",
    answer: "Both! If you're new to SEO, the AI Suggestions section explains every recommendation in plain English — no jargon. If you're an expert, the detailed technical breakdowns and raw data give you everything you need for deep-dive analysis."
  }
];

// Text reveal animation component
const AnimatedText = ({ text, className = "" }: { text: string; className?: string }) => {
  return <span className={className}>{text}</span>
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
      {/* Modern Navbar */}
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 md:px-6 pt-24 pb-10 md:pb-14">
        {/* Hero + input + value props */}
        <section
          id="hero-section"
          className="flex flex-col items-center justify-center gap-10 mb-10 md:mb-14"
        >
          {/* Hero content */}
          <div className="w-full max-w-3xl text-center space-y-6">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 justify-center"
            >
              Instant website audit (SEO, performance, trust)
            </div>
          </div>

          <div className="w-full max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4 text-center">
              Find what's broken
              <br className="hidden sm:block" />{' '}
              Fix what matters with{' '}
              <span className="inline-block">
                <span className="bg-linear-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                  WebsiteScore
                </span>
              </span>
            </h1>
            <div className="text-sm md:text-base text-muted-foreground max-w-xl mb-6 text-center mx-auto">
              Paste a URL and get a clear, prioritized report: what's hurting rankings, performance, and trust — plus the exact next steps your team can ship.
            </div>

            <div className="relative max-w-2xl mx-auto">
              <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }}>
                <div className="flex w-full max-w-2xl flex-col justify-center gap-3 sm:mx-auto sm:flex-row sm:items-center sm:gap-4">
                  <div className="grid gap-2 relative flex-1">
                    <div className="relative">
                      <div className="absolute left-3 sm:left-4 top-1/2 flex h-5 w-5 sm:h-6 sm:w-6 -translate-y-1/2 transform items-center justify-center">
                        {extractedDomain ? (
                          <img
                            src={faviconUrl}
                            alt=""
                            className="h-5 w-5 sm:h-6 sm:w-6 rounded-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        ) : (
                          <Globe2 className="text-muted-foreground h-5 w-5 sm:h-6 sm:w-6" />
                        )}
                      </div>
                      <span className="pointer-events-none absolute left-12 sm:left-14 top-1/2 h-6 sm:h-8 -translate-y-1/2 border-l border-border"></span>
                      <Input
                        type="text"
                        placeholder="website.com"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="w-full text-left h-10 sm:h-12 md:h-14 border-2 border-border/20 bg-transparent pl-16 sm:pl-16 text-base sm:text-lg md:text-xl focus:border-primary/50 sm:pr-4 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex min-w-0 rounded-md px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={!domain || isAnalyzing}
                    className="cursor-pointer text-primary-foreground shadow-xs py-2 h-10 sm:h-12 md:h-14 w-full sm:w-auto px-6 text-sm sm:text-base bg-primary hover:bg-primary/90 font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        Analyzing…
                      </>
                    ) : (
                      'Analyze'
                    )}
                  </Button>
                </div>
              </form>
              <div className="absolute left-1/2 -translate-x-1/2 -top-10 text-center lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:-translate-x-full lg:pr-4 text-sm text-foreground whitespace-nowrap">
                {/* <span className="inline-block">
                  Get started <span className="lg:hidden">👇</span><span className="hidden lg:inline">👉</span>
                </span> */}
              </div>
            </div>

            {/* Avatar group with user count */}
            <div className="flex items-center justify-center flex-col">
              <div className="flex -space-x-2">
                <div className="border-2 border-background rounded-full w-8 h-8 bg-gray-200 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="border-2 border-background rounded-full w-8 h-8 bg-gray-200 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="border-2 border-background rounded-full w-8 h-8 bg-gray-200 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/76.jpg" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="border-2 border-background rounded-full w-8 h-8 bg-gray-200 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/11.jpg" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="border-2 border-background rounded-full w-8 h-8 bg-gray-200 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/women/22.jpg" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="border-2 border-background rounded-full w-8 h-8 bg-gray-200 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="User" className="w-full h-full object-cover" />
                </div>
              </div>
              <div
                className="text-sm text-muted-foreground font-medium -mt-2"
              >
                Loved by <span className="text-foreground font-semibold">5,453</span> users
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mt-6">
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
          </div>

          {/* Right: SaaS-style "sample score" panel when idle */}
          {/* {!analysis && (
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
          )} */}
        </section>

        {/* Landing v2 sections (shown only before running an audit) */}
        {!analysis && (
          <div className="space-y-14 md:space-y-16">
            {/* Live stats */}
            <section>
              {/* <div className="flex items-end justify-between gap-6 mb-6">
              >
                <div>
                  <h2 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
                    How websites actually perform
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Benchmarks to set expectations before you optimize.
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-[11px] text-muted-foreground">
                >
                  <span className="rounded-full border border-border bg-background/40 px-3 py-1">
                    Updated on demand
                  </span>
              </div> */}

              {/* <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Websites analyzed', value: '28,000+', icon: BarChart3 },
                  { label: 'Avg WebsiteScore', value: '79 / 100', icon: ShieldCheck },
                  { label: 'Avg PageSpeed', value: '92 / 100', icon: Zap },
                  { label: 'Avg Trust & Security', value: '59 / 100', icon: Lock },
                ].map((s, index) => (
                  <div
                    key={s.label}
                    className="border border-border/70 bg-card/60 hover:border-emerald-500/30 transition-colors"
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
              </div> */}
            </section>

            {/* What we check (5 pillars) */}
            <section id="features" className="ws-fade-up" style={{ animationDelay: '60ms' }}>
              {/* <div className="mb-6">
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
                  <div
                    key={p.title}
                    className="border border-border/70 bg-card/60 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/10"
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
              </div> */}
            </section>

            {/* How it works */}
            {/* <motion.section
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
                        <div key={step.title} className="flex items-start gap-3 rounded-xl border border-border bg-background/30 p-3">
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
            </section> */}

            {/* Interactive Demo Section */}
            <InteractiveDemo />

            {/* Testimonials Section */}
            <TestimonialsSection />
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

        {/* Pricing Section */}
        <section
          className="ws-fade-up py-16"
        >
          {/* <div className="mx-auto max-w-7xl">
            <motion.header
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-500 mb-4">
                <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider">Pricing</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Get your website to
                <span className="block text-emerald-500 pb-1">the next level</span>
              </h2>
            </motion.header>

            <div className="rounded-2xl border border-border/60 p-8 sm:p-12">
            >
              <div className="grid w-full gap-8 max-[1200px]:grid-cols-1 min-[1200px]:grid-cols-[1fr_2fr]">
                <div>
                  <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Everything you'll get</p>
                  <ul className="grid grid-cols-1 gap-4 max-[870px]:grid-cols-1 min-[870px]:max-[1200px]:grid-cols-2 min-[1200px]:grid-cols-1">
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed text-foreground sm:text-base">Unlimited website analyses</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed text-foreground sm:text-base">High authority do-follow backlink</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed text-foreground sm:text-base">Website score badge</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed text-foreground sm:text-base">Daily automated monitoring (up to 10 domains)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed text-foreground sm:text-base">Critical change alerts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed text-foreground sm:text-base">History tracking</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed text-foreground sm:text-base">Certified report page</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed text-foreground sm:text-base">Copy to LLM</span>
                    </li>
                  </ul>
                </div>

                <div className="grid gap-6 max-[840px]:grid-cols-1 min-[840px]:grid-cols-2 items-center">
                  <div className="relative flex flex-col gap-6 rounded-2xl border bg-card/80 p-8 text-center sm:p-10 border-border/60 min-[840px]:p-6 min-[840px]:sm:p-8 min-[840px]:self-center">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Monthly</h3>
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-4xl font-semibold text-foreground sm:text-5xl">$5</span>
                          <span className="text-base text-muted-foreground">/month</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Button className="w-full rounded-xl text-sm font-medium">
                        Subscribe Monthly
                      </Button>
                      <p className="text-xs text-muted-foreground">Cancel anytime</p>
                    </div>
                  </div>

                  <div className="relative flex flex-col gap-6 rounded-2xl border bg-card/80 p-8 text-center sm:p-10 border-emerald-500/60">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-500 bg-background text-xs font-medium text-emerald-500 uppercase tracking-wider">Most Popular</span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Lifetime</h3>
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-4xl font-semibold text-foreground sm:text-5xl">$35</span>
                          <span className="text-sm text-muted-foreground">One time</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Button className="w-full rounded-xl text-sm font-medium">
                        Get Lifetime Access
                      </Button>
                      <p className="text-xs text-muted-foreground">No subscription • One time payment</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div> */}
        </section>

        {/* Rating Badge Section */}
        <div
          className="flex justify-center -mt-25"
        >
          <RatingBadge rating={4.7} title="Best SEO Tool" subtitle="2,000+ reviews" />
        </div>

        {/* Testimonials Section */}
        <section
          className="ws-fade-up py-16 -mt-20"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-3 lg:gap-8 lg:px-4">
            <div className="mx-auto my-12 max-w-md space-y-4 max-lg:px-4 md:my-24 md:space-y-6 lg:max-w-lg">
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5 h-5 lg:w-[22px] lg:h-[22px]">
                    <defs>
                      <linearGradient id={`starGradient-${star}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffd119"></stop>
                        <stop offset="25%" stopColor="#facc15"></stop>
                        <stop offset="40%" stopColor="#ffeb9d"></stop>
                        <stop offset="55%" stopColor="#facc15"></stop>
                        <stop offset="100%" stopColor="#e6ae08"></stop>
                      </linearGradient>
                    </defs>
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" fill={`url(#starGradient-${star})`}></path>
                  </svg>
                ))}
              </div>
              <div className="space-y-2 text-center text-base leading-relaxed lg:text-lg">
                <span className="bg-yellow-100/80 px-1.5 font-medium text-yellow-950 dark:bg-yellow-900/80 dark:text-yellow-100">WebsiteScore &gt; Google Analytics for simplicity and actual useful metrics.</span> The Revenue per Visitor metric is exactly what founders need.
              </div>
              <div className="flex items-center justify-center gap-3 lg:gap-4">
                <img alt="Wozu testimonial for WebsiteScore" loading="lazy" width="48" height="48" className="h-10 w-10 rounded-full object-cover lg:h-12 lg:w-12" src="https://randomuser.me/api/portraits/men/32.jpg" />
                <div>
                  <p className="font-semibold lg:text-lg">Wozu</p>
                  <p className="text-muted-foreground text-sm lg:text-base">gfluo.com</p>
                </div>
              </div>
            </div>

            <div className="mx-auto my-12 max-w-md space-y-4 max-lg:px-4 md:my-24 md:space-y-6 lg:max-w-lg">
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5 h-5 lg:w-[22px] lg:h-[22px]">
                    <defs>
                      <linearGradient id={`starGradient-testimonial-${star}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffd119"></stop>
                        <stop offset="25%" stopColor="#facc15"></stop>
                        <stop offset="40%" stopColor="#ffeb9d"></stop>
                        <stop offset="55%" stopColor="#facc15"></stop>
                        <stop offset="100%" stopColor="#e6ae08"></stop>
                      </linearGradient>
                    </defs>
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" fill={`url(#starGradient-testimonial-${star})`}></path>
                  </svg>
                ))}
              </div>
              <div className="space-y-2 text-center text-base leading-relaxed lg:text-lg">
                Been using WebsiteScore for over a month now. It's amazing! <span className="bg-yellow-100/80 px-1.5 font-medium text-yellow-950 dark:bg-yellow-900/80 dark:text-yellow-100">I've been able to quadruple my conversion rate</span> and increase revenue!
              </div>
              <div className="flex items-center justify-center gap-3 lg:gap-4">
                <img alt="Siya testimonial for WebsiteScore" loading="lazy" width="48" height="48" className="h-10 w-10 rounded-full object-cover lg:h-12 lg:w-12" src="https://randomuser.me/api/portraits/women/44.jpg" />
                <div>
                  <p className="font-semibold lg:text-lg">Siya</p>
                  <p className="text-muted-foreground text-sm lg:text-base">genppt.com</p>
                </div>
              </div>
            </div>

            <div
              className="mx-auto my-12 max-w-md space-y-4 max-lg:px-4 md:my-24 md:space-y-6 lg:max-w-lg"
            >
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5 h-5 lg:w-[22px] lg:h-[22px]">
                    <defs>
                      <linearGradient id={`starGradient-kai-${star}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffd119"></stop>
                        <stop offset="25%" stopColor="#facc15"></stop>
                        <stop offset="40%" stopColor="#ffeb9d"></stop>
                        <stop offset="55%" stopColor="#facc15"></stop>
                        <stop offset="100%" stopColor="#e6ae08"></stop>
                      </linearGradient>
                    </defs>
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" fill={`url(#starGradient-kai-${star})`}></path>
                  </svg>
                ))}
              </div>
              <div className="space-y-2 text-center text-base leading-relaxed lg:text-lg">
                There's <span className="bg-yellow-100/80 px-1.5 font-medium text-yellow-950 dark:bg-yellow-900/80 dark:text-yellow-100">no need for PostHog anymore</span> given how good this is and how little effort it is to attribute revenue to marketing efforts.
              </div>
              <div className="flex items-center justify-center gap-3 lg:gap-4">
                <img alt="Kai testimonial for WebsiteScore" loading="lazy" width="48" height="48" className="h-10 w-10 rounded-full object-cover lg:h-12 lg:w-12" src="https://randomuser.me/api/portraits/men/68.jpg" />
                <div>
                  <p className="font-semibold lg:text-lg">Kai</p>
                  <p className="text-muted-foreground text-sm lg:text-base">blink.new</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <div className='-mt-20'>
          <StatsSection />
        </div>

        {/* FAQ Section */}
        <section
          className="ws-fade-up py-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Everything you need to know about WebsiteScore and data analytics
            </p>
          </div>

          <div className="mx-auto max-w-xl max-md:px-4 py-20">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base-content">
                    <div className="space-y-2 pb-4 pt-3 leading-relaxed">
                      {item.answer.split('\n').map((line, lineIndex) => (
                        <p key={lineIndex} className="text-sm">{line}</p>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Leaderboard Section */}
        <LeaderboardSection />

        {/* CTA Section */}
        <CTASection />

        {/* Featured On Section */}
        <FeaturedOn />
      </main>

      {/* Modern Footer - Outside main container for full width */}
      <ModernFooter />
    </div >
  )
}
