<template>
  <v-main>
      <v-container class="flex-grow-1">
        <v-row>
          <v-col class="text-center mt-6">
            <v-img :src="'/src/assets/img/header-colombia.png'" :width="360" class="mx-auto" />
          </v-col>
        </v-row>
        <div class="main-container">
          <SurveyComponent :model="survey" />
        </div>
      </v-container>
  </v-main>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import 'survey-core/defaultV2.min.css';
  import "survey-core/survey.i18n.js";
  import { Model } from "survey-core";
  import { SurveyComponent } from "survey-vue3-ui";

  const emit = defineEmits(['onCompleting', 'onValueChanged']);

  const props = defineProps({
    json: {
      type: Object,
      required: true
    }
  });

  const json = computed(() => {
    let _json = props.json;
    _json.locale = 'es';
    return _json || {};
  });

  const survey = new Model(json.value);

  survey.onCompleting.add((sender, options) => {
    emit('onCompleting', sender, options);
  });

  survey.onValueChanged.add(async (sender, options) => {
    emit('onValueChanged', sender, options);
  });
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