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

  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;

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

  CLOUDINARY: {
    CLOUDINARY_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
  GOOGLE_API_KEY:string
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
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "GOOGLE_CALLBACK_URL",
      "EXPRESS_SESSION_SECRET",
      "FRONTEND_URL",
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
      "SSL_COMMERZ_BACKEND_FAILED_URL",
      "CLOUDINARY_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
      "GOOGLE_API_KEY",
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

      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
      EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
      FRONTEND_URL: process.env.FRONTEND_URL as string,

      SSL: {
        SSL_COMMERZ_ID: process.env.SSL_COMMERZ_ID as string,
        SSL_COMMERZ_PASS: process.env.SSL_COMMERZ_PASS as string,
        SSL_COMMERZ_PAYMENT_API: process.env.SSL_COMMERZ_PAYMENT_API as string,
        SSL_COMMERZ_VALIDATION_API: process.env
          .SSL_COMMERZ_VALIDATION_API as string,
        SSL_COMMERZ_VALIDATE_URL: process.env
          .SSL_COMMERZ_VALIDATE_URL as string,

        SSL_COMMERZ_FRONTEND_SUCCESS_URL: process.env
          .SSL_COMMERZ_FRONTEND_SUCCESS_URL as string,
        SSL_COMMERZ_FRONTEND_CANCEL_URL: process.env
          .SSL_COMMERZ_FRONTEND_CANCEL_URL as string,
        SSL_COMMERZ_FRONTEND_FAILED_URL: process.env
          .SSL_COMMERZ_FRONTEND_FAILED_URL as string,
        SSL_COMMERZ_BACKEND_SUCCESS_URL: process.env
          .SSL_COMMERZ_BACKEND_SUCCESS_URL as string,
        SSL_COMMERZ_BACKEND_CANCEL_URL: process.env
          .SSL_COMMERZ_BACKEND_CANCEL_URL as string,
        SSL_COMMERZ_BACKEND_FAILED_URL: process.env
          .SSL_COMMERZ_BACKEND_FAILED_URL as string,
      },

      CLOUDINARY: {
        CLOUDINARY_NAME: process.env.CLOUDINARY_NAME as string,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
      },
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY as string
    };
}

export const envVars = loadEnvVars()