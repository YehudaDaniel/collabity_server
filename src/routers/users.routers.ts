import { Request, Response, Router} from 'express'
import auth from '../middleware/auth.middleware'
import { User } from '../models/users.models'
import { NotationAllowed } from '../utils/interfaces/NotationAllowed.interfaces'

//Modules
export const userRouter: Router = Router()

//User requests
userRouter
    //GET Requests
    .get('/user/me', auth, async (req:any, res: Response) => {
        res.send(req.user)
    })
    //Post Requests
    .post('/user/register', async (req: Request, res: Response) => {
        const user: NotationAllowed = new User(req.body)

        try{
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({ user, token})
        }catch(e) {
            res.status(400).send(e)
        }
    })