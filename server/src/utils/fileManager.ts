import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'arm/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type: 'image',
  } as object,
});

const mindStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'arm/mind',
    resource_type: 'raw',
    allowed_formats: ['mind'],
  } as object,
});

export const upload = multer({ storage: imageStorage });
export const uploadMind = multer({ storage: mindStorage });

export function fileUrlFromFilename(storedFilename: string | undefined | null): string {
  if (!storedFilename) return '';
  return storedFilename;
}