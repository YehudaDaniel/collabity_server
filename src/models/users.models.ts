import { Schema, model, Model, Document, HookNextFunction } from 'mongoose'
import validator from 'validator'
import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { NotationAllowed } from '../utils/interfaces/NotationAllowed.interfaces'
import { NextFunction } from 'express'


export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    tokens: Array<boolean>,
    profilePic: Buffer,
}

const userSchema: Schema<IUser> = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
        validate(value: string){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    profilePic: {
        type: Buffer
    }
},{
    timestamps: true,
    collection: 'User'
})

// Functions on the user model--------------------------

// Generates a token for a new user wherever is used
// userSchema.methods.generateAuthToken = async function() {
//     const user = this
//     const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET as string)

//     user.tokens = user.tokens.concat({ token })
//     await user.save()

//     return token
// }

// Makes sure sensitive data is not returned in responses from the api
// userSchema.methods.toJSON = function() {
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens
//     delete userObject.profilePic

//     return userObject
// }

export const User: Model<IUser> = model<IUser>('User', userSchema as Schema)