
export enum IRole{
    ADMIN = "ADMIN",
    DRIVER = "DRIVER",
    RIDER = "RIDER"
}

export interface IUser{
    name: string,
    email: string,
    password:string,
    picture?:string,
    role: IRole,
    isBlocked?: boolean
}