import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import User from "@/lib/db/models/User"

export async function GET(req: Request) {
    try {
        await connectDB()

        // Fetch all users with role 'company'
        const companies = await User.find({ role: "company" })
            .select("companyName industry companySize location website description logo")
            .lean()

        // Map to ensure consistent structure for frontend
        const companiesFormatted = companies.map(c => ({
            id: c._id,
            name: c.companyName,
            industry: c.industry || "Tech",
            size: c.companySize || "Unknown",
            location: (c as any).location || "Remote", // Location not in User schema yet? Need to check
            website: c.website,
            description: c.description,
            logo: c.logo
        }))

        return NextResponse.json({ companies: companiesFormatted })
    } catch (error) {
        console.error("GET /api/companies error:", error)
        return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 })
    }
}
