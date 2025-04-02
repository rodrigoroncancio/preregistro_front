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

  const uCrud = useCrud("forms/catatumbo/fichaacuerdo");
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

  const itemSTownShips = ref<Array<{ id: number; label: string }>>([]);
  const getTownShipsList = async (municipalityId: number) => {
    try {
      const response = await axios.get(`/api/1.0/core/townships/by-municipality/${municipalityId}/`);
      itemSTownShips.value = response.data.map((dept: any) => ({
        value: dept.id,
        text: dept.nombre || dept.name || "Sin nombre" // Asegurar compatibilidad
      }));
    } catch (error) {
      console.error("Error fetching municipality list:", error);
    }
  };

  const itemsVillages = ref<Array<{ id: number; label: string }>>([]);
  const getVillageList = async (townshipId: number) => {
    try {
      const response = await axios.get(`/api/1.0/core/villages/by-township/${townshipId}/`);
      itemsVillages.value = response.data.map((dept: any) => ({
        value: dept.id,
        text: dept.name // Asegurar compatibilidad
      }));
    } catch (error) {
      console.error("Error fetching village list:", error);
    }
  };

  const personasNUcleo = ref({})
  const enviarNucleoFamiliar = async () => {
  try {
    const response = await axios.post('/forms/catatumbo/fichaacuerdonucleo/', personasNUcleo.value, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Respuesta del servidor:', response.data);
    alert('Formulario enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el formulario:', error.response?.data || error);
    alert('Error al enviar los datos');
  }
};

  onMounted(async () => {
    getDepartmentList();
  });

  const json ={
  "title": "Preinscripción Núcleos Familiares Individuales - Convención, El Tarra, Tibú y SardinataFicha de preinscripción para el \"Establecimiento y/o fortalecimiento de actividades económicas para el tránsito a economías lícitas en el marco de procesos de sustitución de cultivos de uso ilícito en los municipios de Convención, El Tarra, Tibú y Sardinata de Norte de Santander\"",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "boolean",
          "name": "tiene_coca",
          "title": "¿Tiene, posee u ocupa usted un predio con cultivos de coca del cual depende su subsistencia?",
          "isRequired": true
        },
        {
          "type": "radiogroup",
          "name": "tipo_exclusion",
          "title": "Seleccione si cuenta con alguna de las siguientes condiciones:",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "El predio de coca que va a someter a sustitución fue sembrado después del 24 de enero del 2025."
            },
            {
              "value": "2",
              "text": "Encontrarse en un programa de reincorporación"
            },
            {
              "value": "3",
              "text": "Ser funcionario o contratista público"
            },
            {
              "value": "4",
              "text": "En su hogar hay funcionarios o contratistas públicos"
            },
            {
              "value": "5",
              "text": "El predio donde está el cultivo de coca es un bien de la Nación o de una entidad pública. (Sólo se permite inscripción de predios de particulares)"
            },
            {
              "value": "6",
              "text": "Que alguien más del núcleo familiar haya inscrito el mismo predio a sustituir."
            },
            {
              "value": "7",
              "text": "Usted, su conyugue o alguien de su núcleo familiar es titular o beneficiario PNIS activo o retirado."
            },
            {
              "value": "8",
              "text": "Contar con un cultivo menor a 0.5 ha de coca sembradas-"
            },
            {
              "value": "10",
              "text": "Ser menor de 18 años de edad"
            },
            {
              "value": "11",
              "text": "NINGUNA DE LAS ANTERIORES"
            }
          ]
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "html",
          "name": "question3",
          "html": "<h3>\nCapítulo (A) Identificación\n</h3>"
        },
        {
          "type": "html",
          "name": "question4",
          "html": "<h4>\n1. ¿Dónde vive usted actualmente?\n</h4>"
        },
        {
          "type": "dropdown",
          "name": "vive_departamento",
          "title": "1.1 Departamento",
          "isRequired": true,
          "choices": [
            {
              "value": "Item 1N",
              "text": "Norte de santander"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "vive_municipio",
          "title": "1.2 Municipio",
          "isRequired": true,
          "choices": [
            {
              "value": "Item 1",
              "text": "Convención"
            },
            {
              "value": "Item 2",
              "text": "El tarra"
            },
            {
              "value": "Item 3",
              "text": "Sardinata"
            },
            {
              "value": "Item 4",
              "text": "Tibú"
            }
          ]
        },
        {
          "type": "radiogroup",
          "name": "vive_lugar",
          "title": "1.3 EN QUE LUGAR DEL MUNICIPIO VIVE USTED?",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Cabecera municipal"
            },
            {
              "value": "2",
              "text": "Centro poblado"
            },
            {
              "value": "3",
              "text": "Corregimiento"
            },
            {
              "value": "4",
              "text": "Vereda"
            }
          ]
        },
        {
          "type": "text",
          "name": "vive_lugar_nombre",
          "visibleIf": "{vive_lugar} <> 4 and {vive_lugar} notempty",
          "title": "Nombre del lugar"
        },
        {
          "type": "text",
          "name": "vive_direccion",
          "visibleIf": "{vive_lugar} <> 4 and {vive_lugar} notempty",
          "title": "Dirección"
        },
        {
          "type": "dropdown",
          "name": "vive_vereda",
          "visibleIf": "{vive_lugar} = 4",
          "title": "Vereda",
          "isRequired": true,
          "choices": [
            {
              "value": "Item 1",
              "text": "Sin vereda"
            }
          ]
        },
        {
          "type": "text",
          "name": "vive_vereda_otra",
          "visibleIf": "{vive_lugar} = 4",
          "title": "Otra vereda",
          "description": "Si la vereda no aparece en la lista, se digita el nombre de la vereda"
        }
      ]
    },
    {
      "name": "page3",
      "elements": [
        {
          "type": "boolean",
          "name": "desplazado_2025",
          "title": "1.4 Su lugar de residencia cambió después del 16 de enero?  "
        },
        {
          "type": "dropdown",
          "name": "desplazado_departamento",
          "visibleIf": "{desplazado_2025} = true",
          "title": "Departamento",
          "isRequired": true,
          "choices": [
            {
              "value": "Item 1",
              "text": "Sin departamento"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "desplazado_municipio",
          "visibleIf": "{desplazado_2025} = true",
          "title": "Municipio",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Convención"
            },
            {
              "value": "2",
              "text": "El Tarra"
            },
            {
              "value": "3",
              "text": "Sardinata"
            },
            {
              "value": "4",
              "text": "Tibú"
            }
          ]
        },
        {
          "type": "radiogroup",
          "name": "deplazado_lugar",
          "visibleIf": "{desplazado_2025} = true",
          "title": "EN QUE LUGAR DEL MUNICIPIO VIVIA USTED?",
          "choices": [
            {
              "value": "1",
              "text": "Cabecera municipal"
            },
            {
              "value": "2",
              "text": "Centro poblado"
            },
            {
              "value": "3",
              "text": "Corregimiento"
            },
            {
              "value": "4",
              "text": "Vereda"
            }
          ]
        },
        {
          "type": "text",
          "name": "desplazado_lugar_nombre",
          "visibleIf": "{deplazado_lugar} != '4' and {desplazado_2025} = true",
          "title": "Nombre"
        },
        {
          "type": "text",
          "name": "desplazado_lugar_direccion",
          "visibleIf": "{deplazado_lugar} != '4' and {desplazado_2025} = true",
          "title": "Dirección"
        },
        {
          "type": "dropdown",
          "name": "desplazado_vereda",
          "visibleIf": "{deplazado_lugar} = 4  and {desplazado_2025} = true",
          "title": "Vereda",
          "choices": [
            {
              "value": "Item 1",
              "text": "Sin vereda"
            }
          ]
        },
        {
          "type": "text",
          "name": "desplazado_otra_vereda",
          "visibleIf": "{deplazado_lugar} = 4  and {desplazado_2025} = true",
          "title": "Otra vereda"
        }
      ]
    },
    {
      "name": "page4",
      "elements": [
        {
          "type": "html",
          "name": "question19",
          "html": "<h4>\n2. Datos del titular del programa de sustitución RenHacemos Catatumbo. \n</h4>"
        },
        {
          "type": "text",
          "name": "titular_nombres",
          "title": "2.1 Nombres",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "titular_apellidos",
          "title": "2.2 Apellidos",
          "isRequired": true
        },
        {
          "type": "dropdown",
          "name": "titular_tipo_identificacion",
          "title": "2.3 Tipo de documento de identidad",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Cédula de ciudadania"
            }
          ]
        },
        {
          "type": "text",
          "name": "titular_Numero_documento",
          "title": "2.4 Número de documento",
          "isRequired": true
        },
        {
          "type": "file",
          "name": "titular_foto_cara",
          "title": "2.5 Cara documento de identidad",
          "isRequired": true
        },
        {
          "type": "file",
          "name": "titular_foto_contracara",
          "title": "2.6 Contracara Documento de identidad",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "titular_fecha_nacimiento",
          "title": "2.7 Fecha de nacimiento",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "text",
          "name": "titular_fecha_expedicion",
          "title": "2.8 Fecha de expedición de la cédula",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "text",
          "name": "titular_celular",
          "title": "2.9 Celular",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "titular_whatsapp",
          "title": "2.10 Whatsapp",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "titular_email",
          "title": "2.12  Correo electrónico",
          "isRequired": true
        }
      ]
    },
    {
      "name": "page5",
      "elements": [
        {
          "type": "radiogroup",
          "name": "titular_sexo",
          "title": "2.13 Sexo",
          "isRequired": true,
          "choices": [
            {
              "value": "15",
              "text": "Femenino"
            },
            {
              "value": "16",
              "text": "Masculino"
            }
          ]
        },
        {
          "type": "boolean",
          "name": "question31",
          "visibleIf": "{titular_sexo} = 15",
          "title": "¿Es madre cabeza de familia? ",
          "isRequired": true
        },
        {
          "type": "dropdown",
          "name": "titular_pertenece_comunidad_etnica",
          "title": "2.14 ¿Usted se identifica como miembro de una comunidad étnica o de alguna de las poblaciones que se describen a continuación? ",
          "choices": [
            {
              "value": "17",
              "text": "Indígena"
            },
            {
              "value": "18",
              "text": "Comunidad Negra o Afrocolombiano"
            },
            {
              "value": "24",
              "text": "Raizal"
            },
            {
              "value": "25",
              "text": "Palenquero"
            },
            {
              "value": "26",
              "text": "Rrom (Gitano)"
            },
            {
              "value": "27",
              "text": "Campesino no perteneciente a las anteriores etnias"
            },
            {
              "value": "28",
              "text": "Ninguno"
            }
          ]
        },
        {
          "type": "text",
          "name": "question34",
          "visibleIf": "({titular_pertenece_comunidad_etnica} != '27') and ({titular_pertenece_comunidad_etnica} != '28')",
          "title": "¿A qué resguardo indígena o Consejo Comunitario de Comunidades negras pertenece Ud.?",
          "description": "No dejar en blanco. Si no se dispone del dato, escribir NA *"
        },
        {
          "type": "text",
          "name": "question35",
          "title": "3. ¿Cuántas personas en total, incluido usted, conforman su núcleo familiar? ",
          "isRequired": true,
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page6",
      "elements": [
        {
          "type": "html",
          "name": "question36",
          "html": "<h3>\nCapítulo B: relación predio coca\n</h3>"
        },
        {
          "type": "radiogroup",
          "name": "predio_coca_tipo_residencia",
          "title": "4. ¿Cuál es su relación con el Predio donde se encuentra la coca? *Una sola opción",
          "choices": [
            {
              "value": "29",
              "text": "Propietario"
            },
            {
              "value": "30",
              "text": "Poseedor"
            },
            {
              "value": "31",
              "text": "Ocupante"
            },
            {
              "value": "32",
              "text": "Arrendatario"
            },
            {
              "value": "33",
              "text": "Amediero con contrato"
            }
          ]
        },
        {
          "type": "file",
          "name": "predio_coca_tipo_documento",
          "title": "4.1 Documento de relación de tenencia con el predio en el formulario.  ",
          "description": "Foto del documento que valide la relación con el predio"
        },
        {
          "type": "text",
          "name": "predio_coca_area_total",
          "title": "5. ¿Cuál es el área total en hectáreas que tiene su predio?  ",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio_coca_area_cultivo",
          "title": "6. ¿Cuántas hectáreas de cultivos de coca tiene este predio?",
          "description": "Debe ser mayor o igual 0.5",
          "inputType": "number"
        },
        {
          "type": "boolean",
          "name": "predio_coca_vive",
          "title": "7. ¿Usted vive en el mismo predio donde tiene el cultivo de coca?"
        },
        {
          "type": "dropdown",
          "name": "predio_coca_departamento",
          "title": "7.1. Departamento",
          "choices": [
            {
              "value": "Item 1",
              "text": "Norte de santader"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio_coca_municipio",
          "title": "7.2 Municipio",
          "choices": [
            {
              "value": "Item 1",
              "text": "Convención"
            },
            {
              "value": "Item 2",
              "text": "El tarra"
            },
            {
              "value": "Item 3",
              "text": "Sardinata"
            },
            {
              "value": "Item 4",
              "text": "Tibú"
            }
          ]
        },
        {
          "type": "radiogroup",
          "name": "predio_coca_lugar",
          "title": "7.3 . LUGAR",
          "choices": [
            {
              "value": "1",
              "text": "Cabecera municipal"
            },
            {
              "value": "2",
              "text": "Centro poblado"
            },
            {
              "value": "3",
              "text": "Corregimiento"
            },
            {
              "value": "4",
              "text": "Vereda"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio_coca_lugar_nombre",
          "visibleIf": "{predio_coca_lugar} <> 4",
          "title": "Nombre"
        },
        {
          "type": "text",
          "name": "predio_coca_lugar_direccion",
          "visibleIf": "{predio_coca_lugar} <> 4",
          "title": "Dirección"
        },
        {
          "type": "dropdown",
          "name": "predio_coca_vereda",
          "visibleIf": "{predio_coca_lugar} = 4",
          "title": "Vereda",
          "choices": [
            {
              "value": "Item 1",
              "text": "Sin vereda"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio_coca_vereda_otra",
          "title": "Otra vereda",
          "description": "Si la vereda no aparece en la lista, se digita el nombre de la vereda"
        }
      ]
    },
    {
      "name": "page7",
      "elements": [
        {
          "type": "html",
          "name": "question49",
          "html": "<h4>\n8. Ingrese las coordenadas del lote de coca. \n</h4>"
        },
        {
          "type": "text",
          "name": "predio_coca_latitud",
          "title": "Latitud (x.y °)"
        },
        {
          "type": "text",
          "name": "predio_coca_longitud",
          "title": "Longitud (x.y °) "
        },
        {
          "type": "text",
          "name": "predio_coca_altitud",
          "title": "Altitud (m) "
        },
        {
          "type": "text",
          "name": "question53",
          "title": "Precisión (m)"
        },
        {
          "type": "radiogroup",
          "name": "predio_coca_ubicacion",
          "title": "9. ¿En cuál de los siguientes lugares se encuentra el predio en donde ejecutará el proyecto productivo? ",
          "choices": [
            {
              "value": "1",
              "text": "En el mismo predio donde está la coca"
            },
            {
              "value": "2",
              "text": "En otro sitio"
            }
          ]
        },
        {
          "type": "html",
          "name": "question55",
          "visibleIf": "{predio_coca_ubicacion} = '2'",
          "title": "Cual?",
          "html": "<h4>\nCuál\n</h4>"
        },
        {
          "type": "dropdown",
          "name": "predio_coca_otro_departamento",
          "visibleIf": "{predio_coca_ubicacion} = '2'",
          "title": "9.1. Departamento",
          "choices": [
            {
              "value": "Item 1",
              "text": "Norte de santander"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio_coca_otro_municipio",
          "visibleIf": "{predio_coca_ubicacion} = '2'",
          "title": "9.2. Municipio",
          "choices": [
            {
              "value": "Item 1",
              "text": "Convención"
            },
            {
              "value": "Item 2",
              "text": "El tarra"
            },
            {
              "value": "Item 3",
              "text": "Sardinata"
            },
            {
              "value": "Item 4",
              "text": "Tibú"
            }
          ]
        },
        {
          "type": "radiogroup",
          "name": "predio_coca_otro_lugar",
          "visibleIf": "{predio_coca_ubicacion} = '2'",
          "title": "9.3. Lugar",
          "choices": [
            {
              "value": "1",
              "text": "Cabecera municipal"
            },
            {
              "value": "2",
              "text": "Centro poblado"
            },
            {
              "value": "3",
              "text": "Corregimiento"
            },
            {
              "value": "4",
              "text": "Vereda"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio_coca_otro_nombre",
          "visibleIf": "{predio_coca_otro_lugar} != '4'",
          "title": "Nombre"
        },
        {
          "type": "text",
          "name": "predio_coca_otro_direccion",
          "visibleIf": "{predio_coca_otro_lugar} != '4'",
          "title": "Dirección"
        },
        {
          "type": "dropdown",
          "name": "predio_coca_otro_vereda",
          "visibleIf": "{predio_coca_otro_lugar} = 4",
          "title": "Vereda",
          "choices": [
            {
              "value": "Item 1",
              "text": "Sin vereda"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio_coca_otro_vereda_otra",
          "visibleIf": "{predio_coca_otro_lugar} = 4",
          "title": "Otra vereda",
          "description": "Si la vereda no aparece en la lista, se digita el nombre de la vereda"
        }
      ]
    },
    {
      "name": "page8",
      "elements": [
        {
          "type": "radiogroup",
          "name": "linea_productiva",
          "title": "10. Seleccione una de las siguientes líneas productivas lícitas. ",
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
              "value": "43",
              "text": "No Agropecuaria (pequeño comercio, bienes o servicios)"
            }
          ]
        },
        {
          "type": "radiogroup",
          "name": "establece_fortalece",
          "title": "11. ¿La línea productiva seleccionada es para establecimiento o fortalecimiento del proyecto productivo? ",
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
        }
      ]
    }
  ],
  "pagePrevText": "Página anterior",
  "pageNextText": "Página siguiente",
  "completeText": "Enviar",
  "showNavigationButtons": true
}

    
  const survey = new Model(json);
  
  survey.onCompleting.add((sender, options) => {
      options.allowComplete = false;
      console.log('sender.data')
      console.log(sender.data)

      const senderData = {
        ...sender.data,
        actividades_otro_predio: sender.data.actividades_otro_predio.length ? sender.data.actividades_otro_predio.join(", ") : "",
        grupo_especial: sender.data.grupo_especial.length ? sender.data.grupo_especial.join(", ") : "",
        foto_doc_frente: Array.isArray(sender.data.foto_doc_frente) && sender.data.foto_doc_frente.length > 0 ? sender.data.foto_doc_frente[0].content : "",
        foto_doc_atras: Array.isArray(sender.data.foto_doc_atras) && sender.data.foto_doc_atras.length > 0 ? sender.data.foto_doc_atras[0].content : "",
        tipo_documento_file: Array.isArray(sender.data.tipo_documento_file) && sender.data.tipo_documento_file.length > 0 ? sender.data.tipo_documento_file[0].content : "",
        predio1_documento_arraigo: Array.isArray(sender.data.predio1_documento_arraigo) && sender.data.predio1_documento_arraigo.length > 0 ? sender.data.predio1_documento_arraigo[0].content : "",
        predio2_documento_arraigo: Array.isArray(sender.data.predio2_documento_arraigo) && sender.data.predio2_documento_arraigo.length > 0 ? sender.data.predio2_documento_arraigo[0].content : "",
        predio3_documento_arraigo: Array.isArray(sender.data.predio3_documento_arraigo) && sender.data.predio3_documento_arraigo.length > 0 ? sender.data.predio3_documento_arraigo[0].content : "",
        predio4_documento_arraigo: Array.isArray(sender.data.predio4_documento_arraigo) && sender.data.predio4_documento_arraigo.length > 0 ? sender.data.predio4_documento_arraigo[0].content : "",
        predio5_documento_arraigo: Array.isArray(sender.data.predio5_documento_arraigo) && sender.data.predio5_documento_arraigo.length > 0 ? sender.data.predio5_documento_arraigo[0].content : "",
        predio6_documento_arraigo: Array.isArray(sender.data.predio6_documento_arraigo) && sender.data.predio6_documento_arraigo.length > 0 ? sender.data.predio6_documento_arraigo[0].content : "",
        predio7_documento_arraigo: Array.isArray(sender.data.predio7_documento_arraigo) && sender.data.predio7_documento_arraigo.length > 0 ? sender.data.predio7_documento_arraigo[0].content : "",
        predio8_documento_arraigo: Array.isArray(sender.data.predio8_documento_arraigo) && sender.data.predio8_documento_arraigo.length > 0 ? sender.data.predio8_documento_arraigo[0].content : "",
        predio9_documento_arraigo: Array.isArray(sender.data.predio9_documento_arraigo) && sender.data.predio9_documento_arraigo.length > 0 ? sender.data.predio9_documento_arraigo[0].content : "",
        predio10_documento_arraigo: Array.isArray(sender.data.predio10_documento_arraigo) && sender.data.predio10_documento_arraigo.length > 0 ? sender.data.predio10_documento_arraigo[0].content : "",
        predio1_arraigo_documento_soporte: Array.isArray(sender.data.predio1_arraigo_documento_soporte) && sender.data.predio1_arraigo_documento_soporte.length > 0 ? sender.data.predio1_arraigo_documento_soporte[0].content : "",
        predio2_arraigo_documento_soporte: Array.isArray(sender.data.predio2_arraigo_documento_soporte) && sender.data.predio2_arraigo_documento_soporte.length > 0 ? sender.data.predio2_arraigo_documento_soporte[0].content : "",
        predio3_arraigo_documento_soporte: Array.isArray(sender.data.predio3_arraigo_documento_soporte) && sender.data.predio3_arraigo_documento_soporte.length > 0 ? sender.data.predio3_arraigo_documento_soporte[0].content : "",
        predio4_arraigo_documento_soporte: Array.isArray(sender.data.predio4_arraigo_documento_soporte) && sender.data.predio4_arraigo_documento_soporte.length > 0 ? sender.data.predio4_arraigo_documento_soporte[0].content : "",
        predio5_arraigo_documento_soporte: Array.isArray(sender.data.predio5_arraigo_documento_soporte) && sender.data.predio5_arraigo_documento_soporte.length > 0 ? sender.data.predio5_arraigo_documento_soporte[0].content : "",
        predio6_arraigo_documento_soporte: Array.isArray(sender.data.predio6_arraigo_documento_soporte) && sender.data.predio6_arraigo_documento_soporte.length > 0 ? sender.data.predio6_arraigo_documento_soporte[0].content : "",
        predio7_arraigo_documento_soporte: Array.isArray(sender.data.predio7_arraigo_documento_soporte) && sender.data.predio7_arraigo_documento_soporte.length > 0 ? sender.data.predio7_arraigo_documento_soporte[0].content : "",
        predio8_arraigo_documento_soporte: Array.isArray(sender.data.predio8_arraigo_documento_soporte) && sender.data.predio8_arraigo_documento_soporte.length > 0 ? sender.data.predio8_arraigo_documento_soporte[0].content : "",
        predio9_arraigo_documento_soporte: Array.isArray(sender.data.predio9_arraigo_documento_soporte) && sender.data.predio9_arraigo_documento_soporte.length > 0 ? sender.data.predio9_arraigo_documento_soporte[0].content : "",
        predio10_arraigo_documento_soporte: Array.isArray(sender.data.predio10_arraigo_documento_soporte) && sender.data.predio10_arraigo_documento_soporte.length > 0 ? sender.data.predio10_arraigo_documento_soporte[0].content : "",
        firma_file: Array.isArray(sender.data.firma_file) && sender.data.firma_file.length > 0 ? sender.data.firma_file[0].content : "",
        documento_pertenencia_etnica_file: Array.isArray(sender.data.documento_pertenencia_etnica_file) && sender.data.documento_pertenencia_etnica_file.length > 0 ? sender.data.documento_pertenencia_etnica_file[0].content : "",
      };

    
    // personasNUcleo.value = personas


    uCrud.create(senderData)
        .then((item) => {
            
            console.log(item)
            const personas= []// Define personas como un objeto con claves dinámicas

            for (let i = 1; i <= 10; i++) {
                if (senderData[`persona${i}_nombre`]) { // Verifica si existen datos
                    personas.push({
                        ficha: ( item as any).id,
                        nombre: senderData[`persona${i}_nombre`],
                        tipo_identificacion: senderData[`persona${i}_tipo_identificacion`],
                        numero_identificacion: senderData[`persona${i}_num_identificación`],
                        fecha_expedicion_identificacion: senderData[`persona${i}_fecha_expedicion_identificacion`],
                        parentesco: senderData[`persona${i}_parentesco`],
                        foto_doc_atras: Array.isArray(senderData[`persona${i}_foto_doc_atras`]) && senderData[`persona${i}_foto_doc_atras`].length > 0 ? senderData[`persona${i}_foto_doc_atras`][0].content : "",
                        foto_doc_frente: Array.isArray(senderData[`persona${i}_foto_doc_frente`]) && senderData[`persona${i}_foto_doc_frente`].length > 0 ? senderData[`persona${i}_foto_doc_frente`][0].content : "",
                        parentesco_otro: senderData[`persona${i}_parentesco_cual`],
                        fecha_nacimiento: senderData[`persona${i}_fecha_nacimiento`],
                        sexo: senderData[`persona${i}_sexo`],
                        estado_civil: senderData[`persona${i}_estado_civil`],
                        grupo_especial: senderData[`persona${i}_atencion_especial`]
                    });
                }
            }
            personasNUcleo.value = personas;
            console.log(personas)
            enviarNucleoFamiliar();

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

    const match = options.name.match(/^persona(\d+)_num_identificación$/);
  
    if (match) {
      const personaIndex = match[1]; // Extrae el número de persona (1-10)

      if (!options.value) return;

      try {
        let loader = uLoading.show({});
        if (parseInt(options.value) < 2000000000) {
          const response = await axios.get(`forms/catatumbo/ficha/validar_nucleo/?documento=${options.value}`);
          console.log(response);

          const status = response.data.status;
          const mostrarKey = `mostrar_persona${personaIndex}`; // Genera la clave correcta

          if (status > 1) {
            survey.setVariable(mostrarKey, false);
            survey.setValue(options.name, ""); // Borra el número de identificación

            let mensajeError = "";
            switch (status) {
              case 2:
                mensajeError = "Usuario con ficha de acuerdo diligenciada. No se puede ingresar como núcleo familiar.";
                break;
              case 3:
                mensajeError = "Usuario se encuentra entre los validados para firma de ficha de acuerdo Catatumbo. No se puede ingresar como núcleo familiar.";
                break;
              case 4:
                mensajeError = "El usuario ha sido titular en el proyecto PNIS. No se puede ingresar como núcleo familiar.";
                break;
              case 5:
                mensajeError = "El usuario ya aparece como nucleo familiar de otro titular. No se puede ingresar como núcleo familiar.";
                break;
            }

            if (mensajeError) uToast.toastError(mensajeError);
          } else {
            survey.setVariable(mostrarKey, true);
          }
        } else {
          const mostrarKey = `mostrar_persona${personaIndex}`;
          survey.setVariable(mostrarKey, false)
          survey.setValue(options.name, "");
          uToast.toastError("Digite un número de cedula valido");
        }
        loader.hide();
      } catch (error) {
        console.error("Error al consultar el endpoint:", error);
      }
    }
    if (options.name === "latitud") {
      if (options.value === null || options.value === "")
        return;
      if (options.value < 6.839111 || options.value > 9.316977) {
        survey.setValue(options.name, "");
        uToast.toastError("La latitud ingresada esta por fuera de la ubicación establecida. Confirme los datos e ingreselos de nuevo");  
      }    
    }
    if (options.name === "longitud") {
      if (options.value === null || options.value === "")
        return;
      if (options.value < -73.644220 || options.value > -72.025764) {
        survey.setValue(options.name, "");
        uToast.toastError("La Longitud ingresada esta por fuera de la ubicación establecida. Confirme los datos e ingreselos de nuevo");  
      }    
    }

    if (options.name.startsWith("predio") && options.name.endsWith("_latitud")) {
      if (options.value === null || options.value === "") return;
      if (options.value < 6.839111 || options.value > 9.316977) {
        survey.setValue(options.name, "");
        uToast.toastError("La latitud ingresada está fuera de la ubicación establecida. Confirme los datos e ingréselos de nuevo");
      }
    }

    if (options.name.startsWith("predio") && options.name.endsWith("_longitud")) {
      if (options.value === null || options.value === "") return;
      if (options.value < -73.644220 || options.value > -72.025764) {
        survey.setValue(options.name, "");
        uToast.toastError("La longitud ingresada está fuera de la ubicación establecida. Confirme los datos e ingréselos de nuevo");
      }
    }

    if (options.name === "nombre") {
      if (options.value === null || options.value === "")
        return;
        sender.setVariable("nombrecompleto", options.value);
        const fechaHoy = new Date().toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });

        sender.setVariable("fechahoy", fechaHoy);
        
    }

    if (["predio1_area_coca", "predio2_area_coca", "predio3_area_coca", "predio4_area_coca", "predio5_area_coca", "predio6_area_coca", "predio7_area_coca", "predio8_area_coca", "predio9_area_coca", "predio10_area_coca"].includes(options.name)) {
      if (!options.value) return;

      // Obtener los valores asegurando que sean números y no NaN
      const totalHectareas =
        (parseFloat(sender.getValue("predio1_area_coca")) || 0) +
        (parseFloat(sender.getValue("predio2_area_coca")) || 0) +
        (parseFloat(sender.getValue("predio3_area_coca")) || 0) +
        (parseFloat(sender.getValue("predio4_area_coca")) || 0) +
        (parseFloat(sender.getValue("predio5_area_coca")) || 0) +
        (parseFloat(sender.getValue("predio6_area_coca")) || 0) +
        (parseFloat(sender.getValue("predio7_area_coca")) || 0) +
        (parseFloat(sender.getValue("predio8_area_coca")) || 0) +
        (parseFloat(sender.getValue("predio9_area_coca")) || 0) +
        (parseFloat(sender.getValue("predio10_area_coca")) || 0) ;

      sender.setVariable("totalhectareas", totalHectareas);
    }

    if (options.name === "predio_nombre") {
      if (options.value === null || options.value === "")
        return;
        sender.setVariable("predionombre", options.value);
        
    }

    if (options.name === "municipio") {
      if (options.value === null || options.value === "")
        return;
       
        const municipioId = sender.getValue("municipio");

        const municipioArraigoQuestion = survey.getQuestionByName("municipio");
        const municipioNombre = municipioArraigoQuestion.choices.find((m: { value: any; }) => m.value === municipioId)?.text || "";
        sender.setVariable("municipio_arraigo", municipioNombre);
    }
    if (options.name === "vereda") {
      if (options.value === null || options.value === "")
        return;
       
        const veredaId = sender.getValue("vereda");

        const veredaArraigoQuestion = survey.getQuestionByName("vereda");
        const veredaNombre = veredaArraigoQuestion.choices.find((m: { value: any; }) => m.value === veredaId)?.text || "";
        sender.setVariable("vereda_arraigo", veredaNombre);
    }
    if (options.name === "vereda_otra") {
      if (options.value === null || options.value === "")
        return;
        sender.setVariable("vereda_arraigo", options.value);
        
    }
    if (options.name === "numero_identificacion") {
      if (options.value === null || options.value === "")
        return;

      try {
        let loader = uLoading.show({});
        
        axios.get(`api/1.0/core/validationregister/filterbydocumentnumber/${options.value}/4/no`)
        .then((resp: any) => {
          let alertQuestion = survey.getQuestionByName("alertasvalidacion");

          if (alertQuestion) {
            // Construir lista de observaciones en color rojo
            let observationsList = resp.data.map((item: { observation: any; validationitems_name:any;}) => `<li style="color: red;">${item.validationitems_name} - NO - ${item.observation}</li>`).join("");

            // Asignar HTML con la lista
            alertQuestion.html = `<center><ul>${observationsList}</ul></center>`;
            alertQuestion.updateElement(); // Refrescar la vista
          }
        })
        .catch(error => {
          console.error("Error en la petición:", error);
        });
        if (options.value < 2000000000){
          axios.get(`forms/catatumbo/ficha/validar_documento/?documento=${options.value}`)
            .then((resp: any) => {
              console.log('resp.data.status')
              console.log(resp.data.status)
              
              if (resp.data.status === 1) {
                const data = resp.data.data

                let latitud = "0";
                let longitud = "0";
                let altitud = "0";

                // Verificar si existen coordenadas y si tienen el formato esperado
                if (data.coordenadas) {
                    const match = data.coordenadas.match(/\(([^)]+)\)/);

                    if (match && match[1]) {
                        [longitud, latitud, altitud] = match[1].split(" ");
                    } else {
                        console.warn("Las coordenadas no tienen el formato esperado.");
                    }
                } else {
                    console.warn("No hay coordenadas disponibles.");
                }

                // Asignar valores a SurveyJS, incluso si son cadenas vacías
                survey.setValue("latitud", latitud);
                survey.setValue("longitud", longitud);
                survey.setValue("altura", altitud);

                survey.setValue("predio1_latitud", latitud);
                survey.setValue("predio1_longitud", longitud);
                survey.setValue("predio1_altura", altitud);

                


                if (data.foto_documento_frente && data.foto_documento_frente.trim().length > 0) {
                  survey.getQuestionByName("foto_doc_frente").visible = false;
                } else {
                  survey.setVariable("mostrar_documentos", true);
                }
                if (data.foto_documento_respaldo && data.foto_documento_respaldo.trim().length > 0) {
                  survey.getQuestionByName("foto_doc_atras").visible = false;
                } else {
                  survey.setVariable("mostrar_documentos", true);
                }


                const fields = [
                  { "origin":['nombres', 'apellidos'], target:'nombre' },
                  { "origin":['nombres', 'apellidos'], target:'nombre' },
                  { "origin": ["fecha_nacimiento"], "target": "fecha_nacimiento" },
                  { "origin": ["submission_date"], "target": "fecha_expedicion" },
                  { "origin": ["sexo"], "target": "sexo" },
                  { "origin": ["correo"], "target": "email" },
                  { "origin": ["tipo_documento"], "target": "tipo_identificacion" },
                  { "origin": ["orientacion"], "target": "identidad_genero" },
                  { "origin": ["educacion"], "target": "escolaridad" },
                  { "origin": ["telefono"], "target": "numero_contacto" },
                  { "origin": ["area_predio"], "target": "predio1_area" },
                  { "origin": ["area_coca"], "target": "predio1_area_coca" },
                  { "origin": ["predio_residencia"], "target": "predio_nombre" },
                  { "origin": ["area_predio"], "target": "predio_area" },
                  
                ]

                

                fields.forEach(field => {
                  let dataOrigin = field.origin.map(key => (data as any)[key]).filter(Boolean).join(" ");
                  if (survey.getQuestionByName(field.target)) {
                    survey.setValue(field.target, dataOrigin);
                    survey.getQuestionByName(field.target).readOnly = true;
                  } else {
                    console.warn(`El campo '${field.target}' no existe en la encuesta.`);
                  }
                });

                
                survey.showNavigationButtons = true;
                survey.setVariable("mostrar_campos", true);
                
              } else {
                if (resp.data.status === 2) {
                  uToast.toastError("Usuario con ficha diligenciada. No se puede continuar con el formulario.");
                }  else if (resp.data.status === 3) {
                  uToast.toastError("El documento no se encuentra en la lista de pre registro. No se puede continuar con el formulario.");
                } else if (resp.data.status === 4) {
                  uToast.toastError("El usuario no se encuentra Validado. No se puede continuar con el formulario.");
                } else {
                  uToast.toastError("El usuario ha sido titular en el proyecto PNIS");
                }
                survey.showNavigationButtons = false;
                survey.setVariable("mostrar_campos", false);
                
              }
              axios.get(`api/1.0/core/cedulasrnec/getbyidentification/${options.value}`)
              .then((resp: any) => {
                console.log(resp)
                survey.setValue("fecha_nacimiento", resp.data.fecha_nacimiento); 
                survey.setValue("fecha_expedicion", resp.data.fecha_expedicion);   
              })
              .catch((err: any) => { console.log(err) })
              
            })
          .catch((err: any) => { console.log(err) })
          .finally(() => { loader.hide() });
        } else {
          survey.setVariable("mostrar_campos", false);
          uToast.toastError("Digite un número de cedula valido");
          loader.hide()
        }  
      } catch (error) {
        console.error("Error al consultar el endpoint:", error);
      }
    }

    const departamentoQuestion = survey.getQuestionByName("departamento");
    const predio1departamentoQuestion = survey.getQuestionByName("predio1_departamento");
    const predio2departamentoQuestion = survey.getQuestionByName("predio2_departamento");
    const predio3departamentoQuestion = survey.getQuestionByName("predio3_departamento");
    const predio4departamentoQuestion = survey.getQuestionByName("predio4_departamento");
    const predio5departamentoQuestion = survey.getQuestionByName("predio5_departamento");
    const predio6departamentoQuestion = survey.getQuestionByName("predio6_departamento");
    const predio7departamentoQuestion = survey.getQuestionByName("predio7_departamento");
    const predio8departamentoQuestion = survey.getQuestionByName("predio8_departamento");
    const predio9departamentoQuestion = survey.getQuestionByName("predio9_departamento");
    const predio10departamentoQuestion = survey.getQuestionByName("predio10_departamento");
    const desplazadodepartamentoQuestion = survey.getQuestionByName("desplazado_departamento");

    
    if (departamentoQuestion) {
      departamentoQuestion.choices = itemsDepartments.value;
    }
    if (desplazadodepartamentoQuestion) {
      desplazadodepartamentoQuestion.choices = itemsDepartments.value;
    }
    if (predio1departamentoQuestion) {
      predio1departamentoQuestion.choices = itemsDepartments.value;
    }
    if (predio2departamentoQuestion) {
      predio2departamentoQuestion.choices = itemsDepartments.value;
    }
    if (predio3departamentoQuestion) {
      predio3departamentoQuestion.choices = itemsDepartments.value;
    }
    if (predio4departamentoQuestion) {
      predio4departamentoQuestion.choices = itemsDepartments.value;
    }
    if (predio5departamentoQuestion) {
      predio5departamentoQuestion.choices = itemsDepartments.value;
    }
    if (predio6departamentoQuestion) {
      predio6departamentoQuestion.choices = itemsDepartments.value;
    }
    if (predio7departamentoQuestion) {
      predio7departamentoQuestion.choices = itemsDepartments.value;
    }
    if (predio8departamentoQuestion) {
      predio8departamentoQuestion.choices = itemsDepartments.value;
    }
    if (predio9departamentoQuestion) {
      predio9departamentoQuestion.choices = itemsDepartments.value;
    }
    if (predio10departamentoQuestion) {
      predio10departamentoQuestion.choices = itemsDepartments.value;
    }
    const municipioQuestion = survey.getQuestionByName("municipio");
    const predio1municipioQuestion = survey.getQuestionByName("predio1_municipio");
    const predio2municipioQuestion = survey.getQuestionByName("predio2_municipio");
    const predio3municipioQuestion = survey.getQuestionByName("predio3_municipio");
    const predio4municipioQuestion = survey.getQuestionByName("predio4_municipio");
    const predio5municipioQuestion = survey.getQuestionByName("predio5_municipio");
    const predio6municipioQuestion = survey.getQuestionByName("predio6_municipio");
    const predio7municipioQuestion = survey.getQuestionByName("predio7_municipio");
    const predio8municipioQuestion = survey.getQuestionByName("predio8_municipio");
    const predio9municipioQuestion = survey.getQuestionByName("predio9_municipio");
    const predio10municipioQuestion = survey.getQuestionByName("predio10_municipio");
    const desplazadomunicipioQuestion = survey.getQuestionByName("desplazado_municipio");

    
    const municipioNucleoQuestion = survey.getQuestionByName("municipio_nucleo_familiar");
    const corregimientoQuestion = survey.getQuestionByName("corregimiento");
    const veredaQuestion = survey.getQuestionByName("vereda");
    const predio1corregimientoQuestion = survey.getQuestionByName("predio1_corregimiento");
    const veredapredio1Question = survey.getQuestionByName("predio1_vereda");
    const predio2corregimientoQuestion = survey.getQuestionByName("predio2_corregimiento");
    const veredapredio2Question = survey.getQuestionByName("predio2_vereda");
    const predio3corregimientoQuestion = survey.getQuestionByName("predio3_corregimiento");
    const veredapredio3Question = survey.getQuestionByName("predio3_vereda");
    const predio4corregimientoQuestion = survey.getQuestionByName("predio4_corregimiento");
    const veredapredio4Question = survey.getQuestionByName("predio4_vereda");
    const predio5corregimientoQuestion = survey.getQuestionByName("predio5_corregimiento");
    const veredapredio5Question = survey.getQuestionByName("predio5_vereda");
    const predio6corregimientoQuestion = survey.getQuestionByName("predio6_corregimiento");
    const veredapredio6Question = survey.getQuestionByName("predio6_vereda");
    const predio7corregimientoQuestion = survey.getQuestionByName("predio7_corregimiento");
    const veredapredio7Question = survey.getQuestionByName("predio7_vereda");
    const predio8corregimientoQuestion = survey.getQuestionByName("predio8_corregimiento");
    const veredapredio8Question = survey.getQuestionByName("predio8_vereda");
    const predio9corregimientoQuestion = survey.getQuestionByName("predio9_corregimiento");
    const veredapredio9Question = survey.getQuestionByName("predio9_vereda");
    const predio10corregimientoQuestion = survey.getQuestionByName("predio10_corregimiento");
    const veredapredio10Question = survey.getQuestionByName("predio10_vereda");

    if (options.name === "municipio") {
        const municipio_id = options.value;
        let loading = uLoading.show({});
        await getTownShipsList(municipio_id);
          if (corregimientoQuestion) {
            corregimientoQuestion.choices = itemSTownShips.value
          }
        loading.hide()
    }

    if (options.name === "corregimiento") {
        const vereda_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(vereda_id);
          if (veredaQuestion) {
            veredaQuestion.choices = itemsVillages.value
          }
        loading.hide()
    }

    if (options.name === "predio1_municipio") {
        const municipio_id = options.value;
        let loading = uLoading.show({});
        await getTownShipsList(municipio_id);
          if (predio1corregimientoQuestion) {
            predio1corregimientoQuestion.choices = itemSTownShips.value
          }
        loading.hide()
    }

    if (options.name === "predio1_corregimiento") {
        const vereda_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(vereda_id);
          if (veredapredio1Question) {
            veredapredio1Question.choices = itemsVillages.value
          }
        loading.hide()
    }

    if (options.name === "predio2_municipio") {
        const municipio_id = options.value;
        let loading = uLoading.show({});
        await getTownShipsList(municipio_id);
          if (predio2corregimientoQuestion) {
            predio2corregimientoQuestion.choices = itemSTownShips.value
          }
        loading.hide()
    }

    if (options.name === "predio2_corregimiento") {
        const vereda_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(vereda_id);
          if (veredapredio2Question) {
            veredapredio2Question.choices = itemsVillages.value
          }
        loading.hide()
    }

    if (options.name === "predio3_municipio") {
      const municipio_id = options.value;
        let loading = uLoading.show({});
        await getTownShipsList(municipio_id);
          if (predio3corregimientoQuestion) {
            predio3corregimientoQuestion.choices = itemSTownShips.value
          }
        loading.hide()
    }

    if (options.name === "predio3_corregimiento") {
        const vereda_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(vereda_id);
          if (veredapredio3Question) {
            veredapredio3Question.choices = itemsVillages.value
          }
        loading.hide()
    }

    if (options.name === "predio4_municipio") {
      const municipio_id = options.value;
        let loading = uLoading.show({});
        await getTownShipsList(municipio_id);
          if (predio4corregimientoQuestion) {
            predio4corregimientoQuestion.choices = itemSTownShips.value
          }
        loading.hide()
    }

    if (options.name === "predio4_corregimiento") {
        const vereda_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(vereda_id);
          if (veredapredio4Question) {
            veredapredio4Question.choices = itemsVillages.value
          }
        loading.hide()
    }

    if (options.name === "predio5_municipio") {
      const municipio_id = options.value;
        let loading = uLoading.show({});
        await getTownShipsList(municipio_id);
          if (predio5corregimientoQuestion) {
            predio5corregimientoQuestion.choices = itemSTownShips.value
          }
        loading.hide()
    }

    if (options.name === "predio5_corregimiento") {
        const vereda_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(vereda_id);
          if (veredapredio5Question) {
            veredapredio5Question.choices = itemsVillages.value
          }
        loading.hide()
    }

    if (options.name === "predio6_municipio") {
      const municipio_id = options.value;
        let loading = uLoading.show({});
        await getTownShipsList(municipio_id);
          if (predio6corregimientoQuestion) {
            predio6corregimientoQuestion.choices = itemSTownShips.value
          }
        loading.hide()
    }

    if (options.name === "predio6_corregimiento") {
        const vereda_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(vereda_id);
          if (veredapredio6Question) {
            veredapredio6Question.choices = itemsVillages.value
          }
        loading.hide()
    }

    if (options.name === "predio7_municipio") {
      const municipio_id = options.value;
        let loading = uLoading.show({});
        await getTownShipsList(municipio_id);
          if (predio7corregimientoQuestion) {
            predio7corregimientoQuestion.choices = itemSTownShips.value
          }
        loading.hide()
    }

    if (options.name === "predio7_corregimiento") {
        const vereda_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(vereda_id);
          if (veredapredio7Question) {
            veredapredio7Question.choices = itemsVillages.value
          }
        loading.hide()
    }

    if (options.name === "predio8_municipio") {
      const municipio_id = options.value;
        let loading = uLoading.show({});
        await getTownShipsList(municipio_id);
          if (predio8corregimientoQuestion) {
            predio8corregimientoQuestion.choices = itemSTownShips.value
          }
        loading.hide()
    }

    if (options.name === "predio8_corregimiento") {
        const vereda_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(vereda_id);
          if (veredapredio8Question) {
            veredapredio8Question.choices = itemsVillages.value
          }
        loading.hide()
    }

    if (options.name === "predio9_municipio") {
      const municipio_id = options.value;
        let loading = uLoading.show({});
        await getTownShipsList(municipio_id);
          if (predio9corregimientoQuestion) {
            predio9corregimientoQuestion.choices = itemSTownShips.value
          }
        loading.hide()
    }

    if (options.name === "predio9_corregimiento") {
        const vereda_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(vereda_id);
          if (veredapredio9Question) {
            veredapredio9Question.choices = itemsVillages.value
          }
        loading.hide()
    }

    if (options.name === "predio10_municipio") {
      const municipio_id = options.value;
        let loading = uLoading.show({});
        await getTownShipsList(municipio_id);
          if (predio10corregimientoQuestion) {
            predio10corregimientoQuestion.choices = itemSTownShips.value
          }
        loading.hide()
    }

    if (options.name === "predio10_corregimiento") {
        const vereda_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(vereda_id);
          if (veredapredio10Question) {
            veredapredio10Question.choices = itemsVillages.value
          }
        loading.hide()
    }

    if (options.name === "predio1_municipio") {
        const municipio_id = options.value;
        let loading = uLoading.show({});
        await getTownShipsList(municipio_id);
          if (veredapredio1Question) {
            veredapredio1Question.choices = itemSTownShips.value
          }
        loading.hide()
    }
    
    if (options.name === "departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (municipioQuestion) {
              municipioQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }

    if (options.name === "desplazado_departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (desplazadomunicipioQuestion) {
              desplazadomunicipioQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }

    if (options.name === "predio1_departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (predio1municipioQuestion) {
              predio1municipioQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }

    if (options.name === "predio2_departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (predio2municipioQuestion) {
              predio2municipioQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }


    if (options.name === "predio3_departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (predio3municipioQuestion) {
              predio3municipioQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }

    if (options.name === "predio4_departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (predio4municipioQuestion) {
              predio4municipioQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }

    if (options.name === "predio5_departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (predio5municipioQuestion) {
              predio5municipioQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }

    if (options.name === "predio6_departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (predio6municipioQuestion) {
              predio6municipioQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }

    if (options.name === "predio7_departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (predio7municipioQuestion) {
              predio7municipioQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }

    if (options.name === "predio8_departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (predio8municipioQuestion) {
              predio8municipioQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }

    if (options.name === "predio9_departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (predio9municipioQuestion) {
              predio9municipioQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }

    if (options.name === "predio10_departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (predio10municipioQuestion) {
              predio10municipioQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }



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

<style scoped>
.v-main {
  min-height: calc(100vh - 65px);
  flex-grow: 1;
  background-image: url("/src/assets/img/bg-catatumbo.png");
  background-position: bottom;
  background-size: contain;
}
</style>