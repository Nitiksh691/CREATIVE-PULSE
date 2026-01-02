"use client"

import { Button } from "@/components/ui/button"
import { LandingNavbar } from "@/components/landing/navbar"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import BriefcaseIcon from "@/components/icons/briefcase"
import SparklesIcon from "@/components/icons/sparkles"
import PulseIcon from "@/components/icons/pulse"
import { ArrowRight, CheckCircle2, Zap, Users, TrendingUp, Shield } from "lucide-react"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Hero Text Stagger
    gsap.from(".hero-text", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "power4.out",
      delay: 0.2
    })

    // Floating graphics
    gsap.to(".floating-graphic", {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2
    })
  }, { scope: heroRef })

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/jobs")
    }
  }, [isLoaded, isSignedIn, router])

  return (
    <div className="min-h-screen selection:bg-primary/30 relative overflow-hidden" ref={heroRef}>


      {/* Additional ambient glow to brighten the page */}
      <div className="fixed inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none" />

      {/* Top Lamp/Spotlight Effect */}
      {/* Top Lamp/Spotlight Effect - INTENSIFIED */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/20 blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-white/40 blur-[80px] pointer-events-none -z-10 rounded-full mix-blend-overlay" />

      <LandingNavbar />

      <section className="relative pt-32 md:pt-48 lg:pt-56 pb-20 md:pb-32 px-4 md:px-6 overflow-hidden">
        {/* Grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* Accent line */}
        <div className="absolute top-28 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* Hero Spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[400px] md:h-[600px] bg-white/5 blur-[100px] md:blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3, once: false }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            <div className="hero-text inline-flex items-center gap-2 px-4 py-2 mb-6 md:mb-8 border border-primary/30 bg-primary/5 backdrop-blur-sm">
              <div className="size-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-primary">
                Next-Gen Talent Network
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display uppercase leading-[0.85] mb-6 md:mb-8 tracking-tighter">
              <span className="hero-text block">The <span className="text-primary">Creative</span></span>
              <span className="hero-text block">Pulse of the</span>
              <span className="hero-text block"><span className="text-primary">Digital</span> Age</span>
            </h1>

            <p className="hero-text text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed font-mono">
              Connect with revolutionary tech companies. Find high-stakes roles, internships, and freelance missions
              that shape the future. Join the community.
            </p>

            <div className="hero-text flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Button
                size="lg"
                className="h-12 md:h-14 lg:h-16 px-8 md:px-10 lg:px-14 text-sm md:text-base lg:text-lg font-display uppercase tracking-widest bg-primary hover:bg-primary/90 w-full sm:w-auto group"
                asChild
              >
                <Link href="/auth/register" className="flex items-center gap-2">
                  Join the Community
                  <ArrowRight className="size-4 md:size-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 md:h-14 lg:h-16 px-8 md:px-10 lg:px-14 text-sm md:text-base lg:text-lg font-display uppercase tracking-widest border-2 bg-transparent hover:bg-white/5 w-full sm:w-auto"
                asChild
              >
                <Link href="/jobs">Browse the Jobs</Link>
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="mt-16 md:mt-24 grid grid-cols-2 gap-4 md:gap-8 max-w-2xl mx-auto py-8 md:py-10 border-y border-white/10">
              <div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-display text-primary mb-1 md:mb-2">10K+</div>
                <div className="text-xs md:text-sm font-mono uppercase tracking-wider text-muted-foreground">
                  Students Joined in 1 Month
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-display text-primary mb-1 md:mb-2">50+</div>
                <div className="text-xs md:text-sm font-mono uppercase tracking-wider text-muted-foreground">
                  Companies Connected
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3, once: false }}
            className="text-center mb-12 md:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 md:mb-8 border border-primary/30 bg-primary/5 backdrop-blur-sm">
              <Zap className="size-4 text-primary" />
              <span className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-primary">
                System Features
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter mb-4 md:mb-6">
              Built for the <span className="text-primary">Future</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-mono">
              Advanced talent matching powered by cutting-edge technology and revolutionary thinking.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[
              {
                icon: Users,
                title: "Talent Network",
                description:
                  "Connect with elite developers, designers, and engineers shaping the future of technology.",
              },
              {
                icon: Zap,
                title: "Instant Matching",
                description: "AI-powered algorithms match you with perfect opportunities in milliseconds.",
              },
              {
                icon: TrendingUp,
                title: "Career Growth",
                description: "Track your progress, showcase your work, and level up your professional journey.",
              },
              {
                icon: Shield,
                title: "Verified Companies",
                description: "Only work with vetted, innovative companies committed to excellence.",
              },
              {
                icon: BriefcaseIcon,
                title: "Diverse Missions",
                description: "Full-time roles, internships, freelance gigs - find exactly what you need.",
              },
              {
                icon: SparklesIcon,
                title: "Creator Discover",
                description: "Showcase your skills and get discovered by top companies actively hiring.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2, once: false }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 md:p-8 border border-white/10 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card/70 transition-all"
              >
                <div className="size-12 md:size-14 bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                  <feature.icon className="size-6 md:size-7 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-display uppercase mb-2 md:mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground font-mono leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3, once: false }}
            className="text-center mb-12 md:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 md:mb-8 border border-primary/30 bg-primary/5 backdrop-blur-sm">
              <CheckCircle2 className="size-4 text-primary" />
              <span className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-primary">How It Works</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter mb-4 md:mb-6">
              Start Your <span className="text-primary">Mission</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-mono">
              Four simple steps to connect with your dream role and join the rebellion.
            </p>
          </motion.div>

          <div className="space-y-8 md:space-y-12">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Sign up and showcase your skills, experience, and what makes you a rebel in your field.",
              },
              {
                step: "02",
                title: "Browse Missions",
                description:
                  "Explore thousands of opportunities from innovative companies looking for talent like you.",
              },
              {
                step: "03",
                title: "Apply & Connect",
                description: "Submit applications directly and connect with hiring teams in real-time.",
              },
              {
                step: "04",
                title: "Land Your Role",
                description: "Interview, negotiate, and secure your next high-stakes mission with confidence.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.3, once: false }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col md:flex-row gap-6 md:gap-8 group"
              >
                <div className="flex items-start md:items-center gap-4 md:gap-6 flex-1">
                  <div className="size-16 md:size-20 shrink-0 bg-primary/10 border-2 border-primary/30 flex items-center justify-center font-display text-xl md:text-2xl text-primary group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-display uppercase mb-2 md:mb-3 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground font-mono leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="hidden md:block w-px bg-white/10" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3, once: false }}
            className="text-center mb-12 md:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 md:mb-8 border border-primary/30 bg-primary/5 backdrop-blur-sm">
              <SparklesIcon className="size-4 text-primary" />
              <span className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-primary">
                Featured Rebels
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter mb-4 md:mb-6">
              Meet the <span className="text-primary">Community</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-mono">
              Talented professionals showcasing their skills and connecting with top companies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                name: "Alex Chen",
                role: "Full-Stack Engineer",
                avatar: "/avatars/user_mati.png",
                skills: ["React", "Node.js", "PostgreSQL"],
              },
              {
                name: "Sarah Jenkins",
                role: "Video Editor",
                avatar: "/avatars/user_pek.png",
                skills: ["Premiere Pro", "After Effects", "DaVinci"],
              },
              {
                name: "Marcus Thorne",
                role: "Script Writer",
                avatar: "/avatars/user_joyboy.png",
                skills: ["Storytelling", "Screenplay", "Copywriting"],
              },
              {
                name: "Sam Taylor",
                role: "Frontend Developer",
                avatar: "/avatars/user_krimson.png",
                skills: ["Vue", "TypeScript", "Tailwind"],
              },
              {
                name: "Riley Morgan",
                role: "Blockchain Engineer",
                avatar: "/avatars/user_mati.png",
                skills: ["Solidity", "Web3", "Rust"],
              },
              {
                name: "Casey Liu",
                role: "Product Designer",
                avatar: "/avatars/user_pek.png",
                skills: ["Figma", "Prototyping", "UX Research"],
              },
            ].map((creator, i) => {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.2, once: false }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-5 md:p-6 border border-white/10 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card/70 transition-all"
                >
                  <div className="flex items-center gap-3 md:gap-4 mb-4">
                    <div className="size-12 md:size-14 shrink-0 border-2 border-primary/30 overflow-hidden group-hover:border-primary/50 transition-all">
                      <Image
                        src={creator.avatar || "/placeholder.svg"}
                        alt={creator.name}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display uppercase tracking-wider text-sm md:text-base truncate">
                        {creator.name}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground font-mono truncate">{creator.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {creator.skills.map((skill, j) => (
                      <span
                        key={j}
                        className="text-[10px] md:text-xs px-2 md:px-3 py-1 bg-primary/10 border border-primary/30 font-mono uppercase tracking-wider text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 lg:py-40 px-4 md:px-6 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.5, once: false }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 md:mb-8 border border-primary/30 bg-primary/5 backdrop-blur-sm">
              <div className="size-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-primary">
                Ready to Begin?
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display uppercase leading-[0.9] mb-6 md:mb-8 tracking-tighter">
              Join the <br />
              <span className="text-primary">Revolution</span> Today
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed font-mono">
              Start your journey. Connect with innovative companies and shape the future of tech.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Button
                size="lg"
                className="h-12 md:h-14 lg:h-16 px-8 md:px-12 lg:px-16 text-sm md:text-base lg:text-lg font-display uppercase tracking-widest bg-primary hover:bg-primary/90 w-full sm:w-auto group"
                asChild
              >
                <Link href="/auth/register" className="flex items-center gap-2">
                  Get Started Now
                  <ArrowRight className="size-4 md:size-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 md:h-14 lg:h-16 px-8 md:px-12 lg:px-16 text-sm md:text-base lg:text-lg font-display uppercase tracking-widest border-2 bg-transparent hover:bg-white/5 w-full sm:w-auto"
                asChild
              >
                <Link href="/jobs">Explore Missions</Link>
              </Button>
            </div>

            <p className="mt-6 md:mt-8 text-xs md:text-sm text-muted-foreground font-mono uppercase tracking-[0.2em]">
              No credit card required • Free to start • Join 10,000+ rebels
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-black/50 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <PulseIcon className="size-7 md:size-8 text-primary" />
                <span className="text-lg md:text-xl font-display uppercase tracking-wider">CREATIVE PULSE</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-mono">
                The pulse for creative talent. Connecting innovation with artistry.
              </p>
            </div>
            <div>
              <h4 className="font-display uppercase tracking-widest mb-4 md:mb-6 text-sm md:text-base">Missions</h4>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-muted-foreground font-mono uppercase tracking-widest">
                <li>
                  <Link href="/jobs" className="hover:text-primary transition-colors">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className="hover:text-primary transition-colors">
                    Companies
                  </Link>
                </li>
                <li>
                  <Link href="/creator-discover" className="hover:text-primary transition-colors">
                    Discover Talent
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-display uppercase tracking-widest mb-4 md:mb-6 text-sm md:text-base">Company</h4>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-muted-foreground font-mono uppercase tracking-widest">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-display uppercase tracking-widest mb-4 md:mb-6 text-sm md:text-base">Legal</h4>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-muted-foreground font-mono uppercase tracking-widest">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs md:text-sm text-muted-foreground font-mono text-center md:text-left">
              © 2026 CREATIVE PULSE. All rights reserved.
            </p>
            <div className="flex items-center gap-4 md:gap-6">
              <Link
                href="#"
                className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors font-mono uppercase"
              >
                Twitter
              </Link>
              <Link
                href="#"
                className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors font-mono uppercase"
              >
                LinkedIn
              </Link>
              <Link
                href="#"
                className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors font-mono uppercase"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
