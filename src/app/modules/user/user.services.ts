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

    const user = await User.create(payload)
    return user
}

const getAllUser = async() =>{
    const users = await User.find()
    return users

} 

export const userServices = {
  createUser,
  getAllUser,
};