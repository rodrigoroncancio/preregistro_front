<script setup lang="ts">
import { watch, defineProps, defineEmits } from "vue";
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

// 📌 Interfaz para surveyData
interface SurveyData extends Record<string, any> {}

// 📌 Interfaz para el JSON del formulario
interface SurveyJson extends Record<string, any> {}

const props = defineProps({
identificationnumber: { type: String, default: "0000000000" },
validationitem: { type: Number, default: 1 },
fomularioid: { type: Number, default: 1 },
isReadOnly: { type: Boolean, default: false },

// 📌 Datos iniciales del formulario
surveyData: {
  type: Object as () => SurveyData,
  default: (): SurveyData => ({
    status: "si",
    observation: "Sin observaciones.",
    attachment: [],
  }),
},

// 📌 JSON de la estructura del formulario con valor por defecto
surveyJson: {
  type: Object as () => SurveyJson,
  default: (): SurveyJson => ({
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
  }),
},
});

const emit = defineEmits(["onClickSave", "onSurveyComplete"]);

// 📌 Inicializar el modelo de SurveyJS con el JSON recibido
const survey = new Model(props.surveyJson);
survey.applyTheme(FlatLight);

// 📌 Cargar datos iniciales del formulario
survey.data = props.surveyData;

// 📌 Verificar cambios en `surveyData`
watch(
() => props.surveyData,
(newData) => {
  if (newData) {
    survey.data = newData;
  }
},
{ deep: true, immediate: true }
);

// 📌 Verificar cambios en `surveyJson` y actualizar el formulario
watch(
() => props.surveyJson,
(newJson) => {
  if (newJson) {
    survey.fromJSON(newJson);
  }
},
{ deep: true, immediate: true }
);

// 📌 Aplicar la opción de solo lectura
watch(
  () => props.isReadOnly,
  (newValue) => {
    survey.mode = newValue ? "display" : "edit";

    // 📌 Asegurar que los botones de navegación NO se oculten
    survey.showNavigationButtons = true;
    survey.showPrevButton = true;
    survey.showTitle = true; // Asegurar que el título no desaparezca

    // 📌 Si hay más de una página, asegurar que la barra de navegación se vea
    if (survey.pages.length > 1) {
      survey.showPageTitles = true;
      survey.showProgressBar = "bottom"; // O "top" según prefieras
    }
  },
  { immediate: true }
);

// 📌 Manejo del guardado
survey.onCompleting.add((sender, options) => {
options.allowComplete = false; // Evitar cierre automático

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
    emit("onClickSave");
    emit("onSurveyComplete", senderData);
  })
  .catch(() => {
    uToast.toastError("Ocurrió un error al guardar la validación. Intente de nuevo.");
  });

return false;
});
</script>

<template>
  <div class="validate-container">
    <SurveyComponent :model="survey" />
  </div>
</template>
