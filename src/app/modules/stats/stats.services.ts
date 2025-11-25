import mongoose from "mongoose"
import { Driver } from "../driver/driver.model"
import { Ride } from "../ride/ride.model"
import { User } from "../user/user.model"

const now = new Date()
const nextDay = new Date(now).setDate(now.getDate() + 1)
const previousDay = new Date(now).setDate(now.getDate() - 1)
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7)
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30)



const getDriverStats = async (id: string) => {

    const sevenDaysAgoRideCountPromise = Driver.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(id) } },
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

    ])

    const thirtyDaysAgoRideCountPromise = Driver.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(id) } },
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

    ])


    const todayRidesCountPromise = Driver.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(id) } },
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

    ])




    const totalEarningsPromise = await Driver.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(id) } },
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

    const [totalEarnings, sevenDaysAgoRideCount, thirtyDaysAgoRideCount, todayRidesCount] = await Promise.all([
        totalEarningsPromise,
        sevenDaysAgoRideCountPromise,
        thirtyDaysAgoRideCountPromise,
        todayRidesCountPromise
    ])

    return {
        todayRidesCount: todayRidesCount[0],
        sevenDaysAgoRideCount: sevenDaysAgoRideCount[0],
        thirtyDaysAgoRideCount: thirtyDaysAgoRideCount[0],
        totalEarnings: totalEarnings[0],
    }


}


const getAdminStats = async () => {

    const numberOfTotalRidesPromise = Ride.countDocuments()

    const totalNumberOfRidesCompletedPromise = Ride.countDocuments({ ride_status: "Completed" })

    const totalNumberOfRidesCancelPromise = Ride.countDocuments({ ride_status: "Canceled" })


    const totalNumberOfApproveDriverPromise = Driver.countDocuments({ approval_status: "Accept" })

    const totalNumberOfUsersPromise = User.countDocuments()

    const totalRevenuePromise = Ride.aggregate([
        {
            $match: {"ride_status": "Completed"}
        },
        {
            $group: {
                _id: "$ride_status",
                total_revenue: {$sum: "$price"}
            }
        }
        // {
        //     $group: {
        //         _id: "$ride_status",
        //         total_revenue: { $sum: "$price" }
        //     }
        // }
    ])

    const totalRevenueThirtyDayAndCountPromise = Ride.aggregate([
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

    ])

    const totalRevenueSevenDayAndCountPromise = Ride.aggregate([
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

    ])

    const totalRevenueOneDayAndCountPromise = Ride.aggregate([
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

    ])

    const [numberOfTotalRides, totalNumberOfRidesCompleted, totalNumberOfRidesCancel, totalNumberOfApproveDriver, totalNumberOfUsers, totalRevenue, totalRevenueThirtyDayAndCount, totalRevenueSevenDayAndCount, totalRevenueOneDayAndCount] = await Promise.all([

        numberOfTotalRidesPromise,
        totalNumberOfRidesCompletedPromise,
        totalNumberOfRidesCancelPromise,
        totalNumberOfApproveDriverPromise,
        totalNumberOfUsersPromise,
        totalRevenuePromise,
        totalRevenueThirtyDayAndCountPromise,
        totalRevenueSevenDayAndCountPromise,
        totalRevenueOneDayAndCountPromise


    ])


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
    }

}



export const StatsServices = {
    getDriverStats,
    getAdminStats

}