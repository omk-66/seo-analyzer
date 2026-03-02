"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, ExternalLink, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data for different time periods (same structure, different data)
const leaderboardData24h = [
  {
    rank: 1,
    site: "launchigniter.com",
    favicon: "https://www.google.com/s2/favicons?domain=launchigniter.com&sz=48",
    pageSeo: 98,
    links: 95,
    usability: 97,
    performance: 96,
    social: 94,
    timeAgo: "2 h ago"
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
    timeAgo: "3 h ago"
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
    timeAgo: "5 h ago"
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
    timeAgo: "8 h ago"
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
    timeAgo: "12 h ago"
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
    timeAgo: "18 h ago"
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
    timeAgo: "22 h ago"
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

const leaderboardData30d = [
  {
    rank: 1,
    site: "launchigniter.com",
    favicon: "https://www.google.com/s2/favicons?domain=launchigniter.com&sz=48",
    pageSeo: 97,
    links: 93,
    usability: 95,
    performance: 94,
    social: 91,
    timeAgo: "5 d ago"
  },
  {
    rank: 2,
    site: "apppage.co",
    favicon: "https://www.google.com/s2/favicons?domain=apppage.co&sz=48",
    pageSeo: 95,
    links: 92,
    usability: 96,
    performance: 95,
    social: 89,
    timeAgo: "7 d ago"
  },
  {
    rank: 3,
    site: "apppa.ge",
    favicon: "https://www.google.com/s2/favicons?domain=apppa.ge&sz=48",
    pageSeo: 91,
    links: 86,
    usability: 93,
    performance: 96,
    social: 87,
    timeAgo: "10 d ago"
  },
  {
    rank: 4,
    site: "quattroespacios.com",
    favicon: "https://www.google.com/s2/favicons?domain=quattroespacios.com&sz=48",
    pageSeo: 89,
    links: 83,
    usability: 90,
    performance: 97,
    social: 85,
    timeAgo: "15 d ago"
  },
  {
    rank: 5,
    site: "lilirosas.com",
    favicon: "https://www.google.com/s2/favicons?domain=lilirosas.com&sz=48",
    pageSeo: 87,
    links: 84,
    usability: 88,
    performance: 95,
    social: 82,
    timeAgo: "20 d ago"
  },
  {
    rank: 6,
    site: "saasgrow.app",
    favicon: "https://www.google.com/s2/favicons?domain=saasgrow.app&sz=48",
    pageSeo: 85,
    links: 81,
    usability: 86,
    performance: 93,
    social: 79,
    timeAgo: "25 d ago"
  },
  {
    rank: 7,
    site: "viajesbalmoral.mx",
    favicon: "https://www.google.com/s2/favicons?domain=viajesbalmoral.mx&sz=48",
    pageSeo: 83,
    links: 79,
    usability: 85,
    performance: 91,
    social: 77,
    timeAgo: "28 d ago"
  },
  {
    rank: 8,
    site: "ginecologanatalia.com",
    favicon: "https://www.google.com/s2/favicons?domain=ginecologanatalia.com&sz=48",
    pageSeo: 81,
    links: 77,
    usability: 83,
    performance: 89,
    social: 75,
    timeAgo: "29 d ago"
  },
  {
    rank: 9,
    site: "startuptrusted.com",
    favicon: "https://www.google.com/s2/favicons?domain=startuptrusted.com&sz=48",
    pageSeo: 79,
    links: 75,
    usability: 82,
    performance: 87,
    social: 73,
    timeAgo: "30 d ago"
  },
  {
    rank: 10,
    site: "homeprosite.com",
    favicon: "https://www.google.com/s2/favicons?domain=homeprosite.com&sz=48",
    pageSeo: 77,
    links: 73,
    usability: 80,
    performance: 85,
    social: 71,
    timeAgo: "30 d ago"
  }
]

const leaderboardDataAllTime = [
  {
    rank: 1,
    site: "launchigniter.com",
    favicon: "https://www.google.com/s2/favicons?domain=launchigniter.com&sz=48",
    pageSeo: 96,
    links: 92,
    usability: 94,
    performance: 93,
    social: 90,
    timeAgo: "All time"
  },
  {
    rank: 2,
    site: "apppage.co",
    favicon: "https://www.google.com/s2/favicons?domain=apppage.co&sz=48",
    pageSeo: 94,
    links: 90,
    usability: 95,
    performance: 94,
    social: 88,
    timeAgo: "All time"
  },
  {
    rank: 3,
    site: "apppa.ge",
    favicon: "https://www.google.com/s2/favicons?domain=apppa.ge&sz=48",
    pageSeo: 90,
    links: 84,
    usability: 92,
    performance: 95,
    social: 86,
    timeAgo: "All time"
  },
  {
    rank: 4,
    site: "quattroespacios.com",
    favicon: "https://www.google.com/s2/favicons?domain=quattroespacios.com&sz=48",
    pageSeo: 88,
    links: 81,
    usability: 89,
    performance: 96,
    social: 84,
    timeAgo: "All time"
  },
  {
    rank: 5,
    site: "lilirosas.com",
    favicon: "https://www.google.com/s2/favicons?domain=lilirosas.com&sz=48",
    pageSeo: 86,
    links: 82,
    usability: 87,
    performance: 94,
    social: 81,
    timeAgo: "All time"
  },
  {
    rank: 6,
    site: "saasgrow.app",
    favicon: "https://www.google.com/s2/favicons?domain=saasgrow.app&sz=48",
    pageSeo: 84,
    links: 79,
    usability: 85,
    performance: 92,
    social: 78,
    timeAgo: "All time"
  },
  {
    rank: 7,
    site: "viajesbalmoral.mx",
    favicon: "https://www.google.com/s2/favicons?domain=viajesbalmoral.mx&sz=48",
    pageSeo: 82,
    links: 76,
    usability: 83,
    performance: 90,
    social: 75,
    timeAgo: "All time"
  },
  {
    rank: 8,
    site: "ginecologanatalia.com",
    favicon: "https://www.google.com/s2/favicons?domain=ginecologanatalia.com&sz=48",
    pageSeo: 80,
    links: 74,
    usability: 81,
    performance: 88,
    social: 73,
    timeAgo: "All time"
  },
  {
    rank: 9,
    site: "startuptrusted.com",
    favicon: "https://www.google.com/s2/favicons?domain=startuptrusted.com&sz=48",
    pageSeo: 78,
    links: 72,
    usability: 80,
    performance: 86,
    social: 71,
    timeAgo: "All time"
  },
  {
    rank: 10,
    site: "homeprosite.com",
    favicon: "https://www.google.com/s2/favicons?domain=homeprosite.com&sz=48",
    pageSeo: 76,
    links: 70,
    usability: 78,
    performance: 84,
    social: 69,
    timeAgo: "All time"
  }
]

export function LeaderboardSection() {
  const [timeFilter, setTimeFilter] = useState('24h')

  const getLeaderboardData = () => {
    switch (timeFilter) {
      case '24h':
        return leaderboardData24h
      case '30d':
        return leaderboardData30d
      case 'all':
        return leaderboardDataAllTime
      default:
        return leaderboardData24h
    }
  }

  const currentData = getLeaderboardData()

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
          onClick={() => setTimeFilter('24h')}
          className={`px-2 py-1 rounded-md border font-medium transition-colors cursor-pointer ${timeFilter === '24h'
            ? 'bg-background text-foreground border-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:border-input/60 border-transparent'
            }`}
        >
          Last 24h
        </button>
        <button
          type="button"
          onClick={() => setTimeFilter('30d')}
          className={`px-2 py-1 rounded-md border font-medium transition-colors cursor-pointer ${timeFilter === '30d'
            ? 'bg-background text-foreground border-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:border-input/60 border-transparent'
            }`}
        >
          Last 30d
        </button>
        <button
          type="button"
          onClick={() => setTimeFilter('all')}
          className={`px-2 py-1 rounded-md border font-medium transition-colors cursor-pointer ${timeFilter === 'all'
            ? 'bg-background text-foreground border-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:border-input/60 border-transparent'
            }`}
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
            {currentData.map((row, index) => (
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
