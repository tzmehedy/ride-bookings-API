import { IErrorResponse } from "../interfaces/error.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handelDuplicateKeyError = (err: any): IErrorResponse => {
  const matchedKey = err.message.match(/"([^"]*)"/);

  return {
    statusCode: 400,
    message: `${matchedKey[1]} is already exist.`,
  };
};