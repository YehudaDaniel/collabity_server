import { Application, Request, Response} from 'express'
import { projectRouter } from '../routers/projects.routers'
import { userRouter } from '../routers/users.routers'

export const RoutesConfig = (app: Application) => {
    app
        .use('/user', userRouter)

        .use('/project', projectRouter)

        .get('/', (req: Request, res: Response) => {
            res.send('Collabity server is running')
        })
}