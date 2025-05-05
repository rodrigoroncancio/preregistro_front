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
import { getApiKey } from '@/helpers/apiKey';
const base_url2 = 'http://localhost:8002'
// const base_url2 = ''
const uLoading = useLoading();
const apikey=getApiKey
const uCrud = useCrud(`${base_url2}/api/2.0/validacion/item-persona`);
const uCrudAdjunto = useCrud(`${base_url2}/api/2.0/validacion/validaciones_adjunto`);
const uToast = useToast();

const resizeBase64Img = (base64:string, callback:any) => {
  const img = new Image();
  img.src = base64;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Reducción al 50%
    canvas.width = img.width / 3;
    canvas.height = img.height / 3;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convertir a Base64 nuevamente
    const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7);
    callback(resizedBase64);
  };
};

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
          name: "aprobado",
          title: "Cumple con el requerimiento",
          isRequired: true,
          choices: [
            { value: 1, text: "Sí" },
            { value: 0, text: "No" }
          ],
        },
        {
          type: "comment",
          name: "observacion",
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
    rol: 1,
    formulario_persona: props.fomularioid,
    validacion_item: props.validationitem,
    // attachment: Array.isArray(sender.data.attachment) && sender.data.attachment.length > 0 ? sender.data.attachment[0].content : "",
  };

  if (props.validationitem == 0) {
    Object.assign(uCrud, useCrud("/api/1.0/core/validationfinalregister"));
  } else {
    senderData.validationitems = props.validationitem;
  }

  uCrud
    .create(senderData, apikey)
    .then((resp) => {
      if(Array.isArray(sender.data.attachment) && sender.data.attachment.length > 0){
        resizeBase64Img(sender.data.attachment[0].content, (resizedImage:any) => {
          const senderAdjuntoData = {
            persona: (resp as any).id,
            ruta: resizedImage,
            fcrea: new Date().toISOString()
          };
          uCrudAdjunto.create(senderAdjuntoData, apikey)
        });
        
      }
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
