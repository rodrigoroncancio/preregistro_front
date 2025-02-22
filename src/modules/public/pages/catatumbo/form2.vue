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
  import useCrud from "@/composables/useCrud";
  import useToast from "@/composables/useToast";
  import { useLoading } from "vue-loading-overlay";
  import { ref, onMounted } from "vue";
  import axios from "axios";

  const uLoading = useLoading();

  const uCrud = useCrud("forms/catatumbo/preinscripciongrupoproductores");
  const uToast = useToast();

  const itemsDepartments = ref<Array<{ id: number; label: string }>>([]);

  const getDepartmentList = async () => {
    try {
      const response = await axios.get("/api/1.0/core/departments");
      itemsDepartments.value = response.data.map((dept: any) => ({
        value: dept.id,
        text: dept.nombre || dept.name || "Sin nombre" // Asegurar compatibilidad
      }));

    } catch (error) {
      console.error("Error fetching department list:", error);
    }
  };

  const itemsMunicipalities = ref<Array<{ id: number; label: string }>>([]);
  const getMunicipalityList = async (departmentId: number) => {
    try {
      const response = await axios.get(`/api/1.0/core/municipalities/by-department/${departmentId}/`);
      itemsMunicipalities.value = response.data.map((dept: any) => ({
        value: dept.id,
        text: dept.nombre || dept.name || "Sin nombre" // Asegurar compatibilidad
      }));
    } catch (error) {
      console.error("Error fetching municipality list:", error);
    }
  };

  onMounted(async () => {
    getDepartmentList();
  });

  const json = {
      "title": "Preinscripción Grupo de Productores Convención, El Tarra, Tibú y Sardinata - Norte de Santander",
      "description": "Ficha de preinscripción para el \"Establecimiento y/o fortalecimiento de actividades económicas para el tránsito a economías lícitas en el marco de procesos de sustitución de cultivos de uso ilícito en los municipios de Convención, El Tarra, Tibú y Sardinata de Norte de Santander\"",
      "logoPosition": "right",
      "pages": [
          {
          "name": "page1",
          "elements": [
              {
              "type": "boolean",
              "name": "ocupacion_asociados",
              "title": "¿Sus asociados tienen, poseen u ocupan predios con presencia de cultivos de uso ilícito de los que depende su subsistencia?",
              "description": "Seleccione una opción.",
              "isRequired": true,
              "labelTrue": "Si"
              }
          ]
          },
          {
          "name": "page2",
          "visibleIf": "{ocupacion_asociados} = true",
          "elements": [
              {
              "type": "boolean",
              "name": "victimas_desplazamiento",
              "title": "¿Sus asociados han sido victimas de desplazamiento forzado con fecha igual o posterior al 15 de enero de 2025?\n",
              "description": "Seleccione una opción.",
              "isRequired": true,
              "labelTrue": "Si"
              }
          ]
          },
          {
          "name": "page3",
          "visibleIf": "{victimas_desplazamiento} = true",
          "elements": [
              {
              "type": "html",
              "name": "question1",
              "html": "<h4>Ficha Grupo de Productores</h4>\n<strong>La actividad económica solo se implementara en el territorio inscrito para este fin</strong>"
              },
              {
              "type": "radiogroup",
              "name": "actividad_transito",
              "title": "Actividad económica para el tránsito a economías lícitas",
              "description": "Seleccione una opción.",
              "choices": [
                  "Agropecuaría",
                  "No Agropecuaría"
              ]
              }
          ]
          },
          {
          "name": "page5",
          "elements": [
              {
              "type": "html",
              "name": "question2",
              "visibleIf": "{actividad_transito} = 'Agropecuaría'",
              "html": "<h4>Actividades económicas agropecuarias</h4>\n"
              },
              {
              "type": "html",
              "name": "question3",
              "visibleIf": "{actividad_transito} = 'No Agropecuaría'",
              "html": "<h4>Actividades económicas no agropecuarias</h4>\n"
              },
              {
              "type": "radiogroup",
              "name": "actividad_etapa",
              "title": "Etapa de la actividad económica",
              "description": "Seleccione una opción.",
              "isRequired": true,
              "choices": [
                  "Establecimiento",
                  "Fortalecimiento"
              ]
              },
              {
              "type": "radiogroup",
              "name": "linea_productiva",
              "visibleIf": "{actividad_transito} = 'Agropecuaría'",
              "title": "Línea productiva que selecciona",
              "description": "Seleccione una opción.",
              "isRequired": true,
              "choices": [
                  "Caña",
                  "Cacao",
                  "Café",
                  "Yuca",
                  "Maíz",
                  "Aguacate",
                  "Piscicultura",
                  {
                  "value": "Otra",
                  "visibleIf": "{actividad_transito} = 'No Agropecuaría'"
                  }
              ]
              },
              {
              "type": "text",
              "name": "linea_productiva_otra",
              "visibleIf": "{linea_productiva} = 'Otra'",
              "title": "Si seleccionó en la respuesta anterior \"Otra\", mencione cual",
              "description": "No dejar en blanco.",
              "isRequired": true
              },
              {
              "type": "radiogroup",
              "name": "actividad_economica",
              "visibleIf": "{actividad_transito} = 'No Agropecuaría'",
              "title": "Actividades económicas que selecciona",
              "description": "No dejar en blanco.",
              "isRequired": true,
              "choices": [
                  "Comercio al por menor",
                  "Producción y transformación básica de bienes",
                  "Servicios y otras actividades Este campo es obligatorio"
              ]
              },
              {
              "type": "boolean",
              "name": "experiencia_tiene_experiencia",
              "title": "¿Tiene experiencia en esta actividad económica?",
              "isRequired": true,
              "labelTrue": "Si"
              },
              {
              "type": "text",
              "name": "experiencia_agnos",
              "visibleIf": "{experiencia_tiene_experiencia} = true",
              "title": "¿Hace cuántos años?",
              "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
              "isRequired": true,
              "inputType": "number"
              }
          ]
          },
          {
          "name": "page4",
          "elements": [
              {
              "type": "html",
              "name": "question7",
              "html": "<h4>Lugar de implementación de la actividad económica</h4>\n"
              },
              {
              "type": "radiogroup",
              "name": "departamento",
              "title": "Departamento",
              "isRequired": true,
              "choices": [
                  "Item 1",
                  "Item 2",
                  "Item 3"
              ]
              },
              {
              "type": "radiogroup",
              "name": "municipio",
              "title": "Municipio",
              "description": "Seleccione una opción.",
              "isRequired": true,
              "choices": [
                  "sin municipio"
              ]
              },
              {
              "type": "text",
              "name": "vereda",
              "title": "Vereda",
              "description": "No dejar en blanco.",
              "isRequired": true
              }
          ]
          },
          {
          "name": "page6",
          "elements": [
              {
              "type": "html",
              "name": "question4",
              "html": "<h4>Datos del grupo de productores</h4>"
              },
              {
              "type": "text",
              "name": "grupo_nombre",
              "title": "Nombre del grupo de productores",
              "description": "Indique el nombre del grupo, junta de acción comunal, asociación, cooperativa o estructura de gobernanza según corresponda",
              "isRequired": true
              },
              {
              "type": "radiogroup",
              "name": "grupo_tipo",
              "title": "Tipo de organización",
              "description": "Seleccione una opción.\n\n",
              "isRequired": true,
              "choices": [
                  "Grupo de hecho no formalizado",
                  {
                  "value": "Asociación formalizada",
                  "text": "Asociación formalizada (Con registro ante Cámara de comercio)"
                  },
                  {
                  "value": "ItCooperativa formalizadaem 3",
                  "text": "Cooperativa formalizada"
                  },
                  "Junta de Acción Comunal - JAC",
                  "Consejos Comunitarios",
                  "Resguardos Indígenas",
                  "Otro"
              ]
              },
              {
              "type": "text",
              "name": "grupo_otro",
              "visibleIf": "{grupo_tipo} = 'Otro'",
              "title": "Si seleccionó en la respuesta anterior \"Otro\", mencione cual",
              "description": "No dejar en blanco.\n",
              "isRequired": true
              },
              {
              "type": "text",
              "name": "grupo_num_registro",
              "visibleIf": "{grupo_tipo} = 'Asociación formalizada' or {grupo_tipo} = 'ItCooperativa formalizadaem 3'",
              "title": "Número de registro de la organización",
              "description": "Indique el número del NIT – Registro o similar",
              "isRequired": true
              },
              {
              "type": "text",
              "name": "lider_nombre",
              "title": "Nombre del líder o lidereza que representa el grupo de productores",
              "description": "Indique nombres y apellidos del representante del grupo de produtores",
              "isRequired": true
              },
              {
              "type": "text",
              "name": "lider_identificacion",
              "title": "Número de identificación",
              "description": "Indique el número de identificación del líder ó del representante del grupo de productores",
              "isRequired": true
              },
              {
              "type": "text",
              "name": "grupo_telefonos",
              "title": "Número de teléfono celular",
              "description": "Sin son varios, separar con guion (-).",
              "inputType": "tel"
              },
              {
              "type": "text",
              "name": "grupo_email",
              "title": "Correo electrónico",
              "description": "Sin son varios, separar con guion (-). Si no se dispone del dato, escribir \"NA\"",
              "inputType": "email"
              }
          ]
          },
          {
          "name": "page7",
          "elements": [
              {
              "type": "html",
              "name": "question11",
              "html": "<h4>Impacto territorial / Cobertura territorial del grupo de productores</h4>\n<strong>La actividad económica solo se implementara en el territorio inscrito para este fins</strong>"
              },
              {
              "type": "radiogroup",
              "name": "departamento_cobertura",
              "title": "Departamento(s) en los que tienen incidencia",
              "choices": [
                  "Item 1",
                  "Item 2",
                  "Item 3"
              ]
              },
              {
              "type": "text",
              "name": "veredas_cobertura",
              "title": "Vereda(s) en las que tienen incidencia",
              "description": "Sin son varios, separar con guion (-).",
              "isRequired": true
              },
              {
              "type": "text",
              "name": "grupo_fecha_creacion",
              "title": "Fecha de creación del grupo de productores",
              "isRequired": true,
              "inputType": "date"
              },
              {
              "type": "checkbox",
              "name": "lineas_productivas",
              "title": "Principales líneas productivas de trabajo del grupo de productores",
              "isRequired": true,
              "choices": [
                  "Cacao",
                  "Café",
                  "Caña",
                  "Ají",
                  "Ganadería",
                  "Frijol",
                  "Maíz",
                  "Aguacate",
                  "Yuca",
                  "Tomate",
                  "Lulo",
                  "Tomate de árbol",
                  "Cebolla en rama",
                  "Piña",
                  "Papaya",
                  "Guayaba",
                  "Naranja",
                  "Otro"
              ]
              },
              {
              "type": "text",
              "name": "lineas_otro",
              "visibleIf": "{lineas_productivas} allof ['Otro']",
              "title": "Si seleccionó en la respuesta anterior \"Otro\", mencione cual",
              "description": "No dejar en blanco.",
              "isRequired": true
              }
          ]
          },
          {
          "name": "page8",
          "elements": [
              {
              "type": "html",
              "name": "question14",
              "html": "<h4>Lugar de creación del grupo de productores</h4>\n"
              },
              {
              "type": "radiogroup",
              "name": "departamento_creacion",
              "title": "Departamento de creación del grupo de productores",
              "isRequired": true,
              "choices": [
                  "Item 1",
                  "Item 2",
                  "Item 3"
              ]
              },
              {
              "type": "html",
              "name": "question13",
              "html": "<h4>Nota: 24 horas después de diligenciado de este formulario se pueden inscribir los representantes de los núcleos familiares</h4>\n"
              }
          ]
          }
      ],
      "pagePrevText": "Página anterior",
      "pageNextText": "Página siguiente",
      "completeText": "Enviar",
      "showNavigationButtons": false
  }

  const survey = new Model(json);
  
  survey.onCompleting.add((sender, options) => {
      options.allowComplete = false;

      // Asegurarse de que lineas_productivas sea un string separado por comas
      if (Array.isArray(sender.data.lineas_productivas)) {
          sender.data = Object.assign({}, sender.data, {
              lineas_productivas: sender.data.lineas_productivas.join(", ")
          });
      }

      uCrud.create(sender.data)
          .then((item) => {
              uToast.toastSuccess("Su formulario ha sido guardado correctamente.");
              sender.clear(true);
              survey.showNavigationButtons = false;
          })
          .catch((error) => {
              uToast.toastError("Ocurrió un error al guardar su formulario. Por favor, inténtelo de nuevo.");
          });

      return false;
  });


  survey.onValueChanged.add(async (sender, options) => {
    if (options.name === "ocupacion_asociados") {
      survey.showNavigationButtons = options.value;
    }

    const departamentoQuestion = survey.getQuestionByName("departamento");
    const departamentocoberturaQuestion = survey.getQuestionByName("departamento_cobertura");
    
    if (departamentoQuestion) {
      departamentoQuestion.choices = itemsDepartments.value;
      departamentocoberturaQuestion.choices = itemsDepartments.value;
    }
    const municipioQuestion = survey.getQuestionByName("municipio");
    
    if (options.name === "departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (municipioQuestion) {
              municipioQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }

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