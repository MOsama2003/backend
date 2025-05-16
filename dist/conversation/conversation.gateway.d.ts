import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class ConversationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private activeUsers;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
    handleJoinRoom(data: {
        conversationId: number;
    }, socket: Socket): void;
    handleLeaveRoom(data: {
        conversationId: number;
    }, socket: Socket): void;
    sendMessageToRoom({ conversationId, message }: {
        conversationId: any;
        message: any;
    }): void;
    sendConversationUpdate({ participants, conversationId, lastMessage }: {
        participants: any;
        conversationId: any;
        lastMessage: any;
    }): void;
    sendConversationMessageUpdate({ receiverId, message }: {
        receiverId: any;
        message: any;
    }): void;
}
