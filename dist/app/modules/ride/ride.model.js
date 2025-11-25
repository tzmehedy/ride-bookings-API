"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const rideSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: "Driver" },
    payment: { type: mongoose_1.Schema.Types.ObjectId, ref: "Payment" },
    paymentMethod: { type: String, enum: Object.values(ride_interface_1.PaymentMethod), required: true },
    destination_address: { type: String, required: true },
    pickup_address: { type: String, required: true },
    distance: { type: Number, required: true },
    price: { type: Number, required: true },
    ride_status: {
        type: String,
        enum: Object.values(ride_interface_1.RideStatus),
        default: ride_interface_1.RideStatus.Requested,
    },
}, {
    timestamps: true
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
