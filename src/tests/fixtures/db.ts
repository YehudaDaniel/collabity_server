import jwt from "jsonwebtoken";
import mongoose, { Document} from "mongoose";
import { User } from "../../models/users.models";

export const userOneId = new mongoose.Types.ObjectId
export const userOne = {
    username: 'test',
    email: 'test@test.com',
    password: 'test123',
    tokens: [
        {
            token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET as string)
        }
    ]
}

export const setupDataBase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
}

