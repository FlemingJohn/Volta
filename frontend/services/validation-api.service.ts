import axios, { AxiosError } from 'axios';
import { ValidationRequest, ValidationResponse } from '../types/validation.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const validationApi = {
    async validateDesign(request: ValidationRequest): Promise<ValidationResponse> {
        try {
            const response = await axios.post<ValidationResponse>(
                `${API_BASE_URL}/design/validate`,
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 300000,
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message: string }>;

                // Handle timeout
                if (axiosError.code === 'ECONNABORTED') {
                    throw new Error(
                        'Validation timeout. The AI model is taking too long to respond. ' +
                        'This may be due to system resource constraints. Please try again.'
                    );
                }

                // Handle network errors
                if (axiosError.code === 'ERR_NETWORK' || axiosError.code === 'ECONNREFUSED') {
                    throw new Error(
                        'Cannot connect to validation server. Please ensure the backend is running on port 3001.'
                    );
                }

                // Handle server errors with custom messages
                if (axiosError.response?.status === 500) {
                    const serverMessage = axiosError.response.data?.message || '';

                    // Memory errors
                    if (serverMessage.includes('out of memory') || serverMessage.includes('memory layout')) {
                        throw new Error(
                            '⚠️ AI Model Out of Memory\n\n' +
                            'The system does not have enough RAM to process this validation. ' +
                            'This is a known limitation with the current setup (2.4GB available).\n\n' +
                            'Solutions:\n' +
                            '• Close other applications to free up memory\n' +
                            '• Restart Ollama service\n' +
                            '• Contact support for hardware upgrade options'
                        );
                    }

                    // Schema validation errors
                    if (serverMessage.includes('invalid response format') || serverMessage.includes('Schema validation')) {
                        throw new Error(
                            '⚠️ AI Response Format Error\n\n' +
                            'The AI model returned an unexpected response format. ' +
                            'This may be due to model limitations.\n\n' +
                            'Please try again. If the issue persists, the model may need to be upgraded.'
                        );
                    }

                    // Model not found
                    if (serverMessage.includes('model not available') || serverMessage.includes('not found')) {
                        throw new Error(
                            '⚠️ AI Model Not Available\n\n' +
                            'The required AI model (Gemma 3:1B) is not loaded.\n\n' +
                            'Please ensure Ollama is running with: ollama run gemma3:1b'
                        );
                    }

                    // Generic server error
                    throw new Error(
                        `Validation Error: ${serverMessage || 'Internal server error occurred'}`
                    );
                }

                // Handle other HTTP errors
                if (axiosError.response) {
                    throw new Error(
                        `Server Error (${axiosError.response.status}): ${axiosError.response.data?.message || 'Unknown error'}`
                    );
                }
            }

            // Unknown error
            throw new Error(
                `Validation failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
            );
        }
    },
};
