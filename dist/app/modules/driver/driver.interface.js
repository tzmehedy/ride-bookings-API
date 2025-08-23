"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IApprovalStatus = exports.IIsActive = void 0;
var IIsActive;
(function (IIsActive) {
    IIsActive["Active"] = "Active";
    IIsActive["InActive"] = "InActive";
    IIsActive["Blocked"] = "Blocked";
})(IIsActive || (exports.IIsActive = IIsActive = {}));
var IApprovalStatus;
(function (IApprovalStatus) {
    IApprovalStatus["Accept"] = "Accept";
    IApprovalStatus["Reject"] = "Reject";
    IApprovalStatus["Pending"] = "Pending";
})(IApprovalStatus || (exports.IApprovalStatus = IApprovalStatus = {}));
