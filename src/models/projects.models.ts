import { model, Model, Schema, Types } from "mongoose";
import { IProjects } from "../utils/interfaces/IProjects.interface";

const projectSchema: Schema<IProjects> = new Schema<IProjects>({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 2
    },
    content: {
        type: String,
        required: true
    },
    features: [{
        content: String,
        likes: {
            type: Number,
            default: 0
        }
    }],
    participants: [{
        _id: Types.ObjectId,
        username: String,
        permissions: {
            type: String,
            default: 'Participant'
        }
    }],
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

export const Project: Model<IProjects> = model<IProjects>('Project', projectSchema as Schema)