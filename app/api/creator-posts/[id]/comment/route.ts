import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import CreatorPost from "@/lib/db/models/CreatorPost"
import User from "@/lib/db/models/User"

// POST /api/creator-posts/[id]/comment - Add comment
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const user = await User.findOne({ clerkId: userId })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const body = await req.json()
        const { comment } = body

        if (!comment || comment.trim().length === 0) {
            return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 })
        }

        const post = await CreatorPost.findById(params.id)

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }

        // Add comment
        post.comments.push({
            user: user._id,
            userName: user.name,
            comment: comment.trim(),
            timestamp: new Date(),
        })

        await post.save()

        return NextResponse.json({ success: true, commentsCount: post.comments.length })
    } catch (error) {
        console.error("POST /api/creator-posts/[id]/comment error:", error)
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
    }
}
