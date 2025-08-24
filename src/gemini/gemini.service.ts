import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  basicPrompt() {
    return { hola: 'Hola desde el servicio' };
  }
}
