import { Request, Response } from 'express'
import { Project } from '../models/projects.models'
import { ResponseStatus } from '../utils/status.utils'

console.log('Imported projects controller')

export module projectCont {

    //Function for making a new project
    //Should recieve the following in req.body => title, content and possibly participants
    export async function create_C(req: Request, res: Response) {
        const projectCred = {
            ...req.body,
            owner: req.body.user._id
        }
        const project = new Project(projectCred)
        try{
            await project.save()

            res.status(ResponseStatus.Created).send(project)
        }catch(e) {
            res.status(ResponseStatus.BadRequest).send(e)
        }
    }
}