<template>
  <div class="validate-container">
    <SurveyComponent :model="survey" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import 'survey-core/defaultV2.min.css';
  import { Model } from "survey-core";
  import { FlatLight } from "survey-core/themes";
  import { SurveyComponent } from "survey-vue3-ui";
  import useCrud from "@/composables/useCrud";
  import useToast from "@/composables/useToast";
  import { useLoading } from "vue-loading-overlay";
  import axios from "axios";
  const uLoading = useLoading();

  const uCrud = useCrud("/api/1.0/core/validationregister");
  const uToast = useToast();

  const props = defineProps({
    identificationnumber: {
      type: String,
      default: "",
    },
    validationitem: {
      type: Number,
      default: 0,
    },
    fomularioid: {
      type: Number,
      default: 0,
    },
  });

  const emit = defineEmits([
    "onClickSave",
  ]);



  onMounted(async () => {

  });

  const json = {
    "title": "Formulario de validación",
    "description": "\n",
    "logoPosition": "right",
    "widthMode": "responsive",
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "radiogroup",
            "name": "status",
            "title": "Cumple con el requerimiento",
            "isRequired": true,
            "choices": [
              {
                "value": "si",
                "text": "Si"
              },
              {
                "value": "no",
                "text": "No"
              },
              {
                "value": "na",
                "text": "No aplica"
              }
            ]
          },
          {
            "type": "comment",
            "name": "observation",
            "title": "Observaciones",
            "isRequired": true
          },
          {
            "type": "file",
            "name": "attachment",
            "title": "Archivo de Evidanecia"
          }
        ]
      }
    ]
  }

  const survey = new Model(json);
  survey.applyTheme(FlatLight);
  survey.onCompleting.add((sender, options) => {
      options.allowComplete = false;

      const senderData = {
        ...sender.data,
        document_number: props.identificationnumber,
        SurveyForms: props.fomularioid,
        validationitems: props.validationitem,
        attachment: Array.isArray(sender.data.attachment) && sender.data.attachment.length > 0 ? sender.data.attachment[0].content : "",
      };

      uCrud.create(senderData)
        .then((item) => {
          uToast.toastSuccess("Su validación ha sido guardada correctamente.");
          sender.clear(true);
          emit("onClickSave");
        })
        .catch((error) => {
          uToast.toastError("Ocurrió un error al guardar su validacion. Por favor, inténtelo de nuevo.");
        });

      return false;
  });
</script>

<style lang="scss">
.validate-container {
  .sd-root-modern.sd-root-modern--full-container {
    overflow: hidden;
    margin-bottom: -135px;
    .sd-body.sd-body--responsive {
      padding: 0px;
      padding-top: 15px;
    }
  }
}
.validate-form {
  .v-card-text {
    .v-btn {
      height: 56px;
      margin-top: 20px;
    }
  }
}
</style>