import httpStatusCode  from 'http-status-codes';
import AppError from "../../errorhelpers/appError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs"
import { envVars } from '../../config/env';

const  createUser = async(payload: Partial<IUser>) =>{
    const {email, password} = payload
    const isUserExist = await User.findOne({email})

    if(isUserExist){
        throw new AppError(httpStatusCode.BAD_REQUEST, "User already exist...!!!")
    }

    const hashedPassword = await bcrypt.hash(password as string, envVars.SALT_COUNT)
    
    payload.password = hashedPassword


    const userPayload: Partial<IUser> = {
      ...payload,
      auths: [
        {
          providerId: payload.email as string,
          providerName: "Credentials",
        },
      ],
    };

    const user = await User.create(userPayload)
    return user
}

const getAllUser = async() =>{
    const users = await User.find()
    return users

} 

const blockedUser = async(id:string)=>{

    const updatedUsersDoc = {
      isBlocked : true
    };

    const updatedUserInfo = await User.findByIdAndUpdate(id, updatedUsersDoc, {new:true})

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = updatedUserInfo?.toObject() as IUser;

    return rest;

}


const getMe = async(id: string) =>{
  const userInfo = await User.findById(id)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = userInfo?.toObject() as IUser;

  return rest
}

export const userServices = {
  createUser,
  getAllUser,
  blockedUser,
  getMe,
};