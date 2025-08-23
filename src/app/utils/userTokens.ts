import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

export const createUserTokens = async (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = await generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET_KEY,
    envVars.JWT_ACCESS_EXPIRES_IN
  );

  const refreshToken = await generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET_KEY,
    envVars.JWT_REFRESH_EXPIRES_IN
  );

  return {
    accessToken,
    refreshToken,
  };
};
