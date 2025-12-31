"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import BuildingIcon from "@/components/icons/building"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface Company {
  id: string
  name: string
  industry: string
  size: string
  location: string
  logo?: string
  description?: string
  website?: string
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies")
        if (!res.ok) throw new Error("Failed to fetch companies")
        const data = await res.json()
        setCompanies(data.companies)
      } catch (error) {
        console.error("Error fetching companies:", error)
        toast.error("Failed to load companies")
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  return (
    <DashboardPageLayout
      header={{
        title: "Company Directory",
        description: "Explore revolutionary organizations",
        icon: BuildingIcon,
      }}
      showBackButton
    >
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 md:p-6 bg-card/50 rounded-lg border-2 border-white/5 space-y-4">
              <div className="flex gap-4">
                <Skeleton className="size-14 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {companies.map((company) => (
            <Link
              key={company.id}
              href={`/companies/${company.id}`}
              className="group p-4 md:p-6 bg-card/50 backdrop-blur-sm border-2 border-white/5 hover:border-primary/30 transition-all duration-300 rounded-lg flex flex-col gap-4"
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className="shrink-0 size-14 md:size-20 bg-white/5 rounded-lg flex items-center justify-center p-2 md:p-3">
                  <Image
                    src={company.logo || "/placeholder.svg"}
                    alt={company.name}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <h3 className="text-base md:text-xl font-display uppercase truncate">{company.name}</h3>
                  <p className="text-[10px] md:text-xs text-primary font-mono uppercase">{company.industry}</p>
                </div>
              </div>

              <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 font-mono leading-relaxed">
                {company.description || "No description available yet."}
              </p>

              <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                <span>{company.size} Rebels</span>
                <span className="truncate ml-2">{company.location}</span>
              </div>
            </Link>
          ))}
          {companies.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground font-mono uppercase">
              No active companies found.
            </div>
          )}
        </div>
      )}
    </DashboardPageLayout>
  )
}
