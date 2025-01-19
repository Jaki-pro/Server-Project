import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});
export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
) => {
  console.log('cloudinary sendImageToCloudinary');
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: imageName,
    })
    .catch((error) => {
      console.log(error);
    });
  //delete file from uploads folder
  fs.unlink(path, function (err) {
    if (err) console.log(err);
    // else console.log('file is deleted successfully');
  });
  // console.log(uploadResult);
  return uploadResult;
};
// upload file to uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage }); // call upload.single('file') from router
