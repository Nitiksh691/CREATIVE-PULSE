"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import BuildingIcon from "@/components/icons/building"
import { notFound, useRouter } from "next/navigation"
import Image from "next/image"
import { useEffect, useState, use } from "react" // Added use for unwrapping params
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, Briefcase } from "lucide-react"

interface Job {
  id: string
  title: string
  salary: string
}

interface Company {
  id: string
  name: string
  industry: string
  size: string
  location: string
  logo?: string
  description?: string
  website?: string
  jobs: Job[]
}

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use() or await (since params is now a Promise in Next 15)
  // However, since this is a client component ('use client'), we can use the `use` hook from React
  // or simply wait for it if we were server side. 
  // BUT common pattern for client components in Next 15 is:
  const { id } = use(params)
  const router = useRouter()

  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [isApplyOpen, setIsApplyOpen] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`/api/companies/${id}`)
        if (res.status === 404) {
          notFound()
          return
        }
        const data = await res.json()
        setCompany(data.company)
      } catch (error) {
        console.error("Error fetching company:", error)
        toast.error("Failed to load company details")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCompany()
  }, [id])

  const handleSpontaneousApplication = async () => {
    if (!coverLetter.trim()) {
      toast.error("Please include a message or cover letter")
      return
    }

    setApplying(true)
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: id,
          coverLetter: coverLetter,
          // Optional fields can be added here
        }),
      })

      const text = await res.text()
      let data
      try { data = JSON.parse(text) } catch { throw new Error(text) }

      if (!res.ok) throw new Error(data.error || "Failed to send application")

      toast.success("Profile sent successfully! The company will review your details.")
      setIsApplyOpen(false)
      setCoverLetter("")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <DashboardPageLayout header={{ title: "Loading...", icon: BuildingIcon }} showBackButton>
        <div className="space-y-8 animate-pulse">
          <Skeleton className="h-[200px] w-full rounded-2xl" />
          <Skeleton className="h-[300px] w-full rounded-2xl" />
        </div>
      </DashboardPageLayout>
    )
  }

  if (!company) return null

  return (
    <DashboardPageLayout
      header={{
        title: company.name,
        description: company.industry,
        icon: BuildingIcon,
      }}
      showBackButton
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-card border-2 border-white/5 rounded-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="size-20 bg-white/5 rounded-xl flex items-center justify-center p-4">
                  <Image src={company.logo || "/placeholder.svg"} alt={company.name} width={64} height={64} className="object-contain" />
                </div>
                <div>
                  <h2 className="text-3xl font-display uppercase tracking-tight mb-1">{company.name}</h2>
                  <p className="text-primary font-mono uppercase tracking-widest">{company.industry}</p>
                </div>
              </div>

              {/* Spontaneous Application Button */}
              <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                <DialogTrigger asChild>
                  <Button className="font-display uppercase tracking-widest h-12 px-6">
                    <Send className="mr-2 size-4" /> Send Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-2 border-white/10 bg-card">
                  <DialogHeader>
                    <DialogTitle className="font-display uppercase text-xl">Connect with {company.name}</DialogTitle>
                    <DialogDescription className="font-mono text-xs uppercase opacity-70">
                      Send your profile directly to this company for future opportunities.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="uppercase font-mono text-[10px] tracking-widest opacity-70">Your Pitch / Message</Label>
                      <Textarea
                        placeholder={`Hi ${company.name}, I'm interested in working with you because...`}
                        className="min-h-[150px] bg-background border-border/50 font-mono text-sm uppercase"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleSpontaneousApplication}
                      disabled={applying}
                      className="w-full font-display uppercase tracking-widest"
                    >
                      {applying ? "Sending..." : "Send Profile Now"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4 pt-6 md:pt-0 border-t md:border-t-0 border-white/5">
              <h4 className="font-display uppercase tracking-widest text-lg">Mission Overview</h4>
              <p className="text-muted-foreground font-mono leading-relaxed">{company.description || "No description provided."}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6">
              <div className="p-4 bg-accent/50 rounded-lg border border-white/5">
                <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1">Size</p>
                <p className="font-mono text-sm uppercase">{company.size}</p>
              </div>
              {/* Removed Founded year as it's not in schema currently */}
              <div className="p-4 bg-accent/50 rounded-lg border border-white/5">
                <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1">Location</p>
                <p className="font-mono text-sm uppercase">{company.location}</p>
              </div>
              <div className="p-4 bg-accent/50 rounded-lg border border-white/5">
                <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1">Website</p>
                <a href={company.website} target="_blank" rel="noreferrer" className="font-mono text-sm uppercase hover:text-primary truncate block">
                  {company.website || "N/A"}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-card border-2 border-white/5 rounded-2xl space-y-4">
            <h4 className="font-display uppercase tracking-widest text-sm flex items-center gap-2">
              <Briefcase className="size-4 text-primary" /> Active Missions
            </h4>
            <div className="space-y-3">
              {company.jobs.length > 0 ? company.jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => router.push(`/jobs/${job.id}`)}
                  className="p-3 bg-white/5 cursor-pointer rounded-lg border border-white/5 hover:border-primary/50 transition-colors group"
                >
                  <p className="font-mono text-xs uppercase mb-1 group-hover:text-primary transition-colors">{job.title}</p>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase">{job.salary}</p>
                </div>
              )) : (
                <p className="text-xs font-mono text-muted-foreground uppercase opacity-50">No active jobs posted.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
