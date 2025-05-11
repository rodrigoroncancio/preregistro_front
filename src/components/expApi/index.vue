<script setup lang="ts">
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

// Creamos la API
const api = axios.create()

// Creamos el método
const customGet = (url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  console.log("llama la llama 2")
  return api.get(url, {
    ...config,
    headers: {
      ...config.headers,
      'Authorization': 'Api-Key gAAAAABoDAoAK62G2X52O3HtVq6b40VgHydW_eKBzaouhXV4GrdTwlu8XX',
    },
  })
}

// Esto define qué métodos puedes usar desde fuera
defineExpose({
  customGet
})
</script>

<template>
  <div>
    <!-- Puedes dejarlo vacío si solo es para API -->
  </div>
</template>
