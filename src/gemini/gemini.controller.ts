import { Response } from 'express';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';

/* Services */
import { GeminiService } from './gemini.service';

/* Dtos */
import { BasicPromptDto } from './dtos/basic-prompt.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('/basic-prompt')
  async basicPrompt(@Body() body: BasicPromptDto) {
    return this.geminiService.basicPrompt(body);
  }

  @Post('/basic-prompt-stream')
  async basicPromptStream(
    @Body() body: BasicPromptDto,
    @Res() res: Response,
    // todo: files
  ) {
    const stream = await this.geminiService.basicPromptStream(body);

    res.setHeader('Content-Type', 'text/plain');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.text;
      res.write(piece);
    }

    res.end();
  }
}
