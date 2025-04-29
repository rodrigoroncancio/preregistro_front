<template>
  <v-dialog v-model="dialog" max-width="500px" scrollable persistent>
    <v-card>
      <v-card-title class="headline text-center">
        Buscar Usuario
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="buscarUsuario" ref="formRef">
          <v-select
              v-model="tipoDocumento"
              :items="tiposDocumento"
              item-title="text"
              item-value="value"
              label="Tipo de Documento"
              outlined
              dense
              required
          />
          <v-text-field
              v-model="numeroDocumento"
              label="Número de Documento"
              placeholder="123456789"
              outlined
              dense
              required
              class="mt-4"
          />
          <v-alert v-if="error" type="error" dense class="mt-4">
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn type="submit" color="primary" @click="buscarUsuario">
          <v-icon left>mdi-magnify</v-icon> Buscar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

//Helpers
import { getApiKey } from '@/helpers/apiKey';
import cleanAxios from '@/helpers/cleanAxios';

const router = useRouter();
const dialog = ref(false);
const tipoDocumento = ref('12');// Guarda lo que el usuario elige
const numeroDocumento = ref('');// Guarda el número que escribe
const error = ref('');// Para mostrar errores
const formRef = ref(null);// No lo estás usando ahora, pero sirve para resetear formulario si quieres

const tiposDocumento = [
  { text: "Cédula de Ciudadanía", value: "12" },
];

onMounted(() => {
  dialog.value = true; // Apenas carga, abre la modal automáticamente
});

// Función de búsqueda
const buscarUsuario = async () => {
  error.value = '';

  if (!tipoDocumento.value || !numeroDocumento.value) {
    error.value = 'Debe ingresar tipo y número de documento.';
    return;
  }

  const headers = {
    'Authorization': `Api-Key ${getApiKey()}`,
  }
  // const base_url1 = 'http://localhost:8002'
  const base_url1 = ''
  try {
    const {data, status} = await cleanAxios.get(`${base_url1}/api/2.0/inscripciones/ficha/catatumbo/validar_documento/`, {
      params: {
        documento: numeroDocumento.value,
        formulario: 19,
      },
      headers: headers,
    });

    const user = data.data;

    if (status === 200 && Object.keys(user).length > 0) {
      router.push({name: 'preregistro-call-center', params: {id: user?.id}});
    }

    if (status === 200 && Object.keys(user).length === 0) {
      error.value = 'Usuario no encontrado.';
    }
  } catch (err) {
    if (err.response && err.status === 404) {
      error.value = 'Usuario no encontrado.';
    } else {
      error.value = 'Error buscando el usuario.';
    }
  }
};
</script>

<style scoped lang="scss">
.v-card-title {
  font-family: 'Nunito', sans-serif;
  font-weight: bold;
  font-size: 22px;
}
.v-btn {
  text-transform: none;
  font-weight: bold;
}
</style>
