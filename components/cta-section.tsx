"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

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
  const handleAnalyzeClick = () => {
    // Scroll to hero section
    const heroSection = document.getElementById('hero-section')
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-24 max-md:px-4 md:py-28">
      <div className="rounded-[1.3rem] border border-border/5 bg-neutral/5 p-1.5 dark:bg-neutral/50 relative mx-auto max-w-3xl bg-background">
        <div className="relative z-10 bg-background/5 px-6 py-16 text-center backdrop-blur-[2px] md:px-14 md:py-28">
          <motion.h2
            className="mx-auto mb-6 text-3xl font-extrabold tracking-tight md:mb-8 md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Find SEO opportunities hiding in your website
          </motion.h2>

          <motion.p
            className="text-muted-foreground mx-auto mb-8 max-w-124 leading-relaxed md:mb-12 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Discover which technical issues are hurting your rankings so you can fix them and grow your organic traffic, fast.
          </motion.p>

          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              size="lg"
              className="w-full md:w-auto px-8 py-3 text-base"
              onClick={handleAnalyzeClick}
            >
              Analyze Your Website Free
            </Button>

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
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 h-full w-full opacity-10 dark:opacity-5">
          <div className="h-full w-full bg-linear-to-br from-emerald-500/20 via-transparent to-blue-500/20" />
        </div>
      </div>
    </section>
  )
}
