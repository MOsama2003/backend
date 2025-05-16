import { DeliveryStatus } from "src/constants";
import { User } from "src/user/entities/user.entity";
import { Conversation } from "./conversation.entity";
export declare class ConversationMessages {
    messageId: number;
    conversation: Conversation;
    text: string;
    file: string;
    sender: User;
    status: DeliveryStatus;
    createdAt: Date;
    broadcastId: string;
}
