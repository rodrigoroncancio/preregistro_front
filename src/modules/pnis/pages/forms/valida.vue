<template>
  <div class="validate-container">
    <SurveyComponent :model="survey" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";
import { FlatLight } from "survey-core/themes";
import { SurveyComponent } from "survey-vue3-ui";
import useCrud from "@/composables/useCrud";
import useToast from "@/composables/useToast";
import { useLoading } from "vue-loading-overlay";

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
  surveyData: {
    type: Object,
    default: () => ({}),
  },
  isReadOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["onClickSave", "onSurveyComplete"]);

// 📌 Definir estructura JSON del formulario
const json = {
  title: "Formulario de validación",
  description: "",
  logoPosition: "right",
  widthMode: "responsive",
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "radiogroup",
          name: "status",
          title: "Cumple con el requerimiento",
          isRequired: true,
          choices: [
            { value: "si", text: "Sí" },
            { value: "no", text: "No" },
            { value: "na", text: "No aplica" },
          ],
        },
        {
          type: "comment",
          name: "observation",
          title: "Observaciones",
          isRequired: true,
        },
        {
          type: "file",
          name: "attachment",
          title: "Archivo de Evidencia",
        },
      ],
    },
  ],
};

// 📌 Inicializar el modelo de SurveyJS
const survey = new Model(json);
survey.applyTheme(FlatLight);

// 📌 Actualizar el formulario cuando cambia surveyData
watch(
  () => props.surveyData,
  (newData) => {
    if (newData) {
      survey.data = newData; // Rellenar el formulario con los datos proporcionados
    }
  },
  { deep: true, immediate: true }
);

// 📌 Aplicar la opción de solo lectura cuando cambia isReadOnly
watch(
  () => props.isReadOnly,
  (newValue) => {
    survey.mode = newValue ? "display" : "edit";
  },
  { immediate: true }
);

// 📌 Manejar el guardado de datos
survey.onCompleting.add((sender, options) => {
  options.allowComplete = false; // Evitar que cierre el formulario automáticamente

  const senderData = {
    ...sender.data,
    document_number: props.identificationnumber,
    SurveyForms: props.fomularioid,
    validationitems: props.validationitem,
    attachment: Array.isArray(sender.data.attachment) && sender.data.attachment.length > 0 ? sender.data.attachment[0].content : "",
  };

  uCrud
    .create(senderData)
    .then(() => {
      uToast.toastSuccess("Su validación ha sido guardada correctamente.");
      sender.clear(true);
      emit("onClickSave"); // Emitir evento de guardado
      emit("onSurveyComplete", senderData); // Emitir los datos finales
    })
    .catch(() => {
      uToast.toastError("Ocurrió un error al guardar la validación. Intente de nuevo.");
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
</style>
