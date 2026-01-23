export const delay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

export const retry = async <T>(
    fn: () => Promise<T>,
    attempts: number,
    delayMs: number
): Promise<T> => {
    try {
        return await fn();
    } catch (error) {
        if (attempts <= 1) throw error;
        await delay(delayMs);
        return retry(fn, attempts - 1, delayMs);
    }
};
