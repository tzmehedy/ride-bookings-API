"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const rideSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Driver" },
    destination_address: { type: String, required: true },
    pickup_address: { type: String, required: true },
    distance: { type: Number, required: true },
    price: { type: Number, required: true },
    ride_status: { type: String, enum: Object.values(ride_interface_1.RideStatus), default: ride_interface_1.RideStatus.Requested }
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
