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

  const modelValue = defineModel<object>();

  const props = defineProps({
    form_title: {
      type: String,
      default: 'Preinscripción Grupo de Productores Convención, El Tarra, Tibú y Sardinata - Norte de Santander'
    },
    form_title_description: {
      type: String,
      default: 'Ficha de preinscripción para el \"Establecimiento y/o fortalecimiento de actividades económicas para el tránsito a economías lícitas en el marco de procesos de sustitución de cultivos de uso ilícito en los municipios de Convención, El Tarra, Tibú y Sardinata de Norte de Santander\"'
    },
  })


  const uLoading = useLoading();
  const uCrud = useCrud("api/2.0/nucleo/asociaciones");
  const uToast = useToast();
  const itemsDepartments = ref<Array<{ id: number; label: string }>>([]);
  const getDepartmentList = async () => {
    try {
      const response = await axios.get(`/api/2.0/nucleo//api/2.0/nucleo/ubicacion/1/`);
      itemsDepartments.value = response.data.map((dept: any) => ({
        value: dept.id,
        text: dept.nombre // Asegurar compatibilidad
      }));
    } catch (error) {
      console.error("Error fetching village list:", error);
    }
  };
  const itemsVillages = ref<Array<{ value: number; text: string }>>([]);
  const getVillageList = async (ubicacionId: number) => {
    try {
      const response = await axios.get(`/api/2.0/nucleo//api/2.0/nucleo/ubicacion/${ubicacionId}/`);
      itemsVillages.value = response.data.map((dept: any) => ({
        value: dept.id,
        text: dept.nombre // Asegurar compatibilidad
      }));
    } catch (error) {
      console.error("Error fetching village list:", error);
    }
  };

  const json = {
      "title": props.form_title,
      "description": props.form_title_description,
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
              "isRequired": true,
              "choices": [
                {
                  "value": "89",
                  "text": "Agropecuaría"
                },
                {
                  "value": "90",
                  "text": "No Agropecuaría"
                }
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
              "visibleIf": "{actividad_transito} = '89'",
              "html": "<h4>Actividades económicas agropecuarias</h4>\n"
              },
              {
              "type": "html",
              "name": "question3",
              "visibleIf": "{actividad_transito} = '90'",
              "html": "<h4>Actividades económicas no agropecuarias</h4>\n"
              },
              {
              "type": "radiogroup",
              "name": "actividad_etapa",
              "title": "Etapa de la actividad económica",
              "description": "Seleccione una opción.",
              "isRequired": true,
              "choices": [
                {
                  "value": "44",
                  "text": "Establecimiento"
                },
                {
                  "value": "45",
                  "text": "Fortalecimiento"
                }
              ]
              },
              {
              "type": "radiogroup",
              "name": "linea_productiva",
              "visibleIf": "{actividad_transito} = '89'",
              "title": "Línea productiva que selecciona",
              "description": "Seleccione una opción.",
              "isRequired": true,
              "choices": [
                  {
                  "value": "34",
                  "text": "Caña"
                  },
                  {
                  "value": "35",
                  "text": "Cacao"
                  },
                  {
                  "value": "36",
                  "text": "Café"
                  },
                  {
                  "value": "37",
                  "text": "Yuca"
                  },
                  {
                  "value": "38",
                  "text": "Maíz"
                  },
                  {
                  "value": "40",
                  "text": "Aguacate"
                  },
                  {
                  "value": "41",
                  "text": "Piscicultura"
                  },
                  {
                  "value": "101",
                  "text": "Otra",
                  "visibleIf": "{actividad_transito} = '90'"
                  }
              ]
              },
              {
              "type": "text",
              "name": "linea_productiva_otra",
              "visibleIf": "{linea_productiva} = '101'",
              "title": "Si seleccionó en la respuesta anterior \"Otra\", mencione cual",
              "description": "No dejar en blanco.",
              "isRequired": true
              },
              {
              "type": "radiogroup",
              "name": "actividad_economica",
              "visibleIf": "{actividad_transito} = '90'",
              "title": "Actividades económicas que selecciona",
              "description": "No dejar en blanco.",
              "isRequired": true,
              "choices": [
                {
                "value": "102",
                "text": "Comercio al por menor"
                },
                {
                "value": "103",
                "text": "Producción y transformación básica de bienes"
                },
                {
                "value": "104",
                "text": "Servicios y otras actividades Este campo es obligatorio"
                }

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
              "type": "dropdown",
              "name": "departamento",
              "title": "Departamento",
              "isRequired": true,
              "choices": [
                  "Sin departamento",
              ]
              },
              {
              "type": "dropdown",
              "name": "municipio",
              "title": "Municipio",
              "description": "Seleccione una opción.",
              "isRequired": true,
              "choices": [
                  "sin municipio"
              ]
              },
              {
              "type": "dropdown",
              "name": "corregimiento",
              "title": "Corregimiento",
              "description": "Seleccione una opción.",
              "isRequired": true,
              "choices": [
                  "sin corregimiento"
              ]
              },
              {
              "type": "dropdown",
              "name": "vereda",
              "title": "Vereda",
              "description": "Seleccione una opción.",
              "choices": [
                  "sin corregimiento"
              ]
              },
              {
              "type": "text",
              "name": "vereda_otra",
              "title": "Vereda Otra",
              "description": "Si la vereda no aparece en la lista, se digite el nombre de la vereda"
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
                  {
                  "value": "91",
                  "text": "Grupo de hecho no formalizado"
                  },
                  {
                  "value": "92",
                  "text": "Asociación formalizada (Con registro ante Cámara de comercio)"
                  },
                  {
                  "value": "93",
                  "text": "Cooperativa formalizada"
                  },
                  {
                  "value": "94",
                  "text": "Junta de Acción Comunal - JAC"
                  },
                  {
                  "value": "95",
                  "text": "Consejos Comunitarios"
                  },
                  {
                  "value": "97",
                  "text": "Resguardos Indígenas"
                  },
                  {
                  "value": "98",
                  "text": "Otro"
                  }
              ]
              },
              {
                "type": "text",
                "name": "fecha_creacion",
                "title": "Fecha de creación",
                "isRequired": true,
                "inputType": "date"
              },
              {
              "type": "text",
              "name": "grupo_otro",
              "visibleIf": "{grupo_tipo} = '98'",
              "title": "Si seleccionó en la respuesta anterior \"Otro\", mencione cual",
              "description": "No dejar en blanco.\n",
              "isRequired": true
              },
              {
              "type": "text",
              "name": "grupo_num_registro",
              "visibleIf": "{grupo_tipo} = '92' or {grupo_tipo} = '93'",
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
              "name": "grupo_telefono",
              "title": "Número de teléfono",
              "isRequired": true,
              "maxLength": 10
                  },
              {
              "type": "text",
              "name": "grupo_email",
              "title": "Correo electrónico",
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
              "type": "dropdown",
              "name": "departamento_cobertura",
              "title": "Departamento(s) en los que tienen incidencia",
              "isRequired": true,
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
              "type": "dropdown",
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
              "type": "dropdown",
              "name": "municipio_creacion",
              "title": "Municipio creacion",
              "description": "Seleccione una opción.",
              "isRequired": true,
              "choices": [
                  "sin municipio"
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
      const asociacionaData = {
        cub: 0,
        tipo: parseInt(sender.data.grupo_tipo),
        id_registro: 0,
        nombre: sender.data.grupo_nombre,
        nit: sender.data.grupo_num_registro,
        tiene_experiencia: sender.data.experiencia_tiene_experiencia?1:0,
        anios_experiencia: sender.data.experiencia_agnos,
        tipo_actividad_economica: sender.data.actividad_transito,
        nombre_lider: sender.data.lider_nombre,
        identificacion_lider: sender.data.lider_identificacion,
        celular: sender.data.grupo_telefono,
        correo: sender.data.grupo_email,
        desplazados: sender.data.victimas_desplazamiento === "1" ? 1 : 0,
        coca: sender.data.ocupacion_asociados === "1" ? 1 : 0,
        fecha_creacion: sender.data.fecha_creacion,
        linea_productiva_cual: sender.data.linea_productiva_otra || "",
        linea_productiva: parseInt(sender.data.linea_productiva) || parseInt(sender.data.actividad_economica),
        num_nucleos: 0,
        municipioid: parseInt(sender.data.municipio_creacion),
        tipo_experiencia: parseInt(sender.data.actividad_etapa),
        origen: 'preregistro_catatumbo',
        fcrea: new Date().toISOString(),
      };

      // Asegurarse de que lineas_productivas sea un string separado por comas
      if (Array.isArray(sender.data.lineas_productivas)) {
          sender.data = Object.assign({}, sender.data, {
              lineas_productivas: sender.data.lineas_productivas.join(", ")
          });
      }

      uCrud.create(asociacionaData)
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
    const departamentocreacionQuestion = survey.getQuestionByName("departamento_creacion");

    if (departamentoQuestion) {
      departamentoQuestion.choices = itemsDepartments.value;
      departamentocoberturaQuestion.choices = itemsDepartments.value;
      departamentocreacionQuestion.choices = itemsDepartments.value;
    }
    const municipioQuestion = survey.getQuestionByName("municipio");

    if (options.name === "departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(departamento_id);
          if (municipioQuestion) {
              municipioQuestion.choices = itemsVillages.value
          }
        loading.hide()
    }

    const municipiocreacionQuestion = survey.getQuestionByName("municipio_creacion");

    if (options.name === "departamento_creacion") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(departamento_id);
          if (municipiocreacionQuestion) {
              municipiocreacionQuestion.choices = itemsVillages.value
          }
        loading.hide()
    }

    const corregimientoQuestion = survey.getQuestionByName("corregimiento");

    if (options.name === "municipio") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(departamento_id);
          if (corregimientoQuestion) {
            corregimientoQuestion.choices = itemsVillages.value
          }
        loading.hide()
    }

    const veredaQuestion = survey.getQuestionByName("vereda");

    if (options.name === "corregimiento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(departamento_id);
          if (veredaQuestion) {
            veredaQuestion.choices = itemsVillages.value
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


  onMounted(async () => {
    getDepartmentList();
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