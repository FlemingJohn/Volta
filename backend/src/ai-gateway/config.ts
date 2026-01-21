export const OLLAMA_MODEL = (process.env.OLLAMA_MODEL || 'gemma3:1b').trim();
export const GEMINI_MODEL = (process.env.GEMINI_MODEL || 'gemini-1.5-flash').trim().replace('googleai/', '');
export const USE_FALLBACK = (process.env.USE_GEMINI_FALLBACK || 'true').trim().toLowerCase() === 'true';
export const OLLAMA_URL = (process.env.OLLAMA_API_URL || 'http://localhost:11434').trim();
export const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || '').trim();
