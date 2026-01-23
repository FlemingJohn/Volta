import { ParseResult } from './types';

export const tryParse = (str: string, stage: string): ParseResult => {
    try {
        const data = JSON.parse(str);
        return { success: true, data, stage };
    } catch (error) {
        return {
            success: false,
            error: error as Error,
            stage,
            content: str
        };
    }
};

export const stripMarkdown = (text: string): string => {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    return match ? match[1] : text;
};
