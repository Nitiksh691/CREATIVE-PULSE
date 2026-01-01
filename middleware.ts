// middleware.ts (in project root)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
    "/",
    "/auth/login(.*)",
    "/auth/register(.*)",
    "/api/webhooks(.*)",
    "/jobs(.*)",
    "/companies(.*)",
    "/creator-discover(.*)",
    "/api/jobs(.*)",
    "/api/companies(.*)",
    "/api/creator-posts(.*)",
])

const requiresOnboarding = createRouteMatcher([
    "/dashboard(.*)",
    "/profile(.*)",
    "/settings(.*)",
    "/applications(.*)",
    "/company-dashboard(.*)",
])

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth()

    // 1. If user is logged in, check for rediects
    if (userId && !req.nextUrl.pathname.startsWith("/api")) {
        // Redirect authenticated users from landing page to jobs
        if (req.nextUrl.pathname === "/") {
            const jobsUrl = new URL("/jobs", req.url)
            return NextResponse.redirect(jobsUrl)
        }

        // Check public_metadata for onboarding status (set by backend)
        const metadata = sessionClaims?.public_metadata as { onboardingCompleted?: boolean } | undefined
        const onboardingCompleted = metadata?.onboardingCompleted



        // NOTE: We relaxed the strict redirect to /onboarding here because session claims
        // might be stale immediately after onboarding. The DashboardLayout now handles
        // strict server-side checks using await currentUser().

        // Check if user is trying to access onboarding page but already completed it
        // Check if user is trying to access onboarding page but already completed it
        // DISABLED loop fix: If DB says they aren't onboarded but Clerk says they are,
        // we need to let them access onboarding to fix it.
        /*
        if (onboardingCompleted && req.nextUrl.pathname === "/onboarding") {
            const dashboardUrl = new URL("/dashboard", req.url)
            return NextResponse.redirect(dashboardUrl)
        }
        */
    }

    // 2. Public route check (only for non-logged in users)
    if (isPublicRoute(req)) {
        return NextResponse.next()
    }

    // 3. Protected route check (if not public and not logged in)
    if (!userId) {
        // ... handled by clerkMiddleware defaults usually, but explicit redirect here
        const signInUrl = new URL("/auth/login", req.url)
        signInUrl.searchParams.set("redirect_url", req.url)
        return NextResponse.redirect(signInUrl)
    }

    // 4. Role-based access (optional, can be added here)
    // currently relying on page-level checks or layout

    return NextResponse.next()
})

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
}
