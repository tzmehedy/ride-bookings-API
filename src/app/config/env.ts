import dotenv from "dotenv"

dotenv.config()

interface IEnvConfig {
  DATABASE_URL: string;
  PORT: string;
  NODE_DEV: string;
  SALT_COUNT: number;
  JWT_ACCESS_SECRET_KEY: string;
  JWT_ACCESS_EXPIRES_IN: string;

  JWT_REFRESH_SECRET_KEY: string;
  JWT_REFRESH_EXPIRES_IN:string
}

const loadEnvVars = ():IEnvConfig =>{
    const requiredEnvVar: string[] = [
      "DATABASE_URL",
      "PORT",
      "NODE_DEV",
      "SALT_COUNT",
      "JWT_ACCESS_SECRET_KEY",
      "JWT_ACCESS_EXPIRES_IN",
      "JWT_REFRESH_SECRET_KEY",
      "JWT_REFRESH_EXPIRES_IN",
    ];

    requiredEnvVar.forEach(key=>{
        if(!process.env[key]){
            throw new Error(`Missing Env Variable of ${key}`)
        }
    })

    

    return {
      DATABASE_URL: process.env.DATABASE_URL as string,
      PORT: process.env.PORT as string,
      NODE_DEV: process.env.NODE_DEV as string,
      SALT_COUNT: Number(process.env.SALT_COUNT),
      JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY as string,
      JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN as string,
      JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY as string,
      JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
    };
}

export const envVars = loadEnvVars()