import  httpStatusCode  from 'http-status-codes';
import AppError from "../../errorhelpers/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs"
import { createUserTokens } from '../../utils/userTokens';


const credentialsLogin = async(payload: Partial<IUser>) =>{
    const {email, password} = payload 

    const isUserExist = await User.findOne({email})

    if(!isUserExist){
        throw new AppError(httpStatusCode.NOT_FOUND, "The email address does not exist")
    }

    const isMatchedPassword = await bcrypt.compare(password as string, isUserExist.password as string)

    if(!isMatchedPassword){
        throw new AppError(httpStatusCode.NOT_FOUND, "The password does not matched")
    }

   const userTokens = await createUserTokens(isUserExist)


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password: pass, ...rest} = isUserExist.toObject()

    return {
      userTokens,
      user: rest,
    };


}

export const AuthServices = {
    credentialsLogin
}