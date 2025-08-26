import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';

/* Dtos */
import { BasicPromptDto } from './dtos/basic-prompt.dto';

/* Use Cases */
import { basicPromptStreamUseCase, basicPromptUseCase } from './use-cases';

@Injectable()
export class GeminiService {
  private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  async basicPrompt(basicPromptDto: BasicPromptDto) {
    return basicPromptUseCase(this.ai, basicPromptDto);
  }

  async basicPromptStream(basicPromptDto: BasicPromptDto) {
    return basicPromptStreamUseCase(this.ai, basicPromptDto);
  }
}
