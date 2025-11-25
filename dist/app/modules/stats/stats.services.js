"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const driver_model_1 = require("../driver/driver.model");
const ride_model_1 = require("../ride/ride.model");
const user_model_1 = require("../user/user.model");
const now = new Date();
const nextDay = new Date(now).setDate(now.getDate() + 1);
const previousDay = new Date(now).setDate(now.getDate() - 1);
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getDriverStats = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const sevenDaysAgoRideCountPromise = driver_model_1.Driver.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(id) } },
        {
            $lookup: {
                from: "rides",
                localField: "rideId",
                foreignField: "_id",
                as: "ridesData",
            },
        },
        {
            $unwind: "$ridesData",
        },
        {
            $match: {
                "ridesData.createdAt": { $gte: new Date(sevenDaysAgo) }
            }
        },
        {
            $group: {
                _id: "$_id",
                totalEarning: { $sum: "$ridesData.price" },
                count: { $sum: 1 }
            }
        },
    ]);
    const thirtyDaysAgoRideCountPromise = driver_model_1.Driver.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(id) } },
        {
            $lookup: {
                from: "rides",
                localField: "rideId",
                foreignField: "_id",
                as: "ridesData",
            },
        },
        {
            $unwind: "$ridesData",
        },
        {
            $match: {
                "ridesData.createdAt": { $gte: new Date(thirtyDaysAgo) }
            }
        },
        {
            $group: {
                _id: "$_id",
                totalEarning: { $sum: "$ridesData.price" },
                count: { $sum: 1 }
            }
        },
    ]);
    const todayRidesCountPromise = driver_model_1.Driver.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(id) } },
        {
            $lookup: {
                from: "rides",
                localField: "rideId",
                foreignField: "_id",
                as: "ridesData",
            },
        },
        {
            $unwind: "$ridesData",
        },
        {
            $match: {
                $and: [
                    { "ridesData.createdAt": { $lt: new Date(nextDay) } },
                    { "ridesData.createdAt": { $gt: new Date(previousDay) } },
                ]
            }
        },
        {
            $group: {
                _id: "$_id",
                totalEarning: { $sum: "$ridesData.price" },
                count: { $sum: 1 }
            }
        },
    ]);
    const totalEarningsPromise = yield driver_model_1.Driver.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(id) } },
        {
            $lookup: {
                from: "rides",
                localField: "rideId",
                foreignField: "_id",
                as: "ridesData",
            },
        },
        {
            $unwind: "$ridesData",
        },
        {
            $match: {
                "ridesData.ride_status": "Completed",
            },
        },
        {
            $group: {
                _id: "$_id",
                totalEarnings: { $sum: "$ridesData.price" },
                totalCompletedRides: { $sum: 1 },
            },
        },
    ]);
    const [totalEarnings, sevenDaysAgoRideCount, thirtyDaysAgoRideCount, todayRidesCount] = yield Promise.all([
        totalEarningsPromise,
        sevenDaysAgoRideCountPromise,
        thirtyDaysAgoRideCountPromise,
        todayRidesCountPromise
    ]);
    return {
        todayRidesCount: todayRidesCount[0],
        sevenDaysAgoRideCount: sevenDaysAgoRideCount[0],
        thirtyDaysAgoRideCount: thirtyDaysAgoRideCount[0],
        totalEarnings: totalEarnings[0],
    };
});
const getAdminStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const numberOfTotalRidesPromise = ride_model_1.Ride.countDocuments();
    const totalNumberOfRidesCompletedPromise = ride_model_1.Ride.countDocuments({ ride_status: "Completed" });
    const totalNumberOfRidesCancelPromise = ride_model_1.Ride.countDocuments({ ride_status: "Canceled" });
    const totalNumberOfApproveDriverPromise = driver_model_1.Driver.countDocuments({ approval_status: "Accept" });
    const totalNumberOfUsersPromise = user_model_1.User.countDocuments();
    const totalRevenuePromise = ride_model_1.Ride.aggregate([
        {
            $match: { "ride_status": "Completed" }
        },
        {
            $group: {
                _id: "$ride_status",
                total_revenue: { $sum: "$price" }
            }
        }
        // {
        //     $group: {
        //         _id: "$ride_status",
        //         total_revenue: { $sum: "$price" }
        //     }
        // }
    ]);
    const totalRevenueThirtyDayAndCountPromise = ride_model_1.Ride.aggregate([
        {
            $match: { "createdAt": { $gte: new Date(thirtyDaysAgo) } }
        },
        {
            $group: {
                _id: "$ride_status",
                thirty_day_revenue: { $sum: "$price" },
                count: { $sum: 1 }
            }
        }
    ]);
    const totalRevenueSevenDayAndCountPromise = ride_model_1.Ride.aggregate([
        {
            $match: { "createdAt": { $gte: new Date(sevenDaysAgo) } }
        },
        {
            $group: {
                _id: "$ride_status",
                seven_day_revenue: { $sum: "$price" },
                count: { $sum: 1 }
            }
        }
    ]);
    const totalRevenueOneDayAndCountPromise = ride_model_1.Ride.aggregate([
        {
            $match: {
                $and: [
                    { "createdAt": { $lt: new Date(nextDay) } },
                    { "createdAt": { $gt: new Date(previousDay) } },
                ]
            }
        },
        {
            $group: {
                _id: "$ride_status",
                one_day_revenue: { $sum: "$price" },
                count: { $sum: 1 }
            }
        }
    ]);
    const [numberOfTotalRides, totalNumberOfRidesCompleted, totalNumberOfRidesCancel, totalNumberOfApproveDriver, totalNumberOfUsers, totalRevenue, totalRevenueThirtyDayAndCount, totalRevenueSevenDayAndCount, totalRevenueOneDayAndCount] = yield Promise.all([
        numberOfTotalRidesPromise,
        totalNumberOfRidesCompletedPromise,
        totalNumberOfRidesCancelPromise,
        totalNumberOfApproveDriverPromise,
        totalNumberOfUsersPromise,
        totalRevenuePromise,
        totalRevenueThirtyDayAndCountPromise,
        totalRevenueSevenDayAndCountPromise,
        totalRevenueOneDayAndCountPromise
    ]);
    return {
        total_ride: numberOfTotalRides,
        total_completed_ride: totalNumberOfRidesCompleted,
        total_cancel_ride: totalNumberOfRidesCancel,
        total_approve_driver: totalNumberOfApproveDriver,
        total_user: totalNumberOfUsers,
        total_revenue: totalRevenue[0] || 0,
        total_revenue_in_thirtyDays: totalRevenueThirtyDayAndCount[0] || 0,
        total_revenue_in_sevenDays: totalRevenueSevenDayAndCount[0] || 0,
        total_revenue_in_oneDays: totalRevenueOneDayAndCount[0] || 0
    };
});
exports.StatsServices = {
    getDriverStats,
    getAdminStats
};
