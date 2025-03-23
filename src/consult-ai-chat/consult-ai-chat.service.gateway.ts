import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ConsultAiChatService } from './consult-ai-chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private chatService: ConsultAiChatService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: { userId: string; message: string }) {
    const response = await this.chatService.getChatResponse(data.userId, data.message);
    
    const suggestAppointment = response.includes('consult an expert');

    this.server.emit('receiveMessage', { userId: data.userId, response, suggestAppointment });
  }
}
