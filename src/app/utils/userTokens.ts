import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import jwt from "jsonwebtoken"

export const createUserTokens = async(user:Partial<IUser>)=>{
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    }

     const accessToken = await jwt.sign(
       jwtPayload,
       envVars.JWT_ACCESS_SECRET_KEY,
       {
         expiresIn: "1d",
       }
     );

     const refreshToken = await jwt.sign(
       jwtPayload,
       envVars.JWT_REFRESH_SECRET_KEY,
       {
         expiresIn: "30d",
       }
     );

     return {
        accessToken,
        refreshToken
     }

}