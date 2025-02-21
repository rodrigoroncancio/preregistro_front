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
    import axios from "axios";
    import { useLoading } from "vue-loading-overlay";
    import { ref, onMounted } from "vue";

    const uLoading = useLoading();

    const uCrud = useCrud("forms/catatumbo/preinscripcionfamiliaspnis");
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
      "title": "Preinscripción núcleos familiares de cultivadores, no cultivadores y recolectores con estado activo en el PNIS - Tibú y Sardinata",
      "description": "Ficha de preinscripción para la \"Atención de núcleos familiares de cultivadores, no cultivadores y recolectores con estado activo en el PNIS en los municipios de Tibú y Sardinata de Norte de Santander, que se postulan para las medidas adoptadas en el marco de la conmoción interior\"",
      "logoPosition": "right",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "html",
              "name": "question1",
              "html": "<h4>\nValidación de datos\n</h4>"
            },
            {
              "type": "text",
              "name": "numero_documento",
              "title": "Ingrese el número de documento",
              "description": "Digite el número de documento sin puntos \".\" ni comas \",\""
            },
            {
              "type": "boolean",
              "name": "victima_desplazamiento",
              "title": "¿Ha sido victima de desplazamiento forzado con fecha igual o posterior al 15 de enero de 2025?",
              "description": "Seleccione una opción.",
              "labelTrue": "Si"
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "html",
              "name": "question3",
              "html": "<h4>\nDatos Personales.\n\n</h4>"
            },
            {
              "type": "text",
              "name": "nombres",
              "title": "Nombres",
              "description": "Digite los nombres del representante del núcleo familiar.",
              "isRequired": true
            },
            {
              "type": "text",
              "name": "apellidos",
              "title": "Apellidos",
              "description": "Digite los apellidos del representante del núcleo familiar.",
              "isRequired": true
            },
            {
              "type": "text",
              "name": "numero_telefono",
              "title": "Número de teléfono celular",
              "description": "Sin son varios, separar con guion (-)."
            },
            {
              "type": "text",
              "name": "email",
              "title": "Correo electrónico",
              "description": "Sin son varios, separar con guion (-). Si no se dispone del dato, escribir \"NA\"",
              "isRequired": true
            }
          ]
        },
        {
          "name": "page3",
          "elements": [
            {
              "type": "html",
              "name": "question6",
              "html": "<h4>\nDatos Personales.\n\n</h4>"
            },
            {
              "type": "dropdown",
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
              "type": "dropdown",
              "name": "municipio",
              "title": "Municipio",
              "choices": [
                {
                  "value": "Item 1",
                  "text": "sin municipio"
                }
              ]
            },
            {
              "type": "text",
              "name": "vereda",
              "title": "Vereda o Cabecera Municipal o Centro Poblado",
              "description": "No dejar en blanco."
            },
            {
              "type": "text",
              "name": "direccion",
              "title": "Dirección o descripción de acceso al predio o punto de referencia",
              "description": "Dirección o breve descripción de acceso. Tiempo desde la cabecera municipal hasta la finca.\nAcceso en vehículo cuanto tiempo, en animal o a pie cuanto tiempo."
            },
            {
              "type": "html",
              "name": "question8",
              "html": "<h4>\nTerminos y condiciones\n</h4>"
            },
            {
              "type": "html",
              "name": "question9",
              "html": "<a target=\"blank\" href=\"https://stpnis.blob.core.windows.net/testdsci/Terminos_catatumbo/13022025_ConvocatoriaFinal_v11.pdf\">\nVer Terminos y condiciones\n</a>"
            },
            {
              "type": "radiogroup",
              "name": "acepta_terminos",
              "title": "He leído y acepto los términos y condiciones",
              "isRequired": true,
              "choices": [
                {
                  "value": "Si",
                  "text": "Si"
                }
              ]
            },
            {
              "type": "html",
              "name": "question11",
              "html": "<a target=\"blank\" href=\"https://stpnis.blob.core.windows.net/testdsci/Terminos/Normativa%20aplicable%20al%20registro.pdf\">\nVer Tratamiento de Datos Personales\n</a>"
            },
            {
              "type": "radiogroup",
              "name": "acepta_tratamiento_datos",
              "title": "He leído y acepto el tratamiento de datos personales",
              "isRequired": true,
              "choices": [
                {
                  "value": "Si",
                  "text": "Si"
                }
              ]
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
      

      if (options.name === "victima_desplazamiento") {
        survey.showNavigationButtons = options.value;
      }

      const departamentoQuestion = survey.getQuestionByName("departamento");      
      if (departamentoQuestion) {
        departamentoQuestion.choices = itemsDepartments.value;
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