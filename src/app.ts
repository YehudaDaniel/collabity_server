import express from 'express';
import './db/mongoose.db'
import { userRouter } from './routers/users.routers'

const app = express()


//Tells express to parse the json data coming, into an object and be accessable via request.body
app.use(express.json())
//Includes the user router and uses its router request
app.use(userRouter)


export = app