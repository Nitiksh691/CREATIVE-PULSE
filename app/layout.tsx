import type React from "react"
import { Roboto_Mono } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { V0Provider } from "@/lib/v0-context"
import localFont from "next/font/local"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import { SidebarProvider } from "@/components/ui/sidebar" // Add this import

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
})

const rebelGrotesk = localFont({
  src: "../public/fonts/Rebels-Fett.woff2",
  variable: "--font-rebels",
  display: "swap",
})

const isV0 = process.env["VERCEL_URL"]?.includes("vusercontent.net") ?? false

export const metadata: Metadata = {
  title: {
    template: "%s – CREATIVE PULSE",
    default: "CREATIVE PULSE",
  },
  description: "The pulse for creative talent. Find missions, build your profile, and join the network of innovators.",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <head>
          <link rel="preload" href="/fonts/Rebels-Fett.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        </head>
        <body className={`${rebelGrotesk.variable} ${robotoMono.variable} antialiased bg-background text-foreground`}>
          {/* Wrap everything in SidebarProvider */}
          <SidebarProvider>
            <V0Provider isV0={isV0}>{children}</V0Provider>
            <Toaster position="top-right" richColors />
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
