import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostReaction } from 'src/constants';

export class CreateReactionDto {
  @ApiProperty({
    description: 'ID of the post to react to',
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({
    description: 'Type of reaction (Upvote or Devote)',
    enum: PostReaction,
    example: PostReaction.Upvote,
  })
  @IsNotEmpty()
  @IsEnum(PostReaction)
  reactionType: PostReaction;
}
