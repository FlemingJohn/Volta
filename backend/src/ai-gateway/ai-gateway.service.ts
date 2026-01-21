import { Injectable } from '@nestjs/common';
import { extractFieldsFlow, validateDesignFlow, validateFreeTextFlow } from './flows';

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
}
