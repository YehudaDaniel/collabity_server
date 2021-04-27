import { NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/users.models'

const auth = async (req:any, res:any, next:NextFunction):Promise<void> => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded: {} = jwt.verify(token, process.env.JWT_SECRET as string)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if(!user)
            throw new Error()

        req.token = token
        req.user = user
        next()
    }catch(e) {
        res.status(401).send({error: 'Please authenticate'})
    }
}

export = auth