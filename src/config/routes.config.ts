import { Application, Request, Response} from 'express'
import { userRouter } from '../routers/users.routers'

export const RoutesConfig = (app: Application) => {
    app
        .use('/user', userRouter)

        .get('/', (req: Request, res: Response) => {
            res.send('Collabity server is running')
        })
}