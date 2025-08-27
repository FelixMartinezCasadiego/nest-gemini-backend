import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
} from '@google/genai';

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
  const { prompt, files = [] } = basicPromptDto; // []

  const images = await Promise.all(
    files.map(async (file) => {
      return ai.files.upload({
        file: new Blob([file.buffer as any], {
          type: file.mimetype.includes('image') ? file.mimetype : 'image/jpg',
        }),
      });
    }),
  );

  const { model = 'gemini-2.5-flash' } = options ?? {};

  const response = await ai.models.generateContentStream({
    model: model,
    // contents: basicPromptDto.prompt,
    contents: [
      createUserContent([
        prompt,
        // createPartFromUri(image.uri ?? '', image.mimeType ?? ''),
        ...images.map((image) =>
          createPartFromUri(image.uri ?? '', image.mimeType ?? ''),
        ),
      ]),
    ],
    config: {
      systemInstruction: `Responde únicamente en español, en formato markdown`,
    },
  });

  return response;
};
