import  httpStatusCode  from 'http-status-codes';
import AppError from "../../errorhelpers/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs"

const credentialsLogin = async(payload: Partial<IUser>) =>{
    const {email, password} = payload

    const isUserExist = await User.findOne({email})

    if(!isUserExist){
        throw new AppError(httpStatusCode.NOT_FOUND, "The email address does not exist")
    }

    const isMatchedPassword = await bcrypt.compare(password as string, isUserExist.password)

    if(!isMatchedPassword){
        throw new AppError(httpStatusCode.NOT_FOUND, "The password does not matched")
    }


}

export const AuthServices = {
    credentialsLogin
}