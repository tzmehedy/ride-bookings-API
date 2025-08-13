import { model, Schema } from "mongoose";
import { IRole, IUser } from "./user.interface";

const userSchema = new Schema<IUser>({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    picture:{type:String},
    isBlocked:{type:Boolean},
    role:{type:String, enum: Object.values(IRole), required:true, default: IRole.RIDER}
})

export const User = model<IUser>("User", userSchema)