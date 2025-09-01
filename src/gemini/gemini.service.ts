import { Content, GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';

/* Dtos */
import { BasicPromptDto } from './dtos/basic-prompt.dto';

/* Use Cases */
import {
  basicPromptStreamUseCase,
  basicPromptUseCase,
  chatPromptStreamUseCase,
  imageGenerationUseCase,
} from './use-cases';
import { ChatPromptDto } from './dtos/chat-prompt.dto';
import { ImageGenerationDto } from './dtos/image-generation.dto';

@Injectable()
export class GeminiService {
  private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  private chatHistory = new Map<string, Content[]>();

  async basicPrompt(basicPromptDto: BasicPromptDto) {
    return basicPromptUseCase(this.ai, basicPromptDto);
  }

  async basicPromptStream(basicPromptDto: BasicPromptDto) {
    return basicPromptStreamUseCase(this.ai, basicPromptDto);
  }

  async chatStream(chatPromptDto: ChatPromptDto) {
    const chatHistory = this.getChatHistory(chatPromptDto.chatId);
    return chatPromptStreamUseCase(this.ai, chatPromptDto, {
      history: chatHistory,
    });
  }

  saveMessage(chatId: string, message: Content) {
    const messages = this.getChatHistory(chatId);

    messages.push(message);

    this.chatHistory.set(chatId, messages);
  }

  getChatHistory(chatId: string) {
    return structuredClone(this.chatHistory.get(chatId) ?? []);
  }

  imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return imageGenerationUseCase(this.ai, imageGenerationDto);
  }
}
