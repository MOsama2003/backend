import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ApiTags } from '@nestjs/swagger';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
@ApiTags('testChat') 
export class ConsultAiChatService {
  private GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
  private MODEL = 'llama3-70b-8192';

  constructor(private redisService: RedisService) {}

  async getChatResponse(userId: string, message: string) {
    const previousMessages = await this.redisService.getChatHistory(userId);

    const response = await axios.post(
      this.GROQ_URL,
      {
        model: this.MODEL,
        messages: [
          { role: 'system', content: 'You are an agriculture expert.' },
          ...previousMessages,
          { role: 'user', content: message }
        ],
        temperature: 0.7
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } }
    );

    const reply = response.data.choices[0].message.content;

    await this.redisService.storeChatMessage(userId, { role: 'user', content: message });
    await this.redisService.storeChatMessage(userId, { role: 'assistant', content: reply });

    return reply;
  }
}
