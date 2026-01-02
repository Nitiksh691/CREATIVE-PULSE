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
        const { role, email: rawEmail, name, ...profileData } = body

        // Basic validation
        if (!role || !rawEmail || !name) {
            return NextResponse.json(
                { error: "Role, email, and name are required" },
                { status: 400 }
            )
        }

        await connectDB()

        // Atomic update or create (upsert) to prevent race conditions
        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            {
                $set: {
                    email: rawEmail.toLowerCase().trim(),
                    name: name.trim(),
                    role: role,
                    onboardingCompleted: true,
                    ...profileData,
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )

        console.log("✅ User onboarded in DB:", user._id)

        // Update Clerk metadata to sync onboarding status
        const client = await clerkClient()
        try {
            await client.users.updateUser(userId, {
                publicMetadata: {
                    onboardingCompleted: true,
                    role,
                },
            })
            console.log("✅ Clerk metadata updated")
        } catch (clerkError) {
            console.error("Failed to update Clerk metadata:", clerkError)
            // Continue since DB is updated, but log critical error
        }

        return NextResponse.json({ success: true, user })

    } catch (error: any) {
        console.error("Onboarding API error:", {
            message: error.message,
            name: error.name,
            code: error.code,
            errors: error.errors,
            stack: error.stack,
        })

        // Handle duplicate key error (E11000)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0]
            return NextResponse.json(
                { error: `This ${field} is already associated with another account.` },
                { status: 409 }
            )
        }

        return NextResponse.json(
            {
                error: "Failed to complete onboarding",
                details: error.message // Always returning details effectively helps user debug connection issues like IP whitelist
            },
            { status: 500 }
        )
    }
}
