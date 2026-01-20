import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OllamaClientService {
    private readonly ollamaApiUrl: string;
    private readonly ollamaModel: string;

    constructor(private readonly configService: ConfigService) {
        this.ollamaApiUrl = this.configService.get<string>('OLLAMA_API_URL') || 'http://localhost:11434';
        this.ollamaModel = this.configService.get<string>('OLLAMA_MODEL') || 'gemma';
    }

    async generateCompletion(
        userPrompt: string,
        systemPrompt?: string,
    ): Promise<string> {
        try {
            const requestPayload = {
                model: this.ollamaModel,
                prompt: userPrompt,
                system: systemPrompt,
                stream: false,
            };

            const response = await axios.post(
                `${this.ollamaApiUrl}/api/generate`,
                requestPayload,
                {
                    timeout: 60000,
                },
            );

            return response.data.response;
        } catch (error) {
            throw new HttpException(
                `Ollama API error: ${error.message}`,
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async healthCheck(): Promise<boolean> {
        try {
            await axios.get(`${this.ollamaApiUrl}/api/tags`, { timeout: 5000 });
            return true;
        } catch (error) {
            return false;
        }
    }
}
