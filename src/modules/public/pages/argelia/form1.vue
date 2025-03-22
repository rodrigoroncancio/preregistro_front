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

  const uCrud = useCrud("forms/argelia/fichaacuerdo");
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
    const response = await axios.post('/forms/argelia/fichaacuerdonucleo/', personasNUcleo.value, {
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
  "title": "FICHA DE VINCULACIÓN DE NÚCLEOS FAMILIARES A PROCESOS DE SUSTITUCIÓN DE CULTIVOS DE USO ILÍCITO DE LA DIRECCIÓN DE SUSTITUCIÓN DE CULTIVOS DE USO ILÍCITO",
  "logoPosition": "right",
  "pages": [
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
          "type": "file",
          "name": "foto_doc_frente",
          "title": "Foto Doc. Frente",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
        },
        {
          "type": "file",
          "name": "foto_doc_atras",
          "title": "Foto Doc. Atras",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
        },
        {
          "type": "text",
          "name": "fecha_expedicion",
          "title": "Fecha expedición",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "text",
          "name": "fecha_nacimiento",
          "title": "Fecha nacimiento",
          "isRequired": true,
          "inputType": "date"
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
          "type": "dropdown",
          "name": "organizacion_etnica",
          "visibleIf": "{comunidad_etnica} <> 'Ninguno'",
          "title": "La organización étnica a la cual pertenece su núcleo familiar corresponde a:",
          "choices": [
            "Comunidad indígena sin territorio formalmente constituido",
            "Asociación de comunidad negra sin territorio formalmente titulado",
            "Consejo Comunitario formalmente titulado",
            "Resguardo",
            "Zona de Reserva Campesina",
            {
              "value": "Junta de Acción Comuna",
              "text": "Junta de Acción Comunal"
            },
            "No Sabe"
          ]
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
          "type": "dropdown",
          "name": "departamento",
          "title": "Departamento",
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
            "sin municipio"
          ]
        },
        {
          "type": "dropdown",
          "name": "corregimiento",
          "title": "corregimiento",
          "choices": [
            "sin corregimiento"
          ]
        },
        {
          "type": "dropdown",
          "name": "vereda",
          "title": "vereda",
          "choices": [
            "sin vereda"
          ]
        },
        {
          "type": "text",
          "name": "vereda_otra",
          "title": "Otra vereda"
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
          "type": "dropdown",
          "name": "tipo_documento_acredita",
          "title": "Tipo de documento que acredita la relación con el predio\n",
          "choices": [
            {
              "value": "Propietario",
              "text": "Escritura"
            },
            {
              "value": "Ocupante",
              "text": "Sana posesión"
            },
            {
              "value": "Poseedor",
              "text": "Certificado de tradición y libertad"
            },
            "Arrendatario",
            {
              "value": "Tenedor (prestada, cuidandero en posada)",
              "text": "Documento o compraventa"
            }
          ]
        },
        {
          "type": "file",
          "name": "tipo_documento_file",
          "title": "Cargar documento poseción"
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
      "visibleIf": "{num_dependientes} >= '1'",
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
          "type": "file",
          "name": "persona1_foto_doc_frente",
          "title": "Foto Doc. Frente",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
        },
        {
          "type": "file",
          "name": "persona1_foto_doc_atras",
          "title": "Foto Doc. Atras",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
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
      "visibleIf": "{num_dependientes} >= '2'",
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
          "type": "file",
          "name": "persona2_foto_doc_frente",
          "title": "Foto Doc. Frente",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
        },
        {
          "type": "file",
          "name": "persona2_foto_doc_atras",
          "title": "Foto Doc. Atras",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
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
      "visibleIf": "{num_dependientes} >= '3'",
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
          "type": "file",
          "name": "persona3_foto_doc_frente",
          "title": "Foto Doc. Frente",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
        },
        {
          "type": "file",
          "name": "persona3_foto_doc_atras",
          "title": "Foto Doc. Atras",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
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
      "visibleIf": "{num_dependientes} >= '4'",
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
          "type": "file",
          "name": "persona4_foto_doc_frente",
          "title": "Foto Doc. Frente",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
        },
        {
          "type": "file",
          "name": "persona4_foto_doc_atras",
          "title": "Foto Doc. Atras",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
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
      "visibleIf": "{num_dependientes} >= '5'",
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
          "name": "persona5_foto_doc_frente",
          "title": "Foto Doc. Frente",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
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
      "visibleIf": "{num_dependientes} >= '6'",
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
          "type": "file",
          "name": "persona6_foto_doc_frente",
          "title": "Foto Doc. Frente",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
        },
        {
          "type": "file",
          "name": "persona6_foto_doc_atras",
          "title": "Foto Doc. Atras",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
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
      "visibleIf": "{num_dependientes} >= '7'",
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
          "type": "file",
          "name": "persona7_foto_doc_frente",
          "title": "Foto Doc. Frente",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
        },
        {
          "type": "file",
          "name": "persona7_foto_doc_atras",
          "title": "Foto Doc. Atras",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
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
      "visibleIf": "{num_dependientes} >= '8'",
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
          "type": "file",
          "name": "persona8_foto_doc_frente",
          "title": "Foto Doc. Frente",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
        },
        {
          "type": "file",
          "name": "persona8_foto_doc_atras",
          "title": "Foto Doc. Atras",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
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
      "visibleIf": "{num_dependientes} >= '9'",
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
          "type": "file",
          "name": "persona9_foto_doc_frente",
          "title": "Foto Doc. Frente",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
        },
        {
          "type": "file",
          "name": "persona9_foto_doc_atras",
          "title": "Foto Doc. Atras",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
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
      "visibleIf": "{num_dependientes} >= '10'",
      "elements": [
        {
          "type": "html",
          "name": "persona10_question3",
          "html": "\n<p><strong>1.1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona10_question7",
          "visibleIf": "{num_dependientes} >= '10'",
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
          "type": "file",
          "name": "persona10_foto_doc_frente",
          "title": "Foto Doc. Frente",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
        },
        {
          "type": "file",
          "name": "persona10_foto_doc_atras",
          "title": "Foto Doc. Atras",
          "description": "Escriba el número de identificación del representante del núcleo familiar"
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
          "type": "dropdown",
          "name": "predio1_departamento",
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
          "name": "predio1_municipio",
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
          "name": "predio1_corregimiento",
          "title": "corregimiento",
          "choices": [
            "sin corregimiento"
          ]
        },
        {
          "type": "dropdown",
          "name": "predio1_vereda",
          "title": "Vereda",
          "choices": [
            "sin vereda"
          ]
        },
        {
          "type": "text",
          "name": "predio1_vereda_otra",
          "title": "Otra vereda"
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
          "type": "file",
          "name": "predio1_documento_arraigo",
          "title": "Documento de arraigo"
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
          "type": "file",
          "name": "predio1_arraigo_documento_soporte",
          "visibleIf": "{predio1_arraigo_documento_anexo} = 'si'",
          "title": "Documento Relacion"
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
          "name": "predio2_departamento",
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
          "type": "dropdown",
          "name": "predio2_vereda",
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
          "name": "predio2_vereda_otra",
          "title": "Otra vereda"
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
          "type": "file",
          "name": "predio2_documento_arraigo",
          "title": "Documento de arraigo"
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
          "type": "file",
          "name": "predio2_arraigo_documento_soporte",
          "visibleIf": "{predio1_arraigo_documento_anexo} = 'si'",
          "title": "Documento Relacion"
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
          "name": "predio3_vereda_otra",
          "title": "Otra vereda"
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
          "type": "file",
          "name": "predio3_documento_arraigo",
          "title": "Documento de arraigo"
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
          "type": "file",
          "name": "predio3_arraigo_documento_soporte",
          "visibleIf": "{predio3_arraigo_documento_anexo} = 'si'",
          "title": "Documento Relacion"
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
          "name": "predio4_vereda_otra",
          "title": "Otra vereda"
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
          "type": "file",
          "name": "predio4_documento_arraigo",
          "title": "Documento de arraigo"
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
          "type": "file",
          "name": "predio4_arraigo_documento_soporte",
          "visibleIf": "{predio4_arraigo_documento_anexo} = 'si'",
          "title": "Documento Relacion"
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
          "name": "predio5_vereda_otra",
          "title": "Otra vereda"
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
          "type": "file",
          "name": "predio5_documento_arraigo",
          "title": "Documento de arraigo"
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
          "type": "file",
          "name": "predio5_arraigo_documento_soporte",
          "visibleIf": "{predio5_arraigo_documento_anexo} = 'si'",
          "title": "Documento Relacion"
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
          "type": "file",
          "name": "predio6_documento_arraigo",
          "title": "Documento de arraigo"
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
          "type": "file",
          "name": "predio6_arraigo_documento_soporte",
          "visibleIf": "{predio6_arraigo_documento_anexo} = 'si'",
          "title": "Documento Relacion"
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
          "type": "file",
          "name": "predio7_documento_arraigo",
          "title": "Documento de arraigo"
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
          "type": "file",
          "name": "predio7_arraigo_documento_soporte",
          "visibleIf": "{predio7_arraigo_documento_anexo} = 'si'",
          "title": "Documento Relacion"
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
          "type": "file",
          "name": "predio8_documento_arraigo",
          "title": "Documento de arraigo"
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
          "type": "file",
          "name": "predio8_arraigo_documento_soporte",
          "visibleIf": "{predio8_arraigo_documento_anexo} = 'si'",
          "title": "Documento Relacion"
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
          "type": "file",
          "name": "predio9_documento_arraigo",
          "title": "Documento de arraigo"
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
          "type": "file",
          "name": "predio9_arraigo_documento_soporte",
          "visibleIf": "{predio9_arraigo_documento_anexo} = 'si'",
          "title": "Documento Relacion"
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
          "type": "file",
          "name": "predio10_documento_arraigo",
          "title": "Documento de arraigo"
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
          "type": "file",
          "name": "predio10_arraigo_documento_soporte",
          "visibleIf": "{predio10_arraigo_documento_anexo} = 'si'",
          "title": "Documento Relacion"
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
          "type": "dropdown",
          "name": "linea_productiva",
          "title": "Línea productiva de intervención\n",
          "choices": [
            {
              "value": "Cafe",
              "text": "Café"
            },
            "Cacao",
            "Aji",
            {
              "value": "Caña_Panelera",
              "text": "Caña Panelera"
            }
          ]
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
          "type": "dropdown",
          "name": "tipo_figura_organizativa",
          "title": "Tipo de figura organizativa",
          "choices": [
            "Tipo 1",
            "Tipo 2"
          ]
        },
        {
          "type": "text",
          "name": "tipo_figura_organizativa_identificacion",
          "title": "Número identificación tributario"
        },
        {
          "type": "dropdown",
          "name": "documento_pertenencia_etnica_anexa",
          "title": "Anexa documento de soporte (obligatorio en casos de pertenencia étnica)",
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
          "type": "file",
          "name": "documento_pertenencia_etnica_file",
          "title": "Documento pertenencia"
        }
      ]
    },
    {
      "name": "page17",
      "elements": [
        {
          "type": "dropdown",
          "name": "tipo_firma",
          "isRequired": true,
          "choices": [
            {
              "value": "firmatactil",
              "text": "Firma Tactil"
            },
            {
              "value": "cargarfirma",
              "text": "Cargar firma"
            }
          ]
        },
        {
          "type": "signaturepad",
          "name": "firma",
          "visibleIf": "{tipo_firma} = 'firmatactil'",
          "title": "Firma de aceptación",
          "signatureWidth": 500,
          "signatureHeight": 400,
          "placeholder": "Firmar aqui"
        },
        {
          "type": "file",
          "name": "firma_file",
          "visibleIf": "{tipo_firma} = 'cargarfirma'",
          "title": "Cargar Firma de aceptación"
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


    if (options.name === "numero_identificacion") {
      if (options.value === null || options.value === "")
        return;

      try {
        let loader = uLoading.show({});
        axios.get(`forms/argelia/ficha/validar_documento/?documento=${options.value}`)
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

              


              if (data.fotodocumentofrente && data.fotodocumentofrente.trim().length > 0) {
                survey.getQuestionByName("foto_doc_frente").visible = false;
              }
              if (data.fotodocumentorespaldo && data.fotodocumentorespaldo.trim().length > 0) {
                survey.getQuestionByName("foto_doc_atras").visible = false;
              }


              const fields = [
                { "origin":['nombres', 'apellidos'], target:'nombre' },
                { "origin":['nombres', 'apellidos'], target:'nombre' },
                { "origin": ["fechanacimiento"], "target": "fecha_nacimiento" },
                { "origin": ["fechanacimiento"], "target": "fecha_nacimiento" },
                { "origin": ["sexo"], "target": "sexo" },
                { "origin": ["correo"], "target": "email" },
                { "origin": ["lineaproductiva"], "target": "linea_productiva" },
                { "origin": ["tipodocumento"], "target": "tipo_identificacion" },
                { "origin": ["orientacion"], "target": "identidad_genero" },
                { "origin": ["educacion"], "target": "escolaridad" },
                { "origin": ["telefono"], "target": "numero_contacto" },
                { "origin": ["areapredio"], "target": "predio1_area" },
                { "origin": ["areacoca"], "target": "predio1_area_coca" },
                
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
              
            } else {
              if (resp.data.status === 2) {
                uToast.toastError("Usuario con ficha diligenciada. No se puede continuar con el formulario.");
              }  else if (resp.data.status === 3) {
                uToast.toastError("El documento no se encuentra en la lista de pre registro. No se puede continuar con el formulario.");
              } else {
                uToast.toastError("El usuario no se encuentra Validado. No se puede continuar con el formulario.");
              }
              survey.showNavigationButtons = false;
            }
            
          })
          .catch((err: any) => { console.log(err) })
          .finally(() => { loader.hide() });
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

    
    if (departamentoQuestion) {
      departamentoQuestion.choices = itemsDepartments.value;
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