"use client"

import { SignIn } from "@clerk/nextjs"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

            {/* Back to home link */}
            <Link
                href="/"
                className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm uppercase tracking-wider z-20"
            >
                <ArrowLeft className="size-4" />
                Back to Home
            </Link>

            <div className="max-w-md w-full space-y-8 relative z-10">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight">
                        Welcome <span className="text-primary">Back</span>
                    </h1>
                    <p className="text-muted-foreground font-mono text-sm">
                        Sign in to continue your mission
                    </p>
                </div>

                {/* Clerk Sign In Component */}
                <div className="flex justify-center">
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-card/50 backdrop-blur-xl border-2 border-white/10 shadow-xl",
                                headerTitle: "font-display uppercase text-2xl",
                                headerSubtitle: "font-mono text-xs text-muted-foreground uppercase tracking-wider",
                                socialButtonsBlockButton: "font-mono uppercase tracking-wider border-2 border-white/10 bg-white/5 hover:bg-white/10",
                                formButtonPrimary: "bg-primary hover:bg-primary/90 font-display uppercase tracking-widest h-12",
                                formFieldInput: "bg-background border-2 border-white/10 font-mono",
                                footerActionLink: "text-primary hover:text-primary/80 font-mono uppercase text-xs",
                                identityPreviewEditButton: "text-primary hover:text-primary/80",
                                formFieldLabel: "font-mono uppercase text-xs tracking-wider",
                                dividerLine: "bg-white/10",
                                dividerText: "font-mono uppercase text-xs text-muted-foreground",
                            },
                        }}
                        fallbackRedirectUrl="/onboarding"
                        signUpUrl="/auth/register"
                        routing="path"
                        path="/auth/login"
                    />
                </div>

                {/* Sign up link */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground font-mono">
                        Don't have an account?{" "}
                        <Link href="/auth/register" className="text-primary hover:underline uppercase tracking-wide font-bold">
                            Join the Rebellion
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
