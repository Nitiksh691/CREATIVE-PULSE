import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { auth } from "@clerk/nextjs/server"

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { folder } = await req.json()

        // Generate timestamp
        const timestamp = Math.round(new Date().getTime() / 1000)

        // Generate signature
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder: folder || "monky-os",
            },
            process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!
        )

        return NextResponse.json({
            timestamp,
            signature,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        })
    } catch (error) {
        console.error("Signature error:", error)
        return NextResponse.json({ error: "Failed to sign request" }, { status: 500 })
    }
}
