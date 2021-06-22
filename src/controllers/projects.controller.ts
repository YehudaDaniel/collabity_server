import { Request, Response } from 'express'
import { isValidObjectId, Mongoose, ObjectId, Schema } from 'mongoose'
import { Project } from '../models/projects.models'
import { User } from '../models/users.models'
import { IProjects } from '../utils/interfaces/IProjects.interface'
import { ResponseStatus } from '../utils/status.utils'

console.log('Imported projects controller')

export module projectCont {

    //Function for making a new project
    //Should recieve the following in req.body => title, content and possibly participants
    export async function create_C(req: Request, res: Response) {
        const doesProjectTitleExist: IProjects | null = await Project.findOne({ title: req.body.title, owner: req.body.user._id })
        if(doesProjectTitleExist)
            return res.status(ResponseStatus.BadRequest).send({ error: 'Project title already taken'})

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
    export async function readMany_C(req: Request, res: Response) {
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
    //Function for reading an existing single project of a user by title and owner's name
    export async function read_C(req: Request, res: Response) {
        const owner: ObjectId = (await User.findOne({ username: req.params.username}))?._id
        const title: string = req.params.title.replace('_', ' ')

        try{
            const project: IProjects | null = await Project.findOne({ title, owner })
            if(!project)
                return res.status(ResponseStatus.NotFound).send()

            res.status(ResponseStatus.Ok).send(project)
        }catch(e) {
            res.status(ResponseStatus.InternalError).send('Could not find project')
        }
    }

    //Function for updating only the title or the content of a project, only if the updater is the owner or someone with access
    //TODO: grant access to participants to update the project even if theyre not the owners
    export async function update_C(req: Request, res: Response) {
        const bodyData: string[] = Object.keys(req.body.update)
        const allowedChanges: string[] = ['title', 'content']
        const isOperationValid: boolean = bodyData.every(data => allowedChanges.includes(data))

        if(!isOperationValid)
            return res.status(ResponseStatus.BadRequest).json({ error: 'Invalid updates'})

        try{
            //TODO: change type any to explicit type
            const title: string = req.params.projectname.replace('_', ' ')
            const projectData: any = {}
            
            bodyData.forEach((data: string) =>  projectData[data] = req.body.update[data] )
            
            const project = await Project.updateOne({title, owner: req.body.user._id}, { $set: projectData })
            
            //"n" containing the amount of matched documents found, hence 0
            if(!project.n)
                return res.status(ResponseStatus.NotFound).json({ error: "Could not find the specified project" })

            const updatedProject = await Project.findOne({ title: bodyData.includes('title')? projectData["title"]: title , owner: req.body.user._id })

            if(!updatedProject)
                return res.status(ResponseStatus.NotFound).json({ error: 'Could not find the updated project'})

            res.send(updatedProject)
        }catch(e) {
            res.status(ResponseStatus.InternalError).send()
        }
    }

    //Function for updating the participants array list of a project
    //TODO: make sure the person updating the list has clearance for this operation
    export async function updatePars_C(req: Request, res: Response) {
        const bodyData: string[] = Object.keys(req.body.update)
        const allowedChanges: string[] = ['participants']
        const isOperationValid: boolean = bodyData.every(data => allowedChanges.includes(data))

        if(!isOperationValid)
            return res.status(ResponseStatus.BadRequest).json({ error: 'Invalid updates' })

        try {
            const title: string = req.params.projectname.replace('_', ' ')
            const project = await Project.updateOne({ title, owner: req.body.user._id }, {$set: {participants: req.body.update.participants} })

            //"n" containing the amount of matched documents found, hence 0
            if(!project.n)
                return res.status(ResponseStatus.NotFound).json({ error: "Could not find the specified project" })

            const updatedProject = await Project.findOne({ title , owner: req.body.user._id })

            if(!updatedProject)
                return res.status(ResponseStatus.NotFound).json({ error: 'Could not find the updated project'})

            res.send(updatedProject)
        }catch(e) {
            res.status(ResponseStatus.InternalError).send()
        }
    }
}