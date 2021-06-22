import { Schema, Document } from "mongoose";

export interface IProjects extends Document {
    title: string,
    content: string,
    features?: Array<string>,
    participants?: Array<Object>,
    owner: Schema.Types.ObjectId
}