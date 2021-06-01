import { model, Model, Schema } from "mongoose";
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
    features: {
        type: [String]
    },
    participants: {
        type: [String],
        permissions: {
            type: String,
            default: 'participant'
        }
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

export const Project: Model<IProjects> = model<IProjects>('Project', projectSchema as Schema)