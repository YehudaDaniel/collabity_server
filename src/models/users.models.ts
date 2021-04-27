import { Schema, model } from 'mongoose'
import validator from 'validator'
import * as jwt from 'jsonwebtoken'
import { NotationAllowed } from '../utils/interfaces/NotationAllowed.interfaces'

const userSchema: NotationAllowed = new Schema({
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
    timestamps: true
})


//Generates a token for a new user wherever is used
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET as string)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

export const User = model('User', userSchema as Schema)