export const getApiKey = (): string => {
  return String(import.meta.env.VITE_API_KEY || '');
};