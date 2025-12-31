"use client"

import { useEffect, useState } from "react"
import { Loader2, Users, Briefcase, FileText, CheckCircle2 } from "lucide-react"

interface AdminStats {
    totalUsers: number
    totalFreelancers: number
    totalCompanies: number
    activeJobs: number
    totalApplications: number
    verifiedCompanies: number
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats")
                if (res.ok) {
                    const data = await res.json()
                    setStats(data.stats)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-red-500" /></div>

    const statCards = [
        { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500" },
        { label: "Freelancers", value: stats?.totalFreelancers || 0, icon: Users, color: "text-purple-500" },
        { label: "Companies", value: stats?.totalCompanies || 0, icon: Users, color: "text-orange-500" },
        { label: "Active Jobs", value: stats?.activeJobs || 0, icon: Briefcase, color: "text-green-500" },
        { label: "Total Applications", value: stats?.totalApplications || 0, icon: FileText, color: "text-yellow-500" },
        { label: "Verified Companies", value: stats?.verifiedCompanies || 0, icon: CheckCircle2, color: "text-cyan-500" },
    ]

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="font-display uppercase text-4xl tracking-tighter text-white">
                        System <span className="text-red-500 font-bold italic">Overview</span>
                    </h1>
                    <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest opacity-60">
                        Platform metrics & real-time status
                    </p>
                </div>
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Last sync: {mounted ? new Date().toLocaleTimeString() : "..."}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <div key={i} className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-red-500/30 transition-all duration-500 relative z-10 backdrop-blur-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-xl bg-black/40 border border-white/5 group-hover:scale-110 transition-transform duration-500 ${stat.color}`}>
                                        <Icon className="size-6" />
                                    </div>
                                    <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 w-1/3 group-hover:w-full transition-all duration-1000" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-4xl font-display font-medium mb-1 tracking-tight">{stat.value}</h3>
                                    <div className="flex items-center gap-2">
                                        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider opacity-60">
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
