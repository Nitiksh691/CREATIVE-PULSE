import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import CreatorPost from "@/lib/db/models/CreatorPost"
import User from "@/lib/db/models/User"

// POST /api/creator-posts/[id]/like - Like/Unlike post
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const user = await User.findOne({ clerkId: userId })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const post = await CreatorPost.findById(id)

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }

        // Check if already liked
        const likedIndex = post.likes.findIndex((id) => id.toString() === user._id.toString())

        if (likedIndex > -1) {
            // Unlike
            post.likes.splice(likedIndex, 1)
            await post.save()
            return NextResponse.json({ success: true, liked: false, likesCount: post.likes.length })
        } else {
            // Like
            post.likes.push(user._id)
            await post.save()
            return NextResponse.json({ success: true, liked: true, likesCount: post.likes.length })
        }
    } catch (error) {
        console.error("POST /api/creator-posts/[id]/like error:", error)
        return NextResponse.json({ error: "Failed to like post" }, { status: 500 })
    }
}
