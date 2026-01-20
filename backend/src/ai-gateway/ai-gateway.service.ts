import { Injectable } from '@nestjs/common';
import { OllamaClientService } from './ollama-client.service';
import { PromptBuilderService } from './prompt-builder.service';

@Injectable()
export class AIGatewayService {
    constructor(
        private readonly ollamaClient: OllamaClientService,
        private readonly promptBuilder: PromptBuilderService,
    ) { }

    async validateDesign(designData: any): Promise<any> {
        const systemPrompt = this.promptBuilder.buildSystemPrompt();
        const validationPrompt = this.promptBuilder.buildValidationPrompt(designData);

        const aiResponse = await this.ollamaClient.generateCompletion(
            validationPrompt,
            systemPrompt,
        );

        try {
            const cleanResponse = aiResponse.replace(/```json\n?|```/g, '').trim();
            return JSON.parse(cleanResponse);
        } catch (error) {
            throw new Error(`Failed to parse AI response: ${error.message}. Response was: ${aiResponse}`);
        }
    }

    async extractFields(freeText: string): Promise<any> {
        const extractionPrompt = this.promptBuilder.buildExtractionPrompt(freeText);

        const aiResponse = await this.ollamaClient.generateCompletion(extractionPrompt);

        try {
            const cleanResponse = aiResponse.replace(/```json\n?|```/g, '').trim();
            return JSON.parse(cleanResponse);
        } catch (error) {
            throw new Error(`Failed to parse AI extraction response: ${error.message}. Response was: ${aiResponse}`);
        }
    }
}
