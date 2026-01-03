"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Loader2, Plus, MoreHorizontal, Users, Eye } from "lucide-react"

import DashboardPageLayout from "@/components/dashboard/layout"
import DashboardStat from "@/components/dashboard/stat"
import BriefcaseIcon from "@/components/icons/briefcase"

import FileTextIcon from "@/components/icons/file-text"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const iconMap = {
  briefcase: BriefcaseIcon,
  users: Users,
  filetext: FileTextIcon,
}

interface Job {
  _id: string
  title: string
  status: string
  applicationsCount: number
  createdAt: string
  type: string
  location: string
  views?: number
}

interface Application {
  _id: string
  status: string
  job: { title: string }
  freelancer: { name: string; email: string; resume?: string }
  coverLetter?: string
  createdAt: string
}

export default function CompanyDashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter() // Need to import this
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user && user.publicMetadata.role !== "company") {
      toast.error("Unauthorized access")
      router.push("/dashboard")
    }
  }, [isLoaded, user, router])
  const [jobs, setJobs] = useState<Job[]>([])
  const [recentApplications, setRecentApplications] = useState<Application[]>([])
  const [spontaneousApps, setSpontaneousApps] = useState<Application[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [postingJob, setPostingJob] = useState(false)
  const [newJob, setNewJob] = useState({
    title: "",
    salaryMin: "",
    salaryMax: "",
    skills: "",
    description: "",
    location: "Remote",
    type: "full-time",
    category: "Development"
  })

  // Acceptance Details State
  const [showAcceptanceForm, setShowAcceptanceForm] = useState(false)
  const [acceptanceDetails, setAcceptanceDetails] = useState({
    email: "",
    phone: "",
    message: "We were impressed by your profile and would like to proceed with your application."
  })

  // Calculate stats
  const stats = [
    { label: "Active Missions", value: jobs.filter(j => j.status === 'open').length.toString(), description: "Currently live", icon: "briefcase", tag: "+2 this week", intent: "primary", direction: "up" },
    { label: "Total Applicants", value: jobs.reduce((acc, curr) => acc + (curr.applicationsCount || 0), 0).toString(), description: "Across all missions", icon: "users", tag: "+12% vs last month", intent: "accent", direction: "up" },
    { label: "Direct Inquiries", value: spontaneousApps.length.toString(), description: "Unsolicited profiles", icon: "filetext", tag: "New", intent: "secondary", direction: "flat" },
    { label: "Talent Selected", value: recentApplications.filter(a => a.status === 'accepted').length.toString(), description: "Successful Hires", icon: "users", tag: "Growing", intent: "accent", direction: "up" }
  ]

  // Fetch Data
  const fetchData = async () => {
    if (!user) return
    try {
      const appsRes = await fetch("/api/applications")
      if (appsRes.ok) {
        const data = await appsRes.json()
        const allApps = data.applications || []
        // Split applications
        setRecentApplications(allApps.filter((a: any) => a.type !== "spontaneous"))
        setSpontaneousApps(allApps.filter((a: any) => a.type === "spontaneous"))
      }

      const jobsRes = await fetch("/api/jobs?limit=50&scope=mine&status=all")
      if (jobsRes.ok) {
        const data = await jobsRes.json()
        setJobs(data.jobs || [])
      }

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      fetchData()
    }
  }, [isLoaded, user])

  const handlePostJob = async () => {
    if (!newJob.title || !newJob.description || !newJob.skills || !newJob.salaryMin || !newJob.salaryMax) {
      toast.error("Please fill in all required fields")
      return
    }

    setPostingJob(true)
    try {
      const payload = {
        title: newJob.title,
        description: newJob.description,
        location: newJob.location,
        type: newJob.type.toLowerCase(),
        category: newJob.category,
        budget: {
          min: Number(newJob.salaryMin),
          max: Number(newJob.salaryMax),
          currency: "USD"
        },
        skills: newJob.skills.split(",").map(s => s.trim()).filter(s => s),
      }

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success("Mission deployed successfully!")
        setDialogOpen(false)
        setNewJob({
          title: "",
          salaryMin: "",
          salaryMax: "",
          skills: "",
          description: "",
          location: "Remote",
          type: "full-time",
          category: "Development"
        })
        fetchData() // Refresh list
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to deploy mission")
      }
    } catch (error) {
      console.error("Post job error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setPostingJob(false)
    }
  }

  const handleReviewClick = (app: Application) => {
    setSelectedApplication(app)
    setReviewDialogOpen(true)
  }

  const handleStatusUpdate = async (status: 'accepted' | 'rejected') => {
    if (!selectedApplication) return

    // If accepting and form not shown yet, show form first
    if (status === 'accepted' && !showAcceptanceForm) {
      setAcceptanceDetails(prev => ({ ...prev, email: user?.primaryEmailAddress?.emailAddress || "" }))
      setShowAcceptanceForm(true)
      return
    }

    setUpdatingStatus(true)
    try {
      const payload: any = { status }

      if (status === 'accepted') {
        payload.acceptanceDetails = acceptanceDetails
      }

      const res = await fetch(`/api/applications/${selectedApplication._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success(status === 'accepted' ? "Candidate Hired! Notification sent." : "Application rejected")
        setReviewDialogOpen(false)
        setShowAcceptanceForm(false) // Reset
        fetchData() // Refresh list
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to update status")
      }
    } catch (error) {
      console.error("Update status error:", error)
      toast.error("Failed to update status")
    } finally {
      setUpdatingStatus(false)
    }
  }

  // ... (rest of the file until return)

  return (
    <DashboardPageLayout
      header={{
        title: "Command Center",
        description: "Manage your recruitment operations",
        icon: BriefcaseIcon,
      }}
      showBackButton
    >
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Active Missions */}
        <div className="lg:col-span-8 space-y-8">

          {/* Section 1: Job Postings */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display uppercase tracking-widest text-lg">Active Missions</h3>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="font-display uppercase tracking-widest px-6">Launch Posting</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-card border-2 border-white/10 max-h-[90vh] overflow-y-auto">
                  {/* ... Keep Dialog Content same ... */}
                  <DialogHeader>
                    <DialogTitle className="font-display uppercase text-2xl">Create New Mission</DialogTitle>
                    <DialogDescription className="font-mono">Define parameters for your new recruitment drive.</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="col-span-2 space-y-2">
                      <Label>Mission Title</Label>
                      <Input value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} placeholder="e.g. Senior Frontend Engineer" className="font-mono" />
                    </div>
                    <div className="space-y-2">
                      <Label>Min Salary</Label>
                      <Input type="number" value={newJob.salaryMin} onChange={e => setNewJob({ ...newJob, salaryMin: e.target.value })} placeholder="80000" className="font-mono" />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Salary</Label>
                      <Input type="number" value={newJob.salaryMax} onChange={e => setNewJob({ ...newJob, salaryMax: e.target.value })} placeholder="120000" className="font-mono" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Required Skills (comma separated)</Label>
                      <Input value={newJob.skills} onChange={e => setNewJob({ ...newJob, skills: e.target.value })} placeholder="React, Node.js, TypeScript" className="font-mono" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Mission Description</Label>
                      <Textarea className="min-h-[100px] font-mono" value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} placeholder="Describe the role..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} className="font-mono" />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={newJob.type} onValueChange={v => setNewJob({ ...newJob, type: v })}>
                        <SelectTrigger className="font-mono"><SelectValue /></SelectTrigger>
                        <SelectContent className="font-mono">
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={newJob.category} onValueChange={v => setNewJob({ ...newJob, category: v })}>
                        <SelectTrigger className="font-mono"><SelectValue /></SelectTrigger>
                        <SelectContent className="font-mono">
                          <SelectItem value="Development">Development</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={postingJob}>Cancel</Button>
                    <Button onClick={handlePostJob} disabled={postingJob}>{postingJob ? <Loader2 className="animate-spin" /> : "Deploy Mission"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {jobs.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-white/10 rounded-lg text-center">
                  <p className="font-mono text-muted-foreground">No active missions deployed.</p>
                </div>
              ) : jobs.map(job => (
                <div key={job._id} className="p-6 bg-card/50 backdrop-blur-sm border-2 border-white/5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-white/5 rounded-lg flex items-center justify-center">
                      <BriefcaseIcon className="size-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-display uppercase text-sm sm:text-base">{job.title}</h4>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] uppercase font-mono">{job.type}</Badge>
                        <Badge variant="outline" className="text-[10px] uppercase font-mono">{job.location}</Badge>
                        <Badge
                          variant={job.status === 'open' ? 'default' : 'secondary'}
                          className={`text-[10px] uppercase font-mono ${job.status === 'open' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/50' : ''}`}
                        >
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto">
                    <div className="flex items-center gap-2 text-sm font-mono">
                      <Users className="size-4 text-primary" />
                      <span>{job.applicationsCount || 0} Applicants</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] font-mono">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Applicants</DropdownMenuItem>
                        <DropdownMenuItem>Edit Mission</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Spontaneous Inquiries */}
          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display uppercase tracking-widest text-lg flex items-center gap-2">
                <Users className="size-5 text-blue-400" /> Direct Inquiries
              </h3>
              <Badge variant="outline" className="text-xs font-mono">{spontaneousApps.length} New</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spontaneousApps.length === 0 ? (
                <div className="col-span-full p-8 border-2 border-dashed border-white/10 rounded-lg text-center">
                  <p className="font-mono text-muted-foreground">No direct inquiries received yet.</p>
                </div>
              ) : spontaneousApps.map(app => (
                <div key={app._id} className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg space-y-3 hover:border-blue-500/40 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-display uppercase text-sm">{app.freelancer?.name || "Unknown Agent"}</h5>
                      <p className="text-[10px] text-blue-400 font-mono uppercase tracking-widest mt-1">Spontaneous Application</p>
                    </div>
                    <Badge
                      className={`text-[10px] uppercase font-mono ${app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-white/5'}`}
                    >
                      {app.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-[10px] text-muted-foreground font-mono">{new Date(app.createdAt).toLocaleDateString()}</span>
                    <Button size="sm" variant="ghost" className="h-7 text-[10px] font-mono uppercase bg-blue-500/10 hover:bg-blue-500/20 text-blue-400">View Profile</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Possible Sidebar / Recent Activity for Job Apps */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Job Applications */}
          <div className="space-y-4">
            <h3 className="font-display uppercase tracking-widest text-lg">Recent Applicants</h3>
            <div className="space-y-3">
              {recentApplications.slice(0, 5).map(app => (
                <div key={app._id} className="p-4 bg-white/5 rounded-lg border border-white/5 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h5 className="font-display uppercase text-sm">{app.freelancer?.name || "Unknown Agent"}</h5>
                    <Badge variant="outline" className="text-[10px] font-mono uppercase">{app.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono truncate">Applied for: {app.job?.title}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-muted-foreground font-mono">{new Date(app.createdAt).toLocaleDateString()}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-[10px] font-mono uppercase"
                      onClick={() => handleReviewClick(app)}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
              {recentApplications.length === 0 && (
                <div className="p-8 border-2 border-dashed border-white/10 rounded-lg text-center text-muted-foreground font-mono text-xs">
                  No job applications received yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-xl bg-card border-2 border-white/10">
          <DialogHeader>
            <DialogTitle className="font-display uppercase text-xl">Application Review</DialogTitle>
            <DialogDescription className="font-mono">
              Review details for {selectedApplication?.job?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <div className="size-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                  {selectedApplication.freelancer?.name?.[0] || "?"}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{selectedApplication.freelancer?.name}</h4>
                  <p className="text-sm text-muted-foreground font-mono">{selectedApplication.freelancer?.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Cover Letter</Label>
                <div className="p-4 bg-black/40 rounded-lg border border-white/5 min-h-[100px] text-sm leading-relaxed font-mono">
                  {selectedApplication.coverLetter || "No cover letter provided."}
                </div>
              </div>

              {selectedApplication.freelancer?.resume && (
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Resume / Portfolio</Label>
                  <div className="flex items-center gap-2">
                    <a href={selectedApplication.freelancer.resume} target="_blank" rel="noopener noreferrer" className="text-primary underline font-mono text-sm break-all">
                      {selectedApplication.freelancer.resume}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {showAcceptanceForm && (
            <div className="py-4 space-y-4 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                <h4 className="font-display uppercase text-green-500 text-sm mb-2">Confirm Hiring</h4>
                <p className="text-xs text-muted-foreground font-mono">
                  Please provide contact details for the freelancer to reach you. This will be shared with them immediately.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Contact Email *</Label>
                <Input
                  value={acceptanceDetails.email}
                  onChange={e => setAcceptanceDetails({ ...acceptanceDetails, email: e.target.value })}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone (Optional)</Label>
                <Input
                  value={acceptanceDetails.phone}
                  onChange={e => setAcceptanceDetails({ ...acceptanceDetails, phone: e.target.value })}
                  className="font-mono"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label>Message / Next Steps *</Label>
                <Textarea
                  value={acceptanceDetails.message}
                  onChange={e => setAcceptanceDetails({ ...acceptanceDetails, message: e.target.value })}
                  className="font-mono min-h-[80px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {!showAcceptanceForm ? (
              <>
                <Button variant="outline" onClick={() => handleStatusUpdate('rejected')} disabled={updatingStatus} className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400">
                  Reject
                </Button>
                <Button onClick={() => handleStatusUpdate('accepted')} disabled={updatingStatus} className="bg-green-600 hover:bg-green-700 text-white">
                  {updatingStatus ? <Loader2 className="animate-spin size-4" /> : "Accept Candidate"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setShowAcceptanceForm(false)} disabled={updatingStatus}>
                  Back
                </Button>
                <Button onClick={() => handleStatusUpdate('accepted')} disabled={updatingStatus || !acceptanceDetails.email || !acceptanceDetails.message} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                  {updatingStatus ? <Loader2 className="animate-spin size-4" /> : "Confirm & Send Notice"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPageLayout >
  )
}
