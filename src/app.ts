import express, { Request, Response } from "express"

export const app = express()

app.get("/", (req:Request, res:Response)=>{
    res.status(200).send({
        statusCode:true,
        message:"The ride bookings api is coming soon...."
    })
})