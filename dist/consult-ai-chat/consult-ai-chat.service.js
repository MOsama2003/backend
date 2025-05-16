"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultAiChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const redis_service_1 = require("../redis/redis.service");
const message_entity_1 = require("./entities/message.entity");
const user_entity_1 = require("../user/entities/user.entity");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
let ConsultAiChatService = class ConsultAiChatService {
    constructor(messageRepo, userRepo, redisService, cloudinaryService) {
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
        this.redisService = redisService;
        this.cloudinaryService = cloudinaryService;
        this.MODEL = 'meta-llama/llama-4-maverick-17b-128e-instruct';
        this.groqClient = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
    }
    async sendMessage(userId, message, file) {
        try {
            if (!userId || !message.trim()) {
                throw new common_1.BadRequestException('User ID and message are required.');
            }
            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error('User not found');
            }
            let imageUrl = null;
            if (file) {
                try {
                    const result = await this.cloudinaryService.uploadFile(file);
                    imageUrl = result?.secure_url || null;
                }
                catch (error) {
                    console.error('Error uploading image:', error);
                    throw new common_1.InternalServerErrorException('Failed to upload image.');
                }
            }
            const previousMessages = await this.redisService.getChatHistory(userId);
            const userMessage = imageUrl ? `${message} [Image: ${imageUrl}]` : message;
            let reply;
            if (!imageUrl) {
                const response = await this.groqClient.chat.completions.create({
                    model: this.MODEL,
                    messages: [
                        { role: 'system', content: 'You are an agriculture expert. Keep your answers short and in a conversational style. If the user’s issue is complex or requires human consultation, suggest booking an appointment.' },
                        ...previousMessages,
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.7
                });
                reply = response.choices[0]?.message?.content || "No response from AI";
            }
            else {
                let summary = '';
                if (previousMessages.length > 0) {
                    const summaryResponse = await this.groqClient.chat.completions.create({
                        model: this.MODEL,
                        messages: [
                            { role: 'user', content: 'Summarize the conversation so far in 4-5 sentences.' },
                            ...previousMessages,
                        ],
                        temperature: 0.5
                    });
                    summary = summaryResponse.choices[0]?.message?.content || '';
                }
                const response = await this.groqClient.chat.completions.create({
                    model: this.MODEL,
                    messages: [
                        {
                            role: 'user', content: 'You are an agriculture expert. Keep your answers short and in a conversational style.'
                        },
                        {
                            role: 'user',
                            content: [
                                { type: 'text', text: summary ? `Here is a summary of our conversation so far: ${summary}` : "-" },
                                { type: 'image_url', image_url: { url: imageUrl } }
                            ]
                        },
                        { role: 'user', content: userMessage },
                    ],
                    temperature: 0.7
                });
                reply = response.choices[0]?.message?.content || "No response from AI";
            }
            const appointmentKeywords = [
                "appointment", "consult", "consultation", "schedule", "meeting", "book",
                "specialist", "expert", "advisor", "doctor", "agronomist", "professional",
                "help", "guidance", "support", "assistance", "talk", "discussion", "chat",
                "session", "checkup", "inspection", "diagnosis", "treatment", "helpdesk",
                "problem", "issue", "solution", "remedy", "recommendation", "agriculture expert", "disease", "recommend", "fungus", "disease", "fungicides"
            ];
            const triggerAppointment = appointmentKeywords.some(keyword => reply.toLowerCase().includes(keyword));
            let customText = "";
            if (triggerAppointment) {
                const recentMessages = previousMessages.slice(-10);
                const response = await this.groqClient.chat.completions.create({
                    model: this.MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: `You are analyzing a recent conversation between a farmer and an AI assistant. 
                          Our system has detected that the farmer may need professional consultation. Based on the conversation history, generate a concise, natural one-liner message (one sentence) telling the farmer that he should book an appointment. The message must be, persuasive, and strictly one sentence. 

                          Here are some examples of how the response should be structured:
                          - "consulting an expert can help you take the right preventive steps."
                          - "booking an appointment can help you get expert advice."
                          - " booking an appointment."

                          Make sure the generated message follows a similar structure and remains strictly one sentence. I strictly need one and one one sentence/line`
                        },
                        ...recentMessages,
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.7
                });
                customText = response.choices[0]?.message?.content || "You might need expert guidance to protect your crops.";
            }
            await this.redisService.storeChatMessage(userId, { role: 'user', content: message });
            await this.redisService.storeChatMessage(userId, { role: 'assistant', content: reply });
            await this.messageRepo.save({
                user,
                content: message,
                imageUrl: imageUrl ?? undefined,
                type: message_entity_1.MessageType.USER,
            });
            await this.messageRepo.save({
                user,
                content: reply,
                type: message_entity_1.MessageType.ASSISTANT,
            });
            return { response: { reply, triggerAppointment, customText, previousMessages } };
        }
        catch (error) {
            console.error('Error processing message:', error);
            throw new common_1.InternalServerErrorException('Failed to process message.');
        }
    }
    async getMessages(userId, page = 1) {
        const offset = (page - 1) * 10;
        return this.messageRepo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            take: 10,
            skip: offset,
        });
    }
    async clearChat(userId) {
        await this.redisService.clearChatHistory(userId);
        await this.messageRepo.delete({ user: { id: userId } });
        return { message: 'Chat cleared' };
    }
};
exports.ConsultAiChatService = ConsultAiChatService;
exports.ConsultAiChatService = ConsultAiChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        redis_service_1.RedisService,
        cloudinary_service_1.CloudinaryService])
], ConsultAiChatService);
//# sourceMappingURL=consult-ai-chat.service.js.map