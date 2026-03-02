import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer-new'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.24),transparent_55%),linear-gradient(to_bottom,#020617,#020617)]">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 md:px-6 pt-32 pb-20">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-4">
              <span className="text-xs font-medium text-emerald-300 uppercase tracking-wider">Privacy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/20 p-8">
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Introduction</h2>
                <p className="text-muted-foreground">
                  WebsiteScore ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our SEO audit services.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Information We Collect</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-xl font-medium text-foreground">1. Information You Provide</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Email address (for newsletter subscriptions and account creation)</li>
                    <li>Website URLs that you submit for analysis</li>
                    <li>Account information (name, company, etc.)</li>
                    <li>Payment information (processed through secure third-party payment processors)</li>
                  </ul>

                  <h3 className="text-xl font-medium text-foreground">2. Automatically Collected Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>IP address and geolocation data</li>
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>Pages visited and time spent on our website</li>
                    <li>Referring website information</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>

                  <h3 className="text-xl font-medium text-foreground">3. Website Analysis Data</h3>
                  <p>When you analyze a website, we collect and process publicly accessible information from that website, including:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Meta tags and structured data</li>
                    <li>Page load times and performance metrics</li>
                    <li>Technical SEO elements</li>
                    <li>Content analysis results</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">How We Use Your Information</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We use the information we collect in the following ways:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>To provide, maintain, and improve our SEO audit services</li>
                    <li>To process website analysis requests and generate reports</li>
                    <li>To communicate with you about your account and services</li>
                    <li>To send newsletters and marketing communications (with your consent)</li>
                    <li>To monitor and analyze trends and usage of our service</li>
                    <li>To detect, prevent, and address technical issues</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Information Sharing</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our service (e.g., payment processors, email services)</li>
                    <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                    <li><strong>Aggregated Data:</strong> We may share anonymized, aggregated data that does not identify individuals</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Data Security</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We implement appropriate technical and organizational measures to protect your personal information, including:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>SSL encryption for data transmission</li>
                    <li>Secure storage of personal information</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication systems</li>
                    <li>Employee training on data protection</li>
                  </ul>
                  <p>However, no method of transmission over the internet or method of electronic storage is 100% secure.</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Cookies and Tracking</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We use cookies and similar tracking technologies to enhance your experience:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how our website is used</li>
                    <li><strong>Marketing Cookies:</strong> Used to personalize your experience (with consent)</li>
                  </ul>
                  <p>You can control cookies through your browser settings and our cookie preferences panel.</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Data Retention</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We retain your personal information only as long as necessary to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Fulfill the purposes for which it was collected</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes</li>
                    <li>Enforce our agreements</li>
                  </ul>
                  <p>Website analysis reports are typically retained for 30 days, unless you have an active subscription.</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Your Rights</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                    <li><strong>Objection:</strong> Object to processing of your information</li>
                    <li><strong>Restriction:</strong> Limit how we use your information</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">International Data Transfers</h2>
                <p className="text-muted-foreground">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers in accordance with applicable data protection laws.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
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
