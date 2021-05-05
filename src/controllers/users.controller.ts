import {Request, Response} from 'express'
import { ResponseStatus } from '../utils/status.utils'
import bcrypt from 'bcrypt'
import { User } from '../models/users.models'
import * as jwt from 'jsonwebtoken'

console.log('Imported user controller')

export module userCont {
    let saltRounds: number = 10

    //Function for signing up a new user with password encryption
    //TODO: Add checkings for security
    export async function register_C(req: Request, res: Response) {

        bcrypt.hash(req.body.password, saltRounds, (err, encrypted) => {
            if(err){
                return res.status(ResponseStatus.InternalError).end('Something went wrong!')
            }
            const userCred = {
                username: req.body.username,
                email: req.body.email,
                password: encrypted,
            }
            if(!userCred.username && !userCred.email && !userCred.password)
                return res.status(ResponseStatus.BadRequest).json({message: "Something went wrong, please try again"})
            
            try{
                const user = User.create(userCred, async (err, doc) => {
                    if(err)
                        return res.status(ResponseStatus.InternalError).send(err)
                    
                    try{
                        const token = await generateAuthToken(doc._id.toString())
                        return res.status(ResponseStatus.Created).json({id: doc._id, username: doc.username, email: doc.email, token: token})
                    }catch(e) {
                        res.status(ResponseStatus.InternalError).send(e)
                    }
                })
                // return res.status(ResponseStatus.Ok).json({message: "Created new user successfully"})
            }catch(e) {
                res.status(ResponseStatus.InternalError).send(`Error: ${e}`)
            }
        })
    }

    //Function for logging in a user and generating a token
    export async function login_C(req: Request, res: Response) {
        try{
            const user = await User.findOne({email: req.body.email})
            if(!user)
                return res.status(ResponseStatus.NotFound).json({message: 'Could not find user'})

            const isMatch = await bcrypt.compare(req.body.password, user.password)
            if(!isMatch)
                return res.status(ResponseStatus.NotFound).json({message: 'Something went wrong'})

            const token = await generateAuthToken(user._id)

            res.send({
                username: user.username,
                email: user.email,
                token: token
            })
        }catch(e) {
            res.status(ResponseStatus.BadRequest).send(e)
        }
    }

    //Function for reading the current logged user
    export async function read_C(req: Request, res: Response) {
        const user = {
            id: req.body.user._id,
            username: req.body.user.username,
            email: req.body.user.email,
            token: req.body.token
        }
        res.send(user)
    }

    //Function for logging out of a specific user
    export async function logout_C(req: Request, res: Response) {
        try{
            req.body.user.tokens = req.body.user.tokens.filter((token: { token: any }) => {
                return token.token !== req.body.token
            })

            await req.body.user.save()
            res.send('Logged out successfully')
        }catch(e) {
            res.status(ResponseStatus.InternalError).send(e)
        }
    }

    //Function for logging out of all connected users
    export async function logoutAll_C(req: Request, res: Response) {
        try{
            req.body.user.tokens = []
            await req.body.user.save()

            res.send('Logged out of all users')
        }catch(e) {
            res.status(ResponseStatus.InternalError).send(e)
        }
    }

    //Function for generating a new function
    async function generateAuthToken(userId: string) {
        const token = jwt.sign({_id: userId}, process.env.JWT_SECRET as string)
        
        await User.updateOne({_id: userId}, {$push: {tokens: {token: token}}})

        return token
    }
}