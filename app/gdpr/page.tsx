import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer-new'

export default function GDPR() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.24),transparent_55%),linear-gradient(to_bottom,#020617,#020617)]">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 md:px-6 pt-32 pb-20">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-4">
              <span className="text-xs font-medium text-emerald-300 uppercase tracking-wider">GDPR</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              GDPR Compliance
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              General Data Protection Regulation (GDPR) compliance statement for WebsiteScore
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            <div className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/20 p-8">
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Introduction to GDPR</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>The General Data Protection Regulation (GDPR) is a regulation in EU law on data protection and privacy for all individuals within the European Union and the European Economic Area. It also addresses the transfer of personal data outside the EU and EEA areas.</p>
                  <p>WebsiteScore is committed to complying with GDPR and protecting the personal data of our users, particularly those within the EU/EEA.</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Data Controller Information</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>WebsiteScore acts as the data controller for personal data processed through our services. Our contact details are:</p>
                  <div className="space-y-2">
                    <p><strong>Company:</strong> WebsiteScore</p>
                    <p><strong>Email:</strong> privacy@websitescore.com</p>
                    <p><strong>Website:</strong> www.websitescore.com</p>
                    <p><strong>Data Protection Officer:</strong> dpo@websitescore.com</p>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Personal Data We Process</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We process the following categories of personal data in accordance with GDPR:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Identity Data:</strong> Name, email address, username</li>
                    <li><strong>Contact Data:</strong> Email address, phone number</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                    <li><strong>Usage Data:</strong> Website usage patterns, service interaction data</li>
                    <li><strong>Payment Data:</strong> Payment information (processed through secure third parties)</li>
                    <li><strong>Marketing Data:</strong> Preferences for receiving marketing communications</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Lawful Basis for Processing</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We process personal data only when we have a lawful basis under GDPR. Our lawful bases include:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Consent:</strong> When you explicitly agree to our processing of your data</li>
                    <li><strong>Contractual Necessity:</strong> To provide our SEO audit services under our terms</li>
                    <li><strong>Legal Obligation:</strong> When required by applicable laws and regulations</li>
                    <li><strong>Legitimate Interest:</strong> For legitimate business interests that don't override your rights</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Your GDPR Rights</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Under GDPR, you have the following rights regarding your personal data:</p>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">1. Right to be Informed</h3>
                    <p>You have the right to be informed about the collection and use of your personal data.</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">2. Right of Access</h3>
                    <p>You can request access to your personal data and information about how we process it.</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">3. Right to Rectification</h3>
                    <p>You can request correction of inaccurate or incomplete personal data.</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">4. Right to Erasure (Right to be Forgotten)</h3>
                    <p>You can request deletion of your personal data when it's no longer necessary for the purpose it was collected.</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">5. Right to Restrict Processing</h3>
                    <p>You can request restriction of processing your personal data under certain circumstances.</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">6. Right to Data Portability</h3>
                    <p>You can request transfer of your personal data to another service provider.</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">7. Right to Object</h3>
                    <p>You can object to processing of your personal data based on legitimate interests.</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-foreground">8. Rights Related to Automated Decision Making</h3>
                    <p>You have rights regarding automated decision-making and profiling.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">How to Exercise Your Rights</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>To exercise your GDPR rights, you can:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Email us at: privacy@websitescore.com</li>
                    <li>Use your account settings to manage preferences</li>
                    <li>Contact our Data Protection Officer at: dpo@websitescore.com</li>
                  </ul>
                  <p>We will respond to your request within one month, unless the request is complex, in which case we may extend this period by up to two months.</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Data Security Measures</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Encryption:</strong> SSL/TLS encryption for data in transit and at rest</li>
                    <li><strong>Access Controls:</strong> Role-based access to personal data</li>
                    <li><strong>Regular Audits:</strong> Security assessments and penetration testing</li>
                    <li><strong>Employee Training:</strong> GDPR compliance training for all staff</li>
                    <li><strong>Data Minimization:</strong> Collecting only necessary data</li>
                    <li><strong>Breach Notification:</strong> Procedures for notifying authorities and individuals</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">International Data Transfers</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>As a global service, we may transfer personal data outside the EEA. We ensure adequate protection through:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Standard Contractual Clauses (SCCs):</strong> EU-approved contracts for data transfers</li>
                    <li><strong>Adequacy Decisions:</strong> Transfers to countries with EU-approved data protection laws</li>
                    <li><strong>Binding Corporate Rules:</strong> Internal rules for intra-group transfers</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Cookies and Tracking</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Our use of cookies complies with GDPR requirements:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Clear cookie consent banner with granular options</li>
                    <li>Detailed cookie policy explaining all cookie types</li>
                    <li>Easy opt-out mechanisms for non-essential cookies</li>
                    <li>Respect for Do Not Track signals</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Data Breach Procedures</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>In the event of a personal data breach, we will:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Assess the risk to individuals' rights and freedoms</li>
                    <li>Notify the relevant supervisory authority within 72 hours</li>
                    <li>Communicate with affected individuals when required</li>
                    <li>Document all breach details and response actions</li>
                    <li>Take measures to prevent future breaches</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Children's Data</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Our service is not directed to children under 16. We do not knowingly collect personal data from children under 16 without parental consent. If we become aware that we have collected such data without consent, we will take steps to delete it immediately.</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Changes to Our GDPR Compliance</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We regularly review and update our GDPR compliance measures to ensure ongoing adherence to the regulation and any related guidance from supervisory authorities.</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Contact Information</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>For GDPR-related inquiries, please contact:</p>
                  <div className="space-y-2">
                    <p><strong>Data Protection Officer:</strong> dpo@websitescore.com</p>
                    <p><strong>General Inquiries:</strong> privacy@websitescore.com</p>
                    <p><strong>Website:</strong> www.websitescore.com</p>
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
          <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
            Cookie Policy
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
