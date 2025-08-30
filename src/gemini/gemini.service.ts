import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';

/* Dtos */
import { BasicPromptDto } from './dtos/basic-prompt.dto';

/* Use Cases */
import {
  basicPromptStreamUseCase,
  basicPromptUseCase,
  chatPromptStreamUseCase,
} from './use-cases';
import { ChatPromptDto } from './dtos/chat-prompt.dto';

@Injectable()
export class GeminiService {
  private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  async basicPrompt(basicPromptDto: BasicPromptDto) {
    return basicPromptUseCase(this.ai, basicPromptDto);
  }

  async basicPromptStream(basicPromptDto: BasicPromptDto) {
    return basicPromptStreamUseCase(this.ai, basicPromptDto);
  }

  async chatStream(chatPromptDto: ChatPromptDto) {
    return chatPromptStreamUseCase(this.ai, chatPromptDto);
  }
}
