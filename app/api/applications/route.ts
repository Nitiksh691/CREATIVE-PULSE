import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import Application from "@/lib/db/models/Application"
import Job from "@/lib/db/models/Job"
import User from "@/lib/db/models/User"

// GET /api/applications - Get applications (filtered by user role)
export async function GET(req: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const status = searchParams.get("status")
        const jobId = searchParams.get("jobId")

        await connectDB()

        const user = await User.findOne({ clerkId: userId })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const query: any = {}

        // Filter by role
        if (user.role === "freelancer") {
            query.freelancer = user._id
        } else if (user.role === "company") {
            query.company = user._id
        } else {
            // Admin sees all
        }

        // Filter by status
        if (status) {
            query.status = status
        }

        // Filter by job
        if (jobId) {
            query.job = jobId
        }

        const applications = await Application.find(query)
            .populate("job", "title salary type location")
            .populate("freelancer", "name email skills hourlyRate")
            .populate("company", "companyName logo")
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({ applications })
    } catch (error) {
        console.error("GET /api/applications error:", error)
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
    }
}

// POST /api/applications - Apply to a job (Freelancer only)
export async function POST(req: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const user = await User.findOne({ clerkId: userId })

        if (!user || user.role !== "freelancer") {
            return NextResponse.json({ error: "Only freelancers can apply to jobs" }, { status: 403 })
        }

        if (!user.onboardingCompleted) {
            return NextResponse.json({ error: "Complete onboarding first" }, { status: 400 })
        }

        const body = await req.json()
        const { jobId, companyId, coverLetter, proposedRate, estimatedDuration, portfolio, resume } = body

        if (!coverLetter) {
            return NextResponse.json({ error: "Cover letter is required" }, { status: 400 })
        }

        let applicationData: any = {
            freelancer: user._id,
            coverLetter,
            proposedRate,
            estimatedDuration,
            portfolio,
            resume,
            status: "pending",
        }

        // SCENARIO 1: Spontaneous Application (No Job ID)
        if (!jobId) {
            if (!companyId) {
                return NextResponse.json({ error: "Company ID is required for spontaneous applications" }, { status: 400 })
            }

            applicationData.company = companyId
            applicationData.type = "spontaneous"

            // Check duplicate spontaneous application
            const existingSpontaneous = await Application.findOne({
                company: companyId,
                freelancer: user._id,
                type: "spontaneous",
                status: "pending" // Allow re-applying if previous was processed? Or just stricter?
                // For now, let's limit one pending direct inquiry per freelancer->company
            })

            if (existingSpontaneous) {
                return NextResponse.json({ error: "You already have a pending inquiry with this company" }, { status: 400 })
            }

        }
        // SCENARIO 2: Job Application
        else {
            const job = await Job.findById(jobId)

            if (!job) {
                return NextResponse.json({ error: "Job not found" }, { status: 404 })
            }

            if (job.status !== "open") {
                return NextResponse.json({ error: "This job is no longer accepting applications" }, { status: 400 })
            }

            // Check duplicate job application
            const existingApplication = await Application.findOne({
                job: jobId,
                freelancer: user._id,
            })

            if (existingApplication) {
                return NextResponse.json({ error: "You have already applied to this job" }, { status: 400 })
            }

            applicationData.job = jobId
            applicationData.company = job.company
            applicationData.type = "job_application"

            // Increment job count later
            await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } })
        }

        // Create application
        const application = await Application.create(applicationData)

        return NextResponse.json({ success: true, application }, { status: 201 })

    } catch (error: any) {
        console.error("POST /api/applications error:", error)
        return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
    }
}
