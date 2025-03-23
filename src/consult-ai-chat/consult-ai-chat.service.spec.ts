import { Test, TestingModule } from '@nestjs/testing';
import { ConsultAiChatService } from './consult-ai-chat.service';

describe('ConsultAiChatService', () => {
  let service: ConsultAiChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsultAiChatService],
    }).compile();

    service = module.get<ConsultAiChatService>(ConsultAiChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
