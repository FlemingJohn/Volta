import { ParseResult } from '../types';
import { tryParse } from '../parsers';

export const sanitize = (input: string): ParseResult => {
    const sanitized = input
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]+/g, ' ')
        .replace(/\\([^"\\/bfnrtu])/g, '\\\\$1')
        .replace(/\}\s*\{/g, '},{')
        .replace(/\]\s*\[/g, '],[')
        .replace(/\}\s*\[/g, '},{')
        .replace(/\]\s*\{/g, '],{');

    return tryParse(sanitized, 'sanitized');
};
