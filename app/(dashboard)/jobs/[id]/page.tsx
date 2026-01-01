"use client"

import { useState, useEffect, use } from "react"
import { notFound, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

import DashboardPageLayout from "@/components/dashboard/layout"
import BriefcaseIcon from "@/components/icons/briefcase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Job {
  _id: string
  title: string
  company: {
    _id: string
    name?: string
    companyName?: string
    logo?: string
  }
  companyName?: string // Fallback
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

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false) // New state
  const [coverLetter, setCoverLetter] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`)
        if (res.status === 404) notFound()
        if (!res.ok) throw new Error("Failed to fetch job")
        const data = await res.json()
        setJob(data.job)

        // Check if user has already applied (if logged in)
        // Ideally we have an endpoint /api/applications/check?jobId=... or we fetch all my apps
        // For now, let's assume we can fetch user's applications
        const appsRes = await fetch("/api/applications/my")
        if (appsRes.ok) {
          const appsData = await appsRes.json()
          // appsData.applications is array of { job: { _id: ... } } or similar
          // We need to check if any app corresponds to this job ID
          const myApps = appsData.applications || []
          const alreadyApplied = myApps.some((app: any) => app.job === id || app.job?._id === id)
          setHasApplied(alreadyApplied)
        }

      } catch (error) {
        console.error("Error fetching job:", error)
        toast.error("Failed to load mission details")
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  const handleApply = async () => {
    if (!user) {
      toast.error("You must be logged in to apply")
      return
    }
    if (!coverLetter.trim()) {
      toast.error("Please provide a cover letter")
      return
    }

    setApplying(true)
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job?._id,
          coverLetter: coverLetter,
          // Resume is handled via user profile for now, or could be added here
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to apply")
      }

      toast.success("Application submitted successfully!")
      setDialogOpen(false)
      setHasApplied(true) // Update state immediately
      // router.push("/dashboard") // Optional: Stay on page to see "Applied" status
    } catch (error: any) {
      console.error("Apply error:", error)
      toast.error(error.message || "Failed to apply")
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <DashboardPageLayout header={{ title: "Loading...", icon: BriefcaseIcon }} showBackButton>
        <div className="flex justify-center py-24">
          <Loader2 className="size-10 text-primary animate-spin" />
        </div>
      </DashboardPageLayout>
    )
  }

  if (!job) return null

  // Resolve company name and logo
  const companyName = job.company?.companyName || job.company?.name || job.companyName || "Unknown Company"
  const companyLogo = job.company?.logo
  const companyId = job.company?._id || (job.company as any)?.id // Handle potential ID variations
  const [imgError, setImgError] = useState(false)

  return (
    <DashboardPageLayout
      header={{
        title: job.title,
        description: companyName,
        icon: BriefcaseIcon,
      }}
      showBackButton
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-card border-2 border-white/5 rounded-2xl space-y-6">
            <div className="flex items-center gap-6">
              <Link href={companyId ? `/companies/${companyId}` : "#"} className="shrink-0 group">
                <div className="size-20 bg-white/5 rounded-xl flex items-center justify-center p-4 border border-white/10 group-hover:border-primary/50 transition-colors">
                  {companyLogo && !imgError ? (
                    <Image
                      src={companyLogo}
                      alt={companyName}
                      width={64}
                      height={64}
                      className="object-contain"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="text-3xl font-display text-primary">{companyName.charAt(0)}</div>
                  )}
                </div>
              </Link>
              <div>
                <h2 className="text-3xl font-display uppercase tracking-tight mb-1">{job.title}</h2>
                <Link href={companyId ? `/companies/${companyId}` : "#"}>
                  <p className="text-primary font-mono uppercase tracking-widest hover:underline">{companyName}</p>
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 py-4 border-y border-white/5">
              <div className="bg-accent px-4 py-2 rounded font-mono text-xs uppercase">
                <span className="opacity-50 mr-2 text-[10px]">Type:</span> {job.type}
              </div>
              <div className="bg-accent px-4 py-2 rounded font-mono text-xs uppercase">
                <span className="opacity-50 mr-2 text-[10px]">Location:</span> {job.location}
              </div>
              {job.budget && (
                <div className="bg-accent px-4 py-2 rounded font-mono text-xs uppercase">
                  <span className="opacity-50 mr-2 text-[10px]">Budget:</span> {job.budget.currency} {job.budget.min.toLocaleString()} - {job.budget.max.toLocaleString()}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-display uppercase tracking-widest text-lg">Mission Brief</h4>
              <p className="text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-display uppercase tracking-widest text-lg">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="px-4 py-1 font-mono uppercase bg-primary/10 text-primary border-primary/30"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-primary/5 border-2 border-primary/20 rounded-2xl flex flex-col gap-4">
            <h4 className="font-display uppercase tracking-widest text-center">Ready for Action?</h4>

            <h4 className="font-display uppercase tracking-widest text-center">Ready for Action?</h4>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full h-14 font-display uppercase tracking-widest text-lg"
                  disabled={hasApplied}
                >
                  {hasApplied ? "Already Applied" : "Apply Now"}
                </Button>
              </DialogTrigger>
              <DialogContent className="border-2 border-white/10 bg-black/90 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="font-display uppercase tracking-wider">Apply for {job.title}</DialogTitle>
                  <DialogDescription className="font-mono text-xs uppercase">
                    Submit your application to {companyName}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="font-mono uppercase text-xs">Cover Letter</Label>
                    <Textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Why are you the best fit for this mission?"
                      className="min-h-[150px] font-mono text-sm"
                    />
                  </div>
                  <div className="bg-primary/10 p-3 rounded border border-primary/20">
                    <p className="text-xs font-mono text-primary">
                      Tip: Your profile resume will be automatically attached to this application.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={applying} className="font-mono uppercase">Cancel</Button>
                  <Button onClick={handleApply} disabled={applying} className="font-display uppercase tracking-widest">
                    {applying ? <Loader2 className="animate-spin size-4" /> : "Submit Application"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="w-full font-display uppercase tracking-widest border-2 bg-transparent">
              Save Mission
            </Button>
            <p className="text-[10px] text-center text-muted-foreground font-mono uppercase tracking-widest mt-2">
              Applications open
            </p>
          </div>

          <div className="p-6 bg-card border-2 border-white/5 rounded-2xl space-y-4">
            <h4 className="font-display uppercase tracking-widest text-sm">About Company</h4>
            <p className="text-xs text-muted-foreground font-mono leading-relaxed">
              {companyName} is hiring on the M.O.N.K.Y OS platform.
            </p>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
