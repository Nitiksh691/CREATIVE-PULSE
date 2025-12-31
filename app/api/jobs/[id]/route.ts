import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import Job from "@/lib/db/models/Job"
import User from "@/lib/db/models/User"

// GET /api/jobs/[id] - Get single job
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB()

        const job = await Job.findById(params.id).populate("company", "companyName logo industry website description")

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 })
        }

        return NextResponse.json({ job })
    } catch (error) {
        console.error("GET /api/jobs/[id] error:", error)
        return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
    }
}

// PATCH /api/jobs/[id] - Update job (Company only, own jobs only)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const user = await User.findOne({ clerkId: userId })

        if (!user || user.role !== "company") {
            return NextResponse.json({ error: "Only companies can update jobs" }, { status: 403 })
        }

        const job = await Job.findById(params.id)

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 })
        }

        // Check if user owns this job
        if (job.company.toString() !== user._id.toString()) {
            return NextResponse.json({ error: "You can only update your own jobs" }, { status: 403 })
        }

        const body = await req.json()

        // Update job
        const updatedJob = await Job.findByIdAndUpdate(params.id, body, { new: true })

        return NextResponse.json({ success: true, job: updatedJob })
    } catch (error) {
        console.error("PATCH /api/jobs/[id] error:", error)
        return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
    }
}

// DELETE /api/jobs/[id] - Delete job (Company only, own jobs only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const user = await User.findOne({ clerkId: userId })

        if (!user || user.role !== "company") {
            return NextResponse.json({ error: "Only companies can delete jobs" }, { status: 403 })
        }

        const job = await Job.findById(params.id)

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 })
        }

        // Check if user owns this job
        if (job.company.toString() !== user._id.toString()) {
            return NextResponse.json({ error: "You can only delete your own jobs" }, { status: 403 })
        }

        await Job.findByIdAndDelete(params.id)

        return NextResponse.json({ success: true, message: "Job deleted" })
    } catch (error) {
        console.error("DELETE /api/jobs/[id] error:", error)
        return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
    }
}
