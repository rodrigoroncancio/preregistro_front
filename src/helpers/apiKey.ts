export const getApiKey = (): string => {
    return import.meta.env.VITE_API_KEY || '';
};
