import { Types } from "mongoose"

export enum IRole{
    ADMIN = "ADMIN",
    DRIVER = "DRIVER",
    RIDER = "RIDER"
}

export interface IUser{
    _id?: Types.ObjectId,
    name: string,
    email: string,
    password:string,
    picture?:string,
    role: IRole,
    isBlocked?: boolean
}