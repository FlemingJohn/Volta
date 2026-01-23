import { ParseResult } from '../types';
import { tryParse } from '../parsers';

export const aggressiveCleanup = (input: string): ParseResult => {
    const cleaned = input
        .replace(/\r/g, '')
        .replace(/\n(?!\s*["\}])/g, '\\n')
        .replace(/\\n\s*\\n/g, '\\n')
        .replace(/^\{\n+/, '{')
        .replace(/\n+\}$/, '}');

    return tryParse(cleaned, 'refined-aggressive');
};
