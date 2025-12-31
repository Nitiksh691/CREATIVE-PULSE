import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import connectDB from "@/lib/db/connect"
import User from "@/lib/db/models/User"

export async function GET(req: Request) {
    try {
        const user = await currentUser()
        if (!user || user.publicMetadata.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const { searchParams } = new URL(req.url)
        const role = searchParams.get("role")
        const search = searchParams.get("search")
        const limit = parseInt(searchParams.get("limit") || "20")
        const page = parseInt(searchParams.get("page") || "1")

        const query: any = {}

        if (role && role !== "all") {
            query.role = role
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { companyName: { $regex: search, $options: "i" } }
            ]
        }

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select("-clerkId") // Exclude sensitive ID if typically not needed

        const total = await User.countDocuments(query)

        return NextResponse.json({
            users,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                current: page
            }
        })

    } catch (error) {
        console.error("Admin users fetch error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
