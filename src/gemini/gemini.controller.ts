import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

/* Services */
import { GeminiService } from './gemini.service';

/* Dtos */
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { ChatPromptDto } from './dtos/chat-prompt.dto';
import { type GenerateContentResponse } from '@google/genai';
import { ImageGenerationDto } from './dtos/image-generation.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  async outputStreamResponse(
    res: Response,
    stream: AsyncGenerator<GenerateContentResponse, any, any>,
  ) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(HttpStatus.OK);

    let resultText = '';

    for await (const chunk of stream) {
      const piece = chunk.text;
      resultText += piece;
      res.write(piece);
    }

    res.end();
    return resultText;
  }

  @Post('/basic-prompt')
  async basicPrompt(@Body() body: BasicPromptDto) {
    return this.geminiService.basicPrompt(body);
  }

  @Post('/basic-prompt-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async basicPromptStream(
    @Body() body: BasicPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    body.files = files;

    const stream = await this.geminiService.basicPromptStream(body);

    await this.outputStreamResponse(res, stream);
  }

  @Post('/chat-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async chatStream(
    @Body() chatPromptDto: ChatPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    chatPromptDto.files = files;

    const stream = await this.geminiService.chatStream(chatPromptDto);

    const data = await this.outputStreamResponse(res, stream);

    const geminiMessage = { role: 'model', parts: [{ text: data }] };
    const userMessage = {
      role: 'user',
      parts: [{ text: chatPromptDto.prompt }],
    };

    this.geminiService.saveMessage(chatPromptDto.chatId, userMessage);
    this.geminiService.saveMessage(chatPromptDto.chatId, geminiMessage);
  }

  @Get('chat-history/:chatId')
  getChatHistory(@Param('chatId') chatId: string) {
    return this.geminiService.getChatHistory(chatId).map((message) => ({
      role: message.role,
      parts: message.parts?.map((part) => part.text).join(''),
    }));
  }

  @Post('/image/generation')
  @UseInterceptors(FilesInterceptor('files'))
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    imageGenerationDto.files = files;

    const { imageUrl, text } =
      await this.geminiService.imageGeneration(imageGenerationDto);

    return { imageUrl, text };
  }
}
