import { ParseResult } from '../types';
import { tryParse } from '../parsers';

export const stringUnwrap = (input: string): ParseResult | null => {
    const match = input.match(/^["'](.*)["']$/s);
    if (!match) return null;

    try {
        const unwrapped = JSON.parse(`"${match[1]}"`);
        return tryParse(unwrapped, 'string-unwrapped');
    } catch {
        return null;
    }
};
