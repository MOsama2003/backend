import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RedisService } from 'src/redis/redis.service';
import { Message, MessageType } from './entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import Groq from 'groq-sdk';

@Injectable()
export class ConsultAiChatService {
  private MODEL = 'llama-3.2-90b-vision-preview';
  private groqClient: Groq;


  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private redisService: RedisService,
    private cloudinaryService: CloudinaryService,
  ) {
      this.groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async sendMessage(userId: number, message: string, file?: Express.Multer.File) {
      try {
          if (!userId || !message.trim()) {
              throw new BadRequestException('User ID and message are required.');
          }

          const user = await this.userRepo.findOne({ where: { id: userId } });

          if (!user) {
              throw new Error('User not found');
          }

          let imageUrl: string | null = null;

          if (file) {
              try {
                  const result = await this.cloudinaryService.uploadFile(file);
                  imageUrl = result?.secure_url || null;
              } catch (error) {
                  console.error('Error uploading image:', error);
                  throw new InternalServerErrorException('Failed to upload image.');
              }
          }

          const previousMessages = await this.redisService.getChatHistory(userId);
          // console.log(...previousMessages);

          const userMessage = imageUrl ? `${message} [Image: ${imageUrl}]` : message;

          let reply: string;

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
          } else {
              let summary:string = '';

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
                              { type: 'text', text: summary? `Here is a summary of our conversation so far: ${summary}` :"-"},
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
              "problem", "issue", "solution", "remedy", "recommendation", "agriculture expert", "disease","recommend", "fungus", "disease", "fungicides"
          ];

        //   const triggerAppointment = appointmentKeywords.some(keyword => 
        //       reply.toLowerCase().split(/\s+/).includes(keyword)
        //   );
          const triggerAppointment = appointmentKeywords.some(keyword => reply.toLowerCase().includes(keyword));

          let customText: string = "";
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
              type: MessageType.USER,
          });

          await this.messageRepo.save({
              user,
              content: reply,
              type: MessageType.ASSISTANT,
          });

          //there is no need to return previousMessages! Currently, I am returning just for testing
          return { response: { reply, triggerAppointment, customText, previousMessages } };
      } catch (error) {
          console.error('Error processing message:', error);
          throw new InternalServerErrorException('Failed to process message.');
      }
  }

  async getMessages(userId: number, page = 1) {
    const offset = (page - 1) * 10;
    return this.messageRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 10,
      skip: offset,
    });
  }

  async clearChat(userId: number) {
    await this.redisService.clearChatHistory(userId);
    await this.messageRepo.delete({ user: { id: userId } });
    return { message: 'Chat cleared' };
  }
}