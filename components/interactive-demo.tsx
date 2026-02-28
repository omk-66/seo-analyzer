"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Maximize2, Play, ArrowRight, ArrowLeft, ZoomIn, Info } from "lucide-react"

// Your 5 screenshots - replace with your actual image paths
const demoScreenshots = [
  {
    id: 1,
    title: "Page SEO Analysis",
    description: "Analyze on-page SEO factors like titles, meta descriptions, and content optimization",
    image: "/screenshots/Screenshot 2026-02-28 164115.png",
    features: ["Meta tags", "Content analysis", "Keyword optimization"]
  },
  {
    id: 2,
    title: "Links Analysis",
    description: "Evaluate backlinks, internal linking structure, and domain authority",
    image: "/screenshots/Screenshot 2026-02-28 160109.png",
    features: ["Backlink profile", "Internal links", "Link quality"]
  },
  {
    id: 3,
    title: "Usability Analysis",
    description: "Check user experience, navigation, accessibility, and mobile responsiveness",
    image: "/screenshots/Screenshot 2026-02-28 164157.png",
    features: ["UX audit", "Mobile testing", "Accessibility"]
  },
  {
    id: 4,
    title: "Performance Analysis",
    description: "Measure page speed, core web vitals, and loading optimization",
    image: "/screenshots/Screenshot 2026-02-28 164224.png",
    features: ["Page speed", "Core Web Vitals", "Optimization"]
  },
  {
    id: 5,
    title: "Social Analysis",
    description: "Review social media integration, sharing metrics, and social signals",
    image: "/screenshots/Screenshot 2026-02-28 164355.png",
    features: ["Social signals", "Sharing analysis", "Social integration"]
  }
]

