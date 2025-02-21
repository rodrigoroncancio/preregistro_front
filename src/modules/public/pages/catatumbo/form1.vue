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
  import 'survey-core/defaultV2.min.css';
  import { Model } from "survey-core";
  import { SurveyComponent } from "survey-vue3-ui";

  const json = {
    "title": "Preinscripción Núcleos Familiares Individuales - Convención, El Tarra, Tibú y Sardinata",
    "description": "Ficha de preinscripción para el \"Establecimiento y/o fortalecimiento de actividades económicas para el tránsito a economías lícitas en el marco de procesos de sustitución de cultivos de uso ilícito en los municipios de Convención, El Tarra, Tibú y Sardinata de Norte de Santander\"",
    "logoPosition": "right",
    "pages": [
      {
        "name": "page1",
        "title": "\n",
        "description": "\n",
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
            "title": "Ingrese el número de documento",
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
          }
        ]
      }
    ],
    "triggers": [
      {
        "type": "runexpression"
      }
    ],
    "checkErrorsMode": "onValueChanged"
  }

  const survey = new Model(json);
  survey.onComplete.add((sender, options) => {
    console.log(JSON.stringify(sender.data, null, 3));
  });

  survey.onValueChanged.add(async (sender, options) => {
    console.log('here')
    sender.getQuestionByName("email").visible = false;

    if (options.name === "ageGroup") {
      const ageGroup = options.value;

      // Llamar a un endpoint para decidir si mostrar el campo 'email'
      try {
        const response = await fetch(`https://myapi.com/validate-age/${ageGroup}`);
        const data = await response.json();

        if (data.showEmail) {
          sender.getQuestionByName("email").visible = true;
        } else {
          sender.getQuestionByName("email").visible = false;
        }
      } catch (error) {
        console.error("Error al consultar el endpoint:", error);
      }
    }
  });
</script>

<style scoped>
.v-main {
  min-height: calc(100vh - 65px);
  flex-grow: 1;
  background-image: url("/src/assets/img/bg-catatumbo.png");
  background-position: bottom;
  background-size: contain;
}
</style>