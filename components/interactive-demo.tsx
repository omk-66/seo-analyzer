"use client"

import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

// Your 5 screenshots - using your actual image files
const demoScreenshots = [
  {
    id: 1,
    title: "Page SEO Analysis",
    image: "/screenshots/Screenshot 2026-02-28 164115.png"
  },
  {
    id: 2,
    title: "Performance Insights",
    image: "/screenshots/Screenshot 2026-02-28 160109.png"
  },
  {
    id: 3,
    title: "Content Optimization",
    image: "/screenshots/Screenshot 2026-02-28 164157.png"
  },
  {
    id: 4,
    title: "Technical SEO Audit",
    image: "/screenshots/Screenshot 2026-02-28 164224.png"
  },
  {
    id: 5,
    title: "Competitor Analysis",
    image: "/screenshots/Screenshot 2026-02-28 164355.png"
  }
]

function ScreenshotCard({ screenshot }: { screenshot: typeof demoScreenshots[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
      className="relative w-full h-full"
    >
      {/* Full Screen Screenshot - No Browser Frame */}
      <div className="relative h-[600px] rounded-xl overflow-hidden shadow-2xl">
        <img
          src={screenshot.image}
          alt={screenshot.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if local image doesn't exist
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/1200x600/f0fdf4/166534?text=${encodeURIComponent(screenshot.title)}`;
          }}
        />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-3">
              <span className="text-white text-xs font-medium">
                {screenshot.title}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function InteractiveDemo() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % demoScreenshots.length)
  }, [])

  // Auto-play with hover pause
  React.useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(nextSlide, 3000) // 3 seconds for faster sweep
      return () => clearInterval(interval)
    }
  }, [isHovered, nextSlide])

  const currentScreenshot = demoScreenshots[currentIndex]

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      data-fast-scroll="scroll_to_demo"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          Interactive Demo
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          See WebsiteScore in Action
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Experience how our comprehensive SEO audit tool analyzes websites
        </p>
      </div>

      {/* Production Full Screen Carousel */}
      <div className="relative max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <ScreenshotCard key={currentIndex} screenshot={currentScreenshot} />
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            {demoScreenshots.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex
                  ? "w-12 bg-emerald-500"
                  : "w-1.5 bg-white/30"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
