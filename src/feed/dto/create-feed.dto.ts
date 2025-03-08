import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedDto {
  @ApiProperty({
    description: 'Caption for the feed post',
    example: 'This is my first post!',
  })
  @IsString()
  @IsNotEmpty()
  caption: string;
}
