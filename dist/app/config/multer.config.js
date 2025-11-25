"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterUpload = void 0;
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = require("./cloudinary.config");
const multer_1 = __importDefault(require("multer"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.CloudinaryUpload,
    params: {
        public_id: (req, file) => {
            const filename = file.originalname
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/\./g, "-");
            const extension = file.originalname.split(".").pop();
            const updatedFileName = Math.random().toString(36).substring(2) +
                "-" +
                "-" +
                filename +
                "." +
                extension;
            return updatedFileName;
        },
    },
});
exports.MulterUpload = (0, multer_1.default)({ storage });
