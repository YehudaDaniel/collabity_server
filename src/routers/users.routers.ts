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
    .get('/me', auth, async (req:any, res: Response) => { res.send(req.user) })
    //Post Requests
    .post('/register', userCont.register_C)

    .post('/login', userCont.login_C)