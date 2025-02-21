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
  
    export const json = {
        "title": "Preinscripción Núcleos Familiares del Grupo de Productores - Convención, El Tarra, Tibú y Sardinata",
        "description": "Ficha de preinscripción para el \"Establecimiento y/o fortalecimiento de actividades económicas para el tránsito a economías lícitas en el marco de procesos de sustitución de cultivos de uso ilícito en los municipios de Convención, El Tarra, Tibú y Sardinata de Norte de Santander\"",
        "logoPosition": "right",
        "pages": [
            {
            "name": "page1",
            "elements": [
                {
                "type": "html",
                "name": "question1",
                "html": "<h4>Validación de datos</h4>\n"
                },
                {
                "type": "boolean",
                "name": "ocupa_predio_cultivo_ilicito",
                "title": "¿Tenía, poseía u ocupaba usted un predio con presencia de cultivos de uso ilícito del cual depende su subsistencia?",
                "description": "Seleccione una opción.",
                "isRequired": true,
                "labelTrue": "Si\n"
                },
                {
                "type": "text",
                "name": "numero_documento",
                "title": "Ingrese el número de documento",
                "description": "Digite el número de documento sin puntos \".\" ni comas \",\"",
                "isRequired": true
                },
                {
                "type": "text",
                "name": "codigo",
                "title": "Digite el código de preinscripción asignado por su asociación o grupo productivo",
                "description": "Digite el código"
                },
                {
                "type": "html",
                "name": "question3",
                "html": "<span style=\"background-color: white; padding: 5px; display: inline-block;\">\n    <strong>Asegúrese de digitar un código de preinscripción válido. De lo contrario consulte con su asociación o grupo de productores y vuelva a intentarlo.</strong>\n</span>\n"
                }
            ]
            }
        ]
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