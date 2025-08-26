import { GoogleGenAI } from '@google/genai';

/* Dtos */
import { BasicPromptDto } from '../dtos/basic-prompt.dto';

interface Options {
  model?: string;
}

export const basicPromptStreamUseCase = async (
  ai: GoogleGenAI,
  basicPromptDto: BasicPromptDto,
  options?: Options,
) => {
  const { model = 'gemini-2.5-flash' } = options ?? {};

  const response = await ai.models.generateContentStream({
    model: model,
    contents: basicPromptDto.prompt,
    config: {
      systemInstruction: `Responde únicamente en español, en formato markdown`,
    },
  });

  return response;
};
