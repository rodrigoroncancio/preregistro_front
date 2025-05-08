<template>
  <exp-survey-js
    :json="json"
    @onCompleting="onCompleting"
    @onValueChanged="onValueChanged"
    v-if="isLoaded"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  import useCrud from '@/composables/useCrud';
  import expSurveyJs from '@/components/expSurveyJs';

  const route = useRoute();

  const convocatoria = route.params.convocatoria;
  const fase = route.params.fase;

  const uCrud = useCrud("api/2.0/inscripciones");
  const isLoaded = ref(false);
  const json = ref({});

  onMounted(async () => {
    const data = await uCrud.custom(`estructura/${convocatoria}/${fase}`, "GET")
    json.value = data;
    isLoaded.value = true;
  });

  const onValueChanged = (sender: any, options: any) => {
    console.log('onValueChanged');
    console.log(sender);
    console.log(options);
  }

  const onCompleting = (sender: any, options: any) => {
    console.log('onCompleting');
    console.log(sender);
    console.log(options);
  }
</script>