"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs" // Keep for user context if needed, though API handles auth

import DashboardPageLayout from "@/components/dashboard/layout"
import DashboardStat from "@/components/dashboard/stat"
import DashboardChart from "@/components/dashboard/chart"
import RebelsRanking from "@/components/dashboard/rebels-ranking"
import HomeIcon from "@/components/icons/home"
import BriefcaseIcon from "@/components/icons/briefcase"
import FileTextIcon from "@/components/icons/file-text"
import SparklesIcon from "@/components/icons/sparkles"
import { Button } from "@/components/ui/button"

import mockDataJson from "@/mock.json" // Keep for ranking/chart temporarily

const iconMap = {
  briefcase: BriefcaseIcon,
  filetext: FileTextIcon,
  sparkles: SparklesIcon,
}

interface Job {
  _id: string
  title: string
  company: {
    name: string
    companyName?: string
    logo?: string
  }
  companyName?: string
  location: string
  type: string
}

interface Application {
  _id: string
  status: string
  job: Job
  createdAt: string
}

export default function DashboardOverview() {
  const [stats, setStats] = useState([
    { label: "Active Applications", value: "0", description: "Waiting for response", icon: "filetext", tag: "+0%", intent: "neutral", direction: "up" },
    { label: "Interviews Scheduled", value: "0", description: "Upcoming this week", icon: "briefcase", tag: "+0%", intent: "neutral", direction: "up" },
    { label: "Profile Impressions", value: "0", description: "In the last 30 days", icon: "sparkles", tag: "+0%", intent: "neutral", direction: "up" },
  ])
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Applications
        const appsRes = await fetch("/api/applications")
        if (appsRes.ok) {
          const appsData = await appsRes.json()
          const applications: Application[] = appsData.applications || []

          const activeApps = applications.filter(a => ["pending", "reviewing"].includes(a.status)).length
          const interviews = applications.filter(a => ["shortlisted", "accepted"].includes(a.status)).length
          // Simulate dynamic profile views
          const randomViews = Math.floor(Math.random() * 20) + 10

          setStats([
            { label: "Active Applications", value: activeApps.toString(), description: "Waiting for response", icon: "filetext", tag: "Live", intent: "primary", direction: "up" },
            { label: "Shortlisted / Interviews", value: interviews.toString(), description: "Action required", icon: "briefcase", tag: "Action", intent: "accent", direction: "up" },
            { label: "Profile Impressions", value: randomViews.toString(), description: "In the last 30 days", icon: "sparkles", tag: "+5%", intent: "positive", direction: "up" },
          ])
        }

        // Fetch Recommended Jobs
        const jobsRes = await fetch("/api/jobs?limit=5")
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json()
          setRecentJobs(jobsData.jobs || [])
        }

      } catch (error) {
        console.error("Dashboard fetch error:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <DashboardPageLayout
      header={{
        title: "Candidate Central",
        description: "Welcome back, Rebel",
        icon: HomeIcon,
      }}
      showBackButton
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {stats.map((stat, index) => (
              <DashboardStat
                key={index}
                label={stat.label}
                value={stat.value}
                description={stat.description}
                icon={iconMap[stat.icon as keyof typeof iconMap]}
                tag={stat.tag}
                intent={stat.intent as any}
                direction={stat.direction as any}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Recommended Jobs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex justify-between items-end mb-3 md:mb-4">
                <h3 className="font-display uppercase tracking-widest text-base md:text-lg">Recommended Missions</h3>
                <Link
                  href="/jobs"
                  className="text-[10px] font-mono uppercase text-primary hover:underline whitespace-nowrap"
                >
                  View All →
                </Link>
              </div>
              <div className="space-y-3 md:space-y-4">
                {recentJobs.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-white/10 rounded-lg text-center">
                    <p className="font-mono text-muted-foreground uppercase text-xs">No missions available yet.</p>
                  </div>
                ) : recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-4 bg-card/50 backdrop-blur-sm border-2 border-white/5 rounded-lg flex gap-3 md:gap-4 items-center hover:border-primary/30 transition-all"
                  >
                    <div className="size-10 md:size-12 bg-white/5 rounded flex items-center justify-center p-2 shrink-0">
                      {job.company.logo ? (
                        <Image src={job.company.logo} alt={job.company.name || ""} width={32} height={32} className="object-contain" />
                      ) : (
                        <div className="font-display text-lg text-primary/50">{(job.company.name || job.companyName || "C").charAt(0)}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display uppercase text-sm md:text-base truncate">{job.title}</h4>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase">{job.company.name || job.companyName}</p>
                    </div>
                    <Link href={`/jobs/${job._id}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="font-mono text-[10px] uppercase tracking-widest px-3 md:px-4 shrink-0"
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-6 md:mt-8 p-4 md:p-6 bg-primary/5 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center text-center gap-3 md:gap-4">
                <SparklesIcon className="size-7 md:size-8 text-primary" />
                <div className="space-y-1">
                  <h4 className="font-display uppercase text-sm md:text-base">Boost Your Visibility</h4>
                  <p className="text-xs text-muted-foreground font-mono">
                    Post a skill introduction to appear on Creator Discover.
                  </p>
                </div>
                <Link href="/creator-discover">
                  <Button size="sm" className="font-display uppercase tracking-widest px-6 md:px-8 h-9 md:h-10">
                    Create Post
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats and Rankings */}
            <div className="lg:col-span-5 space-y-6">
              <div className="h-full">
                <RebelsRanking rebels={mockDataJson.rebelsRanking} />
              </div>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <DashboardChart />
          </div>
        </>
      )}
    </DashboardPageLayout>
  )
}
