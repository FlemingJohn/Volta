import { ParseFailure } from './types';

const SEPARATOR = '-'.repeat(50);

export const reportExtractionFailure = (failure: ParseFailure): void => {
    console.error(SEPARATOR);
    console.error('JSON EXTRACTION FAILURE');
    console.error(SEPARATOR);
    console.error(`Stage: ${failure.stage}`);
    console.error(`Error: ${failure.error.message}`);
    console.error(SEPARATOR);

    logContext(failure);

    console.error(SEPARATOR);
};

const logContext = (failure: ParseFailure): void => {
    const positionMatch = failure.error.message.match(/at position (\d+)/);

    if (positionMatch) {
        logPositionContext(failure.content, parseInt(positionMatch[1], 10));
    } else {
        logContentPreview(failure.content);
    }
};

const logPositionContext = (content: string, position: number): void => {
    const contextStart = Math.max(0, position - 60);
    const contextEnd = Math.min(content.length, position + 60);
    const context = content.substring(contextStart, contextEnd);
    const pointer = ' '.repeat(Math.min(60, position - contextStart)) + '^';

    console.error('Context (+/-60 chars):');
    console.error(context);
    console.error(pointer);
};

const logContentPreview = (content: string): void => {
    console.error('First 200 chars of failed content:');
    console.error(content.substring(0, 200));
};
