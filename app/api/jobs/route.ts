import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import Job from "@/lib/db/models/Job"
import User from "@/lib/db/models/User"

// GET /api/jobs - List all jobs with filtering
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const search = searchParams.get("search")
        const type = searchParams.get("type")
        const skills = searchParams.get("skills")
        const status = searchParams.get("status") || "open"
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")

        await connectDB()

        const query: any = { status }

        // Text search
        if (search) {
            query.$text = { $search: search }
        }

        // Filter by job type
        if (type) {
            query.type = type
        }

        // Filter by skills
        if (skills) {
            const skillsArray = skills.split(",")
            query.skills = { $in: skillsArray }
        }

        // Filter by company
        const companyId = searchParams.get("company")
        if (companyId) {
            query.company = companyId
        }

        const skip = (page - 1) * limit

        const [jobs, total] = await Promise.all([
            Job.find(query)
                .populate("company", "companyName logo")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Job.countDocuments(query),
        ])

        return NextResponse.json({
            jobs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("GET /api/jobs error:", error)
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
    }
}

// POST /api/jobs - Create new job (Company only)
export async function POST(req: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        // Get user and check if company
        const user = await User.findOne({ clerkId: userId })

        if (!user || user.role !== "company") {
            return NextResponse.json({ error: "Only companies can post jobs" }, { status: 403 })
        }

        if (!user.onboardingCompleted) {
            return NextResponse.json({ error: "Complete onboarding first" }, { status: 400 })
        }

        const body = await req.json()

        // Validate required fields
        const { title, description, skills, salary, location, type, category } = body

        if (!title || !description || !skills || !salary || !location || !type || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Create job
        const job = await Job.create({
            ...body,
            company: user._id,
            companyName: user.companyName || user.name,
            status: "open",
            applicationsCount: 0,
        })

        return NextResponse.json({ success: true, job }, { status: 201 })
    } catch (error) {
        console.error("POST /api/jobs error:", error)
        return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
    }
}
