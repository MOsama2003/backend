import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

@Injectable()
export class CloudinaryService {
  private readonly cloudinaryStorage: multer.StorageEngine;

  constructor() {
    // Set up Cloudinary storage
    this.cloudinaryStorage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => ({
        folder: 'uploads', // Save files in 'uploads' folder
        public_id: file.originalname.split('.')[0], // Use filename as public_id
      }),
    });
  }

  // Get the multer upload instance using the cloudinary storage config
  get multerUpload() {
    return multer({ storage: this.cloudinaryStorage });
  }

  // Method to handle the file upload manually (alternative method using upload_stream)
  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse | undefined> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'uploads' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      ).end(file.buffer);
    });
  }
}
