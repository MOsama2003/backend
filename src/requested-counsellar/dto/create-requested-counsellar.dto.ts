import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateRequestedCounsellarDto {
    @ApiProperty({ description: 'First name of the user' })
    @IsString()
    @IsNotEmpty()
    firstName: string;
  
    @ApiProperty({ description: 'Last name of the user' })
    @IsString()
    @IsNotEmpty()
    lastName: string;
  
    @ApiProperty({ description: 'Email address of the user' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
