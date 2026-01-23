import { ParseResult } from '../types';
import { tryParse } from '../parsers';

export const rawParse = (input: string): ParseResult =>
    tryParse(input.trim(), 'raw');
