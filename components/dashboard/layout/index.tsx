"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

interface DashboardPageLayoutProps {
  children: React.ReactNode
  header: {
    title: string
    description?: string
    icon: React.ElementType
  }
  showBackButton?: boolean
}

export default function DashboardPageLayout({ children, header, showBackButton = false }: DashboardPageLayoutProps) {
  const router = useRouter()

  return (
    <SidebarInset className="flex flex-col w-full min-h-screen bg-transparent">
      <div className="sticky top-0 lg:top-0 z-10 bg-background/40 backdrop-blur-xl border-b-2 border-white/5">
        <div className="flex items-center gap-3 md:gap-4 px-4 md:px-8 py-3 md:py-6 max-w-7xl mx-auto w-full">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="shrink-0 hover:bg-primary/10 hover:text-primary"
            >
              <ArrowLeft className="size-5 md:size-6" />
            </Button>
          )}
          <div className="flex items-center justify-center size-10 md:size-12 bg-primary/10 rounded-lg shrink-0">
            <header.icon className="size-5 md:size-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-display uppercase tracking-tight truncate">
              {header.title}
            </h1>
            {header.description && (
              <p className="text-xs md:text-sm text-muted-foreground font-mono uppercase mt-0.5 md:mt-1 truncate">
                {header.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-10">{children}</div>
      </div>
    </SidebarInset>
  )
}
