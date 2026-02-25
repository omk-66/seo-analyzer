"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full bg-secondary border-t border-border/50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Brand Section */}
            <div className="flex flex-col space-y-6">
              <Link
                aria-label="WebsiteScore home"
                className="flex items-center space-x-3 group"
                href="/"
              >
                <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-white font-bold text-sm">WS</span>
                </div>
                <span className="font-semibold text-xl">WebsiteScore.com</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                WebsiteScore analyzes your site, highlights what to fix, and gives you a live badge, certified page, and dofollow backlink to prove trust.
              </p>
              <div className="pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground">
                  © 2026 WebsiteScore. All rights reserved.
                </p>
              </div>
            </div>

            {/* Explore Section */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-semibold text-foreground text-lg mb-6">Explore</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    className="text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4 transition-all duration-200 text-sm"
                    href="/certified-websites"
                  >
                    Certified Websites
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4 transition-all duration-200 text-sm"
                    href="/guides"
                  >
                    SEO Guides
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4 transition-all duration-200 text-sm"
                    href="/tools"
                  >
                    Free Tools
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-semibold text-foreground text-lg mb-6">Legal</h3>
              <div className="space-y-4">
                <Link
                  className="text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4 transition-all duration-200 text-sm block"
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
                <Link
                  className="text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4 transition-all duration-200 text-sm block"
                  href="/terms"
                >
                  Terms of Service
                </Link>
                <Link
                  className="text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4 transition-all duration-200 text-sm block"
                  href="/imprint"
                >
                  Imprint
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
