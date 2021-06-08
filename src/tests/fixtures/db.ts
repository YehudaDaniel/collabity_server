import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Project } from "../../models/projects.models";
import { User } from "../../models/users.models";

export const userOneId = new mongoose.Types.ObjectId
export const userOne = {
    _id: userOneId,
    username: 'test',
    email: 'test@test.com',
    password: 'test123',
    tokens: [
        {
            token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET as string)
        }
    ]
}

export const userTwoId = new mongoose.Types.ObjectId
export const userTwo = {
    _id: userTwoId,
    username: 'SecondUser',
    email: 'test@second.com',
    password: 'second123',
    tokens: [
        {
            token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET as string)
        }
    ]
}

export const userThreeId = new mongoose.Types.ObjectId
export const userThree = {
    _id: userThreeId,
    username: 'ThirdUser',
    email: 'test@third.com',
    password: 'third',
    tokens: [
        {
            token: jwt.sign({_id: userThreeId}, process.env.JWT_SECRET as string)
        }
    ]
}

export const projectOne = {
    title: 'First project',
    content: 'The first one',
    owner: userOneId
}

export const projectTwo = {
    title: 'Second project',
    content: 'The second one',
    owner: userOneId
}

export const projectThree = {
    title: 'Third project',
    content: 'The third one',
    owner: userOneId
}

export const setupDataBase = async () => {
    await User.deleteMany()
    await Project.deleteMany()
    await new User(userOne).save()
    await new Project(projectOne).save()
    await new Project(projectTwo).save()
    await new Project(projectThree).save()
}

