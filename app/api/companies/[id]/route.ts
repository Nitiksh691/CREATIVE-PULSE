import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import User from "@/lib/db/models/User"
import Job from "@/lib/db/models/Job"

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB()

        // Use await params (Next.js 15 fix, though in API routes params acts differently, 
        // but ensuring we treat it correctly if needed)
        const { id } = await params

        const company = await User.findById(id).lean()

        if (!company || company.role !== "company") {
            return NextResponse.json({ error: "Company not found" }, { status: 404 })
        }

        // Fetch active jobs for this company
        const jobs = await Job.find({ company: company._id, status: "open" })
            .select("title salary type location description")
            .lean()

        const companyFormatted = {
            id: company._id,
            name: company.companyName,
            industry: company.industry || "Tech",
            size: company.companySize || "Unknown",
            location: (company as any).location || "Remote",
            website: company.website,
            description: company.description,
            logo: company.logo,
            jobs: jobs.map(j => ({
                id: j._id,
                title: j.title,
                salary: j.salary,
                // Add other job fields if needed by UI
            }))
        }

        return NextResponse.json({ company: companyFormatted })
    } catch (error) {
        console.error("GET /api/companies/[id] error:", error)
        return NextResponse.json({ error: "Failed to fetch company details" }, { status: 500 })
    }
}
