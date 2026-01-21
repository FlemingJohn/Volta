// AI Gateway Configuration - Dynamic environment variable loading
export const getOllamaModel = () => (process.env.OLLAMA_MODEL || 'gemma3:1b').trim();
export const getGeminiModel = () => (process.env.GEMINI_MODEL || 'gemini-1.5-flash').trim().replace('googleai/', '');
export const getUseFallback = () => (process.env.USE_GEMINI_FALLBACK || 'true').trim().toLowerCase() === 'true';
export const getOllamaUrl = () => (process.env.OLLAMA_API_URL || 'http://localhost:11434').trim();
export const getGeminiApiKey = () => (process.env.GEMINI_API_KEY || '').trim();
