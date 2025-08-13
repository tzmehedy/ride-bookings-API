/* eslint-disable no-console */
// /* eslint-disable no-console */
import {Server} from "http"
import { app } from "./app"
import mongoose from "mongoose"
import { envVars } from "./app/config/env"


// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server:Server

const startServer = () =>{
    try {
        mongoose.connect(envVars.DATABASE_URL)
        console.log("The mongodb is connected")
       server = app.listen(envVars.PORT, ()=>{
            console.log(`The server is running on the port of 5000`)
        })

    } catch (error) {
        console.log(error)
    }
}

startServer()