"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Twitter, Linkedin, Mail, ArrowRight, Heart, Globe, Instagram, Facebook } from "lucide-react"

const scrollToSection = (sectionId: string) => {
  // Handle special cases for landing page sections
  if (sectionId === 'demo') {
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
  } else if (sectionId === 'newsletter') {
    // Scroll to newsletter section
    const newsletterSection = document.querySelector('[data-fast-scroll="scroll_to_newsletter"]')
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
}

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Demo", href: "#demo", action: "scroll" },
      { name: "Reviews", href: "#testimonials", action: "scroll" },
      { name: "Leaderboard", href: "#leaderboard", action: "scroll" },
      { name: "Stats", href: "#stats", action: "scroll" },
    ]
  },
  {
    title: "Resources",
    links: [
      // { name: "Documentation", href: "#docs", action: "scroll" },
      { name: "FAQ", href: "#faq", action: "scroll" },
      // { name: "Support", href: "#support", action: "scroll" },
      // { name: "Blog", href: "#blog", action: "scroll" },
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "https://www.laughlogiclabs.com/", action: "navigate" },
      { name: "Contact", href: "https://www.laughlogiclabs.com/contact", action: "navigate" },
      // { name: "Careers", href: "#careers", action: "scroll" },
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Terms of Service", href: "/terms", action: "navigate" },
      { name: "Privacy Policy", href: "/privacy", action: "navigate" },
      { name: "Cookie Policy", href: "/cookies", action: "navigate" },
      { name: "GDPR", href: "/gdpr", action: "navigate" },
    ]
  }
]

const socialLinks = [
  { icon: Globe, href: "https://www.laughlogiclabs.com/", label: "Website" },
  { icon: Twitter, href: "https://x.com/rudaniyash", label: "Twitter" },
  // { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/laughlogiclabs/", label: "LinkedIn" },
  { icon: Facebook, href: "https://www.facebook.com/people/Laugh-Logic-Labs/61561912963372/", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/laughlogiclabs/", label: "Instagram" },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Successfully subscribed! 🎉')
        setEmail('')
      } else if (response.status === 409) {
        setMessage('Email already subscribed')
      } else {
        setMessage(data.error || 'Something went wrong')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  return (
    <footer className="bg-background/50 backdrop-blur-sm border-t border-border/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div
                className="space-y-6"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <span className="text-white font-bold">WS</span>
                  </div>
                  <span className="text-xl font-bold text-foreground">WebsiteScore</span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  The most comprehensive SEO audit tool that helps you identify and fix critical website issues in seconds.
                </p>

                <div className="flex items-center space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="flex items-center justify-center w-10 h-10 rounded-lg border border-border/20 bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground transition-all duration-200"
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {footerLinks.map((section, sectionIndex) => (
                  <div
                    key={section.title}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <a
                            href={link.href}
                            onClick={(e) => {
                              // Check if it's an external link (starts with http)
                              if (link.href.startsWith('http')) {
                                // Let external links work normally
                                return
                              } else if (link.action === 'navigate') {
                                // Let page navigation work normally
                                return
                              } else if (link.action === 'scroll' || link.href.startsWith('#')) {
                                // Handle internal scroll links
                                e.preventDefault()
                                const sectionId = link.href.replace('#', '')
                                scrollToSection(sectionId)
                              }
                            }}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div data-fast-scroll="scroll_to_newsletter" className="border-t border-border/20 py-12">
          <div
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h3 className="text-2xl font-bold text-foreground">
              Stay updated with SEO insights
            </h3>
            <p className="text-sm text-muted-foreground">
              Get the latest SEO tips, feature updates, and industry news delivered to your inbox.
            </p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            {message && (
              <p
                className={`text-sm ${message.includes('Successfully') ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border/20 py-8">
          <div
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          >
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span> 2026 Laugh Logic Labs. All rights reserved.</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span>for the web community</span>
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
              >
                Terms
              </a>
              <a
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
              >
                Privacy
              </a>
              <a
                href="/cookies"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
