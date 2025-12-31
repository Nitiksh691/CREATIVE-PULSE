import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { MobileHeader } from "@/components/dashboard/mobile-header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import mockDataJson from "@/mock.json"
import type { MockData } from "@/types/dashboard"
import { MobileChat } from "@/components/chat/mobile-chat"
import { MobileBottomNav } from "@/components/dashboard/layout/mobile-nav"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import connectDB from "@/lib/db/connect"
import User from "@/lib/db/models/User"



const mockData = mockDataJson as MockData

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { userId } = await auth()

  // Strict server-side check for onboarding using MongoDB (Source of Truth)
  if (userId) {
    await connectDB()
    const dbUser = await User.findOne({ clerkId: userId }).select("onboardingCompleted").lean()

    if (!dbUser || !dbUser.onboardingCompleted) {
      redirect("/onboarding")
    }
  }

  return (
    <SidebarProvider>


      {/* Mobile Header - only visible on mobile */}
      <MobileHeader mockData={mockData} />

      {/* Simplified layout: removed right sidebar (Widget, Notifications, Chat) and expanded main content */}
      <div className="w-full flex min-h-screen relative z-10">
        {/* Left Sidebar - hidden on mobile, visible on lg+ screens */}
        <div className="hidden lg:block lg:w-[220px] xl:w-[240px] shrink-0">
          <div className="sticky top-0 h-screen">
            <DashboardSidebar />
          </div>
        </div>

        <div className="flex-1 min-w-0 w-full">{children}</div>
      </div>

      {/* Mobile Chat - floating CTA with drawer */}
      <MobileChat />

      <MobileBottomNav />
    </SidebarProvider>
  )
}
