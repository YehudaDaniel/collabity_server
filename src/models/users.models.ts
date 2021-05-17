import { Schema, model, Model } from 'mongoose'
import sharp from 'sharp'
import validator from 'validator'
import { IUser } from '../utils/interfaces/IUser.interface'

const userSchema: Schema<IUser> = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        trim: true,
        minLength: 6
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
    //TODO: add default anonymous picture
    profilePic: {
        type: Buffer,
    }
},{
    timestamps: true,
    collection: 'user'
})


export const User: Model<IUser> = model<IUser>('User', userSchema as Schema)