import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import connectDB from "@/lib/db/connect"
import User from "@/lib/db/models/User"
import Job from "@/lib/db/models/Job"
import Application from "@/lib/db/models/Application"

export async function GET() {
    try {
        const user = await currentUser()
        if (!user || user.publicMetadata.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const [
            totalUsers,
            totalFreelancers,
            totalCompanies,
            activeJobs,
            totalApplications,
            verifiedCompanies
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "freelancer" }),
            User.countDocuments({ role: "company" }),
            Job.countDocuments({ status: "open" }),
            Application.countDocuments(),
            User.countDocuments({ role: "company", isVerified: true })
        ])

        return NextResponse.json({
            stats: {
                totalUsers,
                totalFreelancers,
                totalCompanies,
                activeJobs,
                totalApplications,
                verifiedCompanies
            }
        })

    } catch (error) {
        console.error("Admin stats fetch error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
