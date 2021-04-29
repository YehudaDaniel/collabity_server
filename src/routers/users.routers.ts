import { Request, Response, Router} from 'express'
import { auth } from '../middleware/auth.middleware'
import { User } from '../models/users.models'
import { NotationAllowed } from '../utils/interfaces/NotationAllowed.interfaces'
import { ResponseStatus } from '../utils/status.utils'

//Modules
export const userRouter: Router = Router()

//User requests
userRouter
    //GET Requests
    .get('/me', auth, async (req:any, res: Response) => {
        res.send(req.user)
    })
    //Post Requests
    .post('/register', async (req: Request, res: Response) => {
        const user: NotationAllowed = new User(req.body)

        try{
            await user.save()
            const token = await user.generateAuthToken()
            res.status(ResponseStatus.Created).send({ user, token})
        }catch(e) {
            res.status(ResponseStatus.BadRequest).send(e)
        }
    })