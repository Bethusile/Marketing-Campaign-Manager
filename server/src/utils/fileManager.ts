import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const uploadsDirectory = path.join(__dirname, '../../public/uploads');

const multerStorage = multer.diskStorage({
  destination: (_request: Request, _file, callback) => {
    try {
      fs.mkdirSync(uploadsDirectory, { recursive: true });
      callback(null, uploadsDirectory);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      callback(error, uploadsDirectory);
    }
  },
  filename: (_request, file, callback) => {
    const timestampAndRandom = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname) || '';
    callback(null, `${timestampAndRandom}${fileExtension}`);
  },
});

export const upload = multer({ storage: multerStorage });

export function fileUrlFromFilename(storedFilename: string | undefined | null): string {
  if (!storedFilename) return '';
  return `/uploads/${storedFilename}`;
}