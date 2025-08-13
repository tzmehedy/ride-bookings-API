import dotenv from "dotenv"

dotenv.config()

interface IEnvConfig {
  DATABASE_URL: string;
  PORT:string;
  NODE_DEV:string
}

const loadEnvVars = ():IEnvConfig =>{
    const requiredEnvVar: string[] = ["DATABASE_URL","PORT","NODE_DEV"];

    requiredEnvVar.forEach(key=>{
        if(!process.env[key]){
            throw new Error(`Missing Env Variable of ${key}`)
        }
    })
    return {
      DATABASE_URL: process.env.DATABASE_URL as string,
      PORT: process.env.PORT as string,
      NODE_DEV: process.env.NODE_DEV as string,
    };
}

export const envVars = loadEnvVars()