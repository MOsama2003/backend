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
  @ApiProperty({
    description: 'ID of the post to which the comment belongs',
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  postId: string;

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

  @ApiPropertyOptional({
    description: 'Array of mentioned user IDs',
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  mentions?: number[];
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

  @ApiProperty({
    description: 'ID of the post for which comments are being fetched',
    example: 123,
  })
  @IsNotEmpty()
  @IsInt()
  postId: number;
}
