import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDeviceLocDetails {
  @ApiProperty()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  longitude: number;  

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  latitude: number;  
}
