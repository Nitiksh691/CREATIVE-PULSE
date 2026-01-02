"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import BriefcaseIcon from "@/components/icons/briefcase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { CheckCircle2, Clock, XCircle, MoreHorizontal, FileText, Building2, Send } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import AcceptanceNotice from "@/components/dashboard/acceptance-notice"

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/applications")
        if (!res.ok) throw new Error("Failed to fetch applications")
        const data = await res.json()
        setApplications(data.applications)
      } catch (error) {
        console.error("Error fetching applications:", error)
        toast.error("Failed to load applications")
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "reviewing":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-primary/10 text-primary border-primary/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="size-3 md:size-4" />
      case "rejected":
        return <XCircle className="size-3 md:size-4" />
      default:
        return <Clock className="size-3 md:size-4" />
    }
  }

  const activeApplications = applications.filter((app) => ["pending", "reviewing"].includes(app.status))
  const archivedApplications = applications.filter((app) => ["accepted", "rejected", "shortlisted"].includes(app.status))
  const acceptedApplications = applications.filter(app => app.status === 'accepted')

  const renderApplicationCard = (app: any) => {
    const isSpontaneous = app.type === "spontaneous"
    const title = isSpontaneous ? "Direct Inquiry" : app.job?.title || "Unknown Mission"
    const companyName = app.company?.companyName || "Unknown Company"
    const location = app.job?.location || app.company?.location || "Remote"

    return (
      <motion.div
        key={app._id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative overflow-hidden rounded-xl border-2 border-white/5 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300"
      >
        <div className="p-4 md:p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base md:text-lg uppercase tracking-tight">{title}</h3>
                {isSpontaneous && (
                  <Badge variant="outline" className="text-[10px] py-0 h-5 border-blue-500/30 text-blue-400">
                    <Send className="size-2 mr-1" /> Direct
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm font-mono text-muted-foreground uppercase opacity-80">
                <Building2 className="size-3 md:size-4" />
                <span>{companyName}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{location}</span>
              </div>
            </div>
            <Badge variant="secondary" className={`capitalize font-mono text-[10px] md:text-xs px-2 py-1 flex items-center gap-1.5 uppercase tracking-wide border ${getStatusColor(app.status)}`}>
              {getStatusIcon(app.status)}
              {app.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-white/5">
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Proposed Rate</p>
              <p className="font-mono text-xs md:text-sm">{app.proposedRate ? `$${app.proposedRate}/hr` : "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Duration</p>
              <p className="font-mono text-xs md:text-sm">{app.estimatedDuration || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Applied On</p>
              <p className="font-mono text-xs md:text-sm">{new Date(app.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Type</p>
              <p className="font-mono text-xs md:text-sm">{isSpontaneous ? "Spontaneous" : "Job Application"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-3">
              {app.coverLetter && (
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase opacity-70">
                  <FileText className="size-3" /> Cover Letter Included
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs font-mono uppercase tracking-widest hover:bg-white/5">
              Details <MoreHorizontal className="size-3 ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Mission Log",
        description: "Track your active operations",
        icon: BriefcaseIcon,
      }}
      showBackButton
    >
      {/* Acceptance Notices */}
      {acceptedApplications.length > 0 && (
        <div className="mb-8 space-y-4">
          {acceptedApplications.map(app => (
            <AcceptanceNotice key={app._id} app={app} />
          ))}
        </div>
      )}

      <Tabs defaultValue="active" className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 h-12 md:h-14 w-full md:w-auto overflow-x-auto justify-start md:justify-center">
          <TabsTrigger value="active" className="font-display uppercase tracking-widest text-xs md:text-sm h-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[120px]">
            Active Missions ({activeApplications.length})
          </TabsTrigger>
          <TabsTrigger value="archived" className="font-display uppercase tracking-widest text-xs md:text-sm h-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[120px]">
            Archived ({archivedApplications.length})
          </TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="active" className="space-y-4">
              {activeApplications.length > 0 ? (
                activeApplications.map(renderApplicationCard)
              ) : (
                <EmptyState type="active" />
              )}
            </TabsContent>

            <TabsContent value="archived" className="space-y-4">
              {archivedApplications.length > 0 ? (
                archivedApplications.map(renderApplicationCard)
              ) : (
                <EmptyState type="archived" />
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </DashboardPageLayout>
  )
}

function EmptyState({ type }: { type: "active" | "archived" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/5 rounded-2xl bg-white/2">
      <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <BriefcaseIcon className="size-8 opacity-50" />
      </div>
      <h3 className="font-display text-xl uppercase tracking-widest mb-2">
        No {type} missions
      </h3>
      <p className="text-muted-foreground font-mono text-sm max-w-sm">
        {type === "active"
          ? "You haven't applied to any missions yet. Access the job board to start."
          : "No archived applications found."}
      </p>
    </div>
  )
}
