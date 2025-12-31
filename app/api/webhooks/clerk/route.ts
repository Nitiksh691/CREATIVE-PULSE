import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import User from "@/lib/db/models/User"

export async function POST(req: Request) {
    // Get the Svix headers for verification
    const headerPayload = await headers()
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new NextResponse("Error: Missing Svix headers", { status: 400 })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "")

    let evt: WebhookEvent

    // Verify the webhook
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error("Error verifying webhook:", err)
        return new NextResponse("Error: Verification failed", { status: 400 })
    }

    // Handle the webhook
    const eventType = evt.type

    try {
        await connectDB()

        if (eventType === "user.created") {
            const { id, email_addresses, first_name, last_name } = evt.data

            // Create user in MongoDB
            await User.create({
                clerkId: id,
                email: email_addresses[0].email_address,
                name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
                role: "freelancer", // Default role, will be set during onboarding
                onboardingCompleted: false,
            })

            console.log("✅ User created in MongoDB:", id)
        }

        if (eventType === "user.updated") {
            const { id, email_addresses, first_name, last_name } = evt.data

            await User.findOneAndUpdate(
                { clerkId: id },
                {
                    email: email_addresses[0].email_address,
                    name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
                }
            )

            console.log("✅ User updated in MongoDB:", id)
        }

        if (eventType === "user.deleted") {
            const { id } = evt.data

            await User.findOneAndDelete({ clerkId: id })

            console.log("✅ User deleted from MongoDB:", id)
        }

        return NextResponse.json({ message: "Webhook processed successfully" })
    } catch (error) {
        console.error("Error processing webhook:", error)
        return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
    }
}
