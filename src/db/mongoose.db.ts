import mongoose, { Mongoose } from 'mongoose'
const url = process.env.DATABASE_URL as string


export module DatabaseDriver {
    export async function connect() {
        try{
            const connected: Mongoose = await connectDB(url)
            console.log('Successfully connected to MongoDB')

            return connected.connection.readyState == MongooseReadyState.Connected
        }catch(e) {
            console.log(`Failed connection to MongoDB: ${e.message}`)
        }
    }


    async function connectDB(connectionString: string): Promise<Mongoose> {
        console.log(`Connecting to Database ${connectionString}`)
        return mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        })
    }
}

//closing DB connection if node process was terminated
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected on app termination')
        process.exit(0)
    })
})


enum MongooseReadyState {
    Disconnected,
    Connected,
    Connecting,
    Disconnecting
}