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
    .get('/readmany', auth, projectCont.readMany_C)

    .get('/read/:username/:title', auth, projectCont.read_C)

    //PATCH Requests
    .patch('/update/:projectid', auth, projectCont.update_C)

    .patch('/update/participants/:projectid', auth, projectCont.updatePars_C)

    // .patch('/update/features/:projectname', auth, projectCont.updateFeatures_C)