import mongoose from "mongoose";
import { IErrorResponse, IErrorSources } from "../interfaces/error.types";

export const handelValidationError = (err: mongoose.Error.ValidationError):IErrorResponse =>{
  const errorSources: IErrorSources[] = []
  const errors = Object.values(err.errors);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors.forEach((errorObject: any) =>
    errorSources.push({
      path: errorObject.path,
      message: errorObject.message,
    })
  );
  
  return {
    statusCode: 400,
    message:"Validation Error Occur...!!!",
    errorSources
  }

}