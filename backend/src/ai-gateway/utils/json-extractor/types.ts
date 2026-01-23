export type ParseSuccess = {
    success: true;
    data: unknown;
    stage: string;
};

export type ParseFailure = {
    success: false;
    error: Error;
    stage: string;
    content: string;
};

export type ParseResult = ParseSuccess | ParseFailure;

export type ExtractionStage = (input: string) => ParseResult;
