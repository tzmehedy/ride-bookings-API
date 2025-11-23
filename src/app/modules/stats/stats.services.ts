import mongoose from "mongoose"
import { Driver } from "../driver/driver.model"

const now = new Date()
const nextDay = new Date(now).setDate(now.getDate() + 1 )
const previousDay = new Date(now).setDate(now.getDate() - 1)
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7)
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30)



const getDriverStats = async(id: string) =>{

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
            $group:{
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
            $group:{
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
                    {"ridesData.createdAt": { $lt: new Date(nextDay) }},
                    {"ridesData.createdAt": { $gt: new Date(previousDay)}},
                ]
            }
        },

        {
            $group:{
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

    const [totalEarnings, sevenDaysAgoRideCount, thirtyDaysAgoRideCount, todayRidesCount ] = await Promise.all([
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



export const StatsServices = {
    getDriverStats,

}