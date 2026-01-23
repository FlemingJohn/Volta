import { ParseResult } from '../types';
import { tryParse } from '../parsers';

export const surgicalRepair = (input: string): ParseResult => {
    const repaired = input
        .replace(/\n(?!\s*["\}])/g, '\\n')
        .replace(/\r(?!\s*["\}])/g, '\\r');

    return tryParse(repaired, 'surgical-repair');
};
