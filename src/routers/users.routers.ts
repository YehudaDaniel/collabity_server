import { Request, Response, Router} from 'express'
import { auth } from '../middleware/auth.middleware'
import { User } from '../models/users.models'
import { NotationAllowed } from '../utils/interfaces/NotationAllowed.interfaces'
import { ResponseStatus } from '../utils/status.utils'
import bcrypt from 'bcrypt'
import { userCont } from '../controllers/users.controller'

//Modules
export const userRouter: Router = Router()

//User requests
userRouter
    //GET Requests
    .get('/me', auth, async (req:any, res: Response) => {
        res.send(req.user)
    })
    //Post Requests
    .post('/register', userCont.register_C)

    .post('/login', async (req: Request, res: Response) => {
        try{
            const user = await User.findOne({ email: req.body.email })
            if(!user)
                return res.status(ResponseStatus.NotFound).send()

            const isMatch = await bcrypt.compare(req.body.password, user.password)
            if(!isMatch)
                return res.status(ResponseStatus.NotFound).send()
            
            return user
        }catch(e) {
            res.status(ResponseStatus.BadRequest).send(e)
        }

    })