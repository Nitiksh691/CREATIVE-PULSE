"use client"

import { useUser } from "@clerk/nextjs"
import { redirect, usePathname } from "next/navigation"
import { Shield, Users, BarChart3, LayoutDashboard, Settings, Loader2 } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoaded: isClerkLoaded } = useUser()
    const pathname = usePathname()
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function checkAdmin() {
            try {
                const res = await fetch("/api/user/profile")
                if (res.ok) {
                    const data = await res.json()
                    setProfile(data.profileData)
                }
            } catch (error) {
                console.error("Admin check failed:", error)
            } finally {
                setIsLoading(false)
            }
        }
        if (isClerkLoaded) {
            checkAdmin()
        }
    }, [isClerkLoaded])

    if (!isClerkLoaded || isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-widest">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating Admin Credentials...
            </div>
        )
    }

    // Check both Clerk metadata and DB role (DB role is our source of truth for custom changes)
    const isAdmin = user?.publicMetadata?.role === "admin" || profile?.role === "admin"

    if (!isAdmin) {
        redirect("/")
    }


    const navItems = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        // Future items
        // { name: "Content", href: "/admin/content", icon: Shield },
        // { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ]

    return (
        <div className="min-h-screen bg-[#111111] text-white flex relative overflow-hidden">
            {/* Background Spotlights */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Admin Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl hidden md:flex flex-col relative z-10">
                <div className="p-6 border-b border-white/5 flex items-center gap-2">
                    <Shield className="size-6 text-red-500" />
                    <span className="font-display uppercase tracking-widest text-lg">Admin View</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm uppercase transition-all duration-300 ${isActive
                                    ? "bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                                    : "hover:bg-white/5 text-muted-foreground hover:text-white border border-transparent"
                                    }`}
                            >
                                <Icon className="size-4" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="size-8 rounded-full bg-red-500/20 flex items-center justify-center">
                            <Shield className="size-4 text-red-500" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-display truncate">Admin User</p>
                            <p className="text-xs text-muted-foreground font-mono truncate uppercase opacity-50">System Level</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10">
                <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center px-8 justify-between md:hidden">
                    <span className="font-display uppercase tracking-widest text-lg">Admin</span>
                </header>
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
