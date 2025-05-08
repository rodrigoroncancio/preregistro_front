<template>
  <SurveyComponent :model="survey" />
</template>

<script setup lang="ts">
  import { computed } from 'vue';

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