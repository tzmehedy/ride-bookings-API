import dotenv from "dotenv"

dotenv.config()

interface IEnvConfig {
  DATABASE_URL: string
}

const loadEnvVars = ():IEnvConfig =>{
    const requiredEnvVar: string[] = ["DATABASE_URL"]

    requiredEnvVar.forEach(key=>{
        if(!process.env[key]){
            throw new Error(`Missing Env Variable of ${key}`)
        }
    })
    return {
      DATABASE_URL: process.env.DATABASE_URL as string,
    };
}

export const envVars = loadEnvVars()