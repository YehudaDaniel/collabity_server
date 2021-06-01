import { Schema, Document } from "mongoose";

export interface IProjects extends Document {
    title: string,
    content: string,
    features?: Array<string>,
    participants?: Array<string>,
    owner: Schema.Types.ObjectId
}