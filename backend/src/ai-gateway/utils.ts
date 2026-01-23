import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiApiKey } from './config';

let genAI: GoogleGenerativeAI | null = null;

export const getGenAI = () => {
    if (genAI) return genAI;
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        console.error('CRITICAL: GEMINI_API_KEY is not defined in environment.');
    }
    genAI = new GoogleGenerativeAI(apiKey);
    return genAI;
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function extractJson(text: string): any {
    if (!text) throw new Error('AI returned empty response');
    const trimmed = text.trim();
    try {
        const start = trimmed.indexOf('{');
        const end = trimmed.lastIndexOf('}');
        if (start === -1 || end === -1) {
            console.error('No JSON markers found. Raw length:', trimmed.length);
            throw new Error('No JSON object found in response');
        }
        const jsonStr = trimmed.substring(start, end + 1);

        const sanitized = jsonStr
            .replace(/[\u0000-\u001F]+/g, (match) => {
                if (match === '\n' || match === '\r' || match === '\t') return match;
                return ' ';
            })

            .replace(/\\([^"\\\/bfnrtu])/g, '\\\\$1');

        return JSON.parse(sanitized);
    } catch (e: any) {
        console.error(`JSON Parse Failed (Length: ${trimmed.length}). Error: ${e.message}`);
        console.error('Raw content around failure:', trimmed.substring(Math.max(0, trimmed.length / 2 - 50), Math.min(trimmed.length, trimmed.length / 2 + 50)));
        throw new Error(`AI returned invalid JSON format: ${e.message}`);
    }
}
