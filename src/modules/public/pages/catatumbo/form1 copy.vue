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
  import { ref } from "vue";
  import axios from "axios";

  import 'survey-core/defaultV2.min.css';
  import "survey-core/survey.i18n.js";
  import { Model } from "survey-core";
  import { SurveyComponent } from "survey-vue3-ui";

  import useCrud from "@/composables/useCrud";
  import useToast from "@/composables/useToast";
  import { useLoading } from "vue-loading-overlay";

  const uCrud = useCrud("forms/catatumbo/preregistro");
  const uToast = useToast();
  const uLoading = useLoading();

  const json = ref({
    "title": "Preinscripción Núcleos Familiares Individuales - Convención, El Tarra, Tibú y Sardinata",
    "description": "Ficha de preinscripción para el \"Establecimiento y/o fortalecimiento de actividades económicas para el tránsito a economías lícitas en el marco de procesos de sustitución de cultivos de uso ilícito en los municipios de Convención, El Tarra, Tibú y Sardinata de Norte de Santander\"",
    "logoPosition": "right",
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "boolean",
            "name": "posee_predios",
            "title": "¿Tiene, posee u ocupa usted un predio con presencia de cultivos de uso ilícito del cual depende su subsistencia?",
            "isRequired": true
          },
          {
            "type": "text",
            "name": "numero_documento",
            "visibleIf": "{posee_predios} = true",
            "title": "Ingrese el número de documento (presione enter para continuar)",
            "isRequired": true
          }
        ]
      },
      {
        "name": "page2",
        "visibleIf": "{posee_predios} = true",
        "elements": [
          {
            "type": "boolean",
            "name": "victima_desplazamiento",
            "title": "¿Ha sido victima de desplazamiento forzado con fecha igual o posterior al 15 de enero de 2025?",
            "isRequired": true
          },
          {
            "visibleIf": "{victima_desplazamiento} = true",
            "type": "radiogroup",
            "name": "actividades_transitar",
            "title": "Actividad económica para transitar a economías licitas",
            "isRequired": true,
            "choices": [
              {
                "value": "agropecuaria",
                "text": "Agropecuaría"
              },
              {
                "value": "no_agropecuaria",
                "text": "No Agropecuaría"
              }
            ]
          },
          {
            "type": "radiogroup",
            "name": "actividades_economicas",
            "title": "Actividades económicas agropecuarias",
            "isRequired": true,
            "choices": [
              {
                "value": "establecimiento",
                "text": "Establecimiento"
              },
              {
                "value": "fortalecimiento",
                "text": "Fortalecimiento"
              }
            ]
          },
          {
            "type": "dropdown",
            "name": "linea_productiva",
            "title": "Línea productiva que selecciona",
            "isRequired": true,
            "choices": [
              { "value": "cana", "text": "Caña" },
              { "value": "cacao", "text": "Cacao" },
              { "value": "cafe", "text": "Café" },
              { "value": "yuca", "text": "Yuca" },
              { "value": "maiz", "text": "Maíz" },
              { "value": "aguacate", "text": "Aguacate" },
              { "value": "pisicultura", "text": "Piscicultura" }
            ],
            "showOtherItem": true
          }
        ]
      }
    ],
    "locale": "es",
    "showNavigationButtons": false
  })

  const survey = new Model(json.value);

  survey.onCompleting.add((sender, options) => {
    options.allowComplete = false;
    uCrud.create(sender.data)
      .then((item: any) => {
        uToast.toastSuccess("Su formulario ha sido guardado correctamente.");
        sender.clear(true);
        survey.showNavigationButtons = false;
      })
      .catch((error: any) => {
        uToast.toastError("Ocurrió un error al guardar su formulario. Por favor, inténtelo de nuevo.");
      });
    return false
  });

  survey.onValueChanged.add(async (sender, options) => {
    if (options.name === "posee_predios") {
      survey.showNavigationButtons = false;
      sender.clearValue("numero_documento");
    }
    if (options.name === "numero_documento") {
      if (options.value === null || options.value === "")
        return;

      try {
        let loader = uLoading.show({});
        axios.get(`forms/catatumbo/validar_documento/?documento=${options.value}`)
          .then((resp: any) => {
            if (resp.data) {
              survey.showNavigationButtons = false;
              sender.clearValue("numero_documento");
              uToast.toastError("No se puede continuar con el formulario. El documento ya está registrado en las bases de datos de beneficiarios PNIS.");
            } else
              survey.showNavigationButtons = true;
          })
          .catch((err: any) => { console.log(err) })
          .finally(() => { loader.hide() });
      } catch (error) {
        console.error("Error al consultar el endpoint:", error);
      }
    }
  });
</script>

<style scoped lang="scss">
.v-main {
  min-height: calc(100vh - 65px);
  flex-grow: 1;
  background-image: url("/src/assets/img/bg-catatumbo.png");
  background-position: bottom;
  background-size: contain;
}

.main-container {
  margin: auto;
  margin-top: 20px;
  width: 100%;
  max-width: 2200px;
}
</style>