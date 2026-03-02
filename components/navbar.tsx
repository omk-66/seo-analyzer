"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react"

const navigation = [
  {
    name: "Product",
    items: [
      // { name: "Features", href: "#features" },
      { name: "Demo", href: "#demo" },
      { name: "Reviews", href: "#testimonials" },
    ]
  },
  {
    name: "Resources",
    items: [
      { name: "Leaderboard", href: "#leaderboard" },
      { name: "Stats", href: "#stats" },
      { name: "FAQ", href: "#faq" },
    ]
  },
  {
    name: "Company",
    items: [
      { name: "About", href: "https://www.laughlogiclabs.com/" },
      { name: "Contact", href: "https://www.laughlogiclabs.com/" },
    ]
  }
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [activeDropdown])

  const scrollToSection = (href: string) => {
    // Remove the # and get the section id
    const sectionId = href.replace('#', '')

    // Handle special cases
    if (sectionId === 'features') {
      // Scroll to hero section which contains features
      const heroSection = document.getElementById('hero-section')
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // Focus on domain input after scrolling
        setTimeout(() => {
          const domainInput = document.querySelector('input[placeholder*="domain"]') as HTMLInputElement
          if (domainInput) {
            domainInput.focus()
          }
        }, 500)
      }
    } else if (sectionId === 'demo') {
      // Scroll to interactive demo section
      const demoSection = document.querySelector('[data-fast-scroll="scroll_to_demo"]')
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else if (sectionId === 'testimonials') {
      // Scroll to testimonials section
      const testimonialsSection = document.querySelector('[data-fast-scroll="scroll_to_testimonials"]')
      if (testimonialsSection) {
        testimonialsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else if (sectionId === 'leaderboard') {
      // Scroll to leaderboard section
      const leaderboardSection = document.querySelector('[data-fast-scroll="scroll_to_leaderboard"]')
      if (leaderboardSection) {
        leaderboardSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else if (sectionId === 'stats') {
      // Scroll to stats section
      const statsSection = document.querySelector('[data-fast-scroll="scroll_to_stats"]')
      if (statsSection) {
        statsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else if (sectionId === 'faq') {
      // Scroll to FAQ section
      const faqSection = document.querySelector('[data-fast-scroll="scroll_to_faq"]')
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      // Try to find any element with that id
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        // If no section found, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    // Close mobile menu if open
    setIsOpen(false)
    setActiveDropdown(null)
  }

  const handleGetStarted = () => {
    // Scroll to hero section and focus on domain input
    const heroSection = document.getElementById('hero-section')
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Focus on domain input after scrolling
      setTimeout(() => {
        const domainInput = document.querySelector('input[placeholder*="domain"]') as HTMLInputElement
        if (domainInput) {
          domainInput.focus()
        }
      }, 500)
    }

    // Close mobile menu if open
    setIsOpen(false)
    setActiveDropdown(null)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-primary-foreground/95 backdrop-blur-lg border-b border-border/20'
        : 'bg-primary-foreground/95 backdrop-blur-lg border-b border-border/20'
        }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">WS</span>
              </div>
              <span className="text-xl font-bold text-foreground">WebsiteScore</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveDropdown(activeDropdown === item.name ? null : item.name)
                  }}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.name}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''
                    }`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === item.name && (
                    <div
                      className="absolute top-full left-0 mt-2 w-48 rounded-lg border border-border/20 bg-card/90 backdrop-blur-lg shadow-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="py-2">
                        {item.items.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            onClick={(e) => {
                              // Check if it's an external link
                              if (subItem.href.startsWith('http')) {
                                // Let external links work normally
                                return
                              } else {
                                // Handle internal scroll links
                                e.preventDefault()
                                scrollToSection(subItem.href)
                              }
                            }}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
                            target={subItem.href.startsWith('http') ? '_blank' : '_self'}
                            rel={subItem.href.startsWith('http') ? 'noopener noreferrer' : ''}
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center">
            <Button
              size="sm"
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white"
              onClick={handleGetStarted}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <div
              className="lg:hidden border-t border-border/20 bg-card/90 backdrop-blur-lg"
            >
              <div className="px-2 py-4 space-y-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-200"
                    >
                      {item.name}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <div
                          className="px-3 py-2 space-y-1"
                        >
                          {item.items.map((subItem) => (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              onClick={(e) => {
                                // Check if it's an external link
                                if (subItem.href.startsWith('http')) {
                                  // Let external links work normally
                                  return
                                } else {
                                  // Handle internal scroll links
                                  e.preventDefault()
                                  scrollToSection(subItem.href)
                                }
                              }}
                              className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-200"
                              target={subItem.href.startsWith('http') ? '_blank' : '_self'}
                              rel={subItem.href.startsWith('http') ? 'noopener noreferrer' : ''}
                            >
                              {subItem.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <div className="px-3 py-4 space-y-2 border-t border-border/20 mt-4">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white"
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
