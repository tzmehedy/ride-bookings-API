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
  JWT_REFRESH_EXPIRES_IN: string;

  ADMIN_Email: string;
  ADMIN_PASS: string;
  ADMIN_PHONE: string;
  ADMIN_NAME: string;

  SSL: {
    SSL_COMMERZ_ID: string;
    SSL_COMMERZ_PASS: string;
    SSL_COMMERZ_PAYMENT_API: string;
    SSL_COMMERZ_VALIDATION_API: string;
    SSL_COMMERZ_VALIDATE_URL: string;
    SSL_COMMERZ_FRONTEND_SUCCESS_URL: string;
    SSL_COMMERZ_FRONTEND_CANCEL_URL: string;
    SSL_COMMERZ_FRONTEND_FAILED_URL: string;
    SSL_COMMERZ_BACKEND_SUCCESS_URL: string;
    SSL_COMMERZ_BACKEND_CANCEL_URL: string;
    SSL_COMMERZ_BACKEND_FAILED_URL: string;
  };
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
      "ADMIN_Email",
      "ADMIN_PASS",
      "ADMIN_PHONE",
      "ADMIN_NAME",
      "SSL_COMMERZ_ID",
      "SSL_COMMERZ_PASS",
      "SSL_COMMERZ_PAYMENT_API",
      "SSL_COMMERZ_VALIDATION_API",
      "SSL_COMMERZ_VALIDATE_URL",
      "SSL_COMMERZ_FRONTEND_SUCCESS_URL",
      "SSL_COMMERZ_FRONTEND_CANCEL_URL",
      "SSL_COMMERZ_FRONTEND_FAILED_URL",
      "SSL_COMMERZ_BACKEND_SUCCESS_URL",
      "SSL_COMMERZ_BACKEND_CANCEL_URL",
      "SSL_COMMERZ_BACKEND_FAILED_URL"
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
      ADMIN_Email: process.env.ADMIN_Email as string,
      ADMIN_PASS: process.env.ADMIN_PASS as string,
      ADMIN_PHONE: process.env.ADMIN_PHONE as string,
      ADMIN_NAME: process.env.ADMIN_NAME as string,

      SSL: {
        SSL_COMMERZ_ID: process.env.SSL_COMMERZ_ID as string,
        SSL_COMMERZ_PASS: process.env.SSL_COMMERZ_PASS as string,
        SSL_COMMERZ_PAYMENT_API: process.env.SSL_COMMERZ_PAYMENT_API as string,
        SSL_COMMERZ_VALIDATION_API: process.env
          .SSL_COMMERZ_VALIDATION_API as string,
        SSL_COMMERZ_VALIDATE_URL: process.env.SSL_COMMERZ_VALIDATE_URL as string,

        SSL_COMMERZ_FRONTEND_SUCCESS_URL: process.env.SSL_COMMERZ_FRONTEND_SUCCESS_URL as string,
        SSL_COMMERZ_FRONTEND_CANCEL_URL: process.env.SSL_COMMERZ_FRONTEND_CANCEL_URL as string,
        SSL_COMMERZ_FRONTEND_FAILED_URL: process.env.SSL_COMMERZ_FRONTEND_FAILED_URL as string,
        SSL_COMMERZ_BACKEND_SUCCESS_URL: process.env.SSL_COMMERZ_BACKEND_SUCCESS_URL as string,
        SSL_COMMERZ_BACKEND_CANCEL_URL: process.env.SSL_COMMERZ_BACKEND_CANCEL_URL as string,
        SSL_COMMERZ_BACKEND_FAILED_URL: process.env.SSL_COMMERZ_BACKEND_FAILED_URL as string
      },
    };
}

export const envVars = loadEnvVars()