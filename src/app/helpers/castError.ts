import mongoose from "mongoose"
import { IErrorResponse } from "../interfaces/error.types"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handelCastError = (err: mongoose.Error.CastError): IErrorResponse =>{
  return{
    statusCode: 400,
    message: "Please provide a valid ID."
  }
}