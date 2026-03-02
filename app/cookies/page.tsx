import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer-new'

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.24),transparent_55%),linear-gradient(to_bottom,#020617,#020617)]">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 md:px-6 pt-32 pb-20">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-4">
              <span className="text-xs font-medium text-emerald-300 uppercase tracking-wider">Cookies</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Cookie Policy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/20 p-8">
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">What Are Cookies?</h2>
                <p className="text-muted-foreground">
                  Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">How We Use Cookies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>WebsiteScore uses cookies for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Essential Cookies:</strong> Required for basic website functionality and security</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                    <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                    <li><strong>Marketing Cookies:</strong> Used to deliver personalized advertisements (with consent)</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Types of Cookies We Use</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">1. Essential Cookies</h3>
                    <p className="text-muted-foreground">These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services.</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Authentication and security</li>
                      <li>Shopping cart contents</li>
                      <li>Load balancing</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">2. Analytics Cookies</h3>
                    <p className="text-muted-foreground">These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Google Analytics</li>
                      <li>Hotjar (for user behavior analysis)</li>
                      <li>Custom analytics tracking</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">3. Functional Cookies</h3>
                    <p className="text-muted-foreground">These cookies enable the website to provide enhanced functionality and personalization.</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Remembering your preferences</li>
                      <li>Language settings</li>
                      <li>Theme preferences</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">4. Marketing Cookies</h3>
                    <p className="text-muted-foreground">These cookies are used to deliver advertisements that are relevant to you and your interests.</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Google Ads</li>
                      <li>Facebook Pixel</li>
                      <li>LinkedIn Insight Tag</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Third-Party Cookies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>In some special cases, we also use cookies provided by trusted third parties. The following third-party cookies are used on our website:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                    <li><strong>Stripe:</strong> For secure payment processing</li>
                    <li><strong>Cloudflare:</strong> For security and performance optimization</li>
                    <li><strong>Vercel Analytics:</strong> For deployment and performance metrics</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Managing Your Cookie Preferences</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>You have several options to manage cookies:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Browser Settings:</strong> Most browsers allow you to control cookies through their settings</li>
                    <li><strong>Cookie Consent Banner:</strong> Our cookie consent banner allows you to accept or reject non-essential cookies</li>
                    <li><strong>Cookie Preferences Panel:</strong> Accessible from our website footer</li>
                    <li><strong>Opt-out Tools:</strong> Use industry-standard opt-out tools for advertising cookies</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Cookie Duration</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Different cookies have different lifespans:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Session Cookies:</strong> Expire when you close your browser</li>
                    <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them</li>
                    <li><strong>Authentication Cookies:</strong> Typically last for 30 days</li>
                    <li><strong>Analytics Cookies:</strong> Usually expire after 2 years</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Your Rights Regarding Cookies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Accept or reject non-essential cookies</li>
                    <li>Withdraw consent at any time</li>
                    <li>Delete cookies stored on your device</li>
                    <li>Configure browser settings to block cookies</li>
                    <li>Request information about cookies we use</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Impact of Disabling Cookies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>If you choose to disable cookies, some parts of our website may not function properly:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You may not be able to log in to your account</li>
                    <li>Personalized features may not work</li>
                    <li>Some interactive elements may be unavailable</li>
                    <li>We may not be able to remember your preferences</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Updates to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Contact Information</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>If you have any questions about our use of cookies, please contact us:</p>
                  <div className="space-y-2">
                    <p>Email: privacy@websitescore.com</p>
                    <p>Website: www.websitescore.com</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-6 mt-12">
          <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/gdpr" className="text-muted-foreground hover:text-foreground transition-colors">
            GDPR
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
