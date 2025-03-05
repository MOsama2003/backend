import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ description: 'Article Title of the user' })
  @IsString()
  @IsNotEmpty()
  articleTitle: string;

  @ApiProperty({ description: 'Article Content of the user' })
  @IsString()
  @IsNotEmpty()
  articleContent: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  articleKeyword: string[];
}
