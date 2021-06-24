import { Schema, Document } from "mongoose";

interface IParticipant {
    _id: number, //TODO: change to ObjectId
    username: string, 
    permissions: string
}

export interface IProjects extends Document {
    title: string,
    content: string,
    features?: Array<string>,
    participants?: Array<IParticipant>,
    owner: Schema.Types.ObjectId
}