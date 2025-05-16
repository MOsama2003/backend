import { User } from 'src/user/entities/user.entity';
export declare enum MessageType {
    USER = "user",
    ASSISTANT = "assistant"
}
export declare class Message {
    id: number;
    user: User;
    type: MessageType;
    content: string;
    imageUrl?: string;
    createdAt: Date;
}
