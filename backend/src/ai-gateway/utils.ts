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

    const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    let target = markdownMatch ? markdownMatch[1] : text;

    const tryParse = (str: string, label: string) => {
        try {
            return JSON.parse(str);
        } catch (e: any) {
            return { error: e, label, content: str };
        }
    };

    let result = tryParse(target.trim(), "raw");
    if (!(result && result.error)) return result;

    const start = target.indexOf('{');
    const end = target.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
        const jsonStr = target.substring(start, end + 1);
        result = tryParse(jsonStr, "bounded");
        if (!(result && result.error)) return result;

        const sanitized = jsonStr
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]+/g, ' ')
            .replace(/\\([^"\\\/bfnrtu])/g, '\\\\$1')
            .replace(/\}\s*\{/g, '},{')
            .replace(/\]\s*\[/g, '],[')
            .replace(/\}\s*\[/g, '},[')
            .replace(/\]\s*\{/g, '],{');

        result = tryParse(sanitized, "sanitized");
        if (!(result && result.error)) return result;

        const surgical = sanitized.replace(/\n(?!\s*["\}])/g, '\\n').replace(/\r(?!\s*["\}])/g, '\\r');

        result = tryParse(surgical, "surgical-repair");
        if (!(result && result.error)) return result;

        const aggressive = surgical
            .replace(/\r/g, '') // Strip carriage returns entirely for aggressive pass
            .replace(/\n(?!\s*["\}])/g, '\\n') // Escape newlines that are NOT structural whitespace
            .replace(/\\n\s*\\n/g, '\\n') // Deduplicate escapes
            .replace(/^\{\n+/, '{') // Clean leading structural space
            .replace(/\n+\}$/, '}'); // Clean trailing structural space

        result = tryParse(aggressive, "refined-aggressive");
        if (!(result && result.error)) return result;
    }

    const lastError = result.error;
    const lastLabel = result.label;
    const lastContent = result.content;

    console.error(`JSON Extraction failed at stage: ${lastLabel}. Error: ${lastError.message}`);

    const match = lastError.message.match(/at position (\d+)/);
    if (match) {
        const pos = parseInt(match[1], 10);
        console.error(`Context around failure: ${lastContent.substring(Math.max(0, pos - 40), Math.min(lastContent.length, pos + 40))}`);
    }

    throw new Error(`AI returned invalid JSON format (failed at ${lastLabel}): ${lastError.message}`);
}
