import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/users.models'
import { ValidJWT } from '../utils/interfaces/ValidJWT.interfaces'
import { ResponseStatus } from '../utils/status.utils'

export const auth = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try{
        const token = req.header('Authorization')?.replace('Bearer ', '')
        if(!token)
            throw new Error('Something went wrong')
        const verifiedJWT = jwt.verify(token as string, process.env.JWT_SECRET as string)
        
        if (typeof verifiedJWT === 'object') {
            let decoded: ValidJWT = verifiedJWT as ValidJWT;        
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

            if(!user)
                throw new Error()
            
            req.body.token = token
            req.body.user = user
            next()
        } else {
            throw new Error('no authentication');
        }
    }catch(e) {
        res.status(ResponseStatus.Unauthorized).json({error: 'Please authenticate'})
    }
}