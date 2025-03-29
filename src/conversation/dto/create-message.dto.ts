import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessage {
  @ApiProperty({ description: 'text for message' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'conversation id' })
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiProperty({ description: 'broadcastId id to manage broadcasting' })
  @IsString()
  @IsNotEmpty()
  broadcastId: string;
}
