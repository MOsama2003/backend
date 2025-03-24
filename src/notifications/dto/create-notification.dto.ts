import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  data?: any;
}
