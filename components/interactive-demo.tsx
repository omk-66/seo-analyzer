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
    title: "Enter Any Domain",
    description: "Start by entering any website URL to analyze",
    image: "/screenshots/demo-1-input.png",
    features: ["Clean interface", "Instant validation", "Auto-suggestions"]
  },
  {
    id: 2,
    title: "Real-time Analysis",
    description: "Watch as we analyze your website in real-time",
    image: "/screenshots/demo-2-analyzing.png",
    features: ["Live progress", "Multiple metrics", "Fast processing"]
  },
  {
    id: 3,
    title: "Overall Score",
    description: "Get your comprehensive SEO score instantly",
    image: "/screenshots/demo-3-score.png",
    features: ["Overall rating", "Grade system", "Quick insights"]
  },
  {
    id: 4,
    title: "Detailed Breakdown",
    description: "Deep dive into Technical SEO, Performance, and more",
    image: "/screenshots/demo-4-details.png",
    features: ["Category scores", "Issue tracking", "Action items"]
  },
  {
    id: 5,
    title: "Actionable Insights",
    description: "Get specific recommendations to improve your SEO",
    image: "/screenshots/demo-5-recommendations.png",
    features: ["Priority tasks", "Step-by-step guides", "Impact estimates"]
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
          <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-secondary/5">
            <img
              src={screenshot.image}
              alt={screenshot.title}
              className="w-full h-full object-cover"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
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

function FeatureHighlight({ screenshot }: { screenshot: typeof demoScreenshots[0] }) {
  return (
    <motion.div
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
    setCurrentSlide((prev) => (prev + 1) % demoScreenshots.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + demoScreenshots.length) % demoScreenshots.length)
  }

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

  const currentScreenshot = demoScreenshots[currentSlide]

  return (
    <div className="rounded-[1.3rem] border border-border/20 bg-card/30 p-1.5 dark:bg-card/50 w-full max-w-6xl 2xl:max-w-7xl mx-auto">
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
      <div className="space-y-8">
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
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {demoScreenshots.map((screenshot, index) => (
                <div key={screenshot.id} className="w-full flex-shrink-0 px-12">
                  <ScreenshotCard
                    screenshot={screenshot}
                    isActive={index === currentSlide}
                    index={index}
                  />
                </div>
              ))}
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
