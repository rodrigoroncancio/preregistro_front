<template>
  <SurveyComponent :model="survey" />
</template>

<script setup lang="ts">
  import { computed, ref, defineExpose } from 'vue';
  import 'survey-core/defaultV2.min.css';
  import "survey-core/survey.i18n.js";
  import { Model } from "survey-core";
  import { SurveyComponent } from "survey-vue3-ui";

  const props = defineProps({
    json: {
      type: Object,
      required: true
    },
    onCurrentPageChanging: {
      type: Function,
      required: true
    },
    onCompleting: {
      type: Function,
      required: true
    },
    onValueChanged: {
      type: Function,
      required: true
    }
  });

  const survey = ref<Model>();

  // Inicialización del survey
  const initializeSurvey = () => {
    const _json = {
      ...props.json,
      locale: 'es'
    };

    survey.value = new Model(_json);

    survey.value.onValueChanged.add(async (sender, options) => {
      props.onValueChanged(sender, options);
    });

    survey.value.onCurrentPageChanging.add(function (sender, options) {
      props.onCurrentPageChanging(sender, options);
    });

    survey.value.onCompleting.add((sender, options) => {
      props.onCompleting(sender, options);
    });
  };

  // Inicializamos el survey
  initializeSurvey();

  // Función para establecer valores
  const setValue = (key: string, value: any) => {
    if (survey.value) {
      survey.value.setValue(key, value);
    } else {
      console.warn('Survey model no está inicializado');
    }
  };

  // Exponemos la función setValue al componente padre
  defineExpose({
    setValue
  });
/*
  const json = computed(() => {
    let _json = props.json;
    _json.locale = 'es';
    return _json || {};
  });

  const survey = new Model(json.value);

  survey.onValueChanged.add(async (sender, options) => {
    props.onValueChanged(sender, options);
  });

  survey.onCurrentPageChanging.add(function (sender, options) {
    props.onCurrentPageChanging(sender, options);
  });

  survey.onCompleting.add((sender, options) => {
    props.onCompleting(sender, options);
  });
  */
</script>

<style lang="scss">
:root {
  --sjs-header-backcolor: #071432 !important;

  .sd-btn {
    color: #071432 !important;
  }

  .sd-btn.sd-navigation__complete-btn {
    background-color: #071432 !important;
    color: #fff !important;
  }
}
</style>