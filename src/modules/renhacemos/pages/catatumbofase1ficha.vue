<template>
  <formularioslista
    :formid="18"
    title='Lista de Fichas de Acuerdo Individual :: Catatumbo Fase 1|2'
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