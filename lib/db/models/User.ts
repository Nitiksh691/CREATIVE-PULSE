import mongoose, { Schema, Document, Model } from "mongoose"

export type UserRole = "freelancer" | "company" | "admin"

export interface IUser extends Document {
    clerkId: string
    email: string
    name: string
    role: UserRole
    onboardingCompleted: boolean

    // Freelancer-specific fields
    skills?: string[]
    bio?: string
    portfolio?: string
    resume?: string
    hourlyRate?: number
    availability?: "full-time" | "part-time" | "contract"
    socialLinks?: {
        github?: string
        linkedin?: string
        twitter?: string
        website?: string
    }
    image?: string
    profileViews?: number
    experience?: {
        title: string
        company: string
        period: string
        description: string
    }[]

    // Company-specific fields
    companyName?: string
    industry?: string
    companySize?: string
    website?: string
    description?: string
    logo?: string
    location?: string

    // Admin fields
    isBanned: boolean
    isVerified: boolean

    createdAt: Date
    updatedAt: Date
}

const userSchema = new Schema<IUser>(
    {
        clerkId: {
            type: String,
            required: [true, "Clerk ID is required"],
            unique: true,
            index: true,
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
            required: [function () { return this.onboardingCompleted; }, "Email required after onboarding"],
        },
        name: {
            type: String,
            required: [function () { return this.onboardingCompleted; }, "Name required after onboarding"],
        },
        role: {
            type: String,
            enum: ["freelancer", "company", "admin"],
            required: true,
        },
        onboardingCompleted: {
            type: Boolean,
            default: false,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },

        // Freelancer fields
        skills: [String],
        bio: String,
        portfolio: String,
        resume: String,
        hourlyRate: Number,
        availability: {
            type: String,
            enum: ["full-time", "part-time", "contract"],
        },
        socialLinks: {
            github: String,
            linkedin: String,
            twitter: String,
            website: String,
        },
        image: String,
        profileViews: {
            type: Number,
            default: 0,
        },
        experience: [{
            title: String,
            company: String,
            period: String,
            description: String,
        }],

        // Company fields
        companyName: String,
        industry: String,
        companySize: String,
        website: String,
        description: String,
        logo: String,
        location: String,
    },
    {
        timestamps: true,
    }
)

// Indexes for faster queries
userSchema.index({ role: 1 })
userSchema.index({ onboardingCompleted: 1 })
userSchema.index({ isBanned: 1 })
userSchema.index({ isVerified: 1 })

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema)

export default User
