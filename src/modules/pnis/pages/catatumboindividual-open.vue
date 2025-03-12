<template>
  <exp-survey-view 
  v-if="modelValue"
  :surveyJson="surveyJsonBase" 
  :surveyData="surveyData"
  :is-read-only="true"
  >
  </exp-survey-view>
</template>


<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { useRoute } from 'vue-router';
import axios from "axios";

const endpoint = "/api/1.0/core";
const route = useRoute();
const surveyId = route.params.id;

import useAuth from "@/modules/auth/composables/useAuth";
import useCrud from "@/composables/useCrud";
import useUtils from "@/composables/useUtils";
import expDynamicForm from "@/components/expDynamicForm";
import useAuthStore from "@/modules/auth/stores/auth";
import expSurveyView from "@/components/expSurveyView";

const uCrud = useCrud(`${endpoint}/userpnis`);
const uUtils = useUtils();
const { t } = useI18n();
const uAuth = useAuth();

const modelValue = defineModel<boolean>();
const props = defineProps({
 id: {
   type: Number,
   default: null,
 },
});


const surveyJsonBase = ref({
  "title": "Preinscripción Núcleos Familiares Individuales - Convención, El Tarra, Tibú y Sardinata",
  "description": "Ficha de preinscripción para el \"Establecimiento y/o fortalecimiento de actividades económicas para el tránsito a economías lícitas en el marco de procesos de sustitución de cultivos de uso ilícito en los municipios de Convención, El Tarra, Tibú y Sardinata de Norte de Santander",
  "logoPosition": "right",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "html",
          "name": "question5",
          "html": "<h4>Validación de datos</h4>"
        },
        {
          "type": "radiogroup",
          "name": "tiene_coca",
          "title": "¿Tiene, posee u ocupa usted un predio con presencia de cultivos de uso ilícito del cual depende su subsistencia?",
          "description": "Seleccione una opción.",
          "isRequired": true,
          "choices": [
            "Si",
            "No"
          ]
        },
        {
          "type": "text",
          "name": "identificacion",
          "title": "Ingrese el número de documento",
          "description": "Digite el número de documento sin puntos \".\" ni comas \",\""
        },
        {
          "type": "radiogroup",
          "name": "victima_posterior_2025",
          "title": "¿Ha sido victima de desplazamiento forzado con fecha igual o posterior al 15 de enero de 2025?\n",
          "description": "Seleccione una opción.",
          "isRequired": true,
          "choices": [
            "Si",
            "No"
          ]
        },
        {
          "type": "radiogroup",
          "name": "tipo_linea_productiva",
          "title": "Actividad económica para el tránsito a economías lícitas",
          "description": "Seleccione una opción.",
          "choices": [
            "Agropecuaria",
            "No Agropecuaria"
          ]
        },
        {
          "type": "html",
          "name": "question2",
          "visibleIf": "{tipo_linea_productiva} = 'Agropecuaria'",
          "html": "<h4>Actividades económicas agropecuarias</h4>\n"
        },
        {
          "type": "html",
          "name": "question3",
          "visibleIf": "{tipo_linea_productiva} = 'No Agropecuaria'",
          "html": "<h4>Actividades económicas no agropecuarias</h4>\n"
        },
        {
          "type": "radiogroup",
          "name": "condicion_linea_productiva",
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
          "name": "actividad_economica",
          "visibleIf": "{tipo_linea_productiva} = 'No Agropecuaria'",
          "title": "Actividades económicas que selecciona",
          "description": "No dejar en blanco.",
          "isRequired": true,
          "choices": [
            "Comercio al por menor",
            "Producción y transformación básica de bienes",
            "Servicios y otras actividades"
          ]
        },
        {
          "type": "radiogroup",
          "name": "linea_productiva",
          "visibleIf": "{tipo_linea_productiva} = Agropecuaria",
          "title": "Linea Productiva seleccionada ",
          "description": "No dejar en blanco.",
          "isRequired": true,
          "choices": [
            "Caña",
            "Cacao",
            "Cafe",
            "Yuca",
            "Maiz",
            "Aguacate",
            "Piscicultura",
            "Otra"
          ]
        },
        {
          "type": "text",
          "name": "linea_productiva_fortalecimiento_cual",
          "visibleIf": "{tipo_linea_productiva} = 'Agropecuaria'",
          "title": "Linea Productiva Otra ",
          "description": "No dejar en blanco.",
          "isRequired": true
        },
        {
          "type": "radiogroup",
          "name": "experiencia_linea_productiva",
          "title": "¿Tiene experiencia en esta actividad económica?",
          "isRequired": true,
          "choices": [
            "Si",
            "No"
          ]
        },
        {
          "type": "text",
          "name": "experiencia_linea_productiva_anos",
          "visibleIf": "{experiencia_linea_productiva} = Si",
          "title": "¿Hace cuántos años?",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "isRequired": true,
          "inputType": "number",
          "max": 99
        },
        {
          "type": "radiogroup",
          "name": "formacion_linea_productiva_no_agropecuaria",
          "title": "¿Tiene formación en esta actividad económica?",
          "description": "No dejar en blanco.",
          "isRequired": true,
          "choices": [
            "Si",
            "No"
          ]
        },
        {
          "type": "text",
          "name": "ha_sembradas",
          "title": "Hectareas sembradas",
          "description": ""
        },
        {
          "type": "text",
          "name": "volumen_produccion",
          "title": "Volumen de produccion",
          "description": ""
        },
        {
          "type": "html",
          "name": "question7",
          "html": "<h4>Lugar de implementación de la actividad económica</h4>\n"
        },
        {
          "type": "text",
          "name": "departamento_proyecto_productivo_victima",
          "title": "departamento",
          "description": ""
        },
        {
          "type": "text",
          "name": "municipio_proyecto_productivo_victima",
          "title": "municipio",
          "description": ""
        },
        {
          "type": "text",
          "name": "centro_poblado_proyecto_productivo",
          "title": "Cabecera municipal o centro poblado",
          "description": "No dejar en blanco.",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "descripcion_acceso_proyecto_productivo_victima",
          "title": "Dirección",
          "description": "Dirección o breve descripción de acceso",
          "isRequired": true
        },
        {
          "type": "html",
          "name": "question4",
          "html": "<h4>Datos Personales del Representante del Núcleo Familiar.</h4>"
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
          "type": "radiogroup",
          "name": "tipo_documento",
          "title": "Tipo de documento",
          "description": "Seleccione una opción.\n\n",
          "isRequired": true,
          "choices": [
            "Cedula_de_Ciudadania",
            "Permiso Especial de Permanencia (PEP)"
          ]
        },
        {
          "type": "text",
          "name": "numero_documento",
          "title": "Número de documento",
          "description": "Digite el número de documento sin puntos \".\" ni comas \",\"\n",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "fecha_nacimiento",
          "title": "Fecha de nacimiento",
          "description": "Digite la fecha de nacimiento",
          "inputType": "date"
        },
        {
          "type": "radiogroup",
          "name": "sexo",
          "title": "Sexo",
          "description": "Seleccione una opción.\n",
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "radiogroup",
          "name": "orientacion",
          "title": "¿Tiene identidad de género y/o orientación sexual diversa (OSIGD)?",
          "description": "Seleccione una opción.",
          "choices": [
            "Si",
            "No"
          ]
        },
        {
          "type": "text",
          "name": "telefono",
          "title": "Número de teléfono celular"
        },
        {
          "type": "text",
          "name": "correo",
          "title": "Correo electrónico",
          "inputType": "email"
        },
        {
          "type": "text",
          "name": "tipo_ciudadano",
          "title": "¿Usted se identifica como miembro de una comunidad étnica o de alguna de las poblaciones que se describen a continuación? (Sujeto de especial protección)"
        },
        {
          "type": "text",
          "name": "etnico",
          "title": "La organización a la cual pertenece corresponde a"
        },
        {
          "type": "text",
          "name": "nombre_comunidad",
          "title": "¿Cuál es el nombre completo del resguardo, consejo comunitario, zona de reserva campesina o junta de acción comunal a la que pertenece?",
          "description": "No dejar en blanco. Si no se dispone del dato, escribir NA. Precisar el tipo de organización a la que pertenece (RI, CC, ZRC, JAC, Cabildo, Asociación)",
          "isRequired": true
        },
        {
          "type": "radiogroup",
          "name": "lote_etnico",
          "title": "¿El predio, lote o parcela en donde va implementar su actividad económica está ubicado en un territorio étnico formalmente constituido (titulado) o no formalmente constituido (pretendido)?",
          "isRequired": true,
          "choices": [
            "si",
            "no",
            "ns"
          ]
        },
        {
          "type": "radiogroup",
          "name": "condicion",
          "title": "Condición",
          "description": "Seleccione una opción. Va dirigida a todo el núcleo familiar.\n",
          "isRequired": true,
          "choices": [
            "Victima",
            "Desplazado",
            "Ninguno"
          ]
        },
        {
          "type": "radiogroup",
          "name": "discapacidad",
          "title": "Persona con discapacidad",
          "description": "Seleccione una opción.\n",
          "isRequired": true,
          "choices": [
            "Si",
            "No"
          ]
        },
        {
          "type": "radiogroup",
          "name": "educacion",
          "title": "Educación",
          "description": "No dejar en blanco.",
          "isRequired": true,
          "choices": [
            "Primaria",
            "Bachillerato",
            "Auxiliar",
            "Técnico",
            "Tecnólogo",
            "Profesional",
            "Especialista",
            "Ninguna"
          ]
        },
        {
          "type": "text",
          "name": "numero_personas",
          "title": "¿Cuántas personas componen su núcleo familiar?",
          "description": "Digite el número de personas sin puntos \".\" ni comas \",\"\n",
          "isRequired": true,
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "numero_documentos_personas_nucleo",
          "title": "Ingrese el número de documento de las personas que componen su núcleo familiar",
          "description": "Incluir todos los documentos separados por guion (-).\n"
        },
        {
          "type": "text",
          "name": "nombres_documentos_personas_nucleo",
          "title": "Ingrese los nombre y apellidos de las personas que componen su núcleo familiar",
          "description": "Incluir todos los nombre completos separados por guion (-).\n\n"
        },
        {
          "type": "html",
          "name": "question10",
          "html": "<h4>Predios a incribir con cultivo de uso ilícito</h4>\n"
        },
        {
          "type": "text",
          "name": "numero_total_predios_inscribir",
          "title": "¿Cuántos predios tiene, posee u ocupa con presencia de cultivos de uso ilícito?",
          "inputType": "number"
        },
        {
          "type": "radiogroup",
          "name": "numero_predios_inscribir",
          "title": "Ubique hasta los 5s de mayor relevancia",
          "choices": [
            "1",
            "2",
            "3",
            "4",
            "5"
          ]
        }
      ]
    },
    {
      "name": "page10",
      "visibleIf": "{numero_predios_inscribir} = '1' or {numero_predios_inscribir} = '2' or {numero_predios_inscribir} = '3' or {numero_predios_inscribir} = '4' or {numero_predios_inscribir} = '5'",
      "elements": [
        {
          "type": "html",
          "name": "question14",
          "html": "<h4>Identificación Predio 1</h4>\n"
        },
        {
          "type": "text",
          "name": "municipio",
          "title": "Municipio"
        },
        {
          "type": "text",
          "name": "vereda",
          "title": "Vereda"
        },
        {
          "type": "text",
          "name": "vereda_cual",
          "visibleIf": "{vereda} = 'Otro'",
          "title": "Si seleccionó en la respuesta anterior \"Otro\", mencione cual",
          "description": "No dejar en blanco.\n"
        },
        {
          "type": "text",
          "name": "descripcion_acceso",
          "title": "Descripción de acceso al predio o punto de referencia",
          "description": "Breve descripción de acceso. Tiempo desde la cabecera municipal hasta la finca.\nAcceso en vehículo cuanto tiempo, en animal o a pie cuanto tiempo.\n"
        },
        {
          "type": "text",
          "name": "predio",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "area_predio",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "area_coca",
          "title": "¿Qué área en hectáreas de hoja de coca tiene en su predio?",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "radiogroup",
          "name": "tenencia",
          "title": "¿Qué relación de tenencia tiene con el predio?",
          "choices": [
            "Propietario",
            "Poseedor",
            "Ocupante"
          ]
        },
        {
          "type": "text",
          "name": "coordenadas",
          "title": "coordenadas"
        }
      ]
    },
    {
      "name": "page11",
      "visibleIf": "{numero_predios_inscribir} = '2' or {numero_predios_inscribir} = '3' or {numero_predios_inscribir} = '4' or {numero_predios_inscribir} = '5'",
      "elements": [
        {
          "type": "html",
          "name": "question9",
          "html": "<h4>Identificación Predio 2</h4>\n"
        },
        {
          "type": "text",
          "name": "municipiop2",
          "title": "Municipio"
        },
        {
          "type": "text",
          "name": "veredap2",
          "title": "Vereda"
        },
        {
          "type": "text",
          "name": "vereda_cualp2",
          "visibleIf": "{vereda} = 'Otro'",
          "title": "Si seleccionó en la respuesta anterior \"Otro\", mencione cual",
          "description": "No dejar en blanco.\n"
        },
        {
          "type": "text",
          "name": "descripcion_accesop2",
          "title": "Descripción de acceso al predio o punto de referencia",
          "description": "Breve descripción de acceso. Tiempo desde la cabecera municipal hasta la finca.\nAcceso en vehículo cuanto tiempo, en animal o a pie cuanto tiempo.\n"
        },
        {
          "type": "text",
          "name": "prediop2",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "area_prediop2",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "area_cocap2",
          "title": "¿Qué área en hectáreas de hoja de coca tiene en su predio?",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "radiogroup",
          "name": "tenenciap2",
          "title": "¿Qué relación de tenencia tiene con el predio?",
          "choices": [
            "Propietario",
            "Poseedor",
            "Ocupante"
          ]
        },
        {
          "type": "text",
          "name": "coordenadasp2",
          "title": "coordenadas"
        }
      ]
    },
    {
      "name": "page12",
      "visibleIf": "{numero_predios_inscribir} = '3' or {numero_predios_inscribir} = '4' or {numero_predios_inscribir} = '5'",
      "elements": [
        {
          "type": "html",
          "name": "question11",
          "html": "<h4>Identificación Predio 3</h4>\n"
        },
        {
          "type": "text",
          "name": "municipiop3",
          "title": "Municipio"
        },
        {
          "type": "text",
          "name": "veredap3",
          "title": "Vereda"
        },
        {
          "type": "text",
          "name": "vereda_cualp3",
          "visibleIf": "{vereda} = 'Otro'",
          "title": "Si seleccionó en la respuesta anterior \"Otro\", mencione cual",
          "description": "No dejar en blanco.\n"
        },
        {
          "type": "text",
          "name": "descripcion_accesop3",
          "title": "Descripción de acceso al predio o punto de referencia",
          "description": "Breve descripción de acceso. Tiempo desde la cabecera municipal hasta la finca.\nAcceso en vehículo cuanto tiempo, en animal o a pie cuanto tiempo.\n"
        },
        {
          "type": "text",
          "name": "prediop3",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "area_prediop3",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "area_cocap3",
          "title": "¿Qué área en hectáreas de hoja de coca tiene en su predio?",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "radiogroup",
          "name": "tenenciap3",
          "title": "¿Qué relación de tenencia tiene con el predio?",
          "choices": [
            "Propietario",
            "Poseedor",
            "Ocupante"
          ]
        },
        {
          "type": "text",
          "name": "coordenadasp3",
          "title": "coordenadas"
        }
      ]
    },
    {
      "name": "page13",
      "visibleIf": "{numero_predios_inscribir} = '4' or {numero_predios_inscribir} = '5'",
      "elements": [
        {
          "type": "html",
          "name": "question12",
          "html": "<h4>Identificación Predio 4</h4>\n"
        },
        {
          "type": "radiogroup",
          "name": "municipio_predio4",
          "title": "Municipio",
          "choices": [
            {
              "value": "Item 1",
              "text": "CONVENCION"
            },
            {
              "value": "Item 2",
              "text": "EL TARRA"
            },
            {
              "value": "Item 3",
              "text": "SARDINATA"
            },
            {
              "value": "Item 4",
              "text": "TIBÚ"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "vereda_predio4",
          "title": "Vereda",
          "choices": [
            "Item 1",
            "Item 2",
            "Item 3",
            {
              "value": "otro",
              "text": "Otro"
            }
          ]
        },
        {
          "type": "text",
          "name": "vereda_otro_predio4",
          "visibleIf": "{vereda_predio4} = 'otro'",
          "title": "Si seleccionó en la respuesta anterior \"Otro\", mencione cual",
          "description": "No dejar en blanco.\n"
        },
        {
          "type": "text",
          "name": "acceso_predio4",
          "title": "Descripción de acceso al predio o punto de referencia",
          "description": "Breve descripción de acceso. Tiempo desde la cabecera municipal hasta la finca.\nAcceso en vehículo cuanto tiempo, en animal o a pie cuanto tiempo.\n"
        },
        {
          "type": "text",
          "name": "nombre_predio4",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "area_total_predio4",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "area_coca_predio4",
          "title": "¿Qué área en hectáreas de hoja de coca tiene en su predio?",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "radiogroup",
          "name": "relacion_predio4",
          "title": "¿Qué relación de tenencia tiene con el predio?",
          "choices": [
            {
              "value": "Item 1",
              "text": "Propietario"
            },
            {
              "value": "Item 2",
              "text": "Poseedor"
            },
            {
              "value": "Item 3",
              "text": "Ocupante"
            }
          ]
        },
        {
          "type": "html",
          "name": "question25",
          "html": "<strong>Foto del documento que valide la relación de tenencia</strong>\n<p>\nTomar la foto de manera que los datos sean legibles\n</p>\n"
        },
        {
          "type": "text",
          "name": "longitud_predio4",
          "minWidth": "150px",
          "title": "Longitud"
        },
        {
          "type": "text",
          "name": "latitud_predio4",
          "minWidth": "150px",
          "title": "Latitud"
        },
        {
          "type": "text",
          "name": "altirud_predio4",
          "minWidth": "150px",
          "title": "Altitud"
        },
        {
          "type": "text",
          "name": "precision_predio4",
          "minWidth": "150px",
          "title": "Precisión"
        }
      ]
    },
    {
      "name": "page14",
      "visibleIf": "{numero_predios_inscribir} = '5'",
      "elements": [
        {
          "type": "html",
          "name": "question13",
          "html": "<h4>Identificación Predio 5</h4>\n"
        },
        {
          "type": "radiogroup",
          "name": "municipio_predio5",
          "title": "Municipio",
          "choices": [
            {
              "value": "Item 1",
              "text": "CONVENCION"
            },
            {
              "value": "Item 2",
              "text": "EL TARRA"
            },
            {
              "value": "Item 3",
              "text": "SARDINATA"
            },
            {
              "value": "Item 4",
              "text": "TIBÚ"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "vereda_predio5",
          "title": "Vereda",
          "choices": [
            "Item 1",
            "Item 2",
            "Item 3",
            {
              "value": "otro",
              "text": "Otro"
            }
          ]
        },
        {
          "type": "text",
          "name": "vereda_otro_predio5",
          "visibleIf": "{vereda_predio5} = 'otro'",
          "title": "Si seleccionó en la respuesta anterior \"Otro\", mencione cual",
          "description": "No dejar en blanco.\n"
        },
        {
          "type": "text",
          "name": "acceso_predio5",
          "title": "Descripción de acceso al predio o punto de referencia",
          "description": "Breve descripción de acceso. Tiempo desde la cabecera municipal hasta la finca.\nAcceso en vehículo cuanto tiempo, en animal o a pie cuanto tiempo.\n"
        },
        {
          "type": "text",
          "name": "nombre_predio5",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "area_total_predio5",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "area_coca_predio5",
          "title": "¿Qué área en hectáreas de hoja de coca tiene en su predio?",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "radiogroup",
          "name": "relacion_predio5",
          "title": "¿Qué relación de tenencia tiene con el predio?",
          "choices": [
            {
              "value": "Item 1",
              "text": "Propietario"
            },
            {
              "value": "Item 2",
              "text": "Poseedor"
            },
            {
              "value": "Item 3",
              "text": "Ocupante"
            }
          ]
        },
        {
          "type": "text",
          "name": "longitud_predio5",
          "minWidth": "150px",
          "title": "Longitud"
        },
        {
          "type": "text",
          "name": "latitud_predio5",
          "minWidth": "150px",
          "title": "Latitud"
        },
        {
          "type": "text",
          "name": "altitud_predio5",
          "minWidth": "150px",
          "title": "Altitud"
        },
        {
          "type": "text",
          "name": "precision_predio5",
          "minWidth": "150px",
          "title": "Precisión"
        }
      ]
    },
    {
      "name": "page15",
      "elements": [
        {
          "type": "html",
          "name": "question15",
          "html": "<h4>Residencia del núcleo familiar</h4>"
        },
        {
          "type": "text",
          "name": "departamento_residencia",
          "title": "Departamento"
        },
        {
          "type": "text",
          "name": "municipio_residencia",
          "title": "Municipio",
        },
        {
          "type": "text",
          "name": "vereda_residencia",
          "title": "Vereda o Cabecera Municipal o Centro Poblado",
          "description": "No dejar en blanco."
        },
        {
          "type": "text",
          "name": "descripcion_residencia",
          "title": "Dirección o descripción de acceso al predio o punto de referencia",
          "description": "Dirección o breve descripción de acceso. Tiempo desde la cabecera municipal hasta la finca.\nAcceso en vehículo cuanto tiempo, en animal o a pie cuanto tiempo."
        },
        {
          "type": "text",
          "name": "predio_residencia",
          "title": "Nombre del predio",
          "description": "Nombre de la finca de residencia, si no aplica poner NA"
        },
        {
          "type": "radiogroup",
          "name": "usufructa_predio",
          "title": "¿Su núcleo familiar usufructúa un predio distinto a donde vive o a los que registró con cultivos de uso ilícito?",
          "description": "Seleccione una opción.",
          "choices": [
            "Si",
            "No"
          ]
        },
        {
          "type": "text",
          "name": "actividad_econo_otro",
          "title": "Nombre del predio",
          "description": "Actividad económica otro predio"
        }
      ]
    }
  ],
        "pagePrevText": "Página anterior",
        "pageNextText": "Página siguiente",
        "completeText": "Enviar",
        "showNavigationButtons": false
});




const isAdmin = computed(() => {
 try {
   return uAuth.getUserData().role == 1;
 } catch (error) {
   return false;
 }
});

const rules = {
 first_name: { required, minLength: minLength(2) },
 last_name: { required, minLength: minLength(2) },
};

const surveyData = ref<any[]>([]); // Asegurar que es un Ref con un array
const getSurveyData = async () => {
 try {
   modelValue.value=false
   const response = await axios.get(`/api/1.0/core/catatumboindividual/${surveyId}/`);
   surveyData.value = response.data; // Asignar los datos correctamente
   console.log( 'surveyData.value ')
   console.log( surveyData.value )
   modelValue.value=true
 } catch (error) {
   console.error("Error fetching validation items:", error);
 }
};


onMounted(async () => {
 getSurveyData()
});



</script>

<style lang="scss">

</style>