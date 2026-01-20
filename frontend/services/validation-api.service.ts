import axios from 'axios';
import { ValidationRequest, ValidationResponse } from '../types/validation.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const validationApi = {
    async validateDesign(request: ValidationRequest): Promise<ValidationResponse> {
        const response = await axios.post<ValidationResponse>(
            `${API_BASE_URL}/design/validate`,
            request,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 60000,
            }
        );
        return response.data;
    },
};
