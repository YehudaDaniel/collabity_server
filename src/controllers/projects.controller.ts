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

    //GET /project/read?sortBy=createdAt_asc/desc returns the data in an ascending or descending order
    //GET /project/read?limit=10&skip=10
    // - limit will only return 10 result out of the hundreds we have
    // - skip will return the number of result requested, after he skipped the specified number to skip
    export async function read_C(req: Request, res: Response) {
        let sort:{[key: string]: any} = {}

        if(req.query.sortBy){
            const parts = (req.query.sortBy as string).split('_')
            sort[parts[0]] = (parts[1] === 'asc')? 1 : -1
        }

        try{
            await req.body.user.populate({
                path: 'projects',
                options: {
                    limit: parseInt(req.query.limit as string),
                    skip: parseInt(req.query.skip as string),
                    sort
                }
            }).execPopulate()
            res.send(req.body.user.projects)
        }catch(e) {
            res.send(ResponseStatus.InternalError).send()
        }
    }
}