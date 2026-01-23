import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiApiKey } from '../config';

let genAI: GoogleGenerativeAI | null = null;

export const getGenAI = (): GoogleGenerativeAI => {
    if (genAI) return genAI;

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in environment');
    }

    genAI = new GoogleGenerativeAI(apiKey);
    return genAI;
};
