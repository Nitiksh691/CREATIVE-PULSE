"use client"

import { useState, useEffect } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import BriefcaseIcon from "@/components/icons/briefcase"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Search } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

interface Job {
  _id: string
  title: string
  company: {
    name: string
    logo?: string
  }
  location: string
  salary: {
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
              <Link
                key={job._id}
                href={`/jobs/${job._id}`}
                className="group block p-4 md:p-6 bg-card/50 backdrop-blur-sm border-2 border-white/5 hover:border-primary/30 transition-all duration-300 rounded-lg"
              >
                <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                  <div className="shrink-0 size-12 md:size-16 bg-white/5 rounded-lg flex items-center justify-center p-2">
                    {job.company.logo ? (
                      <Image
                        src={job.company.logo}
                        alt={job.company.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    ) : (
                      <div className="font-display text-xl text-primary/50">
                        {job.company.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base md:text-lg lg:text-xl font-display uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-xs md:text-sm font-mono text-primary uppercase truncate">{job.company.name}</p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <div className="text-sm md:text-base lg:text-lg font-mono font-bold whitespace-nowrap">
                          {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                        </div>
                        <p className="text-[10px] md:text-xs text-muted-foreground font-mono uppercase truncate">
                          {job.location}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 font-mono leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2 pt-1">
                      {job.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="font-mono text-[9px] md:text-[10px] uppercase bg-white/5 px-1.5 md:px-2 py-0.5"
                        >
                          {skill}
                        </Badge>
                      ))}
                      <Badge className="font-mono text-[9px] md:text-[10px] uppercase bg-primary/20 text-primary border border-primary/50 px-1.5 md:px-2 py-0.5 ml-auto">
                        {job.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardPageLayout>
  )
}
