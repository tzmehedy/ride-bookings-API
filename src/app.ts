import express, { Request, Response } from "express"
import { router } from "./app/router"
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler"


export const app = express()

app.use("/api/v1", router)

app.get("/", (req:Request, res:Response)=>{
    res.status(200).send({
        statusCode:true,
        message:"The ride bookings api is coming soon...."
    })
})


app.use(globalErrorHandler)