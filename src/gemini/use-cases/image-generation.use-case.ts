import { GoogleGenAI } from '@google/genai';

/* Dtos */
import { ImageGenerationDto } from '../dtos/image-generation.dto';

/* Helpers */
import { geminiUploadFiles } from '../helpers/gemini-upload-file';

interface Options {
  model?: string;
}

export interface imageGenerationResponse {
  imageUrl: string;
  text: string;
}

export const imageGenerationUseCase = async (
  ai: GoogleGenAI,
  imageGenerationDto: ImageGenerationDto,
  options?: Options,
): Promise<imageGenerationResponse> => {
  const { prompt, files = [] } = imageGenerationDto; // []

  // todo: refactor
  const uploadedFiles = await geminiUploadFiles(ai, files);

  const { model = 'gemini-2.5-flash' } = options ?? {};

  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: 'Responde únicamente en español, en formato markdown',
    },
  });

  return { imageUrl: 'xyz', text: 'ABC' };
};
