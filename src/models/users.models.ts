import { Schema, model, Model } from 'mongoose'
import sharp from 'sharp'
import validator from 'validator'
import { IUser } from '../utils/interfaces/IUser.interface'

const userSchema: Schema<IUser> = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 4
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
        type: String,
        default: 'default.png'
    }
},{
    timestamps: true,
    collection: 'user'
})

userSchema.virtual('projects', {
    ref: 'Project',
    localField: '_id',
    foreignField: 'owner'
})


export const User: Model<IUser> = model<IUser>('User', userSchema as Schema)