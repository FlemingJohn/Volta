import { Injectable } from '@nestjs/common';
import { extractFieldsFlow, validateDesignFlow, validateFreeTextFlow, validateMultiCoreFlow } from './flows';

@Injectable()
export class AIGatewayService {
    async validateDesign(designData: any): Promise<any> {
        return validateDesignFlow(designData);
    }

    async extractFields(freeText: string): Promise<any> {
        return extractFieldsFlow(freeText);
    }

    async validateFreeText(freeText: string): Promise<any> {
        return validateFreeTextFlow(freeText);
    }

    async validateMultiCore(multiCoreText: string): Promise<any> {
        return validateMultiCoreFlow(multiCoreText);
    }
}
