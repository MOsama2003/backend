import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({
    description: 'Array of user IDs participating in the conversation',
    example: [1, 2],
  })
  userIds: number[];
}
