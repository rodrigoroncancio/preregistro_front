const useConst = () => {
    return {
        baseApi: import.meta.env.VITE_BASE_API,
        baseMedia: import.meta.env.VITE_BASE_MEDIA,
        saltCrypt: import.meta.env.VITE_SALT_CRYPT,
        apiKey: import.meta.env.VITE_API_KEY || '',
    }
}
export default useConst