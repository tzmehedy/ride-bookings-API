"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const paymentSchema = new mongoose_1.Schema({
    ride: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Ride" },
    transitionId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentGateWayData: { type: mongoose_1.Schema.Types.Mixed },
    paymentUrl: { type: String },
    paymentStatus: {
        type: String,
        enum: Object.values(payment_interface_1.PaymentStatus),
        default: payment_interface_1.PaymentStatus.UNPAID,
    },
}, {
    timestamps: true
});
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
