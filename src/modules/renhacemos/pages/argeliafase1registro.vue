<template>
  <formularioslista
    :formid="1"
    title='Lista de Registros Individual de personas :: Argelia Fase 1'
  >

  </formularioslista>

</template>

<script setup lang="ts">

  import formularioslista from '@/modules/renhacemos/pages/formularioslistas.vue';
  import { useRoute } from 'vue-router';
  const route = useRoute();

  const rawId = route.params.id;
  const tipo = Array.isArray(rawId) ? parseInt(rawId[0], 10) : parseInt(rawId, 10);

</script>