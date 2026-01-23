import { ParseResult } from '../types';
import { tryParse } from '../parsers';

export const boundedExtraction = (input: string): ParseResult | null => {
    const start = input.indexOf('{');
    const end = input.lastIndexOf('}');

    if (start === -1 || end === -1) return null;

    const jsonStr = input.substring(start, end + 1);
    return tryParse(jsonStr, 'bounded');
};
