import { ConsultAiChatService } from './consult-ai-chat.service';
export declare class ConsultAiChatController {
    private readonly consultAiChatService;
    constructor(consultAiChatService: ConsultAiChatService);
    sendMessage(file: Express.Multer.File, body: {
        userId: number;
        message: string;
    }): Promise<{
        response: {
            reply: string;
            triggerAppointment: boolean;
            customText: string;
            previousMessages: any[];
        };
    }>;
    getMessages(userId: number, page?: number): Promise<import("./entities/message.entity").Message[]>;
    clearChat(userId: number): Promise<{
        message: string;
    }>;
}
