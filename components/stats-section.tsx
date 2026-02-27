"use client"

import { motion } from "framer-motion"
import { TrendingUp, Globe, Shield, Zap, BarChart3 } from "lucide-react"

interface StatItem {
  value: string
  suffix?: string
  label: string
  icon: React.ReactNode
}

const statsData: StatItem[] = [
  {
    value: "29,647",
    label: "Websites analyzed",
    icon: <Globe className="h-5 w-5" />
  },
  {
    value: "79",
    suffix: "/100",
    label: "Ø Overall Score",
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    value: "92",
    suffix: "/100",
    label: "Ø PageSpeed",
    icon: <Zap className="h-5 w-5" />
  },
  {
    value: "85",
    suffix: "/100",
    label: "Ø Website Quality",
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    value: "60",
    suffix: "/100",
    label: "Ø Trust & Security",
    icon: <Shield className="h-5 w-5" />
  }
]

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex-1 px-5 py-3 sm:py-4 lg:px-6 lg:py-5 relative group"
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      <div className="relative">
        <div className="flex items-center justify-center mb-2">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {stat.icon}
          </div>
        </div>
        <div className="tabular-nums text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground leading-none">
          {stat.value}
          {stat.suffix && (
            <span className="text-base sm:text-lg lg:text-xl font-normal text-muted-foreground ml-1">
              {stat.suffix}
            </span>
          )}
        </div>
        <div className="mt-1 text-[11px] sm:text-xs text-muted-foreground/80 tracking-wide uppercase">
          {stat.label}
        </div>
      </div>
    </motion.div>
  )
}

export function StatsSection() {
  return (
    <section
      className="py-16"
      data-fast-scroll="scroll_to_stats"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary mb-4">
              <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Live Stats</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              How websites actually
              <span className="text-primary"> perform</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Average scores across all analyzed websites
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl border border-border/40 overflow-hidden bg-card/30 backdrop-blur-sm"
          >
            <div className="flex flex-col sm:flex-col lg:flex-row items-stretch justify-center text-center divide-y divide-border/60 lg:divide-y-0 lg:divide-x lg:divide-border/60">
              {statsData.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Join thousands of website owners improving their online presence
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Real-time data updated hourly</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
