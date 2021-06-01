import express from 'express';
import { userRouter } from './routers/users.routers'
import { DatabaseDriver } from './db/mongoose.db'
import { RoutesConfig } from './config/routes.config';

export const app = express()
const PORT = process.env.PORT

DatabaseDriver.connect()

//Tells express to parse the json data coming, into an object and be accessable via request.body
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
//Includes the user router and uses its router request
app.use(userRouter)
RoutesConfig(app)

export const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})