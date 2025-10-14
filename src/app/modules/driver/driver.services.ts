import httpStatusCode from "http-status-codes";
import { Driver } from "./driver.model";
import { IApprovalStatus, IDriver } from "./driver.interface";
import { User } from "../user/user.model";
import AppError from "../../errorhelpers/appError";
import { IRole } from "../user/user.interface";

const createDriver = async (payload: Partial<IDriver>) => {
  const { userId } = payload;

  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(
      httpStatusCode.NOT_FOUND,
      "The user does not exist...!!!"
    );
  }

  await User.findByIdAndUpdate(userId, { role: IRole.DRIVER }, { new: true });

  const driverInfo = await Driver.create(payload);
  return driverInfo;
};

const getAllDrivers = async () => {
  const allDrivers = await Driver.find().populate("userId");
  return allDrivers;
};

const driverApproval = async (userId: string) => {
  const updatedDoc: Partial<IDriver> = {
    approval_status: IApprovalStatus.Accept,
  };

  const updatedDriverInfo = await Driver.findByIdAndUpdate(userId, updatedDoc, {
    new: true,
  });

  return updatedDriverInfo;
};

const setAvailability = async (driverId: string, availability: string) => {
  const updatedDriverInfo = await Driver.findByIdAndUpdate(
    driverId,
    {
      availability: availability,
    },
    { new: true }
  );

  return updatedDriverInfo
};

export const DriverServices = {
  createDriver,
  driverApproval,
  getAllDrivers,
  setAvailability,
};
