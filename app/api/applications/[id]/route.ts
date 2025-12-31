import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import Application from "@/lib/db/models/Application"
import User from "@/lib/db/models/User"

// GET /api/applications/[id] - Get single application
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const user = await User.findOne({ clerkId: userId })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const application = await Application.findById(params.id)
            .populate("job", "title description salary type location skills")
            .populate("freelancer", "name email skills bio portfolio hourlyRate")
            .populate("company", "companyName logo")

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 })
        }

        // Check access rights
        const isFreelancer = application.freelancer._id.toString() === user._id.toString()
        const isCompany = application.company._id.toString() === user._id.toString()
        const isAdmin = user.role === "admin"

        if (!isFreelancer && !isCompany && !isAdmin) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 })
        }

        return NextResponse.json({ application })
    } catch (error) {
        console.error("GET /api/applications/[id] error:", error)
        return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
    }
}

// PATCH /api/applications/[id] - Update application status (Company only)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const user = await User.findOne({ clerkId: userId })

        if (!user || user.role !== "company") {
            return NextResponse.json({ error: "Only companies can update applications" }, { status: 403 })
        }

        const application = await Application.findById(params.id)

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 })
        }

        // Check if company owns this application
        if (application.company.toString() !== user._id.toString()) {
            return NextResponse.json({ error: "You can only update applications for your jobs" }, { status: 403 })
        }

        const body = await req.json()
        const { status, companyNotes, message } = body

        // Update application
        const updateData: any = {}

        if (status) {
            updateData.status = status
        }

        if (companyNotes) {
            updateData.companyNotes = companyNotes
        }

        // Add message if provided
        if (message) {
            updateData.$push = {
                messages: {
                    sender: "company",
                    message,
                    timestamp: new Date(),
                },
            }
        }

        const updatedApplication = await Application.findByIdAndUpdate(params.id, updateData, { new: true })
            .populate("job", "title")
            .populate("freelancer", "name email")

        return NextResponse.json({ success: true, application: updatedApplication })
    } catch (error) {
        console.error("PATCH /api/applications/[id] error:", error)
        return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
    }
}

// DELETE /api/applications/[id] - Withdraw application (Freelancer only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const user = await User.findOne({ clerkId: userId })

        if (!user || user.role !== "freelancer") {
            return NextResponse.json({ error: "Only freelancers can withdraw applications" }, { status: 403 })
        }

        const application = await Application.findById(params.id)

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 })
        }

        // Check if user owns this application
        if (application.freelancer.toString() !== user._id.toString()) {
            return NextResponse.json({ error: "You can only withdraw your own applications" }, { status: 403 })
        }

        // Only allow withdrawal if still pending or reviewing
        if (!["pending", "reviewing"].includes(application.status)) {
            return NextResponse.json({ error: "Cannot withdraw application at this stage" }, { status: 400 })
        }

        await Application.findByIdAndDelete(params.id)

        return NextResponse.json({ success: true, message: "Application withdrawn" })
    } catch (error) {
        console.error("DELETE /api/applications/[id] error:", error)
        return NextResponse.json({ error: "Failed to withdraw application" }, { status: 500 })
    }
}