function ScreenshotCard({ screenshot, isActive, index }: {
  screenshot: typeof demoScreenshots[0],
  isActive: boolean,
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{
        opacity: isActive ? 1 : 0.3,
        x: isActive ? 0 : 50,
        scale: isActive ? 1 : 0.95
      }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      <Card className={`overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-primary shadow-lg shadow-primary/20' : 'border-border/40'
        }`}>
        <CardContent className="p-0">
          {/* Screenshot Image */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <img
              src={screenshot.image}
              alt={screenshot.title}
              className="absolute inset-0 w-full h-full object-contain bg-liner-to-br from-primary/5 to-secondary/5"
              onError={(e) => {
                // Fallback placeholder if image not found
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.parentElement?.classList.add('flex', 'items-center', 'justify-center')
                target.parentElement!.innerHTML = `
                  <div class="text-center p-8">
                    <div class="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    <h3 class="text-lg font-semibold">${screenshot.title}</h3>
                    <p class="text-muted-foreground mt-2">${screenshot.description}</p>
                  </div>
                `
              }}
            />

            {/* Overlay with Features */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold mb-2">{screenshot.title}</h3>
                <div className="flex flex-wrap gap-1">
                  {screenshot.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Zoom Button */}
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity"
              onClick={() => {
                // Open image in fullscreen or modal
                window.open(screenshot.image, '_blank')
              }}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function FeatureHighlight({ screenshot }: { screenshot: typeof demoScreenshots[0] | null }) {
  if (!screenshot) return null

  return (
    <motion.div
      key={screenshot.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center space-y-4"
    >
      <Badge variant="outline" className="text-sm">
        Step {screenshot.id} of 5
      </Badge>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
        {screenshot.title}
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {screenshot.description}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {screenshot.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-1 text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            {feature}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function InteractiveDemo() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      if (prev === demoScreenshots.length - 1) {
        // When reaching the end, go to cloned first slide
        return demoScreenshots.length
      }
      return prev + 1
    })
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      if (prev === 0) {
        // When at the start, go to cloned last slide
        return -1
      }
      return prev - 1
    })
  }

  // Handle seamless loop transitions
  React.useEffect(() => {
    if (currentSlide === demoScreenshots.length) {
      // When on cloned first slide, reset to actual first slide
      setTimeout(() => setCurrentSlide(0), 50)
    } else if (currentSlide === -1) {
      // When on cloned last slide, reset to actual last slide
      setTimeout(() => setCurrentSlide(demoScreenshots.length - 1), 50)
    }
  }, [currentSlide])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Auto-play functionality
  React.useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(nextSlide, 3000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying])

  const currentScreenshot = demoScreenshots[currentSlide] ||
    (currentSlide === -1 ? demoScreenshots[demoScreenshots.length - 1] :
      currentSlide === demoScreenshots.length ? demoScreenshots[0] : null)

  return (
    <div className="rounded-[1.3rem] border border-border/20 bg-card/30 p-1 dark:bg-card/50 w-full max-w-4xl mx-auto">
      {/* Interactive Demo Badge */}
      <div className="absolute -top-4 right-4 flex -translate-y-full animate-pulse items-center gap-2 z-10">
        <svg className="fill-muted-foreground mt-2 w-8 -rotate-24 opacity-60" viewBox="0 0 219 41" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_3_248)">
            <path d="M21.489 29.4305C36.9333 31.3498 51.3198 33.0559 65.7063 34.9753C66.7641 35.1885 67.6104 36.4681 69.9376 38.3875C63.1675 39.2406 57.8783 40.3069 52.5892 40.5201C38.6259 40.9467 24.8741 40.9467 10.9107 40.9467C9.21821 40.9467 7.5257 41.1599 5.83317 40.7334C0.332466 39.6671 -1.57164 36.0416 1.39028 31.1365C2.87124 28.7906 4.56377 26.658 6.46786 24.7386C13.6611 17.4876 21.0659 10.4499 28.4707 3.41224C29.7401 2.13265 31.6442 1.49285 34.183 0C34.6061 10.8765 23.8162 13.8622 21.489 22.3927C23.3931 21.9662 25.0856 21.7529 26.5666 21.3264C83.6894 5.54486 140.601 7.25099 197.3 22.606C203.224 24.0988 208.936 26.4447 214.649 28.5773C217.61 29.6437 220.149 31.9896 218.457 35.6151C216.976 39.2406 214.014 39.2406 210.629 37.7477C172.759 20.6866 132.561 18.7672 91.9404 19.407C70.7838 19.6203 50.0504 21.9662 29.5285 26.8713C26.9897 27.5111 24.4509 28.3641 21.489 29.4305Z"></path>
          </g>
          <defs>
            <clipPath id="clip0_3_248">
              <rect width="219" height="41"></rect>
            </clipPath>
          </defs>
        </svg>
        <span className="text-muted-foreground text-sm">Interactive demo</span>
      </div>

      {/* Main Demo Container */}
      <div className="space-y-6">
        {/* Feature Highlight */}
        <FeatureHighlight screenshot={currentScreenshot} />

        {/* Screenshot Gallery */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>

          {/* Screenshots */}
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${(currentSlide + 1) * 100}%)` }}>
              {/* Clone last slide at the beginning for seamless loop */}
              <div className="w-full shrink-0 px-8">
                <ScreenshotCard
                  screenshot={demoScreenshots[demoScreenshots.length - 1]}
                  isActive={false}
                  index={-1}
                />
              </div>
              {demoScreenshots.map((screenshot, index) => (
                <div key={screenshot.id} className="w-full shrink-0 px-8">
                  <ScreenshotCard
                    screenshot={screenshot}
                    isActive={index === currentSlide}
                    index={index}
                  />
                </div>
              ))}
              {/* Clone first slide at the end for seamless loop */}
              <div className="w-full shrink-0 px-8">
                <ScreenshotCard
                  screenshot={demoScreenshots[0]}
                  isActive={false}
                  index={demoScreenshots.length}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2">
          {demoScreenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                ? 'bg-primary w-8'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center">
          <Button
            variant={isAutoPlaying ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          >
            <Play className="h-4 w-4 mr-2" />
            {isAutoPlaying ? "Pause" : "Auto Play"}
          </Button>
        </div>
      </div>
    </div>
  )
}
