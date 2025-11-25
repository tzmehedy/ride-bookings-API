/* eslint-disable no-console */
import { envVars } from "../config/env"
import { IRole, IUser } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"
import bcrypt from "bcryptjs"

export const seedAdmin = async()=>{
    try {
        const isAdminExist = await User.findOne({email: envVars.ADMIN_Email})

        if(isAdminExist){
            console.log("The admin already created")
            return
        }

        console.log("Admin creating start...")

        const hashedPassword = await bcrypt.hash(envVars.ADMIN_PASS, envVars.SALT_COUNT)

        const adminPayload: Partial<IUser> = {
          name: envVars.ADMIN_NAME,
          email: envVars.ADMIN_Email,
          password: hashedPassword,
          phone: envVars.ADMIN_PHONE,
          role: IRole.ADMIN,
        };

        await User.create(adminPayload)

        console.log("Admin created successful.\n")

    } catch (error) {
        console.log(error)
        
    }



}