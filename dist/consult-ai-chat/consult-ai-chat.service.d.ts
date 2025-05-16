import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RedisService } from 'src/redis/redis.service';
import { Message } from './entities/message.entity';
import { User } from 'src/user/entities/user.entity';
export declare class ConsultAiChatService {
    private messageRepo;
    private readonly userRepo;
    private redisService;
    private cloudinaryService;
    private MODEL;
    private groqClient;
    constructor(messageRepo: Repository<Message>, userRepo: Repository<User>, redisService: RedisService, cloudinaryService: CloudinaryService);
    sendMessage(userId: number, message: string, file?: Express.Multer.File): Promise<{
        response: {
            reply: string;
            triggerAppointment: boolean;
            customText: string;
            previousMessages: any[];
        };
    }>;
    getMessages(userId: number, page?: number): Promise<Message[]>;
    clearChat(userId: number): Promise<{
        message: string;
    }>;
}
