import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer-new'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.24),transparent_55%),linear-gradient(to_bottom,#020617,#020617)]">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 md:px-6 pt-32 pb-20">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-4">
              <span className="text-xs font-medium text-emerald-300 uppercase tracking-wider">Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/20 p-8">
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using WebsiteScore ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">2. Description of Service</h2>
                <p className="text-muted-foreground">
                  WebsiteScore is a comprehensive SEO audit tool that analyzes websites and provides detailed reports on technical SEO issues, performance metrics, and optimization recommendations. Our service helps website owners identify and fix critical issues that may affect their search engine rankings and user experience.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">3. User Accounts</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>
                  <p>You agree not to disclose your password to any third party. You are responsible for maintaining the confidentiality of your account and password.</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">4. Website Analysis</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Our Service analyzes publicly accessible websites and provides SEO insights based on various metrics including:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Technical SEO factors (meta tags, structured data, crawlability)</li>
                    <li>Performance metrics (page speed, Core Web Vitals)</li>
                    <li>Content quality and optimization</li>
                    <li>Trust and security signals</li>
                    <li>Social media integration</li>
                  </ul>
                  <p>You acknowledge that website analysis is performed on publicly accessible information and does not access private or restricted content.</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">5. Payment Terms</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>WebsiteScore offers both free and paid analysis services. For paid services:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Payment is required in advance for the selected service</li>
                    <li>All fees are non-refundable except as required by law</li>
                    <li>We reserve the right to modify pricing at any time</li>
                    <li>Subscription renewals are automatic unless cancelled</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">6. Intellectual Property</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>The Service and its original content, features, and functionality are and will remain the exclusive property of WebsiteScore and its licensors. The service is protected by copyright, trademark, and other laws.</p>
                  <p>You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products or services obtained from the Service.</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">7. Privacy</h2>
                <p className="text-muted-foreground">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using WebsiteScore, you agree to the collection and use of information in accordance with our Privacy Policy.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">8. Termination</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.</p>
                  <p>Upon termination, your right to use the Service will cease immediately. All provisions of the Terms which by their nature should survive termination shall survive termination.</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">9. Limitation of Liability</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>In no event shall WebsiteScore, our directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses.</p>
                  <p>Our total liability to you for any cause of action whatsoever, and regardless of the form of the action, will at all times be limited to the amount paid, if any, by you to us during the six (6) month period prior to any cause of action.</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">10. Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which WebsiteScore operates, without regard to its conflict of law provisions.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">11. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right, at our sole discretion, to update, change or replace any part of these Terms by posting updates and changes to our website. It is your responsibility to check our website periodically for changes.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">12. Contact Information</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>If you have any questions about these Terms, please contact us:</p>
                  <div className="space-y-2">
                    <p>Email: legal@websitescore.com</p>
                    <p>Website: www.websitescore.com</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-6 mt-12">
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
            Cookie Policy
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
