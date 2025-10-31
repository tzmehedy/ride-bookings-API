import { CloudinaryStorage } from "multer-storage-cloudinary";
import { CloudinaryUpload } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: CloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const filename = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\./g, "-");

      const extension = file.originalname.split(".").pop();
      const updatedFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        "-" +
        filename +
        "." +
        extension;
      return updatedFileName;
    },
  },
});

export const MulterUpload = multer({storage})
