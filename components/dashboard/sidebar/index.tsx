"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import GearIcon from "@/components/icons/gear"
import UserIcon from "@/components/icons/user"
import MonkeyIcon from "@/components/icons/monkey"
import DotsVerticalIcon from "@/components/icons/dots-vertical"
import { Bullet } from "@/components/ui/bullet"
import LockIcon from "@/components/icons/lock"
import Image from "next/image"
import { useIsV0 } from "@/lib/v0-context"
import { NAVIGATION_CONFIG } from "@/lib/navigation"

const data = {
  navMain: [
    {
      title: "Navigation",
      items: NAVIGATION_CONFIG,
    },
  ],
  desktop: {
    title: "Desktop (Online)",
    status: "online",
  },
  user: {
    name: "KRIMSON",
    email: "krimson@joyco.studio",
    avatar: "/avatars/user_krimson.png",
  },
}

export function DashboardSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user } = useUser()
  const [profile, setProfile] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Use Clerk data as fallback while loading custom profile
  const displayProfile = {
    name: (mounted && (profile?.name || user?.fullName)) || "User",
    email: (mounted && (profile?.email || user?.primaryEmailAddress?.emailAddress)) || "...",
    image: profile?.image, // Prefer custom image, or fallback to UI handling of null
    role: profile?.role // Role is important for checking nav items, so we might need publicMetadata
  }


  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile")
        if (res.ok) {
          const data = await res.json()
          setProfile(data.profileData)
        }
      } catch (error) {
        console.error("Error fetching profile for sidebar:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const filteredNavItems = NAVIGATION_CONFIG.filter((item) => {
    if (item.isAdmin && profile?.role !== "admin") return false
    // @ts-ignore - 'role' property doesn't exist on type yet but it works for now
    if (item.role && profile?.role !== item.role) return false
    return true
  })

  return (
    <Sidebar {...props} className={cn("py-6 border-r border-border", className)}>
      <SidebarHeader className="rounded-t-lg flex gap-3 flex-row rounded-b-none border-b border-border/50 pb-4">
        <div className="flex overflow-clip size-12 shrink-0 items-center justify-center rounded bg-primary transition-colors text-primary-foreground">
          <MonkeyIcon className="size-10 origin-top-left transition-transform" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="text-2xl font-display">M.O.N.K.Y.</span>
          <span className="text-xs uppercase">The OS for Rebels</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="rounded-t-none">
          <SidebarGroupLabel>
            <Bullet className="mr-2" />
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.url
                const Icon = item.icon

                return (
                  <SidebarMenuItem
                    key={item.title}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "transition-all duration-300",
                        isActive && "bg-primary/10 text-primary font-bold border-l-2 border-primary",
                        !isActive && "hover:bg-primary/5 hover:text-primary border-l-2 border-transparent",
                      )}
                    >
                      <Link href={item.url} className="flex items-center gap-3 w-full">
                        <Icon className="size-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-0">
        <SidebarGroup>
          <SidebarGroupLabel>
            <Bullet className="mr-2" />
            User
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Popover>
                  <PopoverTrigger className="flex gap-0.5 w-full group cursor-pointer">
                    <div className="shrink-0 flex size-14 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-clip">
                      {displayProfile.image ? (
                        <Image
                          src={displayProfile.image}
                          alt={displayProfile.name}
                          width={120}
                          height={120}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center size-full bg-primary/10 text-primary font-display text-xl uppercase">
                          {displayProfile.name?.[0] || "U"}
                        </div>
                      )}
                    </div>
                    <div className="group/item pl-3 pr-1.5 pt-2 pb-1.5 flex-1 flex bg-sidebar-accent hover:bg-sidebar-accent-active/75 items-center rounded group-data-[state=open]:bg-sidebar-accent-active group-data-[state=open]:hover:bg-sidebar-accent-active group-data-[state=open]:text-sidebar-accent-foreground">
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate text-xl font-display">{displayProfile.name}</span>
                        <span className="truncate text-xs uppercase opacity-50 group-hover/item:opacity-100">
                          {displayProfile.email}
                        </span>
                      </div>
                      <DotsVerticalIcon className="ml-auto size-4" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0" side="bottom" align="end" sideOffset={4}>
                    <div className="flex flex-col">
                      <Link href="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-accent">
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profile
                      </Link>

                      {/* I have paused the settign we'll see about this in future  */}
                      {/* <Link href="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-accent">
                        <GearIcon className="mr-2 h-4 w-4" />
                        Settings
                      </Link> */}
                    </div>
                  </PopoverContent>
                </Popover>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
