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
    import { object } from 'yup';

    

    const uLoading = useLoading();
    const uToast = useToast();

    const uCrud = useCrud("api/2.0/nucleo/persona");
    const uCrud2 = useCrud("api/2.0/nucleo/formpersona");
    const uCrud3 = useCrud("api/2.0/nucleo/personaadjunto");
    const uCrud4 = useCrud("api/2.0/nucleo/predio");
    const uCrud5 = useCrud("api/2.0/nucleo/personalinea");
    const uCrud6 = useCrud("api/2.0/nucleo/lote");

    const modelValue = defineModel<object>();

    const props = defineProps({
      readOnly: {
        type: Boolean,
        default: false,
      },
      polygon: {
        type: Array,
        default: []
      },
      form_title: {
        type: String,
        default: 'Titulo del formulario'
      },
      formid: {
        type: Number,
        default: 1
      },
      faseid: {
        type: Number,
        default: 1
      },
      municipios: {
        type: Object, // con O mayúscula
        default: () => ({
          data: [
            {
              "value": 283,
              "text": "Convención"
            },
            {
              "value": 368,
              "text": "El tarra"
            },
            {
              "value": 963,
              "text": "Sardinata"
            },
            {
              "value": 1040,
              "text": "Teorama"
            },
            {
              "value": 1047,
              "text": "Tibú"
            }
        ],
          datadefault: 0
        })
      },
      departamentos: {
        type: Object, // con O mayúscula
        default: () => ({
          data: [
            { value: 29, text: "Norte de Santander" }
          ],
          datadefault: 29,
          readOnlyState: true
        })
      },
      departamentosVive: {
        type: Object, // con O mayúscula
        default: () => ({
          data: [
            { value: 29, text: "Norte de Santander" }
          ],
          datadefault: 29,
          readOnlyState: true
        })
      }

    });

    const json ={
      "title": props.form_title,
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "boolean",
              "name": "pertenecegrupo",
              "title": "¿Pertenece usted a un Grupo,  Asociación, Cooperativa o Junta de accion comunal  ?",
              "isRequired": true,
              "labelTrue": "Si"
            },
            {
              "type": "dropdown",
              "name": "asociaciones",
              "title": "Asociaciones",
              "visibleIf": "{pertenecegrupo} = true",
              "isRequired": true,
              "choices": [
                {
                  "value": 99999,
                  "text": "Sin asociación"
                }
              ]
            },
            {
              "type": "boolean",
              "name": "tiene_coca",
              "title": "¿Tiene, posee u ocupa usted un predio con cultivos de coca del cual depende su subsistencia?",
              "isRequired": true,
              "labelTrue": "Si"
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
              "choices": props.departamentosVive.data,
              "defaultValue": props.departamentosVive.datadefault,
              "readOnly": props.departamentosVive.readOnlyState
            },
            {
              "type": "dropdown",
              "name": "vive_municipio",
              "title": "1.2 Municipio",
              "isRequired": true,
              "choices": props.municipios.data,
              "defaultValue": props.municipios.datadefault,
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
                  "text": "Corregimiento y Centro poblado"
                },
                {
                  "value": "4",
                  "text": "Vereda"
                }
              ]
            },
            {
              "type": "dropdown",
              "name": "vive_corregimiento",
              "visibleIf": "{vive_lugar} = 2",
              "title": "Corregimiento y Centro poblado",
              "isRequired": true,
              "choices": [
                {
                  "value": "Item 1",
                  "text": "Sin corregimiento"
                }
              ]
            },
            {
              "type": "text",
              "name": "vive_direccion",
              "visibleIf": "{vive_lugar} <> 4 and {vive_lugar} notempty",
              "title": "Dirección"
            },
            // {
            //   "type": "dropdown",
            //   "name": "vive_nucleo_veredal",
            //   "visibleIf": "{vive_lugar} = 4",
            //   "title": "Nucleo veredal",
            //   "isRequired": true,
            //   "choices": [
            //     {
            //       "value": "Item 1",
            //       "text": "Sin nucleo"
            //     }
            //   ]
            // },
            {
              "type": "dropdown",
              "name": "vive_vereda",
              "visibleIf": "{vive_lugar} = 4",
              "title": "Vereda",
              "isRequired": true,
              "choices": [
                {
                  "value": "Item 1",
                  "text": "Sin nucleo"
                }
              ]
            },
            {
              "type": "text",
              "name": "vive_vereda_otra",
              "visibleIf": "{vive_lugar} > 1 and ({vive_vereda} = 9999 or {vive_corregimiento} = 9999)",
              "title": "Nombre",
              "description": "si no aparece en la lista, se digita el nombre del lugar donde vive"
            }
          ]
        },
        {
          "name": "page3",
          "elements": [
            {
              "type": "boolean",
              "name": "desplazado_2025",
              "title": "1.4 Su lugar de residencia cambió después del 16 de enero?  ",
              "isRequired": true,
              "labelTrue": "Si"
            },
            {
              "type": "html",
              "name": "question7",
              "visibleIf": "{desplazado_2025} = true",
              "title": "1.4 Su lugar de residencia cambió después del 16 de enero?  ",
              "html": "<h4>\n Si marcó si: Indique donde vivía antes del 16 de enero de 2025:\n</h4>"
            },
            {
              "type": "dropdown",
              "name": "desplazadoss_departamento",
              "visibleIf": "{desplazado_2025} = true",
              "title": "Departamento",
              "isRequired": true,
              "choices": props.departamentos.data,
              "defaultValue": props.departamentos.datadefault 
            },
            {
              "type": "dropdown",
              "name": "desplazado_municipio",
              "visibleIf": "{desplazado_2025} = true",
              "title": "Municipio",
              "isRequired": true,
              "choices": props.municipios.data,
              "defaultValue": props.municipios.datadefault,
            },
            {
              "type": "radiogroup",
              "name": "deplazado_lugar",
              "visibleIf": "{desplazado_2025} = true",
              "title": "EN QUE LUGAR DEL MUNICIPIO VIVIA USTED?",
              "isRequired": true,
              "choices": [
                {
                  "value": "1",
                  "text": "Cabecera municipal"
                },
                {
                  "value": "2",
                  "text": "Corregimiento y Centro poblado"
                },
                {
                  "value": "4",
                  "text": "Vereda"
                }
              ]
            },
            {
              "type": "dropdown",
              "name": "desplazado_corregimiento",
              "visibleIf": "{deplazado_lugar} = 2 and {desplazado_2025} = true",
              "title": "Corregimiento y centro poblado",
              "choices": [
                {
                  "value": "Item 1",
                  "text": "Sin corregimiento"
                }
              ]
            },
            {
              "type": "text",
              "name": "desplazado_lugar_direccion",
              "visibleIf": "{deplazado_lugar} != '4' and {desplazado_2025} = true",
              "title": "Dirección"
            },
            // {
            //   "type": "dropdown",
            //   "name": "desplazado_nucleo_veredal",
            //   "visibleIf": "{deplazado_lugar} = 4 and {desplazado_2025} = true",
            //   "title": "Nucleo Veredal",
            //   "choices": [
            //     {
            //       "value": "Item 1",
            //       "text": "Sin corregimiento"
            //     }
            //   ]
            // },
            {
              "type": "dropdown",
              "name": "desplazado_vereda",
              "visibleIf": "{deplazado_lugar} = 4 and {desplazado_2025} = true",
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
              "visibleIf": "{deplazado_lugar} > 1  and {desplazado_2025} = true and ({desplazado_vereda} = 9999 or {desplazado_corregimiento} = 9999)",
              "title": "Nombre",
              "description": "si no aparece en la lista, se digita el nombre del lugar donde vive"
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
                  "value": "12",
                  "text": "Cédula de ciudadania"
                }
              ]
            },
            {
              "type": "text",
              "name": "titular_numero_documento",
              "title": "2.4 Número de documento",
              "isRequired": true,
              "inputType": "number"
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
              "isRequired": true,
              "maxLength": 10
            },
            {
              "type": "text",
              "name": "titular_whatsapp",
              "title": "2.10 Whatsapp",
              "isRequired": true,
              "maxLength": 10
            },
            {
              "type": "text",
              "name": "titular_email",
              "title": "2.12  Correo electrónico",
              "isRequired": true,
              "inputType": "email"
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
              "name": "titular_cabeza_familia",
              "visibleIf": "{titular_sexo} = 15",
              "title": "¿Es madre cabeza de familia? ",
              "isRequired": true,
              "labelTrue": "Si"
            },
            {
              "type": "dropdown",
              "name": "tipo_comunidad_etnica",
              "title": "2.14 ¿Usted se identifica como miembro de una comunidad étnica o de alguna de las poblaciones que se describen a continuación? ",
              "isRequired": true,
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
              "name": "tipo_comunidad_etnica_nombre",
              "visibleIf": "({tipo_comunidad_etnica} != '27') and ({tipo_comunidad_etnica} != '28')",
              "title": "¿A qué resguardo indígena o Consejo Comunitario de Comunidades negras pertenece Ud.?",
              "description": "No dejar en blanco. Si no se dispone del dato, escribir NA *"
            },
            {
              "type": "text",
              "name": "num_nucleo",
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
              "title": "4. ¿Cuál es su relación con el Predio donde se encuentra la coca?",
              "isRequired": true,
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
              "isRequired": true,
              "validators": [
                {
                  "type": "regex",
                  "text": "Solo se permiten números positivos de hasta 4 cifras enteras y 4 decimales.",
                  "regex": "^[0-9]{1,4}(\\.[0-9]{1,4})?$"
                }
              ],
              "inputType": "number"
            },
            {
              "type": "text",
              "name": "predio_coca_area_cultivo",
              "title": "6. ¿Cuántas hectáreas de cultivos de coca tiene este predio?",
              "isRequired": true,
              "validators": [
                {
                  "type": "regex",
                  "text": "Solo se permiten números positivos de hasta 4 cifras enteras y 4 decimales.",
                  "regex": "^[0-9]{1,4}(\\.[0-9]{1,4})?$"
                }
              ],
              "inputType": "number"
            },
            {
              "type": "boolean",
              "name": "predio_coca_vive",
              "title": "7. ¿Usted vive en el mismo predio donde tiene el cultivo de coca?",
              "isRequired": true,
              "labelTrue": "Si"
            },
            {
              "type": "html",
              "name": "question7",
              "visibleIf": "{predio_coca_vive} = false",
              "title": "1.4 Su lugar de residencia cambió después del 16 de enero?  ",
              "html": "<h4>\n Si marcó No, Indique donde tiene el cultivo de coca:\n</h4>"
            },
            {
              "type": "dropdown",
              "name": "predio_coca_departamento",
              "visibleIf": "{predio_coca_vive} = false",
              "title": "7.1. Departamento",
              "isRequired": true,
              "choices": props.departamentos.data,
              "defaultValue": props.departamentos.datadefault 
            },
            {
              "type": "dropdown",
              "name": "predio_coca_municipio",
              "visibleIf": "{predio_coca_vive} = false",
              "title": "7.2 Municipio",
              "isRequired": true,
              "choices": props.municipios.data,
              "defaultValue": props.municipios.datadefault,
            },
            {
              "type": "radiogroup",
              "name": "predio_coca_lugar",
              "visibleIf": "{predio_coca_vive} = false",
              "title": "7.3 . LUGAR",
              "isRequired": true,
              "choices": [
                {
                  "value": "1",
                  "text": "Cabecera municipal"
                },
                {
                  "value": "2",
                  "text": "Corregimiento y Centro poblado"
                },
                {
                  "value": "4",
                  "text": "Vereda"
                }
              ]
            },
            {
              "type": "dropdown",
              "name": "predio_coca_corregimiento",
              "visibleIf": "{predio_coca_lugar} = 2 and {predio_coca_vive} = false",
              "title": "Corregimiento y Centro poblado",
              "choices": [
                {
                  "value": "Item 1",
                  "text": "Sin corregimiento"
                }
              ]
            },
            {
              "type": "text",
              "name": "predio_coca_lugar_direccion",
              "visibleIf": "{predio_coca_lugar} <3 and {predio_coca_vive} = false",
              "title": "Dirección"
            },
            // {
            //   "type": "dropdown",
            //   "name": "predio_coca_nucleo_veredal",
            //   "visibleIf": "{predio_coca_lugar} > 2 and {predio_coca_vive} = false",
            //   "title": "Nucleo veredal",
            //   "choices": [
            //     {
            //       "value": "Item 1",
            //       "text": "Sin corregimiento"
            //     }
            //   ]
            // },
            {
              "type": "dropdown",
              "name": "predio_coca_vereda",
              "visibleIf": "{predio_coca_lugar} = 4 and {predio_coca_vive} = false",
              "title": "Vereda",
              "choices": [
                {
                  "value": "Item 1",
                  "text": "Sin corregimiento"
                }
              ]
            },
            {
              "type": "text",
              "name": "predio_coca_vereda_otra",
              "visibleIf": "{predio_coca_lugar} > 1 and {predio_coca_vive} = false  and ({predio_coca_vereda} = 9999 or {predio_coca_corregimiento} = 9999)",
              "title": "Nombre",
              "description": "Si no aparece en la lista, se digita el nombre del lugar donde vive"
            }
          ]
        },
        {
          "name": "page7",
          "elements": [
            {
              "type": "html",
              "name": "question49",
              "html": "<h4>\n8. Ingrese los Datos del lote de coca. \n</h4>"
            },
            // {
            //   "type": "text",
            //   "name": "predio_coca_latitud",
            //   "title": "Latitud (x.y °)",
            //   "isRequired": true,
            //   "validators": [
            //     {
            //       "type": "regex",
            //       "text": "El número debe tener máximo 9 caracteres y hasta 4 decimales.",
            //       "regex": "^-?\\d{1,5}(\\.\\d{1,4})?$"
            //     }
            //   ],
            //   "inputType": "number"
            // },
            {
              "type": "boolean",
              "name": "tienecoordenadas",
              "title": "Tiene las coordenadas GPS del lote de coca?",
              "isRequired": true,
              "labelTrue": "Si"
            },
            {
              "type": "coordinates-question",
              "name": "coordinates",
              "title": "Ingrese sus coordenadas",
              "visibleIf": "{tienecoordenadas} = true",
              "isRequired": true,
              "polygon": props.polygon
            },
            // {
            //   "type": "text",
            //   "name": "predio_coca_longitud",
            //   "title": "Longitud (x.y °) ",
            //   "isRequired": true,
            //   "validators": [
            //     {
            //       "type": "regex",
            //       "text": "El número debe tener máximo 9 caracteres y hasta 4 decimales.",
            //       "regex": "^-?\\d{1,5}(\\.\\d{1,4})?$"
            //     }
            //   ],
            //   "inputType": "number"
            // },
            {
              "type": "text",
              "name": "predio_coca_altitud",
              "title": "Altitud (m)",
              "visibleIf": "{tienecoordenadas} = true",
              "isRequired": true,
              "maxLength": 4,
              "validators": [
                {
                  "type": "regex",
                  "text": "Solo se permiten números positivos de hasta 4 cifras enteras y 4 decimales.",
                  "regex": "^[0-9]{1,4}(\\.[0-9]{1,4})?$"
                }
              ],
              "inputType": "number"
            },
            {
              "type": "text",
              "name": "predio_coca_precision",
              "title": "Precisión (m)",
              "visibleIf": "{tienecoordenadas} = true",
              "isRequired": true,
              "maxLength": 2
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
              "html": "<h4>\nEn que otro sitio ejecutará el proyecto productivo?\n</h4>"
            },
            {
              "type": "dropdown",
              "name": "predio_coca_otro_departamento",
              "visibleIf": "{predio_coca_ubicacion} = '2'",
              "title": "9.1. Departamento",
              "isRequired": true,
              "choices": props.departamentos.data,
              "defaultValue": props.departamentos.datadefault 
            },
            {
              "type": "dropdown",
              "name": "predio_coca_otro_municipio",
              "visibleIf": "{predio_coca_ubicacion} = '2'",
              "title": "9.2. Municipio",
              "isRequired": true,
              "choices": props.municipios.data,
              "defaultValue": props.municipios.datadefault,
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
                  "text": "Corregimiento y Centro poblado"
                },
                {
                  "value": "4",
                  "text": "Vereda"
                }
              ]
            },
            {
              "type": "dropdown",
              "name": "predio_coca_otro_corregimiento",
              "visibleIf": "{predio_coca_otro_lugar} = 2",
              "title": "Corregimiento y Centro poblado",
              "choices": [
                {
                  "value": "Item 1",
                  "text": "Sin Corregimiento"
                }
              ]
            },
            {
              "type": "text",
              "name": "predio_coca_otro_direccion",
              "visibleIf": "{predio_coca_otro_lugar} != 4",
              "title": "Dirección"
            },
            // {
            //   "type": "dropdown",
            //   "name": "predio_coca_otro_nucleo_veredal",
            //   "visibleIf": "{predio_coca_otro_lugar} = 4",
            //   "title": "Nucleo veredal",
            //   "choices": [
            //     {
            //       "value": "Item 1",
            //       "text": "Sin Corregimiento"
            //     }
            //   ]
            // },
            {
              "type": "dropdown",
              "name": "predio_coca_otro_vereda",
              "visibleIf": "{predio_coca_otro_lugar} = 4",
              "title": "Vereda",
              "choices": [
                {
                  "value": "Item 1",
                  "text": "Sin Corregimiento"
                }
              ]
            },
            {
              "type": "text",
              "name": "predio_coca_otro_vereda_otra",
              "visibleIf": "{predio_coca_otro_lugar} > 1  and ({predio_coca_otro_vereda} = 9999 or {predio_coca_otro_corregimiento} = 9999)",
              "title": "Nombre",
              "description": "Si  no aparece en la lista, se digita el nombre del lugar donde vive"
            }
          ]
        },
        {
          "name": "page8",
          "elements": [
            {
              "type": "radiogroup",
              "name": "establece_fortalece",
              "isRequired": true,
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
            },
            {
              "type": "radiogroup",
              "name": "linea_productiva",
              "title": "10. Seleccione una de las siguientes líneas productivas lícitas. ",
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
                  "value": "43",
                  "text": "No Agropecuaria (pequeño comercio, bienes o servicios)"
                },
                {
                  "value": "101",
                  "text": "Otra",
                  "visibleIf": "{establece_fortalece} = '45'"
                }
              ]
            },
            {
              "type": "text",
              "name": "otra_cual",
              "visibleIf": "{linea_productiva} = '101' and {establece_fortalece} = '45'",
              "title": "Cual otra línea"
            },
            {
              "type": "html",
              "name": "question1",
              "html": "<h4>Terminos y condiciones</h4>\n<a target = \"blank\" href=\"https://stpnis.blob.core.windows.net/testdsci/Terminos_catatumbo/13022025_ConvocatoriaFinal_v13%2027.2.25.pdf\"> Ver términos y condiciones </a>"
            },
            {
              "type": "radiogroup",
              "name": "question2",
              "title": "He leído y acepto los términos y condiciones",
              "isRequired": true,
              "choices": [
                {
                  "value": "1",
                  "text": "Si"
                }
              ]
            },
            {
              "type": "html",
              "name": "question5",
              "html": "<h4> Tratamiento de datos personales</h4>\n<a target = \"blank\" href=\"https://centralpdet.renovacionterritorio.gov.co/wp-content/uploads/Documentos/Datos%20personales/2022-09-12_152912_706495414.pdf\"> Ver Tratamiento de Datos Personales </a>"
            },
            {
              "type": "radiogroup",
              "name": "question6",
              "title": "He leído y acepto el tratamiento de datos personales",
              "isRequired": true,
              "choices": [
                {
                  "value": "Item 1",
                  "text": "Si"
                }
              ]
            }
          ]
        }
      ],
      "pagePrevText": "Página anterior",
      "pageNextText": "Página siguiente",
      "completeText": "Enviar"
    };
  

  const itemsVillages = ref<Array<{ value: number; text: string }>>([]);
  const getVillageList = async (ubicacionId: number, tipo: string) => {
      try {
      const response = await axios.get(`/api/2.0/nucleo/ubicacion/by-id/${ubicacionId}/${tipo}`);
      itemsVillages.value = response.data.map((dept: any) => ({
          value: dept.id,
          text: dept.nombre // Asegurar compatibilidad
      }));
      } catch (error) {
      console.error("Error fetching village list:", error);
      }
  };

  const itemsAsociaciones = ref<Array<{ value: number; text: string }>>([]);
  const getAsociaciones = async () => {
    try {
      const response = await axios.get(`/api/2.0/nucleo/asociaciones/`);
      const results = response?.data?.results || [];

      if (results.length === 0) {
        itemsAsociaciones.value = [{ value: 99999, text: 'Sin asociación' }];
      } else {
        itemsAsociaciones.value = results.map((asocia: any) => ({
          value: asocia.cub,
          text: asocia.nombre
        }));
      }

      console.log('itemsAsociaciones', itemsAsociaciones.value);
    } catch (error) {
      console.error("Error fetching village list:", error);
      // En caso de error también puedes mostrar "Sin asociación" si lo deseas
      itemsAsociaciones.value = [{ value: 0, text: 'Sin asociación' }];
    }
  };

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

  const survey = new Model(json);

  survey.onCompleting.add((sender, options) => {
    options.allowComplete = false;
    
    const personaData = {
      tipo_identificacion_id: parseInt(sender.data.titular_tipo_identificacion),
      cub_asociacion: sender.data.asociaciones === 99999 ? null : sender.data.asociaciones,
      cub: 0,
      numero_documento: String(sender.data.titular_numero_documento),
      nombre: sender.data.titular_nombres,
      apellido: sender.data.titular_apellidos,
      fecha_expedicion: sender.data.titular_fecha_expedicion,
      fecha_nacimiento: sender.data.titular_fecha_nacimiento,
      sexo_id: parseInt(sender.data.titular_sexo),
      email: sender.data.titular_email,
      telefono_celular: sender.data.titular_celular,
      whatsapp: sender.data.titular_whatsapp,
      tipo_comunidad_etnica_id: parseInt(sender.data.tipo_comunidad_etnica),
      nombre_comunidad: sender.data.tipo_comunidad_etnica_nombre,
      pertenece_comunidad_etnica: sender.data.tipo_comunidad_etnica !== null ? 1 : 0, 
      desplazado_2025: sender.data.desplazado_2025? 1 : 0,
      cabeza_flia: sender.data.titular_cabeza_familia? 1 : 0,
      num_nucleo: sender.data.num_nucleo,
      ha_total_predios: sender.data.predio_coca_area_total,
      ha_total_loteCoca: sender.data.predio_coca_area_cultivo,
      menor_edad: sender.data.Menor_Edad,
      beneficiario: 0,
      bloqueado:0,
      vinculado_asociacion:0,
      estado_id: 1,
      fase:props.faseid,
      discapacidad:0,
      fcrea: new Date().toISOString(),
      fecha_estado: new Date().toISOString() ,
      origen: 'preregistro_catatumbo'
    };

    const formularioPersonaData = {
      formulario_id: props.formid,
      tiene_coca: sender.data.tiene_coca?1:0,
      persona_id: 0,
      acepta_terminos: 1,
      acepta_tratamiento_datos: 1,
      compromiso_proceso_susticion:1,
      fcrea: new Date().toISOString(),
      fecha_aceptacion: new Date().toISOString() 
    };

    const personaAdjuntoData1 = {
      persona_id: 0,
      tipo_documento_id: 13,
      ruta: "",
      origen: 'preregistro_catatumbo',
      fcrea: new Date().toISOString(),
    };

    if (Array.isArray(sender.data.titular_foto_cara) && sender.data.titular_foto_cara.length > 0) {
      resizeBase64Img(sender.data.titular_foto_cara[0].content, (resizedImage:any) => {
        personaAdjuntoData1.ruta = resizedImage;
        console.log('transformado')
      });
    }

    const personaAdjuntoData2 = {
      persona_id: 0,
      tipo_documento_id: 14,
      ruta: "",
      origen: 'preregistro_catatumbo',
      fcrea: new Date().toISOString(),
    }

    if (Array.isArray(sender.data.titular_foto_contracara) && sender.data.titular_foto_contracara.length > 0) {
      resizeBase64Img(sender.data.titular_foto_contracara[0].content, (resizedImage:any) => {
        personaAdjuntoData2.ruta = resizedImage;
        console.log('transformado')
      });
    }

    const predioLoteViveData = {
      persona_id: 0,
      ubicacion_id: (sender.data.vive_corregimiento != null && sender.data.vive_corregimiento != 9999) ? sender.data.vive_corregimiento : (sender.data.vive_vereda != null && sender.data.vive_vereda != 9999) ?sender.data.vive_vereda : sender.data.vive_municipio,
      cabecera: sender.data.vive_lugar === "1" ? 1 : 0,
      centro_poblado: sender.data.viveLugar === "2" ? 1 : 0,
      corregimiento: sender.data.viveLugar === "3" ? 1 : 0,
      vereda: sender.data.viveLugar === "4" ? 1 : 0,
      direccion: sender.data.vive_direccion != null ? sender.data.vive_direccion : 'Sin dirección',
      nombre_lugar: sender.data.vive_vereda_otra != null ? sender.data.vive_vereda_otra : 'Sin nombre',
      residencia: 1,
      lotecoca:sender.data.predio_coca_vive? 1 : 0,
      area_total_hectareas: sender.data.predio_coca_area_total,
      area_cultivo_hectareas: sender.data.predio_coca_area_cultivo,
      proyecto_productivo: 0,
      tipo_relacion_predio_id: parseInt(sender.data.predio_coca_tipo_residencia),
      documento_relacion_predio: "",
      origen: 'preregistro_catatumbo'
    };

    if (Array.isArray(sender.data.predio_coca_tipo_documento) && sender.data.predio_coca_tipo_documento.length > 0) {
      resizeBase64Img(sender.data.predio_coca_tipo_documento[0].content, (resizedImage:any) => {
        predioLoteViveData.documento_relacion_predio = resizedImage;
      });
    }

    let longitud = 0;
    let latitud = 0;

    if (sender.data?.coordinates) {
      const coords = sender.data.coordinates.split('|').map(parseFloat);
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        [longitud, latitud] = coords;
      }
    }

    const altitud = sender.data?.predio_coca_altitud ?? 0;
    const presicion = sender.data?.predio_coca_precision ?? 0;

    const coordenadaLoteCocaData = {
      predio_id: 0,
      coordenada: `POINT (${longitud} ${latitud})`,
      coordenadastr: `${latitud} ${longitud}`,
      altitud,
      presicion,
      origen: 'preregistro_catatumbo',
      fcrea: new Date().toISOString()
    };

    const predioLoteDesplazadoData = {
      persona_id: 0,
      ubicacion_id: (sender.data.desplazado_corregimiento != null && sender.data.desplazado_corregimiento != 9999) ? sender.data.desplazado_corregimiento : (sender.data.desplazado_vereda != null && sender.data.desplazado_vereda != 9999) ?sender.data.desplazado_vereda : sender.data.desplazado_municipio,
      cabecera: sender.data.deplazado_lugar === "1" ? 1 : 0,
      centro_poblado: sender.data.deplazado_lugar === "2" ? 1 : 0,
      corregimiento: sender.data.deplazado_lugar === "3" ? 1 : 0,
      vereda: sender.data.deplazado_lugar === "4" ? 1 : 0,
      direccion: sender.data.desplazado_lugar_direccion != null ? sender.data.desplazado_lugar_direccion : 'Sin dirección',
      nombre_lugar: sender.data.desplazado_otra_vereda != null ? sender.data.desplazado_otra_vereda : 'Sin nombre',
      residencia: 0,
      lotecoca:0,
      area_total_hectareas: 0,
      area_cultivo_hectareas: 0,
      proyecto_productivo: 0,
      documento_relacion_predio: "",
      origen: 'preregistro_catatumbo'
    };

    const predioLoteCocaData = {
      persona_id: 0,
      ubicacion_id: (sender.data.predio_coca_corregimiento != null && sender.data.predio_coca_corregimiento != 9999) ? sender.data.predio_coca_corregimiento : (sender.data.predio_coca_vereda != null && sender.data.predio_coca_vereda != 9999) ?sender.data.predio_coca_vereda : sender.data.predio_coca_municipio,
      cabecera: sender.data.predio_coca_lugar === "1" ? 1 : 0,
      centro_poblado: sender.data.predio_coca_lugar === "2" ? 1 : 0,
      corregimiento: sender.data.predio_coca_lugar === "3" ? 1 : 0,
      direccion: sender.data.predio_coca_lugar_direccion != null ? sender.data.predio_coca_lugar_direccion : 'Sin dirección',
      nombre_lugar: sender.data.predio_coca_vereda_otra != null ? sender.data.predio_coca_vereda_otra : 'Sin nombre',
      residencia: 0,
      lotecoca:1,
      area_total_hectareas: sender.data.predio_coca_area_total,
      area_cultivo_hectareas: sender.data.predio_coca_area_cultivo,
      proyecto_productivo: 0,
      tipo_relacion_predio_id: parseInt(sender.data.predio_coca_tipo_residencia),
      documento_relacion_predio: "",
      origen: 'preregistro_catatumbo'
    };

    if (Array.isArray(sender.data.predio_coca_tipo_documento) && sender.data.predio_coca_tipo_documento.length > 0) {
      resizeBase64Img(sender.data.predio_coca_tipo_documento[0].content, (resizedImage:any) => {
        predioLoteCocaData.documento_relacion_predio = resizedImage;
        console.log('transformado')
      });
    }

    const predioLoteCocaOtroData = {
      persona_id: 0,
      ubicacion_id: (sender.data.predio_coca_otro_corregimiento != null && sender.data.predio_coca_otro_corregimiento != 9999) ? sender.data.predio_coca_otro_corregimiento : (sender.data.predio_coca_vereda != null && sender.data.predio_coca_vereda != 9999) ?sender.data.predio_coca_vereda : sender.data.predio_coca_otro_municipio,
      cabecera: sender.data.predio_coca_otro_lugar === "1" ? 1 : 0,
      centro_poblado: sender.data.predio_coca_otro_lugar === "2" ? 1 : 0,
      corregimiento: sender.data.predio_coca_otro_lugar === "3" ? 1 : 0,
      vereda: sender.data.predio_coca_otro_lugar === "4" ? 1 : 0,
      direccion: sender.data.predio_coca_otro_direccion != null ? sender.data.predio_coca_otro_direccion : 'Sin dirección',
      nombre_lugar: sender.data.predio_coca_otro_vereda_otra != null ? sender.data.predio_coca_otro_vereda_otra : 'Sin nombre',
      residencia: 0,
      lotecoca:1,
      area_total_hectareas: sender.data.predio_coca_area_total,
      area_cultivo_hectareas: sender.data.predio_coca_area_cultivo,
      proyecto_productivo: 0,
      tipo_relacion_predio_id: parseInt(sender.data.predio_coca_tipo_residencia),
      documento_relacion_predio: "",
      origen: 'preregistro_catatumbo'
    };

    if (Array.isArray(sender.data.predio_coca_tipo_documento) && sender.data.predio_coca_tipo_documento.length > 0) {
      resizeBase64Img(sender.data.predio_coca_tipo_documento[0].content, (resizedImage:any) => {
        predioLoteCocaOtroData.documento_relacion_predio = resizedImage;
      });
    }

    const personaLineaProductivaData = {
      persona_id: sender.data.Persona_Id,
      linea_productiva_id: sender.data.linea_productiva,
      tipo_experiencia_id: sender.data.establece_fortalece,
      otra_cual: sender.data.otra_cual,
      experiencia_linea_productiva: 0,
      tiempo_experiencia_linea: 0,
      vinculado_asociacion: 0,
      activa: 1,
      fcrea: new Date().toISOString(),
      origen: 'preregistro_catatumbo',
      fmodifica: new Date().toISOString()
    };

    uCrud.create(personaData)
      .then((item:any) => {
        formularioPersonaData.persona_id = item.id
        uCrud2.create(formularioPersonaData).then((item2:any) => {})
        personaAdjuntoData1.persona_id = item.id
        uCrud3.create(personaAdjuntoData1).then((item3:any) => {})
        personaAdjuntoData2.persona_id = item.id
        uCrud3.create(personaAdjuntoData2).then((item4:any) => {})

        predioLoteViveData.persona_id = item.id
        uCrud4.create(predioLoteViveData).then((item6:any) => {
          coordenadaLoteCocaData.predio_id = item6.id
          uCrud6.create(coordenadaLoteCocaData).then((item8:any) => {})
        })
        if (sender.data.desplazado_2025) {
          predioLoteDesplazadoData.persona_id = item.id
          uCrud4.create(predioLoteDesplazadoData).then((item61:any) => {
            coordenadaLoteCocaData.predio_id = item61.id
            uCrud6.create(coordenadaLoteCocaData).then((item8:any) => {})
          })
        }

        predioLoteCocaData.persona_id = item.id
        uCrud4.create(predioLoteCocaData).then((item6:any) => {
          coordenadaLoteCocaData.predio_id = item6.id
          uCrud6.create(coordenadaLoteCocaData).then((item8:any) => {})
        })

        if (sender.data.predio_coca_ubicacion==='2') {
          predioLoteCocaOtroData.persona_id = item.id
          uCrud4.create(predioLoteCocaOtroData).then((item7:any) => {
            coordenadaLoteCocaData.predio_id = item7.id
            uCrud6.create(coordenadaLoteCocaData).then((item8:any) => {})
          })
        }
        personaLineaProductivaData.persona_id = item.id
        uCrud5.create(personaLineaProductivaData).then((item5:any) => {})

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

    const asociacionesQuestion = survey.getQuestionByName("asociaciones");
    const perteneceQuestion = survey.getQuestionByName("pertenecegrupo");
    const prediococaOtroDepQuestion = survey.getQuestionByName("predio_coca_otro_departamento");

    if (perteneceQuestion) {
      asociacionesQuestion.choices = itemsAsociaciones.value;

      const villages = await getVillageList(1, 'NA');

      if (Array.isArray(villages)) {
        itemsVillages.value = [...villages];
      }

      if (prediococaOtroDepQuestion) {
        prediococaOtroDepQuestion.choices = itemsVillages.value;
      }
      // await getVillageList(1, 'NA');
    }

    if (options.name === "titular_numero_documento") {
      if (options.value === null || options.value === "")
        return;
        axios.get(`/api/2.0/nucleo/forms/catatumbo/validar_documento/?documento=${options.value}`)
        .then((resp: any) => {
          console.log(resp)
          if (resp.data) {
              survey.setValue(options.name, "");
            uToast.toastError("Número de cedula ya registrado en la convocatoria");
          }

        })   
        // const response = await axios.get(`/api/2.0/nucleo/ubicacion/by-id/${ubicacionId}/`);
    }

    if (options.name === "tiene_coca" || options.name === "tipo_exclusion") {
      const tipoexclusion = sender.getValue("tipo_exclusion");
      const tienecoca = sender.getValue("tiene_coca");

      if (options.name === "tipo_exclusion" && !tienecoca) {
        uToast.toastError('En este momento usted no puede continuar con el preregistro al programa RenHacemos Catatumbo, de acuerdo con los criterios de la resolución 0071 de 2025');
      }

      if (options.name === "tipo_exclusion" && tipoexclusion !== '11') {
        uToast.toastError('En este momento usted no puede continuar con el preregistro al programa RenHacemos Catatumbo, de acuerdo con los criterios de la resolución 0071 de 2025');
      }

      if (tienecoca && tipoexclusion === '11') {
        survey.showNavigationButtons = true;
      } else {
        survey.showNavigationButtons = false;
      }
    }  

    if (options.name === "coordinates") {
      console.log('options.value')
      console.log(options.value)
    }

    // if (options.name === "latitud") {
    //   if (options.value === null || options.value === "")
    //     return;
    //   if (options.value < 6.839111 || options.value > 9.316977) {
    //     survey.setValue(options.name, "");
    //     uToast.toastError("La latitud ingresada esta por fuera de la ubicación establecida. Confirme los datos e ingreselos de nuevo");  
    //   }    
    // }

    // if (options.name === "longitud") {
    //   if (options.value === null || options.value === "")
    //     return;
    //   if (options.value < -73.644220 || options.value > -72.025764) {
    //     survey.setValue(options.name, "");
    //     uToast.toastError("La Longitud ingresada esta por fuera de la ubicación establecida. Confirme los datos e ingreselos de nuevo");  
    //   }    
    // }


    const vivecorregimientoQuestion = survey.getQuestionByName("vive_corregimiento");
    const vivemunicipioQuestion = survey.getQuestionByName("vive_municipio");
    const nucleoveredalQuestion = survey.getQuestionByName("vive_nucleo_veredal")
    const viveveredaQuestion = survey.getQuestionByName("vive_vereda");
    const desplazadoMunicipioQuestion = survey.getQuestionByName("desplazado_municipio");
    const desplazadoCorregimientoQuestion = survey.getQuestionByName("desplazado_corregimiento");
    const desplazadonucleoveredalQuestion = survey.getQuestionByName("desplazado_nucleo_veredal")
    const desplazadoveredaQuestion = survey.getQuestionByName("desplazado_vereda");

    
    const prediococaMunicipioQuestion = survey.getQuestionByName("predio_coca_municipio");
    const prediococaCorregimientoQuestion = survey.getQuestionByName("predio_coca_corregimiento");
    const prediococanucleoveredalQuestion = survey.getQuestionByName("predio_coca_nucleo_veredal")
    const prediococaveredaQuestion = survey.getQuestionByName("predio_coca_vereda");
    const prediococaotroveredaQuestion = survey.getQuestionByName("predio_coca_otro_vereda_otra");

    const prediococaotraMunicipioQuestion = survey.getQuestionByName("predio_coca_otro_municipio");
    const prediococaotraCorregimientoQuestion = survey.getQuestionByName("predio_coca_otro_corregimiento");
    const prediococaotranucleoveredalQuestion = survey.getQuestionByName("predio_coca_otro_nucleo_veredal")
    const prediococaotraveredaQuestion = survey.getQuestionByName("predio_coca_otro_vereda");


    if (options.name === "vive_departamento") {
      const municipio_id = options.value;
      const loading = uLoading.show({});
      const villages = await getVillageList(municipio_id, 'NA');

      if (Array.isArray(villages)) {
        itemsVillages.value = [...villages];
      }

      if (vivemunicipioQuestion) {
        vivemunicipioQuestion.choices = itemsVillages.value;
      }

      loading.hide();

    }

    if (options.name === "desplazadoss_departamento") {
      const municipio_id = options.value;
      const loading = uLoading.show({});
      const villages = await getVillageList(municipio_id, 'NA');

      if (Array.isArray(villages)) {
        itemsVillages.value = [...villages];
      }

      if (desplazadoMunicipioQuestion) {
        desplazadoMunicipioQuestion.choices = itemsVillages.value;
      }

      loading.hide();

    }

    if (options.name === "predio_coca_departamento") {
      const municipio_id = options.value;
      const loading = uLoading.show({});
      const villages = await getVillageList(municipio_id, 'NA');

      if (Array.isArray(villages)) {
        itemsVillages.value = [...villages];
      }

      if (prediococaMunicipioQuestion) {
        prediococaMunicipioQuestion.choices = itemsVillages.value;
      }

      loading.hide();

    }

    if (options.name === "predio_coca_otro_departamento") {
      const municipio_id = options.value;
      const loading = uLoading.show({});
      const villages = await getVillageList(municipio_id, 'NA');

      if (Array.isArray(villages)) {
        itemsVillages.value = [...villages];
      }

      if (prediococaotraMunicipioQuestion) {
        prediococaotraMunicipioQuestion.choices = itemsVillages.value;
      }

      loading.hide();

    }


    if (options.name === "predio_coca_municipio") {
      const municipio_id = options.value;
      const loading = uLoading.show({});
      const villages = await getVillageList(municipio_id, 'NA');

      if (Array.isArray(villages)) {
        itemsVillages.value = [...villages];
      }

      itemsVillages.value.push({
        value: 9999,
        text: 'Corregimiento no encontrado'
      });

      if (prediococaCorregimientoQuestion) {
        prediococaCorregimientoQuestion.choices = itemsVillages.value;
      }

      loading.hide();
    }

    // if (options.name === "predio_coca_corregimiento") {
    //   const municipio_id = options.value;
    //   const loading = uLoading.show({});
    //   const villages = await getVillageList(municipio_id, 'NA');


    //   if (Array.isArray(villages)) {
    //     itemsVillages.value = [...villages];
    //   }

    //   itemsVillages.value.push({
    //     value: 9999,
    //     text: 'Vereda  no encontrada'
    //   });

    //   if (prediococaveredaQuestion) {
    //     prediococaveredaQuestion.choices = itemsVillages.value;
    //   }

    //   loading.hide();
    // }


   

    // if (options.name === "predio_coca_otro_corregimiento") {
    //   const municipio_id = options.value;
    //   const loading = uLoading.show({});
    //   const villages = await getVillageList(municipio_id, 'NA');

    //   if (Array.isArray(villages)) {
    //     itemsVillages.value = [...villages];
    //   }

    //   itemsVillages.value.push({
    //     value: 9999,
    //     text: 'Vereda  no encontrado'
    //   });

    //   if (prediococaotraveredaQuestion) {
    //     prediococaotraveredaQuestion.choices = itemsVillages.value;
    //   }

    //   loading.hide();
    // }

    // if (options.name === "predio_coca_otro_nucleo_veredal") {
    //   const municipio_id = options.value;
    //   const loading = uLoading.show({});
    //   const villages = await getVillageList(municipio_id, 'NA');

    //   if (Array.isArray(villages)) {
    //     itemsVillages.value = [...villages];
    //   }

    //   itemsVillages.value.push({
    //     value: 9999,
    //     text: 'Vereda  no encontrada'
    //   });

    //   if (prediococaotraveredaQuestion) {
    //     prediococaotraveredaQuestion.choices = itemsVillages.value;
    //   }

    //   loading.hide();
    // }

    if (options.name === "vive_municipio") {
      const municipio_id = options.value;
      const loading = uLoading.show({});
      const villages = await getVillageList(municipio_id, 'CO,CP');

      if (Array.isArray(villages)) {
        itemsVillages.value = [...villages];
      }

      itemsVillages.value.push({
        value: 9999,
        text: 'Corregimiento no encontrado'
      });

      if (vivecorregimientoQuestion) {
        vivecorregimientoQuestion.choices = itemsVillages.value;
      }

      const villages2 = await getVillageList(municipio_id, 'VE');

      if (Array.isArray(villages2)) {
        itemsVillages.value = [...villages2];
      }
      console.log('itemsVillages.value')
      console.log(itemsVillages.value)

      itemsVillages.value.push({
        value: 9999,
        text: 'Vereda no encontrada'
      });

      if (viveveredaQuestion) {
        viveveredaQuestion.choices = itemsVillages.value;
      }

      loading.hide();
    }


    if (options.name === "desplazado_municipio") {
      const municipio_id = options.value;
      const loading = uLoading.show({});
      const villages = await getVillageList(municipio_id, 'CO,CP');

      if (Array.isArray(villages)) {
        itemsVillages.value = [...villages];
      }

      itemsVillages.value.push({
        value: 9999,
        text: 'Corregimiento no encontrado'
      });

      if (desplazadoCorregimientoQuestion) {
        desplazadoCorregimientoQuestion.choices = itemsVillages.value;
      }

      const villages2 = await getVillageList(municipio_id, 'VE');

      if (Array.isArray(villages2)) {
        itemsVillages.value = [...villages2];
      }

      itemsVillages.value.push({
        value: 9999,
        text: 'Vereda no encontrada'
      });

      if (desplazadoveredaQuestion) {
        desplazadoveredaQuestion.choices = itemsVillages.value;
      }

      loading.hide();
    }

    if (options.name === "predio_coca_municipio") {
      const municipio_id = options.value;
      const loading = uLoading.show({});
      const villages = await getVillageList(municipio_id, 'CO,CP');

      if (Array.isArray(villages)) {
        itemsVillages.value = [...villages];
      }

      itemsVillages.value.push({
        value: 9999,
        text: 'Corregimiento no encontrado'
      });

      if (prediococaCorregimientoQuestion) {
        prediococaCorregimientoQuestion.choices = itemsVillages.value;
      }

      const villages2 = await getVillageList(municipio_id, 'VE');

      if (Array.isArray(villages2)) {
        itemsVillages.value = [...villages2];
      }

      itemsVillages.value.push({
        value: 9999,
        text: 'Vereda no encontrada'
      });

      if (prediococaveredaQuestion) {
        prediococaveredaQuestion.choices = itemsVillages.value;
      }

      loading.hide();
    }

    if (options.name === "predio_coca_otro_municipio") {
      const municipio_id = options.value;
      const loading = uLoading.show({});
      const villages = await getVillageList(municipio_id, 'CO,CP');

      if (Array.isArray(villages)) {
        itemsVillages.value = [...villages];
      }

      itemsVillages.value.push({
        value: 9999,
        text: 'Corregimiento no encontrado'
      });

      if (prediococaotraCorregimientoQuestion) {
        prediococaotraCorregimientoQuestion.choices = itemsVillages.value;
      }

      const villages2 = await getVillageList(municipio_id, 'VE');

      if (Array.isArray(villages2)) {
        itemsVillages.value = [...villages2];
      }

      itemsVillages.value.push({
        value: 9999,
        text: 'Vereda no encontrada'
      });

      if (prediococaotraveredaQuestion) {
        prediococaotraveredaQuestion.choices = itemsVillages.value;
      }

      loading.hide();
    }

  });
  

  onMounted(async () => {
    await getAsociaciones();
  });
    

</script>