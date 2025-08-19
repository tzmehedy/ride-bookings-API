import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken"

export const generateToken = async(payload: JwtPayload, secret:string, expiresIn:string) =>{
   
    const token = await jwt.sign(payload, secret, {expiresIn} as SignOptions)
    return token
}
