"use client"

import Link from "next/link"
import PulseIcon from "@/components/icons/pulse"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"

export function LandingNavbar() {
  const { isSignedIn } = useUser()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 md:py-4 bg-background/80 backdrop-blur-xl border-b border-white/10">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <PulseIcon className="size-7 md:size-8 text-primary" />
        <span className="text-base md:text-lg lg:text-xl font-display uppercase tracking-wider">CREATIVE PULSE</span>
      </Link>

      {!isSignedIn && (
        <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
          <Link
            href="/auth/login"
            className="text-xs md:text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Button
            size="sm"
            className="font-display uppercase tracking-wider bg-primary hover:bg-primary/90 h-8 md:h-9 lg:h-10 px-3 md:px-4 lg:px-6 text-xs md:text-sm"
            asChild
          >
            <Link href="/auth/register">Sign Up</Link>
          </Button>
        </div>
      )}
    </nav>
  )
}
