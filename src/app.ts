import express, { Request, Response } from "express"
import { router } from "./app/router"
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler"
import cors from "cors"
import cookieParser from "cookie-parser"
import passport from "passport"
import expressSession from "express-session"
import { envVars } from "./app/config/env"
import "./app/config/passport"
export const app = express()

app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(
  cors({
    origin: [envVars.FRONTEND_URL, "http://localhost:5173"],
    credentials: true
  })
);
app.use(cookieParser())

app.use("/api/v1", router)

app.get("/", (req:Request, res:Response)=>{
    res.status(200).send({
        success:true,
        statusCode:true,
        message:"The ride bookings api is coming soon...."
    })
})


app.use(globalErrorHandler)