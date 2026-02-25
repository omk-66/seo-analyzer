"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

// Testimonials data
const testimonials = [
  {
    name: "Olive",
    date: "Dec 4, 2024",
    avatar: "/testimonials/olive.jpg",
    content: "I started at 58 score 😅 Got super helpful insights from YourWebsiteScore. Learned new things about SEO and Security I didn't know before and added them to my app 😊"
  },
  {
    name: "David",
    date: "Dec 2, 2025",
    avatar: "/testimonials/david.jpg",
    content: "Thanks Andi for the great product!"
  },
  {
    name: "Ashish",
    date: "Nov 18, 2025",
    avatar: "/testimonials/ashish.jpg",
    content: "And boom! Don't even take 5 mins. Typscool went from 🚨 to ✅!"
  },
  {
    name: "Gaurav Tiwari",
    date: "Nov 17, 2025",
    avatar: "/testimonials/gaurav.jpg",
    content: "Cool built ✌️, my score was 55 for sketchidraw.com. It will surely help to make your websites better in all aspects."
  },
  {
    name: "Dr. Maen K Househ",
    date: "Nov 13, 2025",
    avatar: "/testimonials/househ.jpg",
    content: "Challenge accepted! Let's see up to what score we can push that. The score is already making much more sense than Google PageSpeed Insights"
  },
  {
    name: "Aleksandar Jovanovic",
    date: "Nov 13, 2025",
    avatar: "/testimonials/aleksandar.jpg",
    content: "Guys, the late night pain paid off. The site is up and running again and the stats are looking better than ever! 😭😭😭 Check out YourWebsiteScore, it has helped me a lot!"
  },
  {
    name: "Stu Green",
    date: "",
    avatar: "/testimonials/stu.jpg",
    content: "I love the app. Just started using it. I like the \"Copy to LLM\" feature, and the fact the prompt is proprietary."
  },
  {
    name: "DOM",
    date: "Nov 9, 2025",
    avatar: "/testimonials/dom.jpg",
    content: "This tool is insane. Definitely worth paying for! Wasn't expecting a high score since it's still in the MVP stage but damn the trust needs to go up. At least I know now 😂"
  },
  {
    name: "Rareș",
    date: "Jan 15, 2026",
    avatar: "/testimonials/rares.jpg",
    content: "YourWebsiteScore forced me to optimize my site for SEO, speed and security. My website is much better because of this product. I even reached a spot on the Leaderboard, which provides more visibility for my project :)"
  },
  {
    name: "Jonah H.",
    date: "Nov 9, 2025",
    avatar: "/testimonials/jonah.jpg",
    content: "Gotta say, the LLM definitely works! I literally had a dream I had a score of straight 100s and was the 1st on the leaderboard. Woke up and well... definitely was a dream 😂"
  },
  {
    name: "Pau Coderch",
    date: "",
    avatar: "/testimonials/pau.jpg",
    content: "Had some website optimizations pending. I used yourwebsitescore.com and it helped me catch what was actually broken - security issues, performance problems, stuff I didn't even notice. Went from a 69 score to 87. Very happy with the results :)"
  },
  {
    name: "Luke",
    date: "Jan 6, 2026",
    avatar: "/testimonials/luke.jpg",
    content: "Deal of the decade was buying lifetime access."
  }
]

// Testimonial card component
const TestimonialCard = ({ name, date, avatar, content }: typeof testimonials[0]) => (
  <div className="shrink-0 w-[350px] sm:w-[400px] p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
    <div className="flex items-start gap-4">
      <img
        alt={name}
        loading="lazy"
        width="48"
        height="48"
        decoding="async"
        className="rounded-full object-cover"
        src={avatar}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="font-semibold text-foreground truncate">{name}</h4>
            {date && <p className="text-xs text-muted-foreground truncate">{date}</p>}
          </div>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-primary text-primary"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
      "{content}"
    </p>
  </div>
)

export function TestimonialsSection() {
  // Duplicate testimonials for infinite scroll effect
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section
      data-fast-scroll="scroll_to_testimonials"
      className="py-16 overflow-hidden relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary mb-4">
          <span className="text-xs font-semibold text-primary">Testimonials</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          Loved by founders<br />and SEO pros
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See how users discover and fix critical website issues
        </p>
      </motion.div>

      <div className="testimonials-container relative w-full">
        {/* First row - moving left */}
        <div className="testimonials-row-left flex gap-6 mb-6">
          <motion.div
            className="flex gap-6"
            animate={{ x: [0, -1000] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`left-${index}`} {...testimonial} />
            ))}
          </motion.div>
        </div>

        {/* Second row - moving right */}
        <div className="testimonials-row-right flex gap-6">
          <motion.div
            className="flex gap-6"
            animate={{ x: [-1000, 0] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 35,
                ease: "linear",
              },
            }}
          >
            {duplicatedTestimonials.slice().reverse().map((testimonial, index) => (
              <TestimonialCard key={`right-${index}`} {...testimonial} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
