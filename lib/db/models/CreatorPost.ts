import mongoose, { Schema, Document, Model } from "mongoose"

export interface ICreatorPost extends Document {
    user: mongoose.Types.ObjectId // Reference to User (Freelancer)
    content: string
    skills: string[]
    likes: mongoose.Types.ObjectId[]
    comments: {
        user: mongoose.Types.ObjectId
        userName: string
        comment: string
        timestamp: Date
    }[]
    views: number
    createdAt: Date
    updatedAt: Date
}

const creatorPostSchema = new Schema<ICreatorPost>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        content: {
            type: String,
            required: true,
            maxLength: 500, // Short pitch
        },
        skills: [String],
        likes: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        comments: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            userName: String,
            comment: String,
            timestamp: {
                type: Date,
                default: Date.now,
            }
        }],
        views: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
)

const CreatorPost: Model<ICreatorPost> = mongoose.models.CreatorPost || mongoose.model<ICreatorPost>("CreatorPost", creatorPostSchema)

export default CreatorPost
