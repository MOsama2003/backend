import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCounsellarDto {
  @ApiProperty({ description: 'First name of the user' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password for the user account' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
