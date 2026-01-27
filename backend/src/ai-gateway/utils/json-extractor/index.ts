import { stripMarkdown } from './parsers';
import { reportExtractionFailure } from './error-reporter';
import {
    rawParse,
    stringUnwrap,
    boundedExtraction,
    sanitize,
    surgicalRepair,
    preEscape,
    aggressiveCleanup
} from './stages';

export const extractJson = (text: string): any => {
    if (!text) {
        throw new Error('AI returned empty response');
    }

    const target = stripMarkdown(text);

    const rawResult = rawParse(target);
    if (rawResult.success) return rawResult.data;

    const unwrapped = stringUnwrap(target);
    if (unwrapped?.success) return unwrapped.data;

    const boundedResult = boundedExtraction(target);
    if (!boundedResult) {
        reportExtractionFailure(rawResult);
        throw new Error(`AI returned invalid JSON format (failed at ${rawResult.stage}): ${rawResult.error.message}`);
    }

    if (boundedResult.success) return boundedResult.data;

    const content = boundedResult.content;
    const stages = [
        () => sanitize(content),
        () => surgicalRepair(content),
        () => preEscape(content),
        () => aggressiveCleanup(content)
    ];

    let lastResult = boundedResult;
    for (const stage of stages) {
        const result = stage();
        if (result.success) return result.data;
        lastResult = result;
    }

    reportExtractionFailure(lastResult);
    const error: any = new Error(`AI returned invalid JSON format (failed at ${lastResult.stage}): ${lastResult.error.message}`);
    error.stage = lastResult.stage;
    throw error;
};
