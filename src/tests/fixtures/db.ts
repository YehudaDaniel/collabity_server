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

export const projectOneId = new mongoose.Types.ObjectId
export const projectOne = {
    _id: projectOneId,
    title: 'First project',
    content: 'The first one',
    owner: userOneId
}

export const projectTwoId = new mongoose.Types.ObjectId
export const projectTwo = {
    _id: projectTwoId,
    title: 'Second project',
    content: 'The second one',
    owner: userOneId
}

export const projectThreeId = new mongoose.Types.ObjectId
export const projectThree = {
    _id: projectThreeId,
    title: 'Third project',
    content: 'The third one',
    owner: userOneId
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

export const SecondProjectOneId = new mongoose.Types.ObjectId
export const SecondProjectOne = {
    _id: SecondProjectOneId,
    title: 'First project',
    content: 'The first one',
    owner: userTwoId
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

export const ThirdProjectOneId = new mongoose.Types.ObjectId
export const ThirdProjectOne = {
    _id: ThirdProjectOneId,
    title: 'First project third',
    content: 'The first one of the third user',
    participants: [
        {
            username: userOne.username,
            _id: userOneId,
            permissions: "Manager"
        },
        {
            username: userTwo.username,
            _id: userTwoId,
            permissions: 'Participant'
        }
    ],
    owner: userThreeId
}

export const setupDataBase = async () => {
    await User.deleteMany()
    await Project.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Project(projectOne).save()
    await new Project(projectTwo).save()
    await new Project(projectThree).save()
    await new Project(SecondProjectOne).save()
    await new Project(ThirdProjectOne).save()
}

