"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin, Mail, ArrowRight, Heart } from "lucide-react"

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
      { name: "Documentation", href: "#docs", action: "scroll" },
      { name: "FAQ", href: "#faq", action: "scroll" },
      { name: "Support", href: "#support", action: "scroll" },
      { name: "Blog", href: "#blog", action: "scroll" },
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#about", action: "scroll" },
      { name: "Contact", href: "#contact", action: "scroll" },
      { name: "Careers", href: "#careers", action: "scroll" },
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Terms of Service", href: "#terms", action: "scroll" },
      { name: "Privacy Policy", href: "#privacy", action: "scroll" },
      { name: "Cookie Policy", href: "#cookies", action: "scroll" },
      { name: "GDPR", href: "#gdpr", action: "scroll" },
    ]
  }
]

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
]

export function Footer() {
  return (
    <footer className="bg-background/50 backdrop-blur-sm border-t border-border/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
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
                    <motion.a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="flex items-center justify-center w-10 h-10 rounded-lg border border-border/20 bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="h-5 w-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {footerLinks.map((section, sectionIndex) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
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
                              e.preventDefault()
                              if (link.action === 'scroll') {
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
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div data-fast-scroll="scroll_to_newsletter" className="border-t border-border/20 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h3 className="text-2xl font-bold text-foreground">
              Stay updated with SEO insights
            </h3>
            <p className="text-sm text-muted-foreground">
              Get the latest SEO tips, feature updates, and industry news delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 text-sm bg-card/50 border border-border/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
              />
              <Button className="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border/20 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          >
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© 2024 WebsiteScore. All rights reserved.</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span>for the web community</span>
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('terms')
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
              >
                Terms
              </a>
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('privacy')
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
              >
                Privacy
              </a>
              <a
                href="#cookies"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('cookies')
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
              >
                Cookies
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
