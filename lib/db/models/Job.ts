import mongoose, { Schema, Document, Model } from "mongoose"

export interface IJob extends Document {
    title: string
    description: string
    company: mongoose.Types.ObjectId // Reference to User (company)
    companyName: string // Denormalized for faster queries

    skills: string[]
    salary: string
    location: string
    type: "full-time" | "part-time" | "contract" | "internship"
    category: string

    budget?: {
        min: number
        max: number
        currency: string
    }

    status: "open" | "closed" | "filled"
    applicationsCount: number

    requirements?: string[]
    benefits?: string[]

    createdAt: Date
    updatedAt: Date
}

const jobSchema = new Schema<IJob>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        skills: {
            type: [String],
            required: true,
        },
        salary: {
            type: String,
            required: false,
        },
        location: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["full-time", "part-time", "contract", "internship"],
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        budget: {
            min: Number,
            max: Number,
            currency: {
                type: String,
                default: "INR",
            },
        },
        status: {
            type: String,
            enum: ["open", "closed", "filled"],
            default: "open",
            index: true,
        },
        applicationsCount: {
            type: Number,
            default: 0,
        },
        requirements: [String],
        benefits: [String],
    },
    {
        timestamps: true,
    }
)

// Indexes for search and filtering
jobSchema.index({ status: 1, createdAt: -1 })
jobSchema.index({ title: "text", description: "text" })
jobSchema.index({ skills: 1 })
jobSchema.index({ type: 1 })

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>("Job", jobSchema)

export default Job
