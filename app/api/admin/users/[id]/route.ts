import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import connectDB from "@/lib/db/connect"
import User from "@/lib/db/models/User"
import { clerkClient } from "@clerk/nextjs/server"

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const adminUser = await currentUser()
        if (!adminUser || adminUser.publicMetadata.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { isBanned, isVerified } = await req.json()
        const targetUserId = params.id // This is the Mongo _id from the route URL

        await connectDB()

        const user = await User.findById(targetUserId)
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Apply updates if provided
        if (typeof isBanned === "boolean") {
            user.isBanned = isBanned
            // Also ban/unban in Clerk to prevent login
            try {
                const clerk = await clerkClient()
                if (isBanned) {
                    await clerk.users.banUser(user.clerkId)
                } else {
                    await clerk.users.unbanUser(user.clerkId)
                }
            } catch (err) {
                console.error("Clerk ban/unban failed:", err)
                // We typically continue even if Clerk fails, or we could block
            }
        }

        if (typeof isVerified === "boolean") {
            user.isVerified = isVerified
        }

        await user.save()

        return NextResponse.json({ user })

    } catch (error) {
        console.error("Admin user update error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
