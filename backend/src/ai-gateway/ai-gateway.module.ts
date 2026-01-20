import { Module } from '@nestjs/common';
import { AIGatewayService } from './ai-gateway.service';
import { OllamaClientService } from './ollama-client.service';
import { PromptBuilderService } from './prompt-builder.service';

@Module({
    providers: [AIGatewayService],
    exports: [AIGatewayService],
})
export class AIGatewayModule { }
