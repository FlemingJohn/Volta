import { ParseResult } from '../types';
import { tryParse } from '../parsers';

export const preEscape = (input: string): ParseResult => {
    try {
        const escaped = input.replace(/"([^"]*?)"/g, (match, content) => {
            const clean = content
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/\t/g, '\\t');
            return `"${clean}"`;
        });
        return tryParse(escaped, 'pre-escaped');
    } catch {
        return tryParse(input, 'pre-escaped');
    }
};
