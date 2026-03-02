"use client"

import { motion } from "framer-motion"
import { Trophy, Medal, ExternalLink, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data for leaderboard with 5 sections
const leaderboardData = [
  {
    rank: 1,
    site: "launchigniter.com",
    favicon: "https://www.google.com/s2/favicons?domain=launchigniter.com&sz=48",
    pageSeo: 98,
    links: 95,
    usability: 97,
    performance: 96,
    social: 94,
    timeAgo: "23 h ago"
  },
  {
    rank: 2,
    site: "apppage.co",
    favicon: "https://www.google.com/s2/favicons?domain=apppage.co&sz=48",
    pageSeo: 96,
    links: 94,
    usability: 98,
    performance: 97,
    social: 92,
    timeAgo: "23 h ago"
  },
  {
    rank: 3,
    site: "apppa.ge",
    favicon: "https://www.google.com/s2/favicons?domain=apppa.ge&sz=48",
    pageSeo: 92,
    links: 88,
    usability: 95,
    performance: 98,
    social: 90,
    timeAgo: "23 h ago"
  },
  {
    rank: 4,
    site: "quattroespacios.com",
    favicon: "https://www.google.com/s2/favicons?domain=quattroespacios.com&sz=48",
    pageSeo: 90,
    links: 85,
    usability: 92,
    performance: 100,
    social: 88,
    timeAgo: "23 h ago"
  },
  {
    rank: 5,
    site: "lilirosas.com",
    favicon: "https://www.google.com/s2/favicons?domain=lilirosas.com&sz=48",
    pageSeo: 88,
    links: 86,
    usability: 90,
    performance: 98,
    social: 85,
    timeAgo: "23 h ago"
  },
  {
    rank: 6,
    site: "saasgrow.app",
    favicon: "https://www.google.com/s2/favicons?domain=saasgrow.app&sz=48",
    pageSeo: 87,
    links: 84,
    usability: 89,
    performance: 96,
    social: 82,
    timeAgo: "23 h ago"
  },
  {
    rank: 7,
    site: "viajesbalmoral.mx",
    favicon: "https://www.google.com/s2/favicons?domain=viajesbalmoral.mx&sz=48",
    pageSeo: 85,
    links: 82,
    usability: 88,
    performance: 94,
    social: 80,
    timeAgo: "23 h ago"
  },
  {
    rank: 8,
    site: "ginecologanatalia.com",
    favicon: "https://www.google.com/s2/favicons?domain=ginecologanatalia.com&sz=48",
    pageSeo: 84,
    links: 80,
    usability: 86,
    performance: 92,
    social: 78,
    timeAgo: "23 h ago"
  },
  {
    rank: 9,
    site: "startuptrusted.com",
    favicon: "https://www.google.com/s2/favicons?domain=startuptrusted.com&sz=48",
    pageSeo: 82,
    links: 78,
    usability: 85,
    performance: 90,
    social: 76,
    timeAgo: "23 h ago"
  },
  {
    rank: 10,
    site: "homeprosite.com",
    favicon: "https://www.google.com/s2/favicons?domain=homeprosite.com&sz=48",
    pageSeo: 80,
    links: 76,
    usability: 83,
    performance: 88,
    social: 74,
    timeAgo: "23 h ago"
  }
]

export function LeaderboardSection() {
  return (
    <section data-fast-scroll="scroll_to_leaderboard" className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12">
      {/* Header */}
      <div
        className="flex flex-col items-center gap-2 text-center"
      >
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary mb-4">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Leaderboard</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-center mb-4">
          See who's leading in{" "}
          <span className="block text-primary pb-1">website race</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover best performing websites and see how you compare
        </p>
        <Button className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-primary hover:bg-primary/80 rounded-lg transition-colors">
          Start Free Analysis
        </Button>
      </div>

      {/* Time Filter */}
      <nav
        className="mt-2 flex items-center justify-center gap-1 text-xs"
      >
        <button
          type="button"
          className="px-2 py-1 rounded-md border font-medium transition-colors cursor-pointer bg-background text-foreground border-primary"
        >
          Last 24h
        </button>
        <button
          type="button"
          className="px-2 py-1 rounded-md border font-medium transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:border-input/60 border-transparent"
        >
          Last 30d
        </button>
        <button
          type="button"
          className="px-2 py-1 rounded-md border font-medium transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:border-input/60 border-transparent"
        >
          All time
        </button>
      </nav>

      {/* Leaderboard Table */}
      <div
        className="w-full overflow-x-auto rounded-md border"
      >
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="hover:bg-muted/50 border-b transition-colors">
              <th className="text-foreground h-10 px-4 text-left align-middle font-medium whitespace-nowrap w-[6%] text-sm">#</th>
              <th className="text-foreground h-10 px-4 text-left align-middle font-medium whitespace-nowrap w-[26%] text-sm">Site</th>
              <th className="text-foreground h-10 px-4 text-left align-middle font-medium whitespace-nowrap w-[14%] text-sm">Page SEO</th>
              <th className="text-foreground h-10 px-4 text-left align-middle font-medium whitespace-nowrap w-[14%] text-sm">Links</th>
              <th className="text-foreground h-10 px-4 text-left align-middle font-medium whitespace-nowrap w-[14%] text-sm">Usability</th>
              <th className="text-foreground h-10 px-4 text-left align-middle font-medium whitespace-nowrap w-[14%] text-sm">Performance</th>
              <th className="text-foreground h-10 px-4 text-left align-middle font-medium whitespace-nowrap w-[14%] text-sm">Social</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((row, index) => (
              <tr
                key={row.rank}
                className="data-[state=selected]:bg-muted border-b cursor-pointer hover:bg-muted/40 h-16 transition-all duration-300"
                role="link"
                tabIndex={0}
              >
                <td className="py-2 px-4 align-middle whitespace-nowrap text-muted-foreground font-medium">
                  <span className="inline-flex items-center justify-center w-6">
                    {row.rank === 1 && <Trophy className="h-5 w-5 text-yellow-400" aria-label="1st place" />}
                    {row.rank === 2 && <Medal className="h-5 w-5 text-slate-300" aria-label="2nd place" />}
                    {row.rank === 3 && <Medal className="h-5 w-5 text-amber-500" aria-label="3rd place" />}
                    <span className="font-black leading-none text-base sm:text-lg">{row.rank}</span>
                  </span>
                </td>
                <td className="py-2 px-4 align-middle whitespace-nowrap">
                  <div className="flex items-center gap-4 min-w-0">
                    <img alt="Favicon" loading="lazy" width="24" height="24" className="rounded-md shrink-0" src={row.favicon} />
                    <div className="min-w-0 space-y-1">
                      <a target="_blank" rel="noopener noreferrer nofollow" className="group inline-flex max-w-full items-center gap-1.5 font-semibold text-foreground transition-colors hover:text-primary" href={`https://${row.site}?ref=yourwebsitescore`}>
                        <span className="truncate transition-colors group-hover:underline group-hover:underline-offset-4">{row.site}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
                      </a>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
                        <span className="truncate">https://{row.site}/</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-2 px-4 align-middle whitespace-nowrap">
                  <div className="inline-flex items-baseline gap-1">
                    <span className="font-black leading-none text-base sm:text-lg text-primary">{row.pageSeo}</span>
                    <span className="text-[10px] sm:text-xs leading-none text-muted-foreground">/100</span>
                  </div>
                </td>
                <td className="py-2 px-4 align-middle whitespace-nowrap">
                  <div className="inline-flex items-baseline gap-1">
                    <span className="font-black leading-none text-base sm:text-lg text-blue-600">{row.links}</span>
                    <span className="text-[10px] sm:text-xs leading-none text-muted-foreground">/100</span>
                  </div>
                </td>
                <td className="py-2 px-4 align-middle whitespace-nowrap">
                  <div className="inline-flex items-baseline gap-1">
                    <span className="font-black leading-none text-base sm:text-lg text-green-600">{row.usability}</span>
                    <span className="text-[10px] sm:text-xs leading-none text-muted-foreground">/100</span>
                  </div>
                </td>
                <td className="py-2 px-4 align-middle whitespace-nowrap">
                  <div className="inline-flex items-baseline gap-1">
                    <span className="font-black leading-none text-base sm:text-lg text-orange-600">{row.performance}</span>
                    <span className="text-[10px] sm:text-xs leading-none text-muted-foreground">/100</span>
                  </div>
                </td>
                <td className="py-2 px-4 align-middle whitespace-nowrap">
                  <div className="inline-flex items-baseline gap-1">
                    <span className="font-black leading-none text-base sm:text-lg text-purple-600">{row.social}</span>
                    <span className="text-[10px] sm:text-xs leading-none text-muted-foreground">/100</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
