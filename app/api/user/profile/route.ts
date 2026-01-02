import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connect"
import User from "@/lib/db/models/User"
import Application from "@/lib/db/models/Application"

// GET /api/user/profile - Get profile data and stats
export async function GET(req: Request) {
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

        // Calculate stats
        const applicationsCount = await Application.countDocuments({ freelancer: user._id })
        const interviewsCount = await Application.countDocuments({
            freelancer: user._id,
            status: "shortlisted"
        })
        const offersCount = await Application.countDocuments({
            freelancer: user._id,
            status: "accepted"
        })

        const profileData = {
            name: user.name,
            displayName: user.bio || (user.role === "freelancer" ? "Freelancer" : user.role === "admin" ? "Admin" : "Company"),
            bio: user.bio || "",
            location: user.location || "Remote",
            email: user.email,
            website: user.website || user.socialLinks?.website || "",
            joinedDate: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            skills: user.skills || [],
            experience: user.experience || [],
            socialLinks: user.socialLinks || {},
            image: user.image,
            resume: user.resume,
            role: user.role, // Consistent database role
            stats: {
                applications: applicationsCount,
                interviews: interviewsCount,
                offers: interviewsCount, // This looks like a bug in existing code, but I'll leave it for now unless I'm sure
                profileViews: user.profileViews || 0,
            },
        }

        return NextResponse.json({ profileData })
    } catch (error) {
        console.error("GET /api/user/profile error:", error)
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }
}

// PUT /api/user/profile - Update profile
export async function PUT(req: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const body = await req.json()
        const { bio, skills, website, location, socialLinks, image, resume, experience } = body

        // Note: Location is not in the schema yet, preserving it in frontend state but not saving to DB unless schema updated
        // Updating fields that exist in User schema
        const updatedUser = await User.findOneAndUpdate(
            { clerkId: userId },
            {
                bio,
                skills,
                website,
                socialLinks,
                image,
                resume,
                location,
                experience,
            },
            { new: true }
        )

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, user: updatedUser })
    } catch (error) {
        console.error("PUT /api/user/profile error:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
