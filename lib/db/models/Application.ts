import mongoose, { Schema, Document, Model } from "mongoose"

export interface IApplication extends Document {
    type: "job_application" | "spontaneous"
    job?: mongoose.Types.ObjectId // Reference to Job (optional)
    freelancer: mongoose.Types.ObjectId // Reference to User (freelancer)
    company: mongoose.Types.ObjectId // Reference to User (company)

    // Application details
    coverLetter: string
    proposedRate?: number
    estimatedDuration?: string
    portfolio?: string[]
    resume?: string

    // Status tracking
    status: "pending" | "reviewing" | "shortlisted" | "rejected" | "accepted"
    companyNotes?: string

    // Communication
    messages?: {
        sender: "freelancer" | "company"
        message: string
        timestamp: Date
    }[]

    createdAt: Date
    updatedAt: Date
}

const applicationSchema = new Schema<IApplication>(
    {
        type: {
            type: String,
            enum: ["job_application", "spontaneous"],
            default: "job_application",
            required: true,
        },
        job: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: false, // Optional for spontaneous applications
            index: true,
        },
        freelancer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        coverLetter: {
            type: String,
            required: true,
        },
        proposedRate: Number,
        estimatedDuration: String,
        portfolio: [String],
        resume: String,
        status: {
            type: String,
            enum: ["pending", "reviewing", "shortlisted", "rejected", "accepted"],
            default: "pending",
            index: true,
        },
        companyNotes: String,
        messages: [
            {
                sender: {
                    type: String,
                    enum: ["freelancer", "company"],
                    required: true,
                },
                message: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
)

// Compound indexes for queries
applicationSchema.index({ job: 1, freelancer: 1 }, { unique: true }) // Prevent duplicate applications
applicationSchema.index({ company: 1, status: 1 })
applicationSchema.index({ freelancer: 1, status: 1 })

const Application: Model<IApplication> =
    mongoose.models.Application || mongoose.model<IApplication>("Application", applicationSchema)

export default Application
