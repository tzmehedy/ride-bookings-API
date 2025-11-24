import httpStatusCode from 'http-status-codes';
import AppError from "../../errorhelpers/appError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs"
import { envVars } from '../../config/env';

const createUser = async (payload: Partial<IUser>) => {
  const { email, password } = payload
  const isUserExist = await User.findOne({ email })

  if (isUserExist) {
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

const getAllUser = async (query: Record<string, string>) => {
  
  const searchTerm = query.searchTerm || ""
  const blocked_status = query.blocked_status || ""
  const role = query.role || ""

 

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseQuery: Record<string, any> = { role: { $ne: "ADMIN" } }

  if (blocked_status) {
    baseQuery.isBlocked = blocked_status

  }

  if(role){
    baseQuery.role = role
  }

  if (searchTerm) {
    baseQuery.$or = [
      {
        name: { $regex: searchTerm, $options: "i" }
      },
      {
        email: {$regex: searchTerm, $options: "i"}
      },
      {
        phone: {$regex: searchTerm, $options: "i"}
      }
    ]
  }

  const users = await User.find(baseQuery)

  return users

}

const blockedUnblockedUser = async (id: string, blockStatus: boolean) => {

  const updatedUsersDoc = {
    isBlocked: blockStatus
  };

  const updatedUserInfo = await User.findByIdAndUpdate(id, updatedUsersDoc, { new: true })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = updatedUserInfo?.toObject() as IUser;

  return rest;

}


const getMe = async (id: string) => {
  const userInfo = await User.findById(id)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = userInfo?.toObject() as IUser;

  return rest
}

const updateUser = async (id: string, updatedDoc: Partial<IUser>) => {

  if (updatedDoc.password) {
    const hashedPassword = await bcrypt.hash(updatedDoc.password, envVars.SALT_COUNT)
    updatedDoc.password = hashedPassword
  }

  const updatedUserInfo = await User.findByIdAndUpdate(id, updatedDoc, {
    new: true
  })

  return updatedUserInfo


}

export const userServices = {
  createUser,
  getAllUser,
  blockedUnblockedUser,
  getMe,
  updateUser
};