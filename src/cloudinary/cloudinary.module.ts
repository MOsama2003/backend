import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinay.provider';

@Module({
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService], 
})
export class CloudinaryModule {}
