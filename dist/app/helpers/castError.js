"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handelCastError = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handelCastError = (err) => {
    return {
        statusCode: 400,
        message: "Please provide a valid ID."
    };
};
exports.handelCastError = handelCastError;
