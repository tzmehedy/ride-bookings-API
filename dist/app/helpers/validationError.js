"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handelValidationError = void 0;
const handelValidationError = (err) => {
    const errorSources = [];
    const errors = Object.values(err.errors);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors.forEach((errorObject) => errorSources.push({
        path: errorObject.path,
        message: errorObject.message,
    }));
    return {
        statusCode: 400,
        message: "Validation Error Occur...!!!",
        errorSources
    };
};
exports.handelValidationError = handelValidationError;
