import { 
  ApiProperty, 
  ApiPropertyOptional 
} from '@nestjs/swagger';
import { 
  IsOptional, 
  IsNotEmpty, 
  IsInt, 
  Min, 
  IsString, 
  IsArray 
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCommentDto {
  @ApiPropertyOptional({
    description: 'ID of the parent comment (if replying to another comment)',
    example: '456',
  })
  @IsOptional()
  @IsString()
  parentCommentId?: string;

  @ApiProperty({
    description: 'Text of the comment',
    example: 'This is a great post!',
  })
  @IsString()
  @IsNotEmpty()
  commentText: string;
}

export class CommentListingDto {
  @ApiPropertyOptional({
    description: 'Page number (default: 1)',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 1)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page (default: 10)',
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 10)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'ID of the parent comment (if fetching replies)',
    example: '456',
  })
  @IsOptional()
  @IsString()
  parentCommentId?: string | null;
}
