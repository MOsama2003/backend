import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsArray, ArrayNotEmpty, IsInt, Min, Max } from "class-validator";

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

  @ApiProperty({ description: 'Years of experience of the user' })
  @IsString()
  @IsNotEmpty()
  yoe: string;

  @ApiProperty({ description: 'Expertise of the user' })
  @IsString()
  @IsNotEmpty()
  expertise: string;

  @ApiProperty({ description: 'Start time of working hours (e.g., 09:00)' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: 'End time of working hours (e.g., 17:00)' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({
    description: 'Working days as an array of numbers (e.g., [1, 2, 3, 4, 5] for Mon–Fri)',
    example: [1, 2, 3, 4, 5],
    type: [Number]
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true }) // assuming 0 = Sunday, 6 = Saturday
  workingDays: number[];
}
