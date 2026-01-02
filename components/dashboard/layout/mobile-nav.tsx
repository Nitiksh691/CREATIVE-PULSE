"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NAVIGATION_CONFIG } from "@/lib/navigation"

const navItems = NAVIGATION_CONFIG.filter((item) => item.mobile)

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-background/95 backdrop-blur-xl border-t border-border h-16 px-2 lg:hidden safe-area-inset-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.url
        return (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 transition-all min-w-0 flex-1 py-2 px-1",
              isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="size-5 shrink-0" />
            <span className="text-[9px] md:text-[10px] uppercase font-display truncate max-w-full">{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
