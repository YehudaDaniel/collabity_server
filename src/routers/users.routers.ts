import { Request, Response, Router} from 'express'
import { User } from '../models/users.models'

//Modules
export const userRouter: Router = Router()

//User requests
userRouter
    //Post Requests
    .post('/register', async (req: Request, res: Response) => {
        const user = new User(req.body)

        try{
            await user.save()
            res.status(201).send(user)
        }catch(e) {
            res.status(400).send(e)
        }
    })