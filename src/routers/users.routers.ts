import { Request, Response, NextFunction, Router } from 'express'
import { auth } from '../middleware/auth.middleware'
import { userCont } from '../controllers/users.controller'
import multer from 'multer'

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' +file.originalname)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please provide a valid photo'))
        }
        cb(null, true)
    },
    storage: fileStorageEngine
})

//Modules
export const userRouter: Router = Router()

//User requests
userRouter
    //GET Requests
    .get('/me', auth, userCont.read_C)
    
    .get('/avatar/:id', userCont.getImage_C)
    //Post Requests
    .post('/register', userCont.register_C)

    .post('/login', userCont.login_C)

    .post('/logout', auth, userCont.logout_C)

    .post('/logoutall', auth, userCont.logoutAll_C)

    .post('/uploadimg', auth, upload.single('image'), userCont.uploadImage_C)

    //Patch Requests - update
    .patch('/update', auth, userCont.updateUser_C)

    //Delete Requests
    .delete('/delete', auth, userCont.deleteUser_C)

    .delete('/deleteimg', auth, userCont.deleteImg_C)
