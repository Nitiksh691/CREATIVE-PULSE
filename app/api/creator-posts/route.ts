import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import CreatorPost from "@/lib/db/models/CreatorPost"
import User from "@/lib/db/models/User"

export async function GET(req: Request) {
    try {
        await connectDB()

        // Fetch posts sorted by newest
        const posts = await CreatorPost.find()
            .sort({ createdAt: -1 })
            .populate("user", "name role logo image") // Make sure to populate user details
            .lean()

        // Format for frontend
        const formattedPosts = posts.map(post => {
            const user = post.user as any
            return {
                id: post._id,
                name: user ? user.name : "Unknown Rebel",
                role: user ? user.role : "Ghost",
                avatar: user ? (user.image || user.logo) : null, // Use image if available, else logo
                content: post.content,
                skills: post.skills || [],
                likes: post.likes || 0,
                comments: post.comments || 0,
                views: post.views || 0,
                timestamp: new Date(post.createdAt).toLocaleDateString(), // Simplify for now
                userId: user ? user._id : null
            }
        })

        return NextResponse.json({ posts: formattedPosts })
    } catch (error) {
        console.error("GET /api/creator-posts error:", error)
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth()
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        await connectDB()
        const user = await User.findOne({ clerkId: userId })

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const body = await req.json()
        const { content, skills } = body

        if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 })

        const newPost = await CreatorPost.create({
            user: user._id,
            content,
            skills: skills ? skills.split(",").map((s: string) => s.trim()).filter((s: string) => s) : []
        })

        // Return formatted post
        const formattedPost = {
            id: newPost._id,
            name: user.name,
            role: user.role,
            avatar: user.image || user.logo,
            content: newPost.content,
            skills: newPost.skills,
            likes: 0,
            comments: 0,
            views: 0,
            timestamp: "Just now",
            userId: user._id
        }

        return NextResponse.json({ success: true, post: formattedPost }, { status: 201 })

    } catch (error) {
        console.error("POST /api/creator-posts error:", error)
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }
}
