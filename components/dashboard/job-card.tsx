"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

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

export default function JobCard({ job }: { job: Job }) {
    const [imgError, setImgError] = useState(false)

    return (
        <div className="relative group block p-4 md:p-6 bg-card/50 backdrop-blur-sm border-2 border-white/5 hover:border-primary/30 transition-all duration-300 rounded-lg">
            <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                <div className="shrink-0 size-12 md:size-16 bg-white/5 rounded-lg flex items-center justify-center p-2 relative z-10">
                    {job.company.logo && !imgError ? (
                        <Image
                            src={job.company.logo}
                            alt={job.company.companyName}
                            width={48}
                            height={48}
                            className="object-contain"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="font-display text-xl text-primary/50">
                            {job.company.companyName?.charAt(0) || "C"}
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="min-w-0 flex-1">
                            <Link href={`/jobs/${job._id}`} className="before:absolute before:inset-0 focus:outline-none">
                                <h3 className="text-base md:text-lg lg:text-xl font-display uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                                    {job.title}
                                </h3>
                            </Link>
                            {/* Company Link - Relative Z-index to float above stretched link */}
                            <div className="relative z-10 w-fit">
                                <Link
                                    href={job.company._id ? `/companies/${job.company._id}` : "#"}
                                    className="text-xs md:text-sm font-mono text-primary uppercase truncate hover:underline hover:text-primary/80"
                                >
                                    {job.company.companyName}
                                </Link>
                            </div>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                            {job.budget && (
                                <div className="text-sm md:text-base lg:text-lg font-mono font-bold whitespace-nowrap">
                                    {job.budget.currency} {job.budget.min.toLocaleString("en-IN")} - {job.budget.max.toLocaleString("en-IN")}
                                </div>
                            )}
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
        </div>
    )
}
