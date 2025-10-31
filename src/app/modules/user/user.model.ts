import { model, Schema } from "mongoose";
import { IAuthProviders, IRole, IUser } from "./user.interface";


const authsProviderSchema = new Schema<IAuthProviders>({
    providerId: {type: String, required: true},
    providerName: {type: String, required: true}

}, {
    versionKey: false,
    _id: false
})

const userSchema = new Schema<IUser>({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String},
    auths: [authsProviderSchema],
    phone: {type:String},
    picture:{type:String},
    isBlocked:{type:Boolean, default:false},
    isVerified: {type: Boolean, default: false},
    role:{type:String, enum: Object.values(IRole), required:true, default: IRole.RIDER}
},{
    timestamps:true
})

export const User = model<IUser>("User", userSchema)