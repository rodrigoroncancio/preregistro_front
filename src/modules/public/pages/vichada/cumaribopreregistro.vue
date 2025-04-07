<template>
  <expPreregistroForm
    form_title='Ficha de preinscripción para el Establecimiento y/o fortalecimiento de actividades económicas para el tránsito a economías lícitas en el marco de procesos de sustitución de cultivos de uso ilícito en el municipio de Cumaribo'
    :polygon="['-71.0913237|2.8979838','-70.6189116|2.7114401','-70.2783355|2.8870115','-70.0915679|3.2819456','-69.7180327|3.4683891','-69.3444976|3.6328676','-68.7951812|3.6876872','-68.3007964|3.9288526','-67.9821929|3.917892','-67.5647124|3.8411639','-67.718521|4.2356889','-67.7954253|5.2539024','-67.5427398|5.483603','-67.5756987|5.6913514','-67.3449859|5.9208805','-67.4109038|6.1721601','-67.4218901|6.3141353','-69.0368804|6.259534','-69.6411284|5.9318081','-70.3772124|5.5382808','-71.1132964|4.9475038','-71.0913237|2.8979838']"
    :formid="11"
    :departamentos="[
      {
        'value': 38,
        'text': 'Valle del cauca'
      }
    ]"
    :municipios="[
      {
        'value': 308,
        'text': 'CUMARIBO'
      }
    ]"
  >

  </expPreregistroForm>
</template>

<script setup lang="ts">

  import expPreregistroForm from '@/components/expPreregistroForm/expPreregistroForm.vue';

</script>