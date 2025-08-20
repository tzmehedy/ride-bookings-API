import  httpStatusCode  from 'http-status-codes';
import { Driver } from "./driver.model";
import { IDriver } from "./driver.interface";
import { User } from "../user/user.model";
import AppError from "../../errorhelpers/appError";
import { IRole } from '../user/user.interface';

const createDriver = async (payload: Partial<IDriver>) => {
    const {userId} = payload

    const isUserExist = await User.findById(userId)

    if(!isUserExist){
        throw new AppError(httpStatusCode.NOT_FOUND, "The user does not exist...!!!")
    }

    await User.findByIdAndUpdate(userId, {role: IRole.DRIVER}, {new: true})

    const driverInfo = (await Driver.create(payload))
    return driverInfo
}

export const DriverServices = {
    createDriver
}