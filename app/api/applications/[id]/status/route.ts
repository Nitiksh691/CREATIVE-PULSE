import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import Application from "@/lib/db/models/Application"
import User from "@/lib/db/models/User"

// PATCH /api/applications/[id]/status - Update application status
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const user = await User.findOne({ clerkId: userId })

        if (!user || user.role !== "company") {
            return NextResponse.json({ error: "Only companies can update applications" }, { status: 403 })
        }

        const application = await Application.findById(id)

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 })
        }

        // Check if company owns this application
        // Ensure both are strings for comparison
        if (application.company.toString() !== user._id.toString()) {
            return NextResponse.json({ error: "You can only update applications sent to your company" }, { status: 403 })
        }

        const body = await req.json()
        const { status, acceptanceDetails } = body

        if (!status || !['accepted', 'rejected', 'pending', 'reviewing'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 })
        }

        const updateData: any = { status }

        // If accepting, validation details
        if (status === 'accepted') {
            if (acceptanceDetails) {
                updateData.acceptanceDetails = {
                    ...acceptanceDetails,
                    acceptedAt: new Date()
                }
            }
        }

        // Update status
        const updatedApplication = await Application.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )
            .populate("job", "title")
            .populate("freelancer", "name email")

        return NextResponse.json({ success: true, application: updatedApplication })

    } catch (error) {
        console.error("PATCH /api/applications/[id]/status error:", error)
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
    }
}
