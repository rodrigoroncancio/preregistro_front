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

import { useLoading } from "vue-loading-overlay";

const endpoint = "/api/1.0/core";
const route = useRoute();
const surveyId = route.params.id;
const uLoading = useLoading();

import useAuth from "@/modules/auth/composables/useAuth";
import useCrud from "@/composables/useCrud";
import useUtils from "@/composables/useUtils";
import expDynamicForm from "@/components/expDynamicForm";
import useAuthStore from "@/modules/auth/stores/auth";
import expSurveyView from "@/components/expSurveyView";

const uCrud = useCrud(`${endpoint}/catatumbofichaacuerdo`);
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
  "description": "",
  "title": "FICHA DE VINCULACIÓN DE NÚCLEOS FAMILIARES A PROCESOS DE SUSTITUCIÓN DE CULTIVOS DE USO ILÍCITO DE LA DIRECCIÓN DE SUSTITUCIÓN DE CULTIVOS DE USO ILÍCITO",
  "logoPosition": "right",
  "pages": [
  {
      "name": "pageregistraduria",
      "elements": [
        {
          "type": "html",
          "name": "question1",
          "html": "<h4>Datos de registraduria</h4>\n"
        },
        {
          "type": "text",
          "name": "reg_numero_cedula",
          "title": "Número de cedula"
        },
        {
          "type": "text",
          "name": "reg_primer_nombre",
          "title": "Primer Nombre"
        },
        {
          "type": "text",
          "name": "reg_segundo_nombre",
          "title": "Segundo Nombre"
        },
        {
          "type": "text",
          "name": "reg_primer_apellido",
          "title": "Primer apellido"
        },
        {
          "type": "text",
          "name": "reg_segundo_apellido",
          "title": "Segundo apellido"
        },
        {
          "type": "text",
          "name": "reg_departamento_exp",
          "title": "Departamento de Expedición"
        },
        {
          "type": "text",
          "name": "reg_municipio_exp",
          "title": "Municipio de expedición"
        },
        {
          "type": "text",
          "name": "reg_fecha_expedicion",
          "title": "Fecha de expedición"
        },
        {
          "type": "text",
          "name": "reg_estado_cedula",
          "title": "Estado de la cédula"
        },
        {
          "type": "text",
          "name": "reg_num_resolucion",
          "title": "Número de resolución"
        },
        {
          "type": "text",
          "name": "reg_agno_resolucion",
          "title": "Año de resolución"
        },
        {
          "type": "text",
          "name": "reg_genero",
          "title": "Género"
        },
        {
          "type": "text",
          "name": "reg_fecha_nacimiento",
          "title": "Fecha de nacimiento"
        },
        {
          "type": "text",
          "name": "reg_edad",
          "title": "Edad"
        }
      ]
    },
    {
      "name": "page1",
      "elements": [
        {
          "type": "html",
          "name": "question1",
          "html": "<h3>1. DATOS GENERALES DEL NÚCLEO FAMILIAR</h3>"
        },
        {
          "type": "html",
          "name": "question2",
          "html": "<span style=\"font-weight: 999;\">1.1. Identificación del Núcleo Familiar </span>\n<p><strong>1.1.1. Titular del núcleo familiar (se recomienda como titular a la mujer)\n</strong></p>"
        },
        {
          "type": "dropdown",
          "name": "tipo_identificacion",
          "title": "Tipo de identificación",
          "isRequired": true,
          "choices": [
            {
              "value": "Cedula_de_Ciudadania",
              "text": "Cedula de ciudadania"
            },
            "Pasaporte",
            {
              "value": "Permiso_Especial_de_Permanencia PEP",
              "text": "Permiso especial de permanencia"
            },
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "tipo_identificacion_cual",
          "visibleIf": "{tipo_identificacion} = 'Otro'",
          "title": "Cuál?",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "numero_identificacion",
          "title": "Número de identificación",
          "description": "Escriba el número de identificación del representante del núcleo familiar",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "nombre",
          "title": "Nombres y apellidos",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "fecha_expedicion",
          "title": "Fecha expedición",
          "isRequired": true,
        },
        {
          "type": "text",
          "name": "reg_fecha_expedicion",
          "title": "Datos Expedición - Registraduría (Depar./ Muni. /Fecha)",
        },
        {
          "type": "text",
          "name": "fecha_nacimiento",
          "title": "Fecha nacimiento",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "numero_contacto",
          "title": "Número de contacto",
          "isRequired": true,
          "inputType": "tel"
        },
        {
          "type": "text",
          "name": "email",
          "title": "Correo electrónico",
          "description": "Indicar el correo electrónico donde será notificado",
          "inputType": "email"
        },
        {
          "type": "dropdown",
          "name": "sexo",
          "title": "Sexo",
          "isRequired": true,
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "identidad_genero",
          "title": "Tiene identidad de Género y/o Orientación sexual diversa (OSIGD)?\n",
          "isRequired": true,
          "choices": [
            "Si",
            "No"
          ]
        },
        {
          "type": "dropdown",
          "name": "estado_civil",
          "title": "Estado civil",
          "isRequired": true,
          "choices": [
            "Soltero(a)",
            {
              "value": "Casado(a)",
              "text": "Casado (a)"
            },
            "Separado(a)",
            "Viudo(a)",
            "Unión libre"
          ]
        },
        {
          "type": "dropdown",
          "name": "ocupacion",
          "title": "Ocupación",
          "isRequired": true,
          "choices": [
            "Independiente",
            "Jubilado/pensionado",
            "Estudiante",
            "Informalidad",
            "Desempleado",
            "No aplica por edad"
          ]
        },
        {
          "type": "dropdown",
          "name": "escolaridad",
          "title": "Nivel de escolaridad",
          "isRequired": true,
          "choices": [
            "NingunA",
            "Primaria incompleta",
            "Primaria",
            "Bachillerato incompleto",
            "Bachillerato",
            "Tecnico",
            "Tecnologo",
            "Profesional",
            "Posgrado",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "escolarida_otro",
          "visibleIf": "{escolaridad} = 'Otro'",
          "title": "Otro"
        },
        {
          "type": "dropdown",
          "name": "tipo_salud",
          "title": "Tipo de afiliación a salud\n",
          "isRequired": true,
          "choices": [
            "Contributivo",
            "Subsidiado",
            "PPNA"
          ]
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "tagbox",
          "name": "grupo_especial",
          "title": "Grupo de atención especial ",
          "isRequired": true,
          "choices": [
            "Desplazados",
            "Retornado",
            "Reinsertado",
            "Afrodescendiente",
            "Indígenas",
            "ROM/gitano",
            "LGTBI",
            "Palenquero y/o raizal",
            "Victima",
            "Campesinado",
            {
              "value": "ninguno",
              "text": "Ninguno"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "comunidad_etnica",
          "title": "¿Su núcleo familiar se identifica como parte de una comunidad étnica o de alguna de las poblaciones que se describen a continuación?",
          "choices": [
            "Indígena",
            "Negra o Afrocolombiano",
            "Raizal",
            "Palenquero",
            "Rrom (Gitano)",
            "Campesino no perteneciente a las anteriores etnias",
            "Ninguno"
          ]
        },
        {
          "type": "text",
          "name": "pueblo_indigena",
          "visibleIf": "{comunidad_etnica} = 'Indígena'",
          "title": "¿A qué pueblo indígena pertenece su núcleo familiar?"
        },
        {
          "type": "text",
          "name": "organizacion_etnica",
          "visibleIf": "{comunidad_etnica} <> 'Ninguno'",
          "title": "La organización étnica a la cual pertenece su núcleo familiar corresponde a:",
        },
        {
          "type": "text",
          "name": "nombre_territorio_etnico",
          "visibleIf": "{comunidad_etnica} <> 'Ninguno'",
          "title": "¿Cuál es el nombre completo del territorio colectivo (consejo comunitario o zona de reserva campesina o junta de acción comunal) a la que pertenece su núcleo familiar?"
        },
        {
          "type": "text",
          "name": "nombre_comunidad_etnica",
          "visibleIf": "{comunidad_etnica} <> 'Ninguno'",
          "title": "¿Cuál es el nombre específico de la comunidad étnica a la que pertenece su núcleo familiar?"
        },
        {
          "type": "dropdown",
          "name": "debidamente_inscrito",
          "visibleIf": "{comunidad_etnica} <> 'Ninguno'",
          "title": "¿Su núcleo familiar se encuentra debidamente inscrito en el auto censo o registro de población de su comunidad étnica?",
          "choices": [
            "Si",
            "No",
            {
              "value": "NA",
              "text": "No aplica"
            }
          ]
        }
      ]
    },
    {
      "name": "page3",
      "elements": [
        {
          "type": "dropdown",
          "name": "ubicado_territorio_etnico",
          "title": "¿El predio, lote o parcela en donde va a implementar su alternativa productiva sostenible está ubicado en un territorio étnico (indígena o comunidad negra) formalmente constituido (titulado) o no formalmente constituido (pretendido)?\n",
          "choices": [
            "Si",
            "No",
            "No sabe"
          ]
        },
        {
          "type": "text",
          "name": "valor_ingresos",
          "title": "Valor ingresos menusales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "valor_gastos",
          "title": "Valor de gastos mensuales\n",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "question5",
          "html": "<h4>Lugar donde vive el núcleo familiar\n</h4>"
        },
        {
          "type": "text",
          "name": "departamento",
          "title": "Departamento"
        },
        {
          "type": "text",
          "name": "municipio",
          "title": "Municipio"
        },
        {
          "type": "text",
          "name": "corregimiento",
          "title": "corregimiento"
        },
        {
          "type": "text",
          "name": "vereda",
          "title": "vereda"
        },
        {
          "type": "text",
          "name": "vereda_otra",
          "title": "Otra Vereda"
        },
        {
          "type": "text",
          "name": "predio_nombre",
          "title": "Nombre del predio",
          "description": "Indique el nombre del predio donde vive el grupo familiar"
        },
        {
          "type": "text",
          "name": "predio_area",
          "title": "Area total del predio",
          "description": "Tamaño del predio en hectáreas",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "question6",
          "title": "Coordenadas",
          "html": "<p><strong>\nCoordenadas (esto se llena por la DSCI)\n\n</strong>\n<br>\nIndique las coordenadas en el formato establecido por el equipo SIG en grados decimales\n</p>"
        },
        {
          "type": "text",
          "name": "latitud",
          "title": "Latitud"
        },
        {
          "type": "text",
          "name": "longitud",
          "title": "Longitud"
        },
        {
          "type": "text",
          "name": "altura",
          "title": "Altura",
          "description": "msnm\n"
        },
        {
          "type": "text",
          "name": "permanencia",
          "title": "Permanencia",
          "description": "Indique hace cuántos años su núcleo familiar cuenta con la tenencia del predio",
          "inputType": "number"
        },
        {
          "type": "dropdown",
          "name": "tipo_relacion",
          "title": "Tipo de relación con el predio\n",
          "choices": [
            "Propietario",
            "Ocupante",
            "Poseedor",
            "Arrendatario",
            "Tenedor (prestada, cuidandero en posada)",
            "Poseedor de posesión ilíquida (herencia sin tramitar derecho)"
          ]
        },
        {
          "type": "text",
          "name": "tipo_documento_acredita",
          "title": "Tipo de documento que acredita la relación con el predio\n",
        },
        {
          "type": "dropdown",
          "name": "proopietario_tipo_identificacion",
          "title": "Tipo de identificación propietario",
          "isRequired": true,
          "choices": [
            "Cédula de ciudadanía",
            "Pasaporte",
            "Permiso especial de permanencia",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "propietario_numero_identificacion",
          "title": "Número identificación propietario"
        },
        {
          "type": "dropdown",
          "name": "predio_mismo_residencia",
          "title": "El predio donde usted tiene el cultivo de uso ilícito es el mismo de su lugar de residencia\n",
          "choices": [
            "Si",
            "No",
            "No sabe"
          ]
        },
        {
          "type": "dropdown",
          "name": "num_dependientes",
          "title": "¿Cuántas personas dependen económicamente del titular y/o habitan en el mismo lugar? ",
          "choices": [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10"
          ]
        }
      ]
    },
    {
      "name": "page18",
      "visibleIf": "{num_dependientes1} >= '1'",
      "elements": [
        {
          "type": "html",
          "name": "question3",
          "html": "\n<p><strong>1.1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "question7",
          "html": "<p><strong>Persona No 1\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona1_nombre",
          "title": "Nombre Completo"
        },
        {
          "type": "dropdown",
          "name": "persona1_tipo_identificacion",
          "title": "Tipo de Identificación\n",
          "choices": [
            "Cédula de ciudadanía",
            "Pasaporte",
            "Permiso especial de permanencia",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona1_num_identificación",
          "title": "Número Identificación"
        },
        {
          "type": "text",
          "name": "persona1_fecha_expedicion_identificacion",
          "title": "Fecha de expedicion\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona1_parentesco",
          "title": "Parentesco",
          "choices": [
            "Abuelo",
            "Abuela",
            "Padre",
            "Madre",
            "Hijo(a)",
            "Hermano (a)",
            "Esposo(a)",
            "Compañero(a) permanente",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona1_parentesco_cual",
          "title": "Cuál Parentesco"
        },
        {
          "type": "text",
          "name": "persona1_fecha_nacimiento",
          "title": "Fecha de Nacimiento\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona1_sexo",
          "title": "Sexo",
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "question21",
          "title": "Estado Civil\n",
          "choices": [
            "Soltero(a)",
            "Casado (a)",
            "Separado(a)",
            "Viudo(a)",
            "Unión libre",
            "Otro"
          ]
        },
        {
          "type": "dropdown",
          "name": "question22",
          "title": "Grupo de atención especial\n",
          "choices": [
            "Desplazados",
            "Retornado",
            "Reinsertado",
            "Afrodescendiente",
            "Indígenas",
            "ROM/gitano",
            "LGTBI",
            "Palenquero",
            "Raizal",
            "Campesinado"
          ]
        }
      ]
    },
    {
      "name": "page_persona2",
      "visibleIf": "{num_dependientes1} >= '2'",
      "elements": [
        {
          "type": "html",
          "name": "persona2_question3",
          "html": "\n<p><strong>1.1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona2_question7",
          "html": "<p><strong>Persona No 2\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona2_nombre",
          "title": "Nombre Completo"
        },
        {
          "type": "dropdown",
          "name": "persona2_tipo_identificacion",
          "title": "Tipo de Identificación\n",
          "choices": [
            "Cédula de ciudadanía",
            "Pasaporte",
            "Permiso especial de permanencia",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona2_num_identificación",
          "title": "Número Identificación"
        },
        {
          "type": "text",
          "name": "persona2_fecha_expedicion_identificacion",
          "title": "Fecha de expedicion\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona2_parentesco",
          "title": "Parentesco",
          "choices": [
            "Abuelo",
            "Abuela",
            "Padre",
            "Madre",
            "Hijo(a)",
            "Hermano (a)",
            "Esposo(a)",
            "Compañero(a) permanente",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona2_parentesco_cual",
          "title": "Cuál Parentesco"
        },
        {
          "type": "text",
          "name": "persona2_fecha_nacimiento",
          "title": "Fecha de Nacimiento\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona2_sexo",
          "title": "Sexo",
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona2_estado_civil",
          "title": "Estado Civil\n",
          "choices": [
            "Soltero(a)",
            "Casado (a)",
            "Separado(a)",
            "Viudo(a)",
            "Unión libre",
            "Otro"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona2_atencion_especial",
          "title": "Grupo de atención especial\n",
          "choices": [
            "Desplazados",
            "Retornado",
            "Reinsertado",
            "Afrodescendiente",
            "Indígenas",
            "ROM/gitano",
            "LGTBI",
            "Palenquero",
            "Raizal",
            "Campesinado"
          ]
        }
      ]
    },
    {
      "name": "page_persona3",
      "visibleIf": "{num_dependientes1} >= '3'",
      "elements": [
        {
          "type": "html",
          "name": "persona3_question3",
          "html": "\n<p><strong>1.1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona3_question7",
          "html": "<p><strong>Persona No 3\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona3_nombre",
          "title": "Nombre Completo"
        },
        {
          "type": "dropdown",
          "name": "persona3_tipo_identificacion",
          "title": "Tipo de Identificación\n",
          "choices": [
            "Cédula de ciudadanía",
            "Pasaporte",
            "Permiso especial de permanencia",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona3_num_identificación",
          "title": "Número Identificación"
        },
        {
          "type": "text",
          "name": "persona3_fecha_expedicion_identificacion",
          "title": "Fecha de expedicion\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona3_parentesco",
          "title": "Parentesco",
          "choices": [
            "Abuelo",
            "Abuela",
            "Padre",
            "Madre",
            "Hijo(a)",
            "Hermano (a)",
            "Esposo(a)",
            "Compañero(a) permanente",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona3_parentesco_cual",
          "title": "Cuál Parentesco"
        },
        {
          "type": "text",
          "name": "persona3_fecha_nacimiento",
          "title": "Fecha de Nacimiento\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona3_sexo",
          "title": "Sexo",
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona3_estado_civil",
          "title": "Estado Civil\n",
          "choices": [
            "Soltero(a)",
            "Casado (a)",
            "Separado(a)",
            "Viudo(a)",
            "Unión libre",
            "Otro"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona3_atencion_especial",
          "title": "Grupo de atención especial\n",
          "choices": [
            "Desplazados",
            "Retornado",
            "Reinsertado",
            "Afrodescendiente",
            "Indígenas",
            "ROM/gitano",
            "LGTBI",
            "Palenquero",
            "Raizal",
            "Campesinado"
          ]
        }
      ]
    },
    {
      "name": "page_persona4",
      "visibleIf": "{num_dependientes1} >= '4'",
      "elements": [
        {
          "type": "html",
          "name": "persona4_question3",
          "html": "\n<p><strong>1.1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona4_question7",
          "html": "<p><strong>Persona No 4\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona4_nombre",
          "title": "Nombre Completo"
        },
        {
          "type": "dropdown",
          "name": "persona4_tipo_identificacion",
          "title": "Tipo de Identificación\n",
          "choices": [
            "Cédula de ciudadanía",
            "Pasaporte",
            "Permiso especial de permanencia",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona4_num_identificación",
          "title": "Número Identificación"
        },
        {
          "type": "text",
          "name": "persona4_fecha_expedicion_identificacion",
          "title": "Fecha de expedicion\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona4_parentesco",
          "title": "Parentesco",
          "choices": [
            "Abuelo",
            "Abuela",
            "Padre",
            "Madre",
            "Hijo(a)",
            "Hermano (a)",
            "Esposo(a)",
            "Compañero(a) permanente",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona4_parentesco_cual",
          "title": "Cuál Parentesco"
        },
        {
          "type": "text",
          "name": "persona4_fecha_nacimiento",
          "title": "Fecha de Nacimiento\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona4_sexo",
          "title": "Sexo",
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona4_estado_civil",
          "title": "Estado Civil\n",
          "choices": [
            "Soltero(a)",
            "Casado (a)",
            "Separado(a)",
            "Viudo(a)",
            "Unión libre",
            "Otro"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona4_atencion_especial",
          "title": "Grupo de atención especial\n",
          "choices": [
            "Desplazados",
            "Retornado",
            "Reinsertado",
            "Afrodescendiente",
            "Indígenas",
            "ROM/gitano",
            "LGTBI",
            "Palenquero",
            "Raizal",
            "Campesinado"
          ]
        }
      ]
    },
    {
      "name": "page_persona5",
      "visibleIf": "{num_dependientes1} >= '5'",
      "elements": [
        {
          "type": "html",
          "name": "persona5_question3",
          "html": "\n<p><strong>1.1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona5_question7",
          "html": "<p><strong>Persona No 5\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona5_nombre",
          "title": "Nombre Completo"
        },
        {
          "type": "dropdown",
          "name": "persona5_tipo_identificacion",
          "title": "Tipo de Identificación\n",
          "choices": [
            "Cédula de ciudadanía",
            "Pasaporte",
            "Permiso especial de permanencia",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona5_num_identificación",
          "title": "Número Identificación"
        },
        {
          "type": "text",
          "name": "persona5_fecha_expedicion_identificacion",
          "title": "Fecha de expedicion\n",
          "inputType": "date"
        },
        {
          "type": "file",
          "name": "persona5_foto_doc_atras",
          "title": "Foto Doc. Atras",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
        },
        {
          "type": "dropdown",
          "name": "persona5_parentesco",
          "title": "Parentesco",
          "choices": [
            "Abuelo",
            "Abuela",
            "Padre",
            "Madre",
            "Hijo(a)",
            "Hermano (a)",
            "Esposo(a)",
            "Compañero(a) permanente",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona5_parentesco_cual",
          "title": "Cuál Parentesco"
        },
        {
          "type": "text",
          "name": "persona5_fecha_nacimiento",
          "title": "Fecha de Nacimiento\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona5_sexo",
          "title": "Sexo",
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona5_estado_civil",
          "title": "Estado Civil\n",
          "choices": [
            "Soltero(a)",
            "Casado (a)",
            "Separado(a)",
            "Viudo(a)",
            "Unión libre",
            "Otro"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona5_atencion_especial",
          "title": "Grupo de atención especial\n",
          "choices": [
            "Desplazados",
            "Retornado",
            "Reinsertado",
            "Afrodescendiente",
            "Indígenas",
            "ROM/gitano",
            "LGTBI",
            "Palenquero",
            "Raizal",
            "Campesinado"
          ]
        }
      ]
    },
    {
      "name": "page_persona6",
      "visibleIf": "{num_dependientes1} >= '6'",
      "elements": [
        {
          "type": "html",
          "name": "persona6_question3",
          "html": "\n<p><strong>1.1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona6_question7",
          "html": "<p><strong>Persona No 6\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona6_nombre",
          "title": "Nombre Completo"
        },
        {
          "type": "dropdown",
          "name": "persona6_tipo_identificacion",
          "title": "Tipo de Identificación\n",
          "choices": [
            "Cédula de ciudadanía",
            "Pasaporte",
            "Permiso especial de permanencia",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona6_num_identificación",
          "title": "Número Identificación"
        },
        {
          "type": "text",
          "name": "persona6_fecha_expedicion_identificacion",
          "title": "Fecha de expedicion\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona6_parentesco",
          "title": "Parentesco",
          "choices": [
            "Abuelo",
            "Abuela",
            "Padre",
            "Madre",
            "Hijo(a)",
            "Hermano (a)",
            "Esposo(a)",
            "Compañero(a) permanente",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona6_parentesco_cual",
          "title": "Cuál Parentesco"
        },
        {
          "type": "text",
          "name": "persona6_fecha_nacimiento",
          "title": "Fecha de Nacimiento\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona6_sexo",
          "title": "Sexo",
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona6_estado_civil",
          "title": "Estado Civil\n",
          "choices": [
            "Soltero(a)",
            "Casado (a)",
            "Separado(a)",
            "Viudo(a)",
            "Unión libre",
            "Otro"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona6_atencion_especial",
          "title": "Grupo de atención especial\n",
          "choices": [
            "Desplazados",
            "Retornado",
            "Reinsertado",
            "Afrodescendiente",
            "Indígenas",
            "ROM/gitano",
            "LGTBI",
            "Palenquero",
            "Raizal",
            "Campesinado"
          ]
        }
      ]
    },
    {
      "name": "page_persona7",
      "visibleIf": "{num_dependientes1} >= '7'",
      "elements": [
        {
          "type": "html",
          "name": "persona7_question3",
          "html": "\n<p><strong>1.1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona7_question7",
          "html": "<p><strong>Persona No 7\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona7_nombre",
          "title": "Nombre Completo"
        },
        {
          "type": "dropdown",
          "name": "persona7_tipo_identificacion",
          "title": "Tipo de Identificación\n",
          "choices": [
            "Cédula de ciudadanía",
            "Pasaporte",
            "Permiso especial de permanencia",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona7_num_identificación",
          "title": "Número Identificación"
        },
        {
          "type": "text",
          "name": "persona7_fecha_expedicion_identificacion",
          "title": "Fecha de expedicion\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona7_parentesco",
          "title": "Parentesco",
          "choices": [
            "Abuelo",
            "Abuela",
            "Padre",
            "Madre",
            "Hijo(a)",
            "Hermano (a)",
            "Esposo(a)",
            "Compañero(a) permanente",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona7_parentesco_cual",
          "title": "Cuál Parentesco"
        },
        {
          "type": "text",
          "name": "persona7_fecha_nacimiento",
          "title": "Fecha de Nacimiento\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona7_sexo",
          "title": "Sexo",
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona7_estado_civil",
          "title": "Estado Civil\n",
          "choices": [
            "Soltero(a)",
            "Casado (a)",
            "Separado(a)",
            "Viudo(a)",
            "Unión libre",
            "Otro"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona7_atencion_especial",
          "title": "Grupo de atención especial\n",
          "choices": [
            "Desplazados",
            "Retornado",
            "Reinsertado",
            "Afrodescendiente",
            "Indígenas",
            "ROM/gitano",
            "LGTBI",
            "Palenquero",
            "Raizal",
            "Campesinado"
          ]
        }
      ]
    },
    {
      "name": "page_persona8",
      "visibleIf": "{num_dependientes1} >= '8'",
      "elements": [
        {
          "type": "html",
          "name": "persona8_question3",
          "html": "\n<p><strong>1.1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona8_question7",
          "html": "<p><strong>Persona No 8\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona8_nombre",
          "title": "Nombre Completo"
        },
        {
          "type": "dropdown",
          "name": "persona8_tipo_identificacion",
          "title": "Tipo de Identificación\n",
          "choices": [
            "Cédula de ciudadanía",
            "Pasaporte",
            "Permiso especial de permanencia",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona8_num_identificación",
          "title": "Número Identificación"
        },
        {
          "type": "text",
          "name": "persona8_fecha_expedicion_identificacion",
          "title": "Fecha de expedicion\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona8_parentesco",
          "title": "Parentesco",
          "choices": [
            "Abuelo",
            "Abuela",
            "Padre",
            "Madre",
            "Hijo(a)",
            "Hermano (a)",
            "Esposo(a)",
            "Compañero(a) permanente",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona8_parentesco_cual",
          "title": "Cuál Parentesco"
        },
        {
          "type": "text",
          "name": "persona8_fecha_nacimiento",
          "title": "Fecha de Nacimiento\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona8_sexo",
          "title": "Sexo",
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona8_estado_civil",
          "title": "Estado Civil\n",
          "choices": [
            "Soltero(a)",
            "Casado (a)",
            "Separado(a)",
            "Viudo(a)",
            "Unión libre",
            "Otro"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona8_atencion_especial",
          "title": "Grupo de atención especial\n",
          "choices": [
            "Desplazados",
            "Retornado",
            "Reinsertado",
            "Afrodescendiente",
            "Indígenas",
            "ROM/gitano",
            "LGTBI",
            "Palenquero",
            "Raizal",
            "Campesinado"
          ]
        }
      ]
    },
    {
      "name": "page_persona9",
      "visibleIf": "{num_dependientes1} >= '9'",
      "elements": [
        {
          "type": "html",
          "name": "persona9_question3",
          "html": "\n<p><strong>1.1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona9_question7",
          "html": "<p><strong>Persona No 9\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona9_nombre",
          "title": "Nombre Completo"
        },
        {
          "type": "dropdown",
          "name": "persona9_tipo_identificacion",
          "title": "Tipo de Identificación\n",
          "choices": [
            "Cédula de ciudadanía",
            "Pasaporte",
            "Permiso especial de permanencia",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona9_num_identificación",
          "title": "Número Identificación"
        },
        {
          "type": "text",
          "name": "persona9_fecha_expedicion_identificacion",
          "title": "Fecha de expedicion\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona9_parentesco",
          "title": "Parentesco",
          "choices": [
            "Abuelo",
            "Abuela",
            "Padre",
            "Madre",
            "Hijo(a)",
            "Hermano (a)",
            "Esposo(a)",
            "Compañero(a) permanente",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona9_parentesco_cual",
          "title": "Cuál Parentesco"
        },
        {
          "type": "text",
          "name": "persona9_fecha_nacimiento",
          "title": "Fecha de Nacimiento\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona9_sexo",
          "title": "Sexo",
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona9_estado_civil",
          "title": "Estado Civil\n",
          "choices": [
            "Soltero(a)",
            "Casado (a)",
            "Separado(a)",
            "Viudo(a)",
            "Unión libre",
            "Otro"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona9_atencion_especial",
          "title": "Grupo de atención especial\n",
          "choices": [
            "Desplazados",
            "Retornado",
            "Reinsertado",
            "Afrodescendiente",
            "Indígenas",
            "ROM/gitano",
            "LGTBI",
            "Palenquero",
            "Raizal",
            "Campesinado"
          ]
        }
      ]
    },
    {
      "name": "page_persona10",
      "visibleIf": "{num_dependientes1} >= '10'",
      "elements": [
        {
          "type": "html",
          "name": "persona10_question3",
          "html": "\n<p><strong>1.1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona10_question7",
          "visibleIf": "{num_dependientes1} >= '10'",
          "html": "<p><strong>Persona No 10\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona10_nombre",
          "title": "Nombre Completo"
        },
        {
          "type": "dropdown",
          "name": "persona10_tipo_identificacion",
          "title": "Tipo de Identificación\n",
          "choices": [
            "Cédula de ciudadanía",
            "Pasaporte",
            "Permiso especial de permanencia",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona10_num_identificación",
          "title": "Número Identificación"
        },
        {
          "type": "text",
          "name": "persona10_fecha_expedicion_identificacion",
          "title": "Fecha de expedicion\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona10_parentesco",
          "title": "Parentesco",
          "choices": [
            "Abuelo",
            "Abuela",
            "Padre",
            "Madre",
            "Hijo(a)",
            "Hermano (a)",
            "Esposo(a)",
            "Compañero(a) permanente",
            "Otro"
          ]
        },
        {
          "type": "text",
          "name": "persona10_parentesco_cual",
          "title": "Cuál Parentesco"
        },
        {
          "type": "text",
          "name": "persona10_fecha_nacimiento",
          "title": "Fecha de Nacimiento\n",
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona10_sexo",
          "title": "Sexo",
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona10_estado_civil",
          "title": "Estado Civil\n",
          "choices": [
            "Soltero(a)",
            "Casado (a)",
            "Separado(a)",
            "Viudo(a)",
            "Unión libre",
            "Otro"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona10_atencion_especial",
          "title": "Grupo de atención especial\n",
          "choices": [
            "Desplazados",
            "Retornado",
            "Reinsertado",
            "Afrodescendiente",
            "Indígenas",
            "ROM/gitano",
            "LGTBI",
            "Palenquero",
            "Raizal",
            "Campesinado"
          ]
        }
      ]
    },
    {
      "name": "page19",
      "elements": [
        {
          "type": "comment",
          "name": "question9",
          "title": "1.1. 3. Caracterización productiva del núcleo familiar",
          "description": "Indique cuáles son las actividades económicas que desarrolla el núcleo familiar"
        }
      ]
    },
    {
      "name": "page4",
      "elements": [
        {
          "type": "html",
          "name": "question8",
          "html": "<span style=\"font-weight: 999;\">1.2. Predio Objetivo de intervención </span>\n<p><strong>1.2.1. Ubicación del predio\n</strong>( Indique las características que permitan georeferenciar e individualizar plenamente el predio objeto de intervención, en el cual usted cuenta con los cultivos de uso ilícito) </p>"
        },
        {
          "type": "dropdown",
          "name": "numero_predios_uso_ilicito",
          "title": "¿Cuántos predios con cultivos de uso ilícito tiene su núcleo familiar?\n",
          "choices": [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10"
          ]
        }
      ]
    },
    {
      "name": "page5",
      "visibleIf": "{numero_predios_uso_ilicito} >= 1",
      "elements": [
        {
          "type": "html",
          "name": "question14",
          "html": "<h4>Identificación Predio 1</h4>\n"
        },
        {
          "type": "text",
          "name": "predio1_municipio",
          "title": "Municipio"
        },
        {
          "type": "text",
          "name": "predio1_corregimiento",
          "title": "corregimiento"
        },
        {
          "type": "text",
          "name": "predio1_vereda",
          "title": "Vereda"
        },
        {
          "type": "text",
          "name": "predio1_vereda_otra",
          "title": "Otra Vereda"
        },
        {
          "type": "text",
          "name": "predio1_nombre",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "predio1_area",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio1_area_coca",
          "title": "Área sembrada de cultivos de uso ilícito en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio1_num_plantas",
          "title": "Cantidad de plantas\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio1_area_disponible",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "question15",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "html": "\n<span style=\"font-weight: 999;\">\nCoordenadas del predio</span>"
        },
        {
          "type": "text",
          "name": "predio1_longitud",
          "minWidth": "150px",
          "title": "Longitud"
        },
        {
          "type": "text",
          "name": "predio1_latitud",
          "minWidth": "150px",
          "title": "Latitud"
        },
        {
          "type": "text",
          "name": "predio1_altura",
          "minWidth": "150px",
          "title": "Altura",
          "description": "msnm"
        },
        {
          "type": "html",
          "name": "precision",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nArraigo al municipio</span>\n"
        },
        {
          "type": "text",
          "name": "predio1_arraigo_tiempo",
          "title": "Tiempo",
          "description": "señalar el tiempo en años de permanencia en el municipio del núcleo familiar y acreditar con certificado por organismos de acción comunal, o quien haga sus veces"
        },
        {
          "type": "dropdown",
          "name": "predio1_arraigo_anexa_documento",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio1_relacion_predio",
          "title": "Tipo de relación con el predio\n",
          "description": "Nota: no se admiten arrendatarios o amedieros.\n",
          "choices": [
            "Propietario",
            "Ocupante",
            {
              "value": "Poseedor",
              "text": "Poseedor a cualquier título"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio1_relacion_documento_acreditado",
          "title": "Tipo de documento que acredita la relación con el predio\n",
          "choices": [
            {
              "value": "Carta venta",
              "text": "Carta venta o documento de similares características"
            },
            {
              "value": "Certificado de sana posesion",
              "text": "Certificado de sana posesión"
            },
            {
              "value": "Certificado de tradicion y libertad",
              "text": "Certificado de tradición y libertad"
            },
            "Documento compraventa"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio1_arraigo_documento_anexo",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "html",
          "name": "question23",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nCuantas personas habitan en el predio?\n</span>\n"
        },
        {
          "type": "dropdown",
          "name": "predio1_todos_familiares",
          "title": "¿Todas las personas que habitan el predio hacen parte de su núcleo familiar? \n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio1_numero_nucleo_familiar",
          "title": "Número de personas de su núcleo familiar que habitan el predio",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio1_numero_nucleo_no_familair",
          "visibleIf": "{predio1_todos_familiares} = 'no'",
          "title": "Número de personas que habitan el predio que no hacen parte de su núcleo familiar",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio1_question10",
          "html": "<p><strong>1.2.2. Caracterización productiva del predio <br>\n</strong>( Indique las características que permitan identificar las condiciones para el desarrollo de alternativas productivas en el predio objeto de intervención) </p>"
        },
        {
          "type": "text",
          "name": "predio1_area_productiva",
          "title": "Area productiva del predio",
          "inputType": "number"
        },
        {
          "type": "dropdown",
          "name": "predio1_actividades_licitas_tiene",
          "title": "Existen actividades productivas lícitas en el predio ",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio1_actividades_licitas_lista",
          "title": "¿Cuáles son las actividades productivas del predio?",
          "choices": [
            {
              "value": "pecuarias",
              "text": "Pecuarias"
            },
            {
              "value": "Agricolas",
              "text": "Agrícolas"
            },
            "Artesanales",
            "Forestales",
            "Ecoturismo",
            "otra"
          ]
        },
        {
          "type": "text",
          "name": "predio1_actividades_licitas_lista_otra",
          "visibleIf": "{predio1_actividades_licitas_lista} = 'otra'",
          "title": "Otra"
        },
        {
          "type": "dropdown",
          "name": "predio1_nucleo_unico_usufructa",
          "title": "¿Su núcleo familiar es el único que usufructúa el predio?",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio1_num_familias_usufructa",
          "title": "Señale cuántos núcleos familiares usufructúan el predio\n",
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page6",
      "visibleIf": "{numero_predios_uso_ilicito} >= 2",
      "elements": [
        {
          "type": "html",
          "name": "question142",
          "html": "<h4>Identificación Predio 2</h4>\n"
        },
        {
          "type": "dropdown",
          "name": "predio2_municipio",
          "title": "Municipio",
          "choices": [
            {
              "value": "787",
              "text": "sin municipio"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio2_corregimiento",
          "title": "corregimiento",
          "choices": [
            "sin corregimiento"
          ]
        },
        {
          "type": "text",
          "name": "predio2_vereda",
          "title": "Vereda"
        },
        {
          "type": "text",
          "name": "predio2_vereda_otra",
          "title": "Otra Vereda"
        },
        {
          "type": "text",
          "name": "predio2_nombre",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "predio2_area",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio2_area_coca",
          "title": "Área sembrada de cultivos de uso ilícito en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio2_num_plantas",
          "title": "Cantidad de plantas\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio2_area_disponible",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "question25",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "html": "\n<span style=\"font-weight: 999;\">\nCoordenadas del predio</span>"
        },
        {
          "type": "text",
          "name": "predio2_longitud",
          "minWidth": "150px",
          "title": "Longitud"
        },
        {
          "type": "text",
          "name": "predio2_latitud",
          "minWidth": "150px",
          "title": "Latitud"
        },
        {
          "type": "text",
          "name": "predio2_altura",
          "minWidth": "150px",
          "title": "Altura",
          "description": "msnm"
        },
        {
          "type": "html",
          "name": "2",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nArraigo al municipio</span>\n"
        },
        {
          "type": "text",
          "name": "predio2_arraigo_tiempo",
          "title": "Tiempo",
          "description": "señalar el tiempo en años de permanencia en el municipio del núcleo familiar y acreditar con certificado por organismos de acción comunal, o quien haga sus veces"
        },
        {
          "type": "dropdown",
          "name": "predio2_arraigo_anexa_documento",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio2_relacion_predio",
          "title": "Tipo de relación con el predio\n",
          "description": "Nota: no se admiten arrendatarios o amedieros.\n",
          "choices": [
            "Propietario",
            "Ocupante",
            {
              "value": "Poseedor",
              "text": "Poseedor a cualquier título"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio2_relacion_documento_acreditado",
          "title": "Tipo de documento que acredita la relación con el predio\n",
          "choices": [
            {
              "value": "Carta venta",
              "text": "Carta venta o documento de similares características"
            },
            {
              "value": "Certificado de sana posesion",
              "text": "Certificado de sana posesión"
            },
            {
              "value": "Certificado de tradicion y libertad",
              "text": "Certificado de tradición y libertad"
            },
            "Documento compraventa"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio2_arraigo_documento_anexo",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "html",
          "name": "question223",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nCuantas personas habitan en el predio?\n</span>\n"
        },
        {
          "type": "dropdown",
          "name": "predio2_todos_familiares",
          "title": "¿Todas las personas que habitan el predio hacen parte de su núcleo familiar? \n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio2_numero_nucleo_familiar",
          "title": "Número de personas de su núcleo familiar que habitan el predio",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio2_numero_nucleo_no_familair",
          "visibleIf": "{predio1_todos_familiares} = 'no'",
          "title": "Número de personas que habitan el predio que no hacen parte de su núcleo familiar",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio2_question10",
          "html": "<p><strong>1.2.2. Caracterización productiva del predio <br>\n</strong>( Indique las características que permitan identificar las condiciones para el desarrollo de alternativas productivas en el predio objeto de intervención) </p>"
        },
        {
          "type": "text",
          "name": "predio2_area_productiva",
          "title": "Area productiva del predio",
          "inputType": "number"
        },
        {
          "type": "dropdown",
          "name": "predio2_actividades_licitas_tiene",
          "title": "Existen actividades productivas lícitas en el predio ",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio2_actividades_licitas_lista",
          "title": "¿Cuáles son las actividades productivas del predio?",
          "choices": [
            {
              "value": "pecuarias",
              "text": "Pecuarias"
            },
            {
              "value": "Agricolas",
              "text": "Agrícolas"
            },
            "Artesanales",
            "Forestales",
            "Ecoturismo",
            "otra"
          ]
        },
        {
          "type": "text",
          "name": "predio2_actividades_licitas_lista_otra",
          "visibleIf": "{predio2_actividades_licitas_lista} = 'otra'",
          "title": "Otra"
        },
        {
          "type": "dropdown",
          "name": "predio2_nucleo_unico_usufructa",
          "title": "¿Su núcleo familiar es el único que usufructúa el predio?",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio2_num_familias_usufructa",
          "title": "Señale cuántos núcleos familiares usufructúan el predio\n",
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page7",
      "visibleIf": "{numero_predios_uso_ilicito} >= 3",
      "elements": [
        {
          "type": "html",
          "name": "predio3_question14",
          "html": "<h4>Identificación Predio 3</h4>\n"
        },
        {
          "type": "dropdown",
          "name": "predio3_departamento",
          "title": "Departamento",
          "choices": [
            {
              "value": "787",
              "text": "departamento1"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio3_municipio",
          "title": "Municipio",
          "choices": [
            {
              "value": "787",
              "text": "sin municipio"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio3_corregimiento",
          "title": "corregimiento",
          "choices": [
            "sin corregimiento"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio3_vereda",
          "title": "Vereda",
          "choices": [
            "sin vereda",
            {
              "value": "otro",
              "text": "Otro"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio3_nombre",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "predio3_area",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio3_area_coca",
          "title": "Área sembrada de cultivos de uso ilícito en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio3_num_plantas",
          "title": "Cantidad de plantas\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio3_area_disponible",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio3_question15",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "html": "\n<span style=\"font-weight: 999;\">\nCoordenadas del predio</span>"
        },
        {
          "type": "text",
          "name": "predio3_longitud",
          "minWidth": "150px",
          "title": "Longitud"
        },
        {
          "type": "text",
          "name": "predio3_latitud",
          "minWidth": "150px",
          "title": "Latitud"
        },
        {
          "type": "text",
          "name": "predio3_altura",
          "minWidth": "150px",
          "title": "Altura",
          "description": "msnm"
        },
        {
          "type": "html",
          "name": "predio3_precision",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nArraigo al municipio</span>\n"
        },
        {
          "type": "text",
          "name": "predio3_arraigo_tiempo",
          "title": "Tiempo",
          "description": "señalar el tiempo en años de permanencia en el municipio del núcleo familiar y acreditar con certificado por organismos de acción comunal, o quien haga sus veces"
        },
        {
          "type": "dropdown",
          "name": "predio3_arraigo_anexa_documento",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio3_relacion_predio",
          "title": "Tipo de relación con el predio\n",
          "description": "Nota: no se admiten arrendatarios o amedieros.\n",
          "choices": [
            "Propietario",
            "Ocupante",
            {
              "value": "Poseedor",
              "text": "Poseedor a cualquier título"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio3_relacion_documento_acreditado",
          "title": "Tipo de documento que acredita la relación con el predio\n",
          "choices": [
            {
              "value": "Carta venta",
              "text": "Carta venta o documento de similares características"
            },
            {
              "value": "Certificado de sana posesion",
              "text": "Certificado de sana posesión"
            },
            {
              "value": "Certificado de tradicion y libertad",
              "text": "Certificado de tradición y libertad"
            },
            "Documento compraventa"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio3_arraigo_documento_anexo",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "html",
          "name": "predio3_question23",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nCuantas personas habitan en el predio?\n</span>\n"
        },
        {
          "type": "dropdown",
          "name": "predio3_todos_familiares",
          "title": "¿Todas las personas que habitan el predio hacen parte de su núcleo familiar? \n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio3_numero_nucleo_familiar",
          "title": "Número de personas de su núcleo familiar que habitan el predio",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio3_numero_nucleo_no_familair",
          "visibleIf": "{predio3_todos_familiares} = 'no'",
          "title": "Número de personas que habitan el predio que no hacen parte de su núcleo familiar",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio3_question10",
          "html": "<p><strong>1.2.2. Caracterización productiva del predio <br>\n</strong>( Indique las características que permitan identificar las condiciones para el desarrollo de alternativas productivas en el predio objeto de intervención) </p>"
        },
        {
          "type": "text",
          "name": "predio3_area_productiva",
          "title": "Area productiva del predio",
          "inputType": "number"
        },
        {
          "type": "dropdown",
          "name": "predio3_actividades_licitas_tiene",
          "title": "Existen actividades productivas lícitas en el predio ",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio3_actividades_licitas_lista",
          "title": "¿Cuáles son las actividades productivas del predio?",
          "choices": [
            {
              "value": "pecuarias",
              "text": "Pecuarias"
            },
            {
              "value": "Agricolas",
              "text": "Agrícolas"
            },
            "Artesanales",
            "Forestales",
            "Ecoturismo",
            "otra"
          ]
        },
        {
          "type": "text",
          "name": "predio3_actividades_licitas_lista_otra",
          "visibleIf": "{predio3_actividades_licitas_lista} = 'otra'",
          "title": "Otra"
        },
        {
          "type": "dropdown",
          "name": "predio3_nucleo_unico_usufructa",
          "title": "¿Su núcleo familiar es el único que usufructúa el predio?",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio3_num_familias_usufructa",
          "title": "Señale cuántos núcleos familiares usufructúan el predio\n",
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page8",
      "visibleIf": "{numero_predios_uso_ilicito} >= 4",
      "elements": [
        {
          "type": "html",
          "name": "predio4_question14",
          "html": "<h4>Identificación Predio 4</h4>\n"
        },
        {
          "type": "radiogroup",
          "name": "predio4_departamento",
          "title": "Departamento",
          "choices": [
            {
              "value": "787",
              "text": "departamento1"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio4_municipio",
          "title": "Municipio",
          "choices": [
            {
              "value": "787",
              "text": "sin municipio"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio4_corregimiento",
          "title": "corregimiento",
          "choices": [
            "sin corregimiento"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio4_vereda",
          "title": "Vereda",
          "choices": [
            "sin vereda",
            {
              "value": "otro",
              "text": "Otro"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio4_nombre",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "predio4_area",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio4_area_coca",
          "title": "Área sembrada de cultivos de uso ilícito en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio4_num_plantas",
          "title": "Cantidad de plantas\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio4_area_disponible",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio4_question15",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "html": "\n<span style=\"font-weight: 999;\">\nCoordenadas del predio</span>"
        },
        {
          "type": "text",
          "name": "predio4_longitud",
          "minWidth": "150px",
          "title": "Longitud"
        },
        {
          "type": "text",
          "name": "predio4_latitud",
          "minWidth": "150px",
          "title": "Latitud"
        },
        {
          "type": "text",
          "name": "predio4_altura",
          "minWidth": "150px",
          "title": "Altura",
          "description": "msnm"
        },
        {
          "type": "html",
          "name": "predio4_precision",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nArraigo al municipio</span>\n"
        },
        {
          "type": "text",
          "name": "predio4_arraigo_tiempo",
          "title": "Tiempo",
          "description": "señalar el tiempo en años de permanencia en el municipio del núcleo familiar y acreditar con certificado por organismos de acción comunal, o quien haga sus veces"
        },
        {
          "type": "dropdown",
          "name": "predio4_arraigo_anexa_documento",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio4_relacion_predio",
          "title": "Tipo de relación con el predio\n",
          "description": "Nota: no se admiten arrendatarios o amedieros.\n",
          "choices": [
            "Propietario",
            "Ocupante",
            {
              "value": "Poseedor",
              "text": "Poseedor a cualquier título"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio4_relacion_documento_acreditado",
          "title": "Tipo de documento que acredita la relación con el predio\n",
          "choices": [
            {
              "value": "Carta venta",
              "text": "Carta venta o documento de similares características"
            },
            {
              "value": "Certificado de sana posesion",
              "text": "Certificado de sana posesión"
            },
            {
              "value": "Certificado de tradicion y libertad",
              "text": "Certificado de tradición y libertad"
            },
            "Documento compraventa"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio4_arraigo_documento_anexo",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "html",
          "name": "predio4_question23",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nCuantas personas habitan en el predio?\n</span>\n"
        },
        {
          "type": "dropdown",
          "name": "predio4_todos_familiares",
          "title": "¿Todas las personas que habitan el predio hacen parte de su núcleo familiar? \n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio4_numero_nucleo_familiar",
          "title": "Número de personas de su núcleo familiar que habitan el predio",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio4_numero_nucleo_no_familair",
          "visibleIf": "{predio4_todos_familiares} = 'no'",
          "title": "Número de personas que habitan el predio que no hacen parte de su núcleo familiar",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio4_question10",
          "html": "<p><strong>1.2.2. Caracterización productiva del predio <br>\n</strong>( Indique las características que permitan identificar las condiciones para el desarrollo de alternativas productivas en el predio objeto de intervención) </p>"
        },
        {
          "type": "text",
          "name": "predio4_area_productiva",
          "title": "Area productiva del predio",
          "inputType": "number"
        },
        {
          "type": "dropdown",
          "name": "predio4_actividades_licitas_tiene",
          "title": "Existen actividades productivas lícitas en el predio ",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio4_actividades_licitas_lista",
          "title": "¿Cuáles son las actividades productivas del predio?",
          "choices": [
            {
              "value": "pecuarias",
              "text": "Pecuarias"
            },
            {
              "value": "Agricolas",
              "text": "Agrícolas"
            },
            "Artesanales",
            "Forestales",
            "Ecoturismo",
            "otra"
          ]
        },
        {
          "type": "text",
          "name": "predio4_actividades_licitas_lista_otra",
          "visibleIf": "{predio4_actividades_licitas_lista} = 'otra'",
          "title": "Otra"
        },
        {
          "type": "dropdown",
          "name": "predio4_nucleo_unico_usufructa",
          "title": "¿Su núcleo familiar es el único que usufructúa el predio?",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio4_num_familias_usufructa",
          "title": "Señale cuántos núcleos familiares usufructúan el predio\n",
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page9",
      "visibleIf": "{numero_predios_uso_ilicito} >= 5",
      "elements": [
        {
          "type": "html",
          "name": "predio5_question14",
          "html": "<h4>Identificación Predio 5</h4>\n"
        },
        {
          "type": "dropdown",
          "name": "predio5_departamento",
          "title": "Departamento",
          "choices": [
            {
              "value": "787",
              "text": "departamento1"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio5_municipio",
          "title": "Municipio",
          "choices": [
            {
              "value": "787",
              "text": "sin municipio"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio5_corregimiento",
          "title": "corregimiento",
          "choices": [
            "sin corregimiento"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio5_vereda",
          "title": "Vereda",
          "choices": [
            "sin vereda",
            {
              "value": "otro",
              "text": "Otro"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio5_nombre",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "predio5_area",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio5_area_coca",
          "title": "Área sembrada de cultivos de uso ilícito en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio5_num_plantas",
          "title": "Cantidad de plantas\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio5_area_disponible",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio5_question15",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "html": "\n<span style=\"font-weight: 999;\">\nCoordenadas del predio</span>"
        },
        {
          "type": "text",
          "name": "predio5_longitud",
          "minWidth": "150px",
          "title": "Longitud"
        },
        {
          "type": "text",
          "name": "predio5_latitud",
          "minWidth": "150px",
          "title": "Latitud"
        },
        {
          "type": "text",
          "name": "predio5_altura",
          "minWidth": "150px",
          "title": "Altura",
          "description": "msnm"
        },
        {
          "type": "html",
          "name": "predio5_precision",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nArraigo al municipio</span>\n"
        },
        {
          "type": "text",
          "name": "predio5_arraigo_tiempo",
          "title": "Tiempo",
          "description": "señalar el tiempo en años de permanencia en el municipio del núcleo familiar y acreditar con certificado por organismos de acción comunal, o quien haga sus veces"
        },
        {
          "type": "dropdown",
          "name": "predio5_arraigo_anexa_documento",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio5_relacion_predio",
          "title": "Tipo de relación con el predio\n",
          "description": "Nota: no se admiten arrendatarios o amedieros.\n",
          "choices": [
            "Propietario",
            "Ocupante",
            {
              "value": "Poseedor",
              "text": "Poseedor a cualquier título"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio5_relacion_documento_acreditado",
          "title": "Tipo de documento que acredita la relación con el predio\n",
          "choices": [
            {
              "value": "Carta venta",
              "text": "Carta venta o documento de similares características"
            },
            {
              "value": "Certificado de sana posesion",
              "text": "Certificado de sana posesión"
            },
            {
              "value": "Certificado de tradicion y libertad",
              "text": "Certificado de tradición y libertad"
            },
            "Documento compraventa"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio5_arraigo_documento_anexo",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "html",
          "name": "predio5_question23",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nCuantas personas habitan en el predio?\n</span>\n"
        },
        {
          "type": "dropdown",
          "name": "predio5_todos_familiares",
          "title": "¿Todas las personas que habitan el predio hacen parte de su núcleo familiar? \n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio5_numero_nucleo_familiar",
          "title": "Número de personas de su núcleo familiar que habitan el predio",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio5_numero_nucleo_no_familair",
          "visibleIf": "{predio5_todos_familiares} = 'no'",
          "title": "Número de personas que habitan el predio que no hacen parte de su núcleo familiar",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio5_question10",
          "html": "<p><strong>1.2.2. Caracterización productiva del predio <br>\n</strong>( Indique las características que permitan identificar las condiciones para el desarrollo de alternativas productivas en el predio objeto de intervención) </p>"
        },
        {
          "type": "text",
          "name": "predio5_area_productiva",
          "title": "Area productiva del predio",
          "inputType": "number"
        },
        {
          "type": "dropdown",
          "name": "predio5_actividades_licitas_tiene",
          "title": "Existen actividades productivas lícitas en el predio ",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio5_actividades_licitas_lista",
          "title": "¿Cuáles son las actividades productivas del predio?",
          "choices": [
            {
              "value": "pecuarias",
              "text": "Pecuarias"
            },
            {
              "value": "Agricolas",
              "text": "Agrícolas"
            },
            "Artesanales",
            "Forestales",
            "Ecoturismo",
            "otra"
          ]
        },
        {
          "type": "text",
          "name": "predio5_actividades_licitas_lista_otra",
          "visibleIf": "{predio5_actividades_licitas_lista} = 'otra'",
          "title": "Otra"
        },
        {
          "type": "dropdown",
          "name": "predio5_nucleo_unico_usufructa",
          "title": "¿Su núcleo familiar es el único que usufructúa el predio?",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio5_num_familias_usufructa",
          "title": "Señale cuántos núcleos familiares usufructúan el predio\n",
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page10",
      "visibleIf": "{numero_predios_uso_ilicito} >= 6",
      "elements": [
        {
          "type": "html",
          "name": "predio6_question14",
          "html": "<h4>Identificación Predio 6</h4>\n"
        },
        {
          "type": "radiogroup",
          "name": "predio6_departamento",
          "title": "Departamento",
          "choices": [
            {
              "value": "787",
              "text": "departamento1"
            }
          ]
        },
        {
          "type": "radiogroup",
          "name": "predio6_municipio",
          "title": "Municipio",
          "choices": [
            {
              "value": "787",
              "text": "sin municipio"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio6_corregimiento",
          "title": "corregimiento",
          "choices": [
            "sin corregimiento"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio6_vereda",
          "title": "Vereda",
          "choices": [
            "sin vereda",
            {
              "value": "otro",
              "text": "Otro"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio6_nombre",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "predio6_area",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio6_area_coca",
          "title": "Área sembrada de cultivos de uso ilícito en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio6_num_plantas",
          "title": "Cantidad de plantas\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio6_area_disponible",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio6_question15",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "html": "\n<span style=\"font-weight: 999;\">\nCoordenadas del predio</span>"
        },
        {
          "type": "text",
          "name": "predio6_longitud",
          "minWidth": "150px",
          "title": "Longitud"
        },
        {
          "type": "text",
          "name": "predio6_latitud",
          "minWidth": "150px",
          "title": "Latitud"
        },
        {
          "type": "text",
          "name": "predio6_altura",
          "minWidth": "150px",
          "title": "Altura",
          "description": "msnm"
        },
        {
          "type": "html",
          "name": "predio6_precision",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nArraigo al municipio</span>\n"
        },
        {
          "type": "text",
          "name": "predio6_arraigo_tiempo",
          "title": "Tiempo",
          "description": "señalar el tiempo en años de permanencia en el municipio del núcleo familiar y acreditar con certificado por organismos de acción comunal, o quien haga sus veces"
        },
        {
          "type": "dropdown",
          "name": "predio6_arraigo_anexa_documento",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio6_relacion_predio",
          "title": "Tipo de relación con el predio\n",
          "description": "Nota: no se admiten arrendatarios o amedieros.\n",
          "choices": [
            "Propietario",
            "Ocupante",
            {
              "value": "Poseedor",
              "text": "Poseedor a cualquier título"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio6_relacion_documento_acreditado",
          "title": "Tipo de documento que acredita la relación con el predio\n",
          "choices": [
            {
              "value": "Carta venta",
              "text": "Carta venta o documento de similares características"
            },
            {
              "value": "Certificado de sana posesion",
              "text": "Certificado de sana posesión"
            },
            {
              "value": "Certificado de tradicion y libertad",
              "text": "Certificado de tradición y libertad"
            },
            "Documento compraventa"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio6_arraigo_documento_anexo",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "html",
          "name": "predio6_question23",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nCuantas personas habitan en el predio?\n</span>\n"
        },
        {
          "type": "dropdown",
          "name": "predio6_todos_familiares",
          "title": "¿Todas las personas que habitan el predio hacen parte de su núcleo familiar? \n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio6_numero_nucleo_familiar",
          "title": "Número de personas de su núcleo familiar que habitan el predio",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio6_numero_nucleo_no_familair",
          "visibleIf": "{predio6_todos_familiares} = 'no'",
          "title": "Número de personas que habitan el predio que no hacen parte de su núcleo familiar",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio6_question10",
          "html": "<p><strong>1.2.2. Caracterización productiva del predio <br>\n</strong>( Indique las características que permitan identificar las condiciones para el desarrollo de alternativas productivas en el predio objeto de intervención) </p>"
        },
        {
          "type": "text",
          "name": "predio6_area_productiva",
          "title": "Area productiva del predio",
          "inputType": "number"
        },
        {
          "type": "dropdown",
          "name": "predio6_actividades_licitas_tiene",
          "title": "Existen actividades productivas lícitas en el predio ",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio6_actividades_licitas_lista",
          "title": "¿Cuáles son las actividades productivas del predio?",
          "choices": [
            {
              "value": "pecuarias",
              "text": "Pecuarias"
            },
            {
              "value": "Agricolas",
              "text": "Agrícolas"
            },
            "Artesanales",
            "Forestales",
            "Ecoturismo",
            "otra"
          ]
        },
        {
          "type": "text",
          "name": "predio6_actividades_licitas_lista_otra",
          "visibleIf": "{predio6_actividades_licitas_lista} = 'otra'",
          "title": "Otra"
        },
        {
          "type": "dropdown",
          "name": "predio6_nucleo_unico_usufructa",
          "title": "¿Su núcleo familiar es el único que usufructúa el predio?",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio6_num_familias_usufructa",
          "title": "Señale cuántos núcleos familiares usufructúan el predio\n",
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page11",
      "visibleIf": "{numero_predios_uso_ilicito} >= 7",
      "elements": [
        {
          "type": "html",
          "name": "predio7_question14",
          "html": "<h4>Identificación Predio 7</h4>\n"
        },
        {
          "type": "dropdown",
          "name": "predio7_departamento",
          "title": "Departamento",
          "choices": [
            {
              "value": "787",
              "text": "departamento1"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio7_municipio",
          "title": "Municipio",
          "choices": [
            {
              "value": "787",
              "text": "sin municipio"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio7_corregimiento",
          "title": "corregimiento",
          "choices": [
            "sin corregimiento"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio7_vereda",
          "title": "Vereda",
          "choices": [
            "sin vereda",
            {
              "value": "otro",
              "text": "Otro"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio7_nombre",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "predio7_area",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio7_area_coca",
          "title": "Área sembrada de cultivos de uso ilícito en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio7_num_plantas",
          "title": "Cantidad de plantas\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio7_area_disponible",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio7_question15",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "html": "\n<span style=\"font-weight: 999;\">\nCoordenadas del predio</span>"
        },
        {
          "type": "text",
          "name": "predio7_longitud",
          "minWidth": "150px",
          "title": "Longitud"
        },
        {
          "type": "text",
          "name": "predio7_latitud",
          "minWidth": "150px",
          "title": "Latitud"
        },
        {
          "type": "text",
          "name": "predio7_altura",
          "minWidth": "150px",
          "title": "Altura",
          "description": "msnm"
        },
        {
          "type": "html",
          "name": "predio7_precision",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nArraigo al municipio</span>\n"
        },
        {
          "type": "text",
          "name": "predio7_arraigo_tiempo",
          "title": "Tiempo",
          "description": "señalar el tiempo en años de permanencia en el municipio del núcleo familiar y acreditar con certificado por organismos de acción comunal, o quien haga sus veces"
        },
        {
          "type": "dropdown",
          "name": "predio7_arraigo_anexa_documento",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio7_relacion_predio",
          "title": "Tipo de relación con el predio\n",
          "description": "Nota: no se admiten arrendatarios o amedieros.\n",
          "choices": [
            "Propietario",
            "Ocupante",
            {
              "value": "Poseedor",
              "text": "Poseedor a cualquier título"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio7_relacion_documento_acreditado",
          "title": "Tipo de documento que acredita la relación con el predio\n",
          "choices": [
            {
              "value": "Carta venta",
              "text": "Carta venta o documento de similares características"
            },
            {
              "value": "Certificado de sana posesion",
              "text": "Certificado de sana posesión"
            },
            {
              "value": "Certificado de tradicion y libertad",
              "text": "Certificado de tradición y libertad"
            },
            "Documento compraventa"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio7_arraigo_documento_anexo",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "html",
          "name": "predio7_question23",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nCuantas personas habitan en el predio?\n</span>\n"
        },
        {
          "type": "dropdown",
          "name": "predio7_todos_familiares",
          "title": "¿Todas las personas que habitan el predio hacen parte de su núcleo familiar? \n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio7_numero_nucleo_familiar",
          "title": "Número de personas de su núcleo familiar que habitan el predio",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio7_numero_nucleo_no_familair",
          "visibleIf": "{predio7_todos_familiares} = 'no'",
          "title": "Número de personas que habitan el predio que no hacen parte de su núcleo familiar",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio7_question10",
          "html": "<p><strong>1.2.2. Caracterización productiva del predio <br>\n</strong>( Indique las características que permitan identificar las condiciones para el desarrollo de alternativas productivas en el predio objeto de intervención) </p>"
        },
        {
          "type": "text",
          "name": "predio7_area_productiva",
          "title": "Area productiva del predio",
          "inputType": "number"
        },
        {
          "type": "dropdown",
          "name": "predio7_actividades_licitas_tiene",
          "title": "Existen actividades productivas lícitas en el predio ",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio7_actividades_licitas_lista",
          "title": "¿Cuáles son las actividades productivas del predio?",
          "choices": [
            {
              "value": "pecuarias",
              "text": "Pecuarias"
            },
            {
              "value": "Agricolas",
              "text": "Agrícolas"
            },
            "Artesanales",
            "Forestales",
            "Ecoturismo",
            "otra"
          ]
        },
        {
          "type": "text",
          "name": "predio7_actividades_licitas_lista_otra",
          "visibleIf": "{predio7_actividades_licitas_lista} = 'otra'",
          "title": "Otra"
        },
        {
          "type": "dropdown",
          "name": "predio7_nucleo_unico_usufructa",
          "title": "¿Su núcleo familiar es el único que usufructúa el predio?",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio7_num_familias_usufructa",
          "title": "Señale cuántos núcleos familiares usufructúan el predio\n",
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page12",
      "visibleIf": "{numero_predios_uso_ilicito} >= 8",
      "elements": [
        {
          "type": "html",
          "name": "predio8_question14",
          "html": "<h4>Identificación Predio 8</h4>\n"
        },
        {
          "type": "dropdown",
          "name": "predio8_departamento",
          "title": "Departamento",
          "choices": [
            {
              "value": "787",
              "text": "departamento1"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio8_municipio",
          "title": "Municipio",
          "choices": [
            {
              "value": "787",
              "text": "sin municipio"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio8_corregimiento",
          "title": "corregimiento",
          "choices": [
            "sin corregimiento"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio8_vereda",
          "title": "Vereda",
          "choices": [
            "sin vereda",
            {
              "value": "otro",
              "text": "Otro"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio8_nombre",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "predio8_area",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio8_area_coca",
          "title": "Área sembrada de cultivos de uso ilícito en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio8_num_plantas",
          "title": "Cantidad de plantas\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio8_area_disponible",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio8_question15",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "html": "\n<span style=\"font-weight: 999;\">\nCoordenadas del predio</span>"
        },
        {
          "type": "text",
          "name": "predio8_longitud",
          "minWidth": "150px",
          "title": "Longitud"
        },
        {
          "type": "text",
          "name": "predio8_latitud",
          "minWidth": "150px",
          "title": "Latitud"
        },
        {
          "type": "text",
          "name": "predio8_altura",
          "minWidth": "150px",
          "title": "Altura",
          "description": "msnm"
        },
        {
          "type": "html",
          "name": "predio8_precision",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nArraigo al municipio</span>\n"
        },
        {
          "type": "text",
          "name": "predio8_arraigo_tiempo",
          "title": "Tiempo",
          "description": "señalar el tiempo en años de permanencia en el municipio del núcleo familiar y acreditar con certificado por organismos de acción comunal, o quien haga sus veces"
        },
        {
          "type": "dropdown",
          "name": "predio8_arraigo_anexa_documento",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio8_relacion_predio",
          "title": "Tipo de relación con el predio\n",
          "description": "Nota: no se admiten arrendatarios o amedieros.\n",
          "choices": [
            "Propietario",
            "Ocupante",
            {
              "value": "Poseedor",
              "text": "Poseedor a cualquier título"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio8_relacion_documento_acreditado",
          "title": "Tipo de documento que acredita la relación con el predio\n",
          "choices": [
            {
              "value": "Carta venta",
              "text": "Carta venta o documento de similares características"
            },
            {
              "value": "Certificado de sana posesion",
              "text": "Certificado de sana posesión"
            },
            {
              "value": "Certificado de tradicion y libertad",
              "text": "Certificado de tradición y libertad"
            },
            "Documento compraventa"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio8_arraigo_documento_anexo",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "html",
          "name": "predio8_question23",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nCuantas personas habitan en el predio?\n</span>\n"
        },
        {
          "type": "dropdown",
          "name": "predio8_todos_familiares",
          "title": "¿Todas las personas que habitan el predio hacen parte de su núcleo familiar? \n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio8_numero_nucleo_familiar",
          "title": "Número de personas de su núcleo familiar que habitan el predio",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio8_numero_nucleo_no_familair",
          "visibleIf": "{predio8_todos_familiares} = 'no'",
          "title": "Número de personas que habitan el predio que no hacen parte de su núcleo familiar",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio8_question10",
          "html": "<p><strong>1.2.2. Caracterización productiva del predio <br>\n</strong>( Indique las características que permitan identificar las condiciones para el desarrollo de alternativas productivas en el predio objeto de intervención) </p>"
        },
        {
          "type": "text",
          "name": "predio8_area_productiva",
          "title": "Area productiva del predio",
          "inputType": "number"
        },
        {
          "type": "dropdown",
          "name": "predio8_actividades_licitas_tiene",
          "title": "Existen actividades productivas lícitas en el predio ",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio8_actividades_licitas_lista",
          "title": "¿Cuáles son las actividades productivas del predio?",
          "choices": [
            {
              "value": "pecuarias",
              "text": "Pecuarias"
            },
            {
              "value": "Agricolas",
              "text": "Agrícolas"
            },
            "Artesanales",
            "Forestales",
            "Ecoturismo",
            "otra"
          ]
        },
        {
          "type": "text",
          "name": "predio8_actividades_licitas_lista_otra",
          "visibleIf": "{predio8_actividades_licitas_lista} = 'otra'",
          "title": "Otra"
        },
        {
          "type": "dropdown",
          "name": "predio8_nucleo_unico_usufructa",
          "title": "¿Su núcleo familiar es el único que usufructúa el predio?",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio8_num_familias_usufructa",
          "title": "Señale cuántos núcleos familiares usufructúan el predio\n",
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page13",
      "visibleIf": "{numero_predios_uso_ilicito} >= 9",
      "elements": [
        {
          "type": "html",
          "name": "predio9_question14",
          "html": "<h4>Identificación Predio 9</h4>\n"
        },
        {
          "type": "dropdown",
          "name": "predio9_departamento",
          "title": "Departamento",
          "choices": [
            {
              "value": "787",
              "text": "departamento1"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio9_municipio",
          "title": "Municipio",
          "choices": [
            {
              "value": "787",
              "text": "sin municipio"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio9_corregimiento",
          "title": "corregimiento",
          "choices": [
            "sin corregimiento"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio9_vereda",
          "title": "Vereda",
          "choices": [
            "sin vereda",
            {
              "value": "otro",
              "text": "Otro"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio9_nombre",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "predio9_area",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio9_area_coca",
          "title": "Área sembrada de cultivos de uso ilícito en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio9_num_plantas",
          "title": "Cantidad de plantas\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio9_area_disponible",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio9_question15",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "html": "\n<span style=\"font-weight: 999;\">\nCoordenadas del predio</span>"
        },
        {
          "type": "text",
          "name": "predio9_longitud",
          "minWidth": "150px",
          "title": "Longitud"
        },
        {
          "type": "text",
          "name": "predio9_latitud",
          "minWidth": "150px",
          "title": "Latitud"
        },
        {
          "type": "text",
          "name": "predio9_altura",
          "minWidth": "150px",
          "title": "Altura",
          "description": "msnm"
        },
        {
          "type": "html",
          "name": "predio9_precision",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nArraigo al municipio</span>\n"
        },
        {
          "type": "text",
          "name": "predio9_arraigo_tiempo",
          "title": "Tiempo",
          "description": "señalar el tiempo en años de permanencia en el municipio del núcleo familiar y acreditar con certificado por organismos de acción comunal, o quien haga sus veces"
        },
        {
          "type": "dropdown",
          "name": "predio9_arraigo_anexa_documento",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio9_relacion_predio",
          "title": "Tipo de relación con el predio\n",
          "description": "Nota: no se admiten arrendatarios o amedieros.\n",
          "choices": [
            "Propietario",
            "Ocupante",
            {
              "value": "Poseedor",
              "text": "Poseedor a cualquier título"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio9_relacion_documento_acreditado",
          "title": "Tipo de documento que acredita la relación con el predio\n",
          "choices": [
            {
              "value": "Carta venta",
              "text": "Carta venta o documento de similares características"
            },
            {
              "value": "Certificado de sana posesion",
              "text": "Certificado de sana posesión"
            },
            {
              "value": "Certificado de tradicion y libertad",
              "text": "Certificado de tradición y libertad"
            },
            "Documento compraventa"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio9_arraigo_documento_anexo",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "html",
          "name": "predio9_question23",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nCuantas personas habitan en el predio?\n</span>\n"
        },
        {
          "type": "dropdown",
          "name": "predio9_todos_familiares",
          "title": "¿Todas las personas que habitan el predio hacen parte de su núcleo familiar? \n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio9_numero_nucleo_familiar",
          "title": "Número de personas de su núcleo familiar que habitan el predio",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio9_numero_nucleo_no_familair",
          "visibleIf": "{predio9_todos_familiares} = 'no'",
          "title": "Número de personas que habitan el predio que no hacen parte de su núcleo familiar",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio9_question10",
          "html": "<p><strong>1.2.2. Caracterización productiva del predio <br>\n</strong>( Indique las características que permitan identificar las condiciones para el desarrollo de alternativas productivas en el predio objeto de intervención) </p>"
        },
        {
          "type": "text",
          "name": "predio9_area_productiva",
          "title": "Area productiva del predio",
          "inputType": "number"
        },
        {
          "type": "dropdown",
          "name": "predio9_actividades_licitas_tiene",
          "title": "Existen actividades productivas lícitas en el predio ",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio9_actividades_licitas_lista",
          "title": "¿Cuáles son las actividades productivas del predio?",
          "choices": [
            {
              "value": "pecuarias",
              "text": "Pecuarias"
            },
            {
              "value": "Agricolas",
              "text": "Agrícolas"
            },
            "Artesanales",
            "Forestales",
            "Ecoturismo",
            "otra"
          ]
        },
        {
          "type": "text",
          "name": "predio9_actividades_licitas_lista_otra",
          "visibleIf": "{predio9_actividades_licitas_lista} = 'otra'",
          "title": "Otra"
        },
        {
          "type": "dropdown",
          "name": "predio9_nucleo_unico_usufructa",
          "title": "¿Su núcleo familiar es el único que usufructúa el predio?",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio9_num_familias_usufructa",
          "title": "Señale cuántos núcleos familiares usufructúan el predio\n",
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page14",
      "visibleIf": "{numero_predios_uso_ilicito} >= 10",
      "elements": [
        {
          "type": "html",
          "name": "predio10_question14",
          "html": "<h4>Identificación Predio 10</h4>\n"
        },
        {
          "type": "dropdown",
          "name": "predio10_departamento",
          "title": "Departamento",
          "choices": [
            {
              "value": "787",
              "text": "departamento1"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio10_municipio",
          "title": "Municipio",
          "choices": [
            {
              "value": "787",
              "text": "sin municipio"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio10_corregimiento",
          "title": "corregimiento",
          "choices": [
            "sin corregimiento"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio10_vereda",
          "title": "Vereda",
          "choices": [
            "sin vereda",
            {
              "value": "otro",
              "text": "Otro"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio10_nombre",
          "title": "Nombre del predio",
          "description": "Nombre de la finca que postula\n"
        },
        {
          "type": "text",
          "name": "predio10_area",
          "title": "Área total del predio en hectáreas",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio10_area_coca",
          "title": "Área sembrada de cultivos de uso ilícito en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio10_num_plantas",
          "title": "Cantidad de plantas\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio10_area_disponible",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio10_question15",
          "title": "Área disponible para conservación o restauración ambiental en el predio\n",
          "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
          "html": "\n<span style=\"font-weight: 999;\">\nCoordenadas del predio</span>"
        },
        {
          "type": "text",
          "name": "predio10_longitud",
          "minWidth": "150px",
          "title": "Longitud"
        },
        {
          "type": "text",
          "name": "predio10_latitud",
          "minWidth": "150px",
          "title": "Latitud"
        },
        {
          "type": "text",
          "name": "predio10_altura",
          "minWidth": "150px",
          "title": "Altura",
          "description": "msnm"
        },
        {
          "type": "html",
          "name": "predio10_precision",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nArraigo al municipio</span>\n"
        },
        {
          "type": "text",
          "name": "predio10_arraigo_tiempo",
          "title": "Tiempo",
          "description": "señalar el tiempo en años de permanencia en el municipio del núcleo familiar y acreditar con certificado por organismos de acción comunal, o quien haga sus veces"
        },
        {
          "type": "dropdown",
          "name": "predio10_arraigo_anexa_documento",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio10_relacion_predio",
          "title": "Tipo de relación con el predio\n",
          "description": "Nota: no se admiten arrendatarios o amedieros.\n",
          "choices": [
            "Propietario",
            "Ocupante",
            {
              "value": "Poseedor",
              "text": "Poseedor a cualquier título"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio10_relacion_documento_acreditado",
          "title": "Tipo de documento que acredita la relación con el predio\n",
          "choices": [
            {
              "value": "Carta venta",
              "text": "Carta venta o documento de similares características"
            },
            {
              "value": "Certificado de sana posesion",
              "text": "Certificado de sana posesión"
            },
            {
              "value": "Certificado de tradicion y libertad",
              "text": "Certificado de tradición y libertad"
            },
            "Documento compraventa"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio10_arraigo_documento_anexo",
          "title": "Anexa documento de soporte\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "html",
          "name": "predio10_question23",
          "title": "Arraigo al municipio",
          "html": "\n<span style=\"font-weight: 999;\">\nCuantas personas habitan en el predio?\n</span>\n"
        },
        {
          "type": "dropdown",
          "name": "predio10_todos_familiares",
          "title": "¿Todas las personas que habitan el predio hacen parte de su núcleo familiar? \n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio10_numero_nucleo_familiar",
          "title": "Número de personas de su núcleo familiar que habitan el predio",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predio10_numero_nucleo_no_familair",
          "visibleIf": "{predio10_todos_familiares} = 'no'",
          "title": "Número de personas que habitan el predio que no hacen parte de su núcleo familiar",
          "inputType": "number"
        },
        {
          "type": "html",
          "name": "predio10_question10",
          "html": "<p><strong>1.2.2. Caracterización productiva del predio <br>\n</strong>( Indique las características que permitan identificar las condiciones para el desarrollo de alternativas productivas en el predio objeto de intervención) </p>"
        },
        {
          "type": "text",
          "name": "predio10_area_productiva",
          "title": "Area productiva del predio",
          "inputType": "number"
        },
        {
          "type": "dropdown",
          "name": "predio10_actividades_licitas_tiene",
          "title": "Existen actividades productivas lícitas en el predio ",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "predio10_actividades_licitas_lista",
          "title": "¿Cuáles son las actividades productivas del predio?",
          "choices": [
            {
              "value": "pecuarias",
              "text": "Pecuarias"
            },
            {
              "value": "Agricolas",
              "text": "Agrícolas"
            },
            "Artesanales",
            "Forestales",
            "Ecoturismo",
            "otra"
          ]
        },
        {
          "type": "text",
          "name": "predio10_actividades_licitas_lista_otra",
          "visibleIf": "{predio10_actividades_licitas_lista} = 'otra'",
          "title": "Otra"
        },
        {
          "type": "dropdown",
          "name": "predio10_nucleo_unico_usufructa",
          "title": "¿Su núcleo familiar es el único que usufructúa el predio?",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "predio10_num_familias_usufructa",
          "title": "Señale cuántos núcleos familiares usufructúan el predio\n",
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page15",
      "elements": [
        {
          "type": "html",
          "name": "predio1_ultimo_titulo",
          "html": "<p><strong>1.2.3. Su núcleo familiar usufructúa otro predio distinto a dónde vive o al que es objeto de intervención\n "
        },
        {
          "type": "dropdown",
          "name": "nucleo_usufructa_otro",
          "title": "Usufructa otro predio?\n",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "tagbox",
          "name": "actividades_otro_predio",
          "visibleIf": "{nucleo_usufructa_otro} = 'si'",
          "title": "¿Qué actividad económica desarrolla en dicho predio?\n",
          "defaultValue": [
            "Agrícolas"
          ],
          "isRequired": true,
          "choices": [
            "Pecuarias",
            "Artesanías",
            "Agrícolas",
            "Forestales",
            "Acoturismo",
            "Otra"
          ]
        },
        {
          "type": "text",
          "name": "actividad_otro_predio_otra",
          "visibleIf": "{actividades_otro_predio} allof ['Otra']",
          "title": "Otra"
        }
      ]
    },
    {
      "name": "page16",
      "elements": [
        {
          "type": "html",
          "name": "question10",
          "html": "<span style=\"font-weight: 999;\">1.3.  Economía de sustitución de cultivos de uso ilícito</span>"
        },
        {
          "type": "text",
          "name": "linea_productiva",
          "title": "Línea productiva de intervención\n"
        },
        {
          "type": "dropdown",
          "name": "establecimiento",
          "title": "Establecimiento",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "fortalecimiento",
          "title": "Fortelecimiento",
          "choices": [
            {
              "value": "si",
              "text": "Si"
            },
            {
              "value": "no",
              "text": "No"
            }
          ]
        },
        {
          "type": "html",
          "name": "question11",
          "html": "<span style=\"font-weight: 999;\">Nombre e identificación de la organización/ asociación/ JAC /cooperativa/ grupo étnico a la que pertenece\n</span>"
        },
        {
          "type": "text",
          "name": "tipo_figura_organizativa",
          "title": "Tipo de figura organizativa"
        },
        {
          "type": "text",
          "name": "tipo_figura_organizativa_identificacion",
          "title": "Número identificación tributario"
        },
        {
          "type": "text",
          "name": "documento_pertenencia_etnica_anexa",
          "title": "Anexa documento de soporte (obligatorio en casos de pertenencia étnica)"
        }
      ]
    }
  ],
    "pagePrevText": "Página anterior",
    "pageNextText": "Página siguiente",
    "completeText": "Enviar",
    "showNavigationButtons": true
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

const surveyData = ref<Record<string, any> | null>(null); // Definir correctamente como objeto o null

const getSurveyData = async () => {
  try {
    modelValue.value = false;
    const response = await axios.get(`/api/1.0/core/catatumbofichaacuerdo/${surveyId}/`);
    // Llama a la función para procesar la data
    await getRegistraduriaData(response.data);
    modelValue.value = true; // Cambia el valor después de completar la carga
  } catch (error) {
    console.error("Error fetching survey data:", error);
  }
};


const getDepartamento = async (departamenotid: undefined, nombrecampo: string) => {
  try {
    modelValue.value = false;
    // Verifica que surveyData.value y departamento están definidos
    if (surveyData.value && surveyData.value.departamento) {
      const response = await axios.get(`/api/1.0/core/departments/${departamenotid}/`);
      console.log(response.data); // Procesa la respuesta del departamento
      surveyData.value[nombrecampo] = response.data.name
    } else {
      console.error("Error: 'departamento' no está disponible en surveyData.");
    }
  } catch (error) {
    console.error("Error fetching department data:", error);
  } finally {
    modelValue.value = true; // Restablece el valor después de la ejecución
  }
};

const getMunicipio = async (municipioId: undefined, nombrecampo: string) => {
  try {
    modelValue.value = false;

    const response = await axios.get(`/api/1.0/core/municipalities/${municipioId}/`);
    console.log(response.data); // Procesa la respuesta del municipio
    surveyData.value[nombrecampo] = response.data.name

  } catch (error) {
    console.error("Error fetching department data:", error);
  } finally {
    modelValue.value = true; // Restablece el valor después de la ejecución
  }
};

const getCorregimiento = async (corregimientoId: undefined, nombrecampo: string) => {
  try {
    modelValue.value = false;
    // Verifica que surveyData.value y departamento están definidos

    const response = await axios.get(`/api/1.0/core/townships/${corregimientoId}/`);
    console.log(response.data); // Procesa la respuesta del corregimiento
    surveyData.value[nombrecampo] = response.data.name

  } catch (error) {
    console.error("Error fetching corregimiento data:", error);
  } finally {
    modelValue.value = true; // Restablece el valor después de la ejecución
  }
};

const getVereda = async (veredaId: undefined, nombrecampo: string) => {
  try {
    modelValue.value = false;
    // Verifica que surveyData.value y departamento están definidos
    const response = await axios.get(`/api/1.0/core/villages/${veredaId}/`);
    console.log(response.data); // Procesa la respuesta del corregimiento
    surveyData.value[nombrecampo] = response.data.name

  } catch (error) {
    console.error("Error fetching department data:", error);
  } finally {
    modelValue.value = true; // Restablece el valor después de la ejecución
  }
};

const getRegistraduriaData = async (userData: { 
  numero_identificacion: any; 
  reg_agno_resolucion: any; 
  reg_edad: any; 
  reg_departamento_exp: any; 
  reg_estado_cedula: any; 
  reg_fecha_expedicion: any; 
  reg_fecha_nacimiento: any; 
  reg_genero: any; 
  reg_municipio_exp: any; 
  reg_numero_cedula: any; 
  reg_num_resolucion: any; 
  reg_primer_apellido: any; 
  reg_primer_nombre: any; 
  reg_segundo_apellido: any; 
  reg_segundo_nombre: any; 
}) => {
  try {
    const response = await axios.get(`/api/1.0/core/cedulasrnec/getbyidentification/${userData.numero_identificacion}/`);

    // Si la respuesta es válida, asignamos los valores
    userData.reg_agno_resolucion = response.data.agno_resolucion || '';
    userData.reg_departamento_exp = response.data.departamento_expedicion || '';
    userData.reg_estado_cedula = response.data.estado_cedula || '';
    userData.reg_fecha_expedicion = response.data.fecha_expedicion || '';
    userData.reg_fecha_nacimiento = response.data.fecha_nacimiento || '';
    userData.reg_genero = response.data.genero || '';
    userData.reg_municipio_exp = response.data.municipio_expedicion || '';
    userData.reg_numero_cedula = response.data.numero_cedula || '';
    userData.reg_num_resolucion = response.data.numero_resolucion || '';
    userData.reg_primer_apellido = response.data.primer_apellido || '';
    userData.reg_primer_nombre = response.data.primer_nombre || '';
    userData.reg_segundo_apellido = response.data.segundo_apellido || '';
    userData.reg_segundo_nombre = response.data.segundo_nombre || '';

    userData.reg_edad = response.data.fecha_nacimiento ? calcularEdad(response.data.fecha_nacimiento) : '';

  } catch (error) {
    console.error('Error en la solicitud:', error);

    // Llenar con valores vacíos si ocurre un error
    userData.reg_agno_resolucion = '';
    userData.reg_departamento_exp = '';
    userData.reg_estado_cedula = '';
    userData.reg_fecha_expedicion = '';
    userData.reg_fecha_nacimiento = '';
    userData.reg_genero = '';
    userData.reg_municipio_exp = '';
    userData.reg_numero_cedula = '';
    userData.reg_num_resolucion = '';
    userData.reg_primer_apellido = '';
    userData.reg_primer_nombre = '';
    userData.reg_segundo_apellido = '';
    userData.reg_segundo_nombre = '';
    userData.reg_edad = '';
  }

  // Asignar los datos correctamente
  surveyData.value = userData;
  console.log('surveyData.value', surveyData.value);
};


const calcularEdad = (fechaNacimiento: string): string => {
  // Convertir "26/04/2018" a un formato compatible (YYYY-MM-DD)
  const [dia, mes, año] = fechaNacimiento.split("/").map(Number);
  const fechaNac = new Date(año, mes - 1, dia);
  const fechaActual = new Date();

  let edadAnios = fechaActual.getFullYear() - fechaNac.getFullYear();
  let edadMeses = fechaActual.getMonth() - fechaNac.getMonth();
  let edadDias = fechaActual.getDate() - fechaNac.getDate();

  // Ajustar si el mes es negativo
  if (edadMeses < 0) {
    edadAnios--;
    edadMeses += 12;
  }

  // Ajustar si los días son negativos
  if (edadDias < 0) {
    edadMeses--;
    const ultimoDiaMesAnterior = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      0
    ).getDate();
    edadDias += ultimoDiaMesAnterior;
  }

  return `${edadAnios} años, ${edadMeses} meses y ${edadDias} días`;
};

onMounted(async () => {
  try {
    let loader = uLoading.show({});
    await getSurveyData(); // Espera a que se resuelva getSurveyData
    // Verifica si surveyData está correctamente asignado antes de llamar a getDepartamento
    if (surveyData.value && surveyData.value.departamento) {
      await getDepartamento(surveyData.value.departamento, 'departamento'); // Luego, llama a getDepartamento si departamento está disponible
    } else {
      console.error("No se encontró 'departamento' en surveyData.");
    }

    if (surveyData.value && surveyData.value.municipio) {
      await getMunicipio(surveyData.value.municipio, 'municipio'); // Luego, llama a getDepartamento si departamento está disponible
    } else {
      console.error("No se encontró 'departamento' en surveyData.");
    }

    if (surveyData.value && surveyData.value.predio1_municipio) {
      await getMunicipio(surveyData.value.predio1_municipio, 'predio1_municipio'); // Luego, llama a getDepartamento si departamento está disponible
    } else {
      console.error("No se encontró 'departamento' en surveyData.");
    }

    if (surveyData.value && surveyData.value.corregimiento) {
      await getCorregimiento(surveyData.value.corregimiento, 'corregimiento'); // Luego, llama a getDepartamento si departamento está disponible
    } else {
      console.error("No se encontró 'corregimiento' en surveyData.");
    }

    if (surveyData.value && surveyData.value.predio1_corregimiento) {
      await getCorregimiento(surveyData.value.predio1_corregimiento, 'predio1_corregimiento'); // Luego, llama a getDepartamento si departamento está disponible
    } else {
      console.error("No se encontró 'predio1_corregimiento' en surveyData.");
    }

    if (surveyData.value && surveyData.value.vereda) {
      await getVereda(surveyData.value.vereda, 'vereda'); // Luego, llama a getDepartamento si departamento está disponible
    } else {
      console.error("No se encontró 'vereda' en surveyData.");
    }

    if (surveyData.value && surveyData.value.predio1_vereda) {
      await getVereda(surveyData.value.predio1_vereda, 'predio1_vereda'); // Luego, llama a getDepartamento si departamento está disponible
    } else {
      console.error("No se encontró 'predio1_vereda' en surveyData.");
    }
    loader.hide()
    
  } catch (error) {
    console.error("Error al montar los datos:", error);
  }
});



</script>

<style lang="scss">

</style>