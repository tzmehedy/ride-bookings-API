"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryUpload = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
cloudinary_1.v2.config({
    cloud_name: env_1.envVars.CLOUDINARY.CLOUDINARY_NAME,
    api_key: env_1.envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: env_1.envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});
exports.CloudinaryUpload = cloudinary_1.v2;
