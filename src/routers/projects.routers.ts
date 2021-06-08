import { Router } from 'express'
import { projectCont } from '../controllers/projects.controller'
import { auth } from '../middleware/auth.middleware'

//Modules
export const projectRouter: Router = Router()

//Project Requests
projectRouter
    //POST Requests
    .post('/create', auth, projectCont.create_C)

    //GET Requests
    .get('/read', auth, projectCont.read_C)