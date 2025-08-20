import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken"
import { envVars } from "../config/env";

export const generateToken = async(payload: JwtPayload, secret:string, expiresIn:string) =>{
   
    const token = await jwt.sign(payload, secret, {expiresIn} as SignOptions)
    return token
}

export const verifyToken = async(accessToken:string) =>{
    const verifiedTokenInfo = await jwt.verify(accessToken, envVars.JWT_ACCESS_SECRET_KEY)

    return verifiedTokenInfo
}