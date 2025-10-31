import { Types } from "mongoose"

export enum IRole{
    ADMIN = "ADMIN",
    DRIVER = "DRIVER",
    RIDER = "RIDER"
}

export interface IAuthProviders{
    providerId: string,
    providerName: string
}

export interface IUser{
    _id?: Types.ObjectId,
    name: string,
    email: string,
    password?:string,
    auths: IAuthProviders[],
    phone?: string,
    picture?:string,
    role: IRole,
    isBlocked?: boolean,
    isVerified: boolean,
}