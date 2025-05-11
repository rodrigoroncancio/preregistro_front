// expApi.ts
import axios from 'axios'

const api = axios.create()

// Crear el método customGet como una función fuera del componente
export const customGet = (url: string, config: any = {}) => {
  console.log("llama la llama 3")
  return api.get(url, {
    ...config,
    headers: {
      ...config.headers,
      'Authorization': 'Api-Key gAAAAABoDAoAK62G2X52O3HtVq6b40VgHydW_eKBzaouhXV4GrdTwlu8XX',
    },
  })
}
