"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handelDuplicateKeyError = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handelDuplicateKeyError = (err) => {
    const matchedKey = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${matchedKey[1]} is already exist.`,
    };
};
exports.handelDuplicateKeyError = handelDuplicateKeyError;
