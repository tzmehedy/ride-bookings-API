"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driver_interface_1 = require("./driver.interface");
const vehicleInfoSchema = new mongoose_1.Schema({
    brand_name: { type: String, required: true },
    model: { type: String, required: true },
    vehicle_number: { type: String, required: true }
}, {
    versionKey: false,
    id: false
});
const driverSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    rideId: { type: [mongoose_1.Schema.Types.ObjectId], ref: "Ride", default: [] },
    approval_status: {
        type: String,
        enum: Object.values(driver_interface_1.IApprovalStatus),
        default: driver_interface_1.IApprovalStatus.Pending,
    },
    online_status: {
        type: String,
        enum: Object.values(driver_interface_1.IIsActive),
        default: driver_interface_1.IIsActive.Active,
    },
    vehicle_info: { type: vehicleInfoSchema, required: true },
    availability: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);
