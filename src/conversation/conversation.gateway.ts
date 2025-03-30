import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ConversationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private activeUsers = new Map<string, string>();

  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.set(userId, socket.id);
      console.log(`User ${userId} connected`);
    }
  }

  handleDisconnect(socket: Socket) {
    for (const [userId, socketId] of this.activeUsers.entries()) {
      if (socketId === socket.id) {
        this.activeUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  @SubscribeMessage('joinChatRoom')
  handleJoinChatRoom(
    @MessageBody() conversationId: { conversationId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(`chat_${conversationId}`);
    console.log(`User joined room: chat_${conversationId}`);
  }

  @SubscribeMessage('leaveChatRoom')
  handleLeaveChatRoom(
    @MessageBody() conversationId: { conversationId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(`chat_${conversationId}`);
    console.log(`User left room: chat_${conversationId}`);
  }

  sendMessageToRoom({conversationId, message}) {
    this.server.to(`chat_${conversationId}`).emit('newMessage', message);
    console.log(`Broadcasting message to chat_${conversationId}:`, message);
  }

  sendConversationUpdate({ participants, conversationId, lastMessage }) {
    participants.forEach((userId) => {
      const socketId = this.activeUsers.get(userId);
      if (socketId) {
        this.server.to(socketId).emit('conversationUpdate', {
          conversationId,
          lastMessage,
        });
      }
    });
    console.log(`Broadcasting conversation update for ${conversationId}`);
  }

  sendConversationMessageUpdate({receiverId, message}) {
    this.server.to(receiverId).emit('conversationMessageUpdate', {
     message
    });
    console.log(
      `conversationMessageUpdate sent to sender ${receiverId}:`,
      { message }
    );
  }

}
