/* eslint-disable no-console */
// /* eslint-disable no-console */
import {Server} from "http"
import { app } from "./app"


// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server:Server

const startServer = () =>{
    try {
       server = app.listen(5000, ()=>{
            console.log(`The server is running on the port of 5000`)
        })

    } catch (error) {
        console.log(error)
    }
}

startServer()