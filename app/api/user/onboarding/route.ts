import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import User from "@/lib/db/models/User"

export async function POST(req: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { role, ...profileData } = body

        await connectDB()

        // Update user in MongoDB
        const updatedUser = await User.findOneAndUpdate(
            { clerkId: userId },
            {
                role,
                ...profileData,
                onboardingCompleted: true,
            },
            { new: true, upsert: true }
        )

        // Update Clerk User Metadata (Server-side)
        const client = await clerkClient()
        await client.users.updateUser(userId, {
            publicMetadata: {
                onboardingCompleted: true,
                role,
            },
        })

        if (!updatedUser) {
            return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
        }

        return NextResponse.json({ success: true, user: updatedUser })
    } catch (error) {
        console.error("Onboarding API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
