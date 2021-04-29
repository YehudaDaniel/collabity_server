import { NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/users.models'
import { ValidJWT } from '../utils/interfaces/ValidJWT.interfaces'
import { ResponseStatus } from '../utils/status.utils'

export const auth = async (req:any, res:any, next:NextFunction):Promise<void> => {
    try{
        const token: string = req.header('Authorization').replace('Bearer ', '')
        const verifiedJWT = jwt.verify(token, process.env.JWT_SECRET as string)
        
        if (typeof verifiedJWT === 'object') {
            let decoded: ValidJWT = verifiedJWT as ValidJWT;        
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

            if(!user)
                throw new Error()
            req.token = token
            req.user = user
            next()
        } else {
            throw new Error('no authentication');
        }
    }catch(e) {
        res.status(ResponseStatus.Unauthorized).send({error: 'Please authenticate'})
    }
}