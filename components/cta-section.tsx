"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const users = [
  { name: "Jack", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Edwin", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Adam", avatar: "https://randomuser.me/api/portraits/men/67.jpg" },
  { name: "RJ", avatar: "https://randomuser.me/api/portraits/women/28.jpg" },
  { name: "Serg", avatar: "https://randomuser.me/api/portraits/men/89.jpg" },
  { name: "Sergiu", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
  { name: "Stephon", avatar: "https://randomuser.me/api/portraits/men/56.jpg" },
  { name: "Katt", avatar: "https://randomuser.me/api/portraits/women/73.jpg" }
]

export function CTASection() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAnalyzeClick = () => {
    // Scroll to hero section
    const heroSection = document.getElementById('hero-section')
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
    <section className="py-24 max-md:px-4 md:py-28">
      <div className="rounded-[1.3rem] border border-border/5 bg-neutral/5 p-1.5 dark:bg-neutral/50 relative mx-auto max-w-3xl bg-background">
        <div className="relative z-10 bg-background/5 px-6 py-16 text-center backdrop-blur-[2px] md:px-14 md:py-28">
          <h2
            className="mx-auto mb-6 text-3xl font-extrabold tracking-tight md:mb-8 md:text-4xl"
          >
            Find SEO opportunities hiding in your website
          </h2>

          <p
            className="text-muted-foreground mx-auto mb-8 max-w-124 leading-relaxed md:mb-12 md:text-xl"
          >
            Discover which technical issues are hurting your rankings so you can fix them and grow your organic traffic, fast.
          </p>

          <div
            className="space-y-6"
          >
            <Button
              size="lg"
              className="w-full md:w-auto px-8 py-3 text-base"
              onClick={handleAnalyzeClick}
            >
              Analyze Your Website Free
            </Button>

            {/* Email Signup */}
            <div className="max-w-md mx-auto">
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
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
                  </Button>
                </div>

                {message && (
                  <p
                    className={`text-sm ${message.includes('Successfully') ? 'text-emerald-600' : 'text-red-600'}`}
                  >
                    {message}
                  </p>
                )}
              </form>
            </div>

            <div className="flex flex-col items-center justify-center gap-1">
              <div className="flex items-center justify-center -space-x-3">
                {users.map((user, index) => (
                  <Avatar key={user.name} className="h-9 w-9 border-2 border-background">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <p className="text-muted-foreground text-sm">
                Loved by <span className="font-medium text-foreground">5,453</span> users
              </p>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 h-full w-full opacity-10 dark:opacity-5">
          <div className="h-full w-full bg-linear-to-br from-emerald-500/20 via-transparent to-blue-500/20" />
        </div>
      </div>
    </section>
  )
}
