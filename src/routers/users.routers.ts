import { Request, Response, NextFunction, Router } from 'express'
import { auth } from '../middleware/auth.middleware'
import { userCont } from '../controllers/users.controller'
import { ResponseStatus } from '../utils/status.utils'
import sharp from 'sharp'
import multer from 'multer'

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please provide a valid photo'))
        }

        cb(null, true)
    }
})

//Modules
export const userRouter: Router = Router()

//User requests
userRouter
    //GET Requests
    .get('/me', auth, userCont.read_C)
    //Post Requests
    .post('/register', userCont.register_C)

    .post('/login', userCont.login_C)

    .post('/logout', auth, userCont.logout_C)

    .post('/logoutall', auth, userCont.logoutAll_C)

    .post('/uploadimg', auth, upload.single('image'), async (req: Request, res: Response) => {
        try{
            const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
            req.body.user.profilepic = buffer
            await req.body.user.save()
            res.send()
        }catch(e) {
            res.status(ResponseStatus.BadRequest).send(e)
        }
    }, (err: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(ResponseStatus.BadRequest).send({error: err.message})
    })

    //Patch Requests - update
    .patch('/update', auth, userCont.updateUser_C)

    //Delete Requests
    .delete('/delete', auth, userCont.deleteUser_C)
