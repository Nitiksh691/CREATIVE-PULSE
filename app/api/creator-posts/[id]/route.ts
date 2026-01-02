import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import CreatorPost from "@/lib/db/models/CreatorPost"
import User from "@/lib/db/models/User"

// GET /api/creator-posts/[id] - Get single post
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        await connectDB()

        // Increment views
        const post = await CreatorPost.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
            .populate("user", "name role logo image skills bio portfolio hourlyRate")
            .populate("comments.user", "name image logo")
            .lean()

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }

        const formattedPost = {
            ...post,
            id: post._id,
            likes: post.likes ? post.likes.length : 0,
            comments: post.comments || [],
            commentsCount: post.comments ? post.comments.length : 0,
            user: post.user,
        }

        return NextResponse.json({ post: formattedPost })
    } catch (error) {
        console.error("GET /api/creator-posts/[id] error:", error)
        return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
    }
}

// DELETE /api/creator-posts/[id] - Delete post (Creator only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

        // Check if user owns this post or is admin
        if (post.user.toString() !== user._id.toString() && user.role !== "admin") {
            return NextResponse.json({ error: "You can only delete your own posts" }, { status: 403 })
        }

        await CreatorPost.findByIdAndDelete(id)

        return NextResponse.json({ success: true, message: "Post deleted" })
    } catch (error) {
        console.error("DELETE /api/creator-posts/[id] error:", error)
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
    }
}
