import { Request, Response } from 'express'
import { isValidObjectId, Mongoose, ObjectId, Schema, Types } from 'mongoose'
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
            const projectid: string = req.params.projectid
            const projectData: {[key: string]: any} = {}

            //Inserting the updated data into projectData
            bodyData.forEach((data: string) => projectData[data] = req.body.update[data] )

            //Finding the project by its ID
            const project = await Project.findOne({ _id: projectid })

            if(!project)
                return res.status(ResponseStatus.NotFound).json({ error: 'Could not find project'})


            const isParticipantHasClearance = project?.participants?.some((participant) => {
                return participant._id.toString() == req.body.user._id.toString() && participant.permissions == "Manager"
            })

            //Is the user who is making the changes either an owner or has a manager role as a participant?
            if(project?.owner.toString() == req.body.user._id.toString() || isParticipantHasClearance){
                const updateProject = await Project.updateOne({ _id: projectid }, { $set: projectData })
                
                //"n" containing the amount of matched documents found, hence 0
                if(!updateProject.n)
                    return res.status(ResponseStatus.NotFound).json({ error: "Could not find the specified project" })
                
                const updatedProject = await Project.findOne({ _id: projectid })
                res.send(updatedProject)
            }else{
                res.status(ResponseStatus.BadRequest).send()
            }
        }catch(e) {
            res.status(ResponseStatus.InternalError).send()
        }
    }

    //Function for updating the participants array list of a project
    export async function updatePars_C(req: Request, res: Response) {
        const bodyData: string[] = Object.keys(req.body.update)
        const allowedChanges: string[] = ['participants']
        const isOperationValid: boolean = bodyData.every(data => allowedChanges.includes(data))

        if(!isOperationValid)
            return res.status(ResponseStatus.BadRequest).json({ error: 'Invalid updates' })

        try {
            const projectid: string = req.params.projectid

            //Finding the project by its id
            const project = await Project.findOne({ _id: projectid })

            if(!project)
                return res.status(ResponseStatus.NotFound).json({ error: 'Could not find project' })
            

            const isParticipantHasClearance = project?.participants?.some((participant) => {
                return participant._id.toString() == req.body.user._id.toString() && participant.permissions == "Manager"
            })

            //Is the user who is making the changes either an owner or has a manager role as a participant
            if(project?.owner.toString() == req.body.user._id.toString() || isParticipantHasClearance){
                //Making sure no permissions changes were made
                const updatesArray: Object[] = req.body.update.participants
                const allowedKeys: string[] = ['username', '_id']

                let areKeysValid: boolean = true
                for(let i = 0; i < updatesArray.length; i++) {
                    if(!Object.keys(updatesArray[i]).every((data: any) => allowedKeys.includes(data))) {
                        areKeysValid = false
                        break
                    }
                }

                if(!areKeysValid)
                    return res.status(ResponseStatus.BadRequest).json({ error: 'Invalid updates' })

                const updateProject = await Project.updateOne({ _id: projectid }, {$set: {participants: req.body.update.participants} })

                //"n" containing the amount of matched documents found, hence 0
                if(!updateProject.n)
                    return res.status(ResponseStatus.NotFound).json({ error: "Could not find the specified project" })


                const updatedProject = await Project.findOne({ _id: projectid })
                res.send(updatedProject)
            }else{
                res.status(ResponseStatus.BadRequest).send()
            }
        }catch(e) {
            res.status(ResponseStatus.InternalError).send()
        }
    }

    export async function updateFeatures_C(req: Request, res: Response) {
        const bodyData: string[] = Object.keys(req.body.update)
        const allowedChanges: string[] = ['features']
        const isOperationValid: boolean = bodyData.every(data => allowedChanges.includes(data))

        if(!isOperationValid)
            return res.status(ResponseStatus.BadRequest).json({ error: 'Invalid updates' })

        try{

        }catch(e) {

        }
    }
}