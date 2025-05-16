import { DeleteApiResponse, UploadApiResponse } from 'cloudinary';
import multer from 'multer';
export declare class CloudinaryService {
    private readonly cloudinaryStorage;
    constructor();
    get multerUpload(): multer.Multer;
    uploadFile(file: Express.Multer.File): Promise<UploadApiResponse | undefined>;
    deleteFile(publicId: string): Promise<DeleteApiResponse | undefined>;
}
