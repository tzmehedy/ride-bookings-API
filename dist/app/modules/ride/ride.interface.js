"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.RideStatus = void 0;
var RideStatus;
(function (RideStatus) {
    RideStatus["Requested"] = "Requested";
    RideStatus["Accepted"] = "Accepted";
    RideStatus["Picked_Up"] = "Picked_Up";
    RideStatus["In_Transit"] = "In_Transit";
    RideStatus["Completed"] = "Completed";
    RideStatus["Canceled"] = "Canceled";
})(RideStatus || (exports.RideStatus = RideStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["Cash"] = "Cash";
    PaymentMethod["Online"] = "Online";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
