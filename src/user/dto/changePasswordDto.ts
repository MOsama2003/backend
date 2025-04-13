import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'old password of the user' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ description: 'new password of the user' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
