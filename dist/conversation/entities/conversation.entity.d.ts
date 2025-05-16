import { User } from "src/user/entities/user.entity";
import { ConversationMessages } from "./conversationMessages.entity";
export declare class Conversation {
    conversationtId: number;
    conversationParticipants: User[];
    messages: ConversationMessages[];
    createdAt: Date;
}
