import mongoose from 'mongoose'

const url = process.env.DATABASE_URL

mongoose
    .connect(url as string, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    })
    .then(() => console.log('Database Connected.'))
    .catch((e) => console.log(e))