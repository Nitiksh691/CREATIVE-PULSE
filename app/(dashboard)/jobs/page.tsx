"use client"

import { useState, useEffect } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import BriefcaseIcon from "@/components/icons/briefcase"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import JobCard from "@/components/dashboard/job-card"
import Image from "next/image"
import { Loader2, Search } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

interface Job {
  _id: string
  title: string
  company: {
    _id: string
    companyName: string
    logo?: string
  }
  location: string
  budget?: {
    min: number
    max: number
    currency: string
  }
  type: string
  skills: string[]
  description: string
  createdAt: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const { user } = useUser()

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)

      const res = await fetch(`/api/jobs?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch jobs")

      const data = await res.json()
      setJobs(data.jobs)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      toast.error("Failed to load missions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs()
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Available Missions",
        description: "Find your next high-stakes role",
        icon: BriefcaseIcon,
      }}
    >
      <div className="space-y-4 md:space-y-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH MISSIONS, SKILLS, COMPANIES..."
              className="pl-9 bg-accent/50 border-2 border-white/10 font-mono uppercase text-xs md:text-sm h-10 md:h-12 focus:border-primary/50 transition-colors"
            />
          </div>
          <Button type="submit" className="font-display uppercase tracking-widest px-6 md:px-8 h-10 md:h-12 bg-primary hover:bg-primary/90 shrink-0">
            {loading ? <Loader2 className="animate-spin size-4" /> : "Filter"}
          </Button>
        </form>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 text-primary animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
            <p className="font-mono text-muted-foreground uppercase">No missions found</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </DashboardPageLayout>
  )
}
