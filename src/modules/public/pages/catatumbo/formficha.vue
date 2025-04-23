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
  const uToast = useToast();

  //Anterior modelo
  const uCrud = useCrud("forms/catatumbo/fichaacuerdo");

  //Nuevo Modelo
  const uCrud_persona = useCrud("api/2.0/nucleo/persona");
  const uCrud_formpersona = useCrud("api/2.0/nucleo/formpersona");
  const uCrud_linea = useCrud("api/2.0/nucleo/personalinea");
  const uCrud_predio = useCrud("api/2.0/nucleo/predio");
  const uCrud_personaAdjunto = useCrud("api/2.0/nucleo/personaadjunto");

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
  "title": "FICHA DE VINCULACIÓN DE NÚCLEOS FAMILIARES A PROCESOS DE SUSTITUCIÓN DE CULTIVOS DE USO ILÍCITO DE LA DIRECCIÓN DE SUSTITUCIÓN DE CULTIVOS DE USO ILÍCITO - CATATUMBO",
  "logoPosition": "right",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "html",
          "name": "alertasvalidacion",
          "html": ""
        },
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
          "type": "text",
          "name": "nombres",
          "visibleIf": "{mostrar_campos} = true",
          "title": "Nombres",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "apellidos",
          "visibleIf": "{mostrar_campos} = true",
          "title": "Apellidos",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "tipo_identificacion",
          "visibleIf": "{mostrar_campos} = true",
          "title": "Tipo de identificación",
          "isRequired": true
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
          "isRequired": true,
          "maxLength": 10
        },
        {
          "type": "file",
          "name": "foto_doc_frente",
          "visibleIf": "{mostrar_documentos} = false",
          "title": "Foto Doc. Frente"
        },
        {
          "type": "file",
          "name": "foto_doc_atras",
          "visibleIf": "{mostrar_documentos} = false",
          "title": "Foto Doc. Atras"
        },
        {
          "type": "text",
          "name": "fecha_expedicion",
          "visibleIf": "{mostrar_campos} = true",
          "title": "Fecha expedición",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "fecha_nacimiento",
          "visibleIf": "{mostrar_campos} = true",
          "title": "Fecha nacimiento",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "numero_contacto",
          "visibleIf": "{mostrar_campos} = true",
          "title": "Número de contacto",
          "description": "Indicar el número de celular.",
          "isRequired": true,
          "inputType": "tel"
        },
        {
          "type": "text",
          "name": "email",
          "visibleIf": "{mostrar_campos} = true",
          "title": "Correo electrónico",
          "description": "Indicar el correo electrónico donde será notificado",
          "inputType": "email"
        },
        {
          "type": "dropdown",
          "name": "sexo",
          "visibleIf": "{mostrar_campos} = true",
          "title": "Sexo",
          "description": "Indique si la persona\nrepresentante del núcleo familiar es masculino o femenino.",
          "isRequired": true,
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "identidad_genero",
          "visibleIf": "{mostrar_campos} = true",
          "title": "Tiene identidad de Género y/o Orientación sexual diversa (OSIGD)?\n",
          "description": "Seleccione SI en caso afirmativo, o NO en caso negativo.\n",
          "isRequired": true,
          "choices": [
            "Si",
            "No"
          ]
        },
        {
          "type": "dropdown",
          "name": "estado_civil",
          "visibleIf": "{mostrar_campos} = true",
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
          "visibleIf": "{mostrar_campos} = true",
          "title": "Ocupación",
          "description": "Indique cuál es la ocupación",
          "isRequired": true,
          "choices": [
            "Ama de casa",
            "Independiente",
            "Jubilado/pensionado",
            "Estudiante",
            "Informalidad",
            "Desempleado",
            "No aplica por edad"
          ]
        },
        {
          "type": "text",
          "name": "escolaridad",
          "visibleIf": "{mostrar_campos} = true",
          "title": "Nivel de escolaridad",
          "isRequired": true
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
          "visibleIf": "{mostrar_campos} = true",
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
            "No Sabe",
            "Ninguno"
          ]
        },
        {
          "type": "text",
          "name": "nombre_territorio_etnico",
          "visibleIf": "{comunidad_etnica} <> 'Ninguno'",
          "title": "¿Cuál es el nombre completo del territorio colectivo ( (consejo comunitario, resguardo) o zona de reserva campesina o junta de acción comunal a la que pertenece su núcleo familiar?"
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
            "sin vereda"
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
          "title": "Otra vereda",
          "description": "si no se encuentra en el listado de veredas",
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
          "description": "Indiquesi el tipo de relación del núcleo familiar con el predio es:",
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
            "Escritura",
            " Carta venta",
            "Certificado Sana posesión",
            "Certificado de tradición y libertad",
            "Documento compraventa"
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
          "description": "Indique el tipo de identificación del propietario del predio",
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
          "title": "Número identificación propietario",
          "description": "Indique  número de identificación del propietario del predio"
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
          "description": "Indique el número de personas que componen el núcleo familiar, este puede estar compuesto por cónyuge o compañero(a) permanente, padre – madre, suegro, hermano(a), cuñado(a), hijo(a), sobrino(a), yerno, nuera, nieto, abuelo(a) u otro.",
          "choices": [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
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
          "html": "\n<p><strong>1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "question7",
          "html": "<p><strong>Persona No 1\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona1_nombre",
          "title": "Nombre Completo",
          "isRequired": true
        },
        {
          "type": "dropdown",
          "name": "persona1_tipo_identificacion",
          "title": "Tipo de Identificación\n",
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
          "name": "persona1_num_identificación",
          "title": "Número Identificación",
          "isRequired": true,
          "maxLength": 10
        },
        {
          "type": "text",
          "name": "persona1_fecha_expedicion_identificacion",
          "visibleIf": "{mostrar_persona1} = true",
          "title": "Fecha de expedicion\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "file",
          "name": "persona1_foto_doc_frente",
          "visibleIf": "{mostrar_persona1} = true",
          "title": "Foto Doc. Frente"
        },
        {
          "type": "file",
          "name": "persona1_foto_doc_atras",
          "visibleIf": "{mostrar_persona1} = true",
          "title": "Foto Doc. Atras"
        },
        {
          "type": "dropdown",
          "name": "persona1_parentesco",
          "visibleIf": "{mostrar_persona1} = true",
          "title": "Parentesco",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona1} = true",
          "title": "Cuál Parentesco"
        },
        {
          "type": "text",
          "name": "persona1_fecha_nacimiento",
          "visibleIf": "{mostrar_persona1} = true",
          "title": "Fecha de Nacimiento\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona1_sexo",
          "visibleIf": "{mostrar_persona1} = true",
          "title": "Sexo",
          "isRequired": true,
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "question21",
          "visibleIf": "{mostrar_persona1} = true",
          "title": "Estado Civil\n",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona1} = true",
          "title": "Grupo de atención especial\n",
          "isRequired": true,
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
          "html": "\n<p><strong>1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona2_question7",
          "html": "<p><strong>Persona No 2\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona2_nombre",
          "title": "Nombre Completo",
          "isRequired": true
        },
        {
          "type": "dropdown",
          "name": "persona2_tipo_identificacion",
          "title": "Tipo de Identificación\n",
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
          "name": "persona2_num_identificación",
          "title": "Número Identificación",
          "isRequired": true,
          "maxLength": 10
        },
        {
          "type": "text",
          "name": "persona2_fecha_expedicion_identificacion",
          "visibleIf": "{mostrar_persona2} = true",
          "title": "Fecha de expedicion\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "file",
          "name": "persona2_foto_doc_frente",
          "visibleIf": "{mostrar_persona2} = true",
          "title": "Foto Doc. Frente"
        },
        {
          "type": "file",
          "name": "persona2_foto_doc_atras",
          "visibleIf": "{mostrar_persona2} = true",
          "title": "Foto Doc. Atras"
        },
        {
          "type": "dropdown",
          "name": "persona2_parentesco",
          "visibleIf": "{mostrar_persona2} = true",
          "title": "Parentesco",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona2} = true",
          "title": "Cuál Parentesco"
        },
        {
          "type": "text",
          "name": "persona2_fecha_nacimiento",
          "visibleIf": "{mostrar_persona2} = true",
          "title": "Fecha de Nacimiento\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona2_sexo",
          "visibleIf": "{mostrar_persona2} = true",
          "title": "Sexo",
          "isRequired": true,
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona2_estado_civil",
          "visibleIf": "{mostrar_persona2} = true",
          "title": "Estado Civil\n",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona2} = true",
          "title": "Grupo de atención especial\n",
          "isRequired": true,
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
          "html": "\n<p><strong>1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona3_question7",
          "html": "<p><strong>Persona No 3\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona3_nombre",
          "title": "Nombre Completo",
          "isRequired": true
        },
        {
          "type": "dropdown",
          "name": "persona3_tipo_identificacion",
          "title": "Tipo de Identificación\n",
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
          "name": "persona3_num_identificación",
          "title": "Número Identificación",
          "isRequired": true,
          "maxLength": 10
        },
        {
          "type": "text",
          "name": "persona3_fecha_expedicion_identificacion",
          "visibleIf": "{mostrar_persona3} = true",
          "title": "Fecha de expedicion\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "file",
          "name": "persona3_foto_doc_frente",
          "visibleIf": "{mostrar_persona3} = true",
          "title": "Foto Doc. Frente"
        },
        {
          "type": "file",
          "name": "persona3_foto_doc_atras",
          "visibleIf": "{mostrar_persona3} = true",
          "title": "Foto Doc. Atras"
        },
        {
          "type": "dropdown",
          "name": "persona3_parentesco",
          "visibleIf": "{mostrar_persona3} = true",
          "title": "Parentesco",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona3} = true",
          "title": "Fecha de Nacimiento\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona3_sexo",
          "visibleIf": "{mostrar_persona3} = true",
          "title": "Sexo",
          "isRequired": true,
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona3_estado_civil",
          "visibleIf": "{mostrar_persona3} = true",
          "title": "Estado Civil\n",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona3} = true",
          "title": "Grupo de atención especial\n",
          "isRequired": true,
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
          "html": "\n<p><strong>1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona4_question7",
          "html": "<p><strong>Persona No 4\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona4_nombre",
          "title": "Nombre Completo",
          "isRequired": true
        },
        {
          "type": "dropdown",
          "name": "persona4_tipo_identificacion",
          "title": "Tipo de Identificación\n",
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
          "name": "persona4_num_identificación",
          "title": "Número Identificación",
          "isRequired": true,
          "maxLength": 10
        },
        {
          "type": "text",
          "name": "persona4_fecha_expedicion_identificacion",
          "visibleIf": "{mostrar_persona4} = true",
          "title": "Fecha de expedicion\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "file",
          "name": "persona4_foto_doc_frente",
          "visibleIf": "{mostrar_persona4} = true",
          "title": "Foto Doc. Frente"
        },
        {
          "type": "file",
          "name": "persona4_foto_doc_atras",
          "visibleIf": "{mostrar_persona4} = true",
          "title": "Foto Doc. Atras"
        },
        {
          "type": "dropdown",
          "name": "persona4_parentesco",
          "visibleIf": "{mostrar_persona4} = true",
          "title": "Parentesco",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona4} = true",
          "title": "Fecha de Nacimiento\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona4_sexo",
          "visibleIf": "{mostrar_persona4} = true",
          "title": "Sexo",
          "isRequired": true,
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona4_estado_civil",
          "visibleIf": "{mostrar_persona4} = true",
          "title": "Estado Civil\n",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona4} = true",
          "title": "Grupo de atención especial\n",
          "isRequired": true,
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
          "name": "persona5_num_identificación",
          "title": "Número Identificación",
          "isRequired": true,
          "maxLength": 10
        },
        {
          "type": "text",
          "name": "persona5_fecha_expedicion_identificacion",
          "visibleIf": "{mostrar_persona5} = true",
          "title": "Fecha de expedicion\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "file",
          "name": "persona5_foto_doc_frente",
          "visibleIf": "{mostrar_persona5} = true",
          "title": "Foto Doc. Frente"
        },
        {
          "type": "file",
          "name": "persona5_foto_doc_atras",
          "visibleIf": "{mostrar_persona5} = true",
          "title": "Foto Doc. Atras"
        },
        {
          "type": "dropdown",
          "name": "persona5_parentesco",
          "visibleIf": "{mostrar_persona5} = true",
          "title": "Parentesco",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona5} = true",
          "title": "Cuál Parentesco"
        },
        {
          "type": "text",
          "name": "persona5_fecha_nacimiento",
          "visibleIf": "{mostrar_persona5} = true",
          "title": "Fecha de Nacimiento\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona5_sexo",
          "visibleIf": "{mostrar_persona5} = true",
          "title": "Sexo",
          "isRequired": true,
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona5_estado_civil",
          "visibleIf": "{mostrar_persona5} = true",
          "title": "Estado Civil\n",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona5} = true",
          "title": "Grupo de atención especial\n",
          "isRequired": true,
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
          "title": "Nombre Completo",
          "isRequired": true
        },
        {
          "type": "dropdown",
          "name": "persona6_tipo_identificacion",
          "title": "Tipo de Identificación\n",
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
          "name": "persona6_num_identificación",
          "title": "Número Identificación",
          "isRequired": true,
          "maxLength": 10
        },
        {
          "type": "text",
          "name": "persona6_fecha_expedicion_identificacion",
          "visibleIf": "{mostrar_persona6} = true",
          "title": "Fecha de expedicion\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "file",
          "name": "persona6_foto_doc_frente",
          "visibleIf": "{mostrar_persona6} = true",
          "title": "Foto Doc. Frente"
        },
        {
          "type": "file",
          "name": "persona6_foto_doc_atras",
          "visibleIf": "{mostrar_persona6} = true",
          "title": "Foto Doc. Atras"
        },
        {
          "type": "dropdown",
          "name": "persona6_parentesco",
          "visibleIf": "{mostrar_persona6} = true",
          "title": "Parentesco",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona6} = true",
          "title": "Cuál Parentesco"
        },
        {
          "type": "text",
          "name": "persona6_fecha_nacimiento",
          "visibleIf": "{mostrar_persona6} = true",
          "title": "Fecha de Nacimiento\n",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona6} = true",
          "title": "Estado Civil\n",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona6} = true",
          "title": "Grupo de atención especial\n",
          "isRequired": true,
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
          "html": "\n<p><strong>1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona7_question7",
          "html": "<p><strong>Persona No 7\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona7_nombre",
          "title": "Nombre Completo",
          "isRequired": true
        },
        {
          "type": "dropdown",
          "name": "persona7_tipo_identificacion",
          "title": "Tipo de Identificación\n",
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
          "name": "persona7_num_identificación",
          "title": "Número Identificación",
          "isRequired": true,
          "maxLength": 10
        },
        {
          "type": "text",
          "name": "persona7_fecha_expedicion_identificacion",
          "visibleIf": "{mostrar_persona7} = true",
          "title": "Fecha de expedicion\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "file",
          "name": "persona7_foto_doc_frente",
          "visibleIf": "{mostrar_persona7} = true",
          "title": "Foto Doc. Frente"
        },
        {
          "type": "file",
          "name": "persona7_foto_doc_atras",
          "visibleIf": "{mostrar_persona7} = true",
          "title": "Foto Doc. Atras"
        },
        {
          "type": "dropdown",
          "name": "persona7_parentesco",
          "visibleIf": "{mostrar_persona7} = true",
          "title": "Parentesco",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona7} = true",
          "title": "Cuál Parentesco",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "persona7_fecha_nacimiento",
          "visibleIf": "{mostrar_persona7} = true",
          "title": "Fecha de Nacimiento\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona7_sexo",
          "visibleIf": "{mostrar_persona7} = true",
          "title": "Sexo",
          "isRequired": true,
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona7_estado_civil",
          "visibleIf": "{mostrar_persona7} = true",
          "title": "Estado Civil\n",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona7} = true",
          "title": "Grupo de atención especial\n",
          "isRequired": true,
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
          "html": "\n<p><strong>1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona8_question7",
          "html": "<p><strong>Persona No 8\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona8_nombre",
          "title": "Nombre Completo",
          "isRequired": true
        },
        {
          "type": "dropdown",
          "name": "persona8_tipo_identificacion",
          "title": "Tipo de Identificación\n",
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
          "name": "persona8_num_identificación",
          "title": "Número Identificación",
          "isRequired": true,
          "maxLength": 10
        },
        {
          "type": "text",
          "name": "persona8_fecha_expedicion_identificacion",
          "visibleIf": "{mostrar_persona8} = true",
          "title": "Fecha de expedicion\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "file",
          "name": "persona8_foto_doc_frente",
          "visibleIf": "{mostrar_persona8} = true",
          "title": "Foto Doc. Frente"
        },
        {
          "type": "file",
          "name": "persona8_foto_doc_atras",
          "visibleIf": "{mostrar_persona8} = true",
          "title": "Foto Doc. Atras"
        },
        {
          "type": "dropdown",
          "name": "persona8_parentesco",
          "visibleIf": "{mostrar_persona8} = true",
          "title": "Parentesco",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona8} = true",
          "title": "Cuál Parentesco",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "persona8_fecha_nacimiento",
          "visibleIf": "{mostrar_persona8} = true",
          "title": "Fecha de Nacimiento\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona8_sexo",
          "visibleIf": "{mostrar_persona8} = true",
          "title": "Sexo",
          "isRequired": true,
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona8_estado_civil",
          "visibleIf": "{mostrar_persona8} = true",
          "title": "Estado Civil\n",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona8} = true",
          "title": "Grupo de atención especial\n",
          "isRequired": true,
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
          "html": "\n<p><strong>1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
        },
        {
          "type": "html",
          "name": "persona9_question7",
          "html": "<p><strong>Persona No 9\n</strong> </p>"
        },
        {
          "type": "text",
          "name": "persona9_nombre",
          "title": "Nombre Completo",
          "isRequired": true
        },
        {
          "type": "dropdown",
          "name": "persona9_tipo_identificacion",
          "title": "Tipo de Identificación\n",
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
          "name": "persona9_num_identificación",
          "title": "Número Identificación",
          "isRequired": true,
          "maxLength": 10
        },
        {
          "type": "text",
          "name": "persona9_fecha_expedicion_identificacion",
          "visibleIf": "{mostrar_persona9} = true",
          "title": "Fecha de expedicion\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "file",
          "name": "persona9_foto_doc_frente",
          "visibleIf": "{mostrar_persona9} = true",
          "title": "Foto Doc. Frente"
        },
        {
          "type": "file",
          "name": "persona9_foto_doc_atras",
          "visibleIf": "{mostrar_persona9} = true",
          "title": "Foto Doc. Atras"
        },
        {
          "type": "dropdown",
          "name": "persona9_parentesco",
          "visibleIf": "{mostrar_persona9} = true",
          "title": "Parentesco",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona9} = true",
          "title": "Cuál Parentesco",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "persona9_fecha_nacimiento",
          "visibleIf": "{mostrar_persona9} = true",
          "title": "Fecha de Nacimiento\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona9_sexo",
          "visibleIf": "{mostrar_persona9} = true",
          "title": "Sexo",
          "isRequired": true,
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona9_estado_civil",
          "visibleIf": "{mostrar_persona9} = true",
          "title": "Estado Civil\n",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona9} = true",
          "title": "Grupo de atención especial\n",
          "isRequired": true,
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
          "html": "\n<p><strong>1.2 Personas que componen el núcleo familiar \n</strong> (personas que dependan económica y convivan con usted, esta información es sujeta de verificación con SISBEN o cualquier otra herramienta equivalente)</p>"
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
          "title": "Nombre Completo",
          "isRequired": true
        },
        {
          "type": "dropdown",
          "name": "persona10_tipo_identificacion",
          "title": "Tipo de Identificación\n",
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
          "name": "persona10_num_identificación",
          "title": "Número Identificación",
          "isRequired": true,
          "maxLength": 10
        },
        {
          "type": "text",
          "name": "persona10_fecha_expedicion_identificacion",
          "visibleIf": "{mostrar_persona10} = true",
          "title": "Fecha de expedicion\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "file",
          "name": "persona10_foto_doc_frente",
          "visibleIf": "{mostrar_persona10} = true",
          "title": "Foto Doc. Frente"
        },
        {
          "type": "file",
          "name": "persona10_foto_doc_atras",
          "visibleIf": "{mostrar_persona10} = true",
          "title": "Foto Doc. Atras"
        },
        {
          "type": "dropdown",
          "name": "persona10_parentesco",
          "visibleIf": "{mostrar_persona10} = true",
          "title": "Parentesco",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona10} = true",
          "title": "Cuál Parentesco",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "persona10_fecha_nacimiento",
          "visibleIf": "{mostrar_persona10} = true",
          "title": "Fecha de Nacimiento\n",
          "isRequired": true,
          "inputType": "date"
        },
        {
          "type": "dropdown",
          "name": "persona10_sexo",
          "visibleIf": "{mostrar_persona10} = true",
          "title": "Sexo",
          "isRequired": true,
          "choices": [
            "Masculino",
            "Femenino"
          ]
        },
        {
          "type": "dropdown",
          "name": "persona10_estado_civil",
          "visibleIf": "{mostrar_persona10} = true",
          "title": "Estado Civil\n",
          "isRequired": true,
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
          "visibleIf": "{mostrar_persona10} = true",
          "title": "Grupo de atención especial\n",
          "isRequired": true,
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
          "title": "1. 3. Caracterización productiva del núcleo familiar",
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
          "html": "<span style=\"font-weight: 999;\">2. Predio Objetivo de intervención </span>\n<p><strong>2.1.</strong> Ubicación del predio con cultivos de uso ilícito.  Indique las características que permitan georreferenciar e individualizar plenamente el predio objeto de intervención, en el cual usted cuenta con los cultivos de uso ilícito</p>"
        },
        {
          "type": "radiogroup",
          "name": "desplazado_nuevo_predio",
          "title": "Si se encuentra en condición de desplazamiento forzado tiene un nuevo predio para proyecto productivo ",
          "isRequired": true,
          "choices": [
            "Si",
            "No"
          ]
        },
        {
          "type": "dropdown",
          "name": "desplazado_departamento",
          "visibleIf": "{desplazado_nuevo_predio} = 'Si'",
          "title": "Departamento",
          "choices": [
            {
              "value": "Si",
              "text": "Sin departamento"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "desplazado_municipio",
          "visibleIf": "{desplazado_nuevo_predio} = 'Si'",
          "title": "Municipio",
          "choices": [
            {
              "value": "Si",
              "text": "Sin municipio"
            }
          ]
        },
        {
          "type": "dropdown",
          "name": "numero_predios_uso_ilicito",
          "title": "¿Cuántos predios con cultivos de uso ilícito tiene su núcleo familiar?\n",
          "choices": [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
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
          "title": "Otra vereda",
          "description": "si no se encuentra en el listado de veredas",
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
          "description": "No dejar en blanco, utilizar números enteros",
          "inputType": "number",
          "step": 1,
          "validators": [
            {
              "type": "regex",
              "text": "Por favor ingrese un número entero",
              "regex": "^\\d+$"
            }
          ],
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
          "inputType": "number",
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
          "title": "Otra vereda",
          "description": "si no se encuentra en el listado de veredas",
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
          "description": "No dejar en blanco, utilizar números enteros",
          "inputType": "number",
          "step": 1,
          "validators": [
            {
              "type": "regex",
              "text": "Por favor ingrese un número entero",
              "regex": "^\\d+$"
            }
          ],
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
          "inputType": "number",
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
          "title": "Otra vereda",
          "description": "si no se encuentra en el listado de veredas",
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
          "description": "No dejar en blanco, utilizar números enteros",
          "inputType": "number",
          "step": 1,
          "validators": [
            {
              "type": "regex",
              "text": "Por favor ingrese un número entero",
              "regex": "^\\d+$"
            }
          ],
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
          "inputType": "number",
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
          "title": "Otra vereda",
          "description": "si no se encuentra en el listado de veredas",
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
          "description": "No dejar en blanco, utilizar números enteros",
          "inputType": "number",
          "step": 1,
          "validators": [
            {
              "type": "regex",
              "text": "Por favor ingrese un número entero",
              "regex": "^\\d+$"
            }
          ],
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
          "inputType": "number",
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
          "title": "Otra vereda",
          "description": "si no se encuentra en el listado de veredas",
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
          "description": "No dejar en blanco, utilizar números enteros",
          "inputType": "number",
          "step": 1,
          "validators": [
            {
              "type": "regex",
              "text": "Por favor ingrese un número entero",
              "regex": "^\\d+$"
            }
          ],
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
          "inputType": "number",
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
          "name": "predio6_vereda_otra",
          "title": "Otra vereda",
          "description": "si no se encuentra en el listado de veredas",
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
          "description": "No dejar en blanco, utilizar números enteros",
          "inputType": "number",
          "step": 1,
          "validators": [
            {
              "type": "regex",
              "text": "Por favor ingrese un número entero",
              "regex": "^\\d+$"
            }
          ],
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
          "inputType": "number",
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
          "name": "predio7_vereda_otra",
          "title": "Otra vereda",
          "description": "si no se encuentra en el listado de veredas",
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
          "description": "No dejar en blanco, utilizar números enteros",
          "inputType": "number",
          "step": 1,
          "validators": [
            {
              "type": "regex",
              "text": "Por favor ingrese un número entero",
              "regex": "^\\d+$"
            }
          ],
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
          "inputType": "number",
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
          "description": "No dejar en blanco, utilizar números enteros",
          "inputType": "number",
          "step": 1,
          "validators": [
            {
              "type": "regex",
              "text": "Por favor ingrese un número entero",
              "regex": "^\\d+$"
            }
          ],
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
          "inputType": "number",
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
          "description": "No dejar en blanco, utilizar números enteros",
          "inputType": "number",
          "step": 1,
          "validators": [
            {
              "type": "regex",
              "text": "Por favor ingrese un número entero",
              "regex": "^\\d+$"
            }
          ],
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
          "inputType": "number",
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
          "description": "No dejar en blanco, utilizar números enteros",
          "inputType": "number",
          "step": 1,
          "validators": [
            {
              "type": "regex",
              "text": "Por favor ingrese un número entero",
              "regex": "^\\d+$"
            }
          ],
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
          "inputType": "number",
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
          "html": "<span style=\"font-weight: 999;\">3.  Economía de sustitución de cultivos de uso ilícito</span>"
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
          "type": "dropdown",
          "name": "tipo_figura_organizativa",
          "title": "Tipo de figura organizativa",
          "choices": [
            "Organización",
            "Asociación",
            "JAC",
            "Cooperativa",
            "Grupo étnico"
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
          "visibleIf": "{documento_pertenencia_etnica_anexa} = 'si'",
          "title": "Documento pertenencia"
        }
      ]
    },
    {
      "name": "page17",
      "elements": [
        {
          "type": "html",
          "name": "question4",
          "html": "<h4>1. TÉRMINOS Y CONDICIONES PARA PROCESOSDE SUSTITUCIÓN DE CULTIVOS DE USO ILÍCITO</h4>"
        },
        {
          "type": "html",
          "name": "question12",
          "html": "<p><strong>2.1. Compromisos del núcleo familiar participante del proceso de sustitución</strong></p>\n<p>Yo {nombrecompleto} en nombre propio y en nombre y representación de las personas incluidas en este formulario como parte de minúcleo familiar\ndeclaro que: </p>\n\n<p>\n<ul>\n<li> - Pertenecemos al mismo núcleo familiar. </li>\n<li> - Entendemos que salvo entre los miembros del grupo familiar aquí preinscritos, las prerrogativas y obligaciones surgidas del proceso de\nsustitución no son transmisibles a ningún título.</li>\n<li> - No nos inscribiremos, además de la presente, ni individual ni colectivamente, en este u otro programa o proceso de sustitución mientras que\nhagamos parte de este núcleo familiar.\n</li><li>  - No tenemos vínculo bajo ninguna calidad (titular-beneficiario- proveedor) con elPrograma Nacional Integral de Sustitución de Cultivos de Uso\nIlícito (PNIS), u otros programas o procesos de sustitución de cultivos de uso ilícito a la fecha de suscripción del presente documento.\n</li><li> - Contamos con arraigo en el municipio de {municipio_arraigo} acreditado por autoridad competente u organismo de acción comunal, o quienes hagan sus veces.\n</li><li>  - Ninguna persona del núcleo familiar aquí inscrito está condenadapor delitos de narcotráfico o conexos (Capítulo II, Título XIII, Libro Segundo\ndel Código Penal colombiano).\n</li><li>  - Ninguna persona del núcleo familiar, aquí inscrito, es funcionario público, contratista del Estado o maneja recursos públicos a ningún título.</li>\n<li> - La implementación del proceso de sustitución de cultivos de uso ilícito conlleva la eliminación de raíz de la totalidad del área sembrada de cultivos de uso ilícito, que corresponde a {totalHectareas} hectáreas cultivos de uso ilícito con corte a la fecha de suscripción del presente documento. \n</li>\n<li> - El predio en el que realizaremos la implementación del proceso de sustitución de cultivos de uso ilícito no pertenece a la categoría de bien\nfiscal o de uso de una entidad pública. </li>\n</ul>\n</p>\n<br>\n<p><strong>Nos comprometemos a:</strong></p>\n<br>\n<ul>\n<li>\n- Arrancar de raíz la totalidad del área sembrada de los cultivos de uso ilícito en el predio objeto de sustitución de cultivos de uso ilícito y/o intervención, en el periodo que determine la DSCI y adelantar el consecuente establecimiento y/o fortalecimiento de la línea productiva, forestal y/o de la biodiversidad de sustitución de economías.\n</li>\n<li>\n- No resembrar cultivos de uso ilícito en el predio objeto de intervención o sembrar en otros predios.\n</li>\n<li>\n- No propiciar, participaro promocionar en ningún grado en la comisión de conductas asociadas a economías ilícitas o conexas, a partir de la\nsuscripción de este documento.\n</li>\n<li>\n-Acreditar sumariamente la propiedad, posesión u ocupación de buena fe exenta de culpa del predio objeto de sustitución de cultivos de uso ilícito y/o intervención en los 30 días siguientes a la suscripción del presente documento. \n</li>\n<li>\n- Implementar la(s) alternativa(s) productiva(s) ambientalmente sostenibles y lícita(s) en el predio objeto de sustitución de cultivos de uso ilícito a la fecha de suscripción del presente documento y conservarlo durante al menos 5 años posteriores al inicio de actividades de implementación. \n</li>\n<li>\n- Permitir, cuando sea debidamente requerido, el ingreso al predio y facilitar la caracterización predial, las validaciones y monitoreo de presencia de cultivos de uso ilícito en el predio objeto de sustitución de cultivos de uso ilícito y/o intervención de acuerdo con el Sistema Integrado de Monitoreo de Cultivos de Uso Ilícito y demás mecanismos de verificación que el Estado en cabeza de la DSCI pueda definir. \n</li>\n<li>\n- Participar activamente y realizar las actividades que se requieran para acceder a las alternativas de sustitución de ingresos y de economías\nen el/los predio (s) indicadas por el equipo de Asistencia Técnica Integral, para el adecuado desarrollo de la línea productiva, forestal y/o de la\nbiodiversidad seleccionada.\n</li>\n<li>\n - Hacer uso adecuado de los bienes y servicios entregados durante la intervención y orientados a la implementación de la(s) alt ernativa(s)\nproductiva(s). Lo anterior incluye no donar, no vender y/o permutar las cualquiera de las herramientas, recursos, insumos, infraestructuras y\ndemás bienes y servicios entregados en el marco del proceso de sustitución, así como no utilizarlos para fines ilícitos.\n</li>\n<li>\n- Suministrar información veraz en cada etapa del proceso de tránsito a las economías licitas, respecto a aquellos aspectos que puedan afectar\nel cumplimiento de los compromisos señaladosy/o derivados del Acuerdo de Sustitución del municipio de {municipio_arraigo}.\n</li>\n<li>\n- Incluir en cualquier negocio jurídico que pretenda tramitar o transmitir el uso, goce o disposición del predio objeto de intervención, una\ncláusula que obligue al adquirente, tenedor, usufructuario u ocupante, que, ante la presencia de cultivos de uso ilícito, procederá la\nerradicación forzosa en cabeza del Estado colombiano.\n</li>\n</ul>"
        },
        {
          "type": "html",
          "name": "question16",
          "html": "<p><strong>2.2 Compromisos de la Dirección de Sustitución de Cultivos de Uso Ilícito\n</strong></p>\n<BR>\n<ul>\n<li>\n- Garantizar los medios necesarios para el cumplimiento de los compromisos asumidos para el proceso de tránsito a economías lícitas en el\nmarco de esta ficha individual y el Acuerdo de Sustitución de Cultivos de Uso Ilícito.\n</li>\n<li>\n-Verificar la información suministrada por el núcleo familiar en el proceso de inscripción para validar el cumplimiento de los requisitos y\ncriterios de acceso al proceso de sustitución de cultivos de uso ilícito.\n</li>\n<li>\n-Informar de manera clara y oportuna a cada núcleo familiar sobre cualquier aspecto relevante del proceso de sustitución de cultivos de uso\nilícito\n</li>\n<li>\n-Identificar y establecer la línea base de cultivos de uso ilícito en los municipios focalizados, núcleos veredales ponderados y las veredas a\nintervenir y el/los predio(s) a intervenir\n</li>\n<li>\n-Realizar el monitoreo para la verificación de la eliminación total del área sembrada de los cultivos de uso ilícito referidos por el núcleo familiar\nfirmante como compromiso de erradicación voluntaria e inicio de la implementación del proceso de sustitución.\n</li>\n<li>\n-Implementar medidas diferenciales para promover la participación y agenciamiento de las mujeres y la población juvenil durante su tránsito\ny permanencia en las economías lícitas.\n</li>\n</ul>"
        },
        {
          "type": "html",
          "name": "question13",
          "html": "<p><strong>2.2.1. Compromisos frente a los procesos de sustitución \n</strong></p>\n<br>\n<p>\nLa Dirección de Sustitución de Cultivos de Uso Ilícito (DSCI), de la Agencia de Renovación del Territorio (ART) propone como componentes del proceso de sustitución de cultivos de uso ilícito para la intervención en el marco de la Convocatoria RenHacemos Catatumbo, para los municipios de Convención, Tibú, El Tarra y Sardinata de Norte de Santander.  \n</p>\n<br>\n<p>\n<strong>\n\n(i) Pago por la eliminación de cultivos de uso ilícito\n</strong>\n<br>\n<br>\nDurante el periodo permitido para la implementación de las medidas de conmoción interior declarado para la Región del Catatumbo, se otorgará una transferencia mensual por valor de un millón doscientos ochenta mil pesos ($1.280.000), los pagos estarán condicionados a:  \n</p>\n<br>\n<ul>\n<li>\n- La suscripción del compromiso de desvinculación del circuito económico basado en cultivos de uso ilícito y transitar a una economía lícita; además de la caracterización del lote de cultivos de uso ilícito. \n</li>\n<li>\n- Eliminación del cultivo de uso lícito de raíz de acuerdo con los plazos y condiciones que para ese efecto determine la DSCI,  \n</li>\n<li>\n- Una vez finalizado el periodo de implementación de las medidas de conmoción, los núcleos familiares continuarán un componente de transferencias a través de la estrategia Renhacemos Catatumbo por concepto de mano de obra y alistamiento del proyecto productivo . para lo cual se le otorgará una transferencia mensual por valor de un millón doscientos ochenta mil pesos ($1.280.000) hasta completar doce meses. \n</li>\n<li>\n- En caso de encontrarse en áreas de especial interés ambiental se aplicarán incentivos en forma de pago por servicios ambientales para las familias que se comprometan con la transformación ecológica y productiva para la sustitución de cultivos de uso ilícito basados en la implementación de sistemas agroforestales y otros, incluyendo los orientados a seguridad alimentaria y alternativas productivas sostenibles, que generen cadenas de valor sostenibles como alternativas de ingreso lícitos en el corto y mediano plazo. \n</li>\n</ul>\n<br>\n<p>\n<strong>(ii) inicio o fortalecimiento de una economía licita, para lo cual el Estado, a través de las entidades competentes, hará la entrega de activos productivos, maquinaria y asistencia técnica necesaria. </strong>\n</p>\n\n<br>\n<ul>\n<li>\n- <strong>Adquisición de activos productivos (bienes y/o insumos) </strong>\n<br>\nA partir de la caracterización del predio, se iniciará con el acompañamiento técnico para la toma de muestras del suelo, la formulación del plan de inversión que contempla la implementación de las actividades necesarias para la recuperación del suelo, la entrega del material vegetal/animal y los insumos productivos necesarios y se lleva a cabo el establecimiento y/o fortalecimiento de la alternativa productiva sostenible. En caso de encontrarse en áreas de especial interés ambiental se promoverá la implementación de sistemas agroforestales y otros, incluyendo los orientados a seguridad alimentaria y alternativas productivas sostenibles.  \n</li>\n<li>\n - <strong>Afianzamiento de la cadena de valor </strong>\n<br>\nDurante 12 meses, en aras de afianzar la economía lícita los núcleos familiares se fortalecerán las alternativas productivas sostenibles que generen ingresos legales y se realizarán las actividades propias de las cadenas de valor de las líneas productivas seleccionadas. Para ello, se implementará un componente de asistencia técnica para fortalecer las capacidades productivas de los núcleos familiares en todos los eslabones de la cadena de valor, particularmente, en aspectos relacionados con la formalización, el mejoramiento de capacidades empresariales en desarrollo de la economía popular, el fortalecimiento de la asociatividad, los encadenamientos comerciales y el modelo de negocio asociativo para la transformación ecológica y productiva de los productores o grupo de productores.\n</li>\n<li>\n- <strong>Empresas agroindustriales y negocios verdes </strong>\n<br>\n\nDurante 12 meses se llevará a cabo la implementación de  procesos de producción primaria para generar cadenas de negocios verdes y procesos de transformación agroindustrial de materia prima y la diversificación de los productos, a través de modelos de negocio asociativo para la transformación y comercialización, el cual podrá operar bajo la modalidad de alianza público-popular o público-privado-popular en los municipios de El Tarra, Convención, Tibú y Sardinata del departamento de Norte de Santander .\n</li>\n<li>\n- <strong>Formalización de tierras y derechos territoriales </strong> <br>\n\nCon el fin de contribuir a la estabilización social, económica y productiva de los núcleos familiares sujetos de procesos de sustitución de cultivos de uso ilícito, la Agencia Nacional de Tierras priorizará los procesos de formalización de la propiedad privada, la adjudicación de bienes baldíos de la Nación y la regularización de la ocupación campesina en áreas inadjudicables, siempre y cuando estas no correspondan a la categoría de territorios colectivos o estén incluidas en procesos de ampliación de los mismos Cuando la adjudicación o el reconocimiento de derechos, en cualquier modalidad, recaiga sobre áreas con presencia de cultivos de uso ilícito, los beneficiarios estarán obligados a sustituirlos como requisito para conservar el derecho otorgado. Esta condición quedará formalizada en el acuerdo de sustitución correspondiente y su incumplimiento dará como resultado la caducidad del derecho reconocido.   \n</li>\n</ul>\n<br>\n<p>\n\n\n<br>\n<p>En el caso que los núcleos familiares se encuentren asentados en áreas de la Reserva de Ley 2 de 1959, se adelantarán los procesos relacionados con\nlos derechos territoriales de que trata el Decreto 1147 de 2024.</p>"
        },
        {
          "type": "html",
          "name": "question17",
          "html": "<h5>\n2. CAUSALES DE SUSPENSIÓN Y DE EXCLUSIÓN DEL PROCESO DE SUSTITUCIÓN \n</h5>\n<br>\n\n<strong>\n3.2. Causales de suspensión  \n</strong>\n<ul>\n<li>\n1. Entregar información insuficiente, incompleta o inconsistente, sin perjuicio de los plazos que para la subsanación entrega el artículo 17 de la Ley 1437 de 2011 (1 mes). \n</li>\n<li>\n2. Muerte del representante del núcleo familiar, hasta tanto se defina el miembro del núcleo familiar que lo reemplazará. \n</li>\n<li>\n3. No asistir a las actividades o atender las recomendaciones de la Asistencia Técnica, sin perjuicio de las causales de caso fortuito o fuerza mayor que deberán ser acreditados por el núcleo familiar beneficiario. \n</li>\n<li>\n4. No atender las visitas planificadas por la Asistencia Técnica Integral, sin perjuicio de la demostración de causales de caso fortuito o fuerza mayor. \n</li>\n<li>\n5. No cumplir con las metas de calidad y de productividad del sistema productivo establecidas por la DSCI, sin perjuicio de las explicaciones de las razones, las acciones correctivas o de subsanación que el núcleo familiar pueda implementar, para lo cual se entregará 1 mes. \n<li>\n</ul>\n<br>\n<br>\n<strong>\n3.1.  Causales de exclusión \n</strong>\n<ul>\n<li>\n1. No arrancar de raíz la totalidad de los cultivos de uso ilícito en el predio objeto de intervención, en los lapsos establecidos en esta ficha. \n</li>\n<li>\n2. Resembrar cultivos de uso ilícito en el predio objeto de intervención o sembrarlos en otros predios. \n</li>\n\n<li>\n3. No adelantar con la diligencia debida, las actividades necesarias para la manutención del sistema productivo dentro de los 5 años siguientes a su implementación. . \n</li>\n\n<li>\n4. Que alguno de los miembros del núcleo familiar inscrito sea condenado por la comisión de conductas punibles relacionadas a economías ilícitas (Capítulo II, Título XIII, Libro Segundo del Código Penal colombiano). \n</li>\n\n<li>\n5. No acreditar sumariamente la propiedad, posesión u ocupación de buena fe exenta de culpa del predio objeto de intervención en los 30 días siguientes a la suscripción del presente documento. \n</li>\n<li>\n6. No permitir el ingreso al predio objeto de la intervención u obstaculizar el desarrollo de la caracterización predial.  \n</li>\n<li>\n7. No brindar las condiciones para el desarrollo de las actividades necesarias para el proceso de sustitución de cultivos de uso ilícito. \n</li>\n<li>\n8. Obstaculizar monitoreo de presencia de cultivos de uso ilícito en el predio objeto de intervención de acuerdo con el Sistema Integrado de Monitoreo de Cultivos de Uso Ilícito y demás mecanismos de verificación que el Estado en cabeza de la DSCI pueda definir. \n</li>\n<li>\n9. No desarrollar las actividades asociadas al proceso de sustitución para lograr ejecutar la sustitución de ingresos. \n</li>\n<li>\n10. No cumplir las recomendaciones brindadas por la Asistencia Técnica Integral. \n</li>\n<li>\n11. Donar, vender y/o permutar las herramientas, recursos e insumos entregados o utilizarlos para fines distintos a los del proyecto productivo de sustitución. \n</li>\n<li>\n12. Suministrar información falsa en cualquier etapa del proceso de tránsito a las economías licitas, especialmente respecto a aquellos aspectos que puedan afectar el cumplimiento de los compromisos señalados y/o derivados del Acuerdo de Sustitución del municipio de {municipio_arraigo}. \n</li>\n<li>\n13. Obstaculizar el cumplimiento del Acuerdo de Sustitución de Cultivos de Uso Ilícito y la consecuente implementación del Plan Operativo para el Tránsito a Economías Lícitas en el municipio de {municipio_arraigo}, en la vereda de {vereda_arraigo}.  \n</li>\n<li>\n14. No subsanar las situaciones que dieron lugar a la suspensión del proceso de sustitución en término establecido para tal efecto \n</li>\n\n<li>\n15. Obstaculizar los procesos de asociatividad o de comercialización para la línea productiva previstos en el Plan Operativo de Sustitución. \n</li>\n<li>\n16. Que alguno de los miembros del núcleo familiar sea elegido o como funcionario público. \n</li>\n<li>\n17. Que alguno de los miembros del núcleo familiar sea contratista del Estado o maneje recursos públicos a cualquier título. \n</li>\n</ul>\n"
        },
        {
          "type": "html",
          "name": "question18",
          "html": " \n\nEl presente acuerdo de sustitución está condicionado a la verificación por parte de la DSCI, de la presencia del cultivo de Coca, Amapola o Marihuana en el predio comprometido a sustituir, ya sea al momento de la firma del presente acuerdo ({fechahoy}) o al inicio del proceso de participación en el proyecto de sustitución de la economía ilícita, a través de los registros históricos oficiales del SIIMA (2023). El proceso de verificación tendrá una duración de treinta (30) días hábiles desde el momento de la firma de la ficha de acuerdo. "
        },
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
    "showNavigationButtons": false
}

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
      console.log('sender.data')
      console.log(sender.data)

    const personaData = {
      tipo_identificacion_id: sender.data.tipo_identificacion,
      numero_documento: sender.data.numero_identificacion,
      nombre: sender.data.nombres,
      apellido: sender.data.apellidos,
      fecha_expedicion: sender.data.fecha_expedicion,
      fecha_nacimiento: sender.data.fecha_nacimiento,
      sexo_id: sender.data.sexo,
      genero_orientacion_sexual_id: sender.data.identidad_genero,
      estado_civil_id:sender.data.estado_civil,
      actividad_laboral:sender.data.ocupacion,
      nivel_escolaridad_id:sender.data.escolaridad,
      tipo_afiliacion_salud_id:sender.data.tipo_salud,
      //discapacidad
      email: sender.data.email,
      telefono_celular: sender.data.numero_contacto,
      //pertenece_comunidad_etnica: si-no
      //cabeza_flia:
      //desplazado_2025
      //ubicacion_ant2025_id
      grupo_atencion_especial_dsci_id: sender.data.grupo_especial,
      tipo_comunidad_etnica_id: sender.data.comunidad_etnica,
      nombre_comunidad: sender.data.pueblo_indigena,
      ingresos_mensuales: sender.data.valor_ingresos,
      gastos_mensuales: sender.data.valor_gastos,
      //titular_id
      //parentesco_id
      //menor_edad
      //fase
      //estado_id
      num_nucleo: sender.data.num_dependientes,
      num_predios: sender.data.numero_predios_uso_ilicito,
      ha_total_predios: sender.data.predio_area,
      //ha_total_loteCoca: sender.data.predios_hectareas_coca
    }

    const formPersonaData = {
      //id
      //formulario_id
      persona_id: 0,
      tiene_coca: 1,
      acepta_terminos: 1,
      acepta_tratamiento_datos: 1,
      compromiso_proceso_susticion:1,
      //beca_desea
      //beca_num
      //beca_descrip
      //vivienda
      //vivienda_imagen
      fecha_aceptacion: new Date().toISOString(),
      firma: sender.data.firma,
      //origen
    }

    const PersonaLineaProductiva = {
      //id
      persona_id: 0,
      linea_productiva_id: sender.data.linea_productiva,
      //otra_cual
      experiencia_linea_productiva: 0,
      tiempo_experiencia_linea: 0,
      vinculado_asociacion: 0,
      activa: 1,
      fcrea: new Date().toISOString(),
      origen: 'ficha_catatumbo',
      fmodifica: new Date().toISOString()
    }

    const predioForm = {
      //id
      persona_id: 0,
      ubicacion_id: sender.data.departamento,
      cabecera: 0,
      centro_poblado: 0,
      corregimiento: sender.data.corregimiento,
      vereda: sender.data.vereda,
      //direccion
      residencia: 1,
      nombre_lugar: sender.data.predio_nombre,
      lotecoca: 1,
      //area_total_hectareas
      //area_cultivo_hectareas,
      documento_relacion_predio: "",
      origen: 'preregistro_catatumbo',
      sig: 0,
      coordenada_registro:  `${sender.data.latitud} ${sender.data.longitud}`,
      altitud: sender.data.altura,
      presion: 0,
      tiempo_propietario_predio: 0,
    }

    const personaAdjuntoData1 = {
      //id
      persona_id: 0,
      tipo_documento_id: 13,
      ruta: "",
      origen: 'ficha_catatumbo',
      fcrea: new Date().toISOString(),
    };

    if (Array.isArray(sender.data.predio1_relacion_documento_acreditado) && sender.data.predio1_relacion_documento_acreditado.length > 0) {
      resizeBase64Img(sender.data.predio1_relacion_documento_acreditado[0].content, (resizedImage:any) => {
        personaAdjuntoData1.ruta = resizedImage;
        console.log('transformado')
      });
    }

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


    uCrud_persona.create(personaData)
        .then((item) => {
            
          console.log(item);
          formPersonaData.persona_id = item.id
          uCrud_formpersona.create(formPersonaData).then((item2:any) => {});
          PersonaLineaProductiva.persona_id = item.id;
          uCrud_linea.create(PersonaLineaProductiva).then((item3:any) => {});
          predioForm.persona_id = item.id;
          uCrud_predio.create(predioForm).then((item4:any) => {});
          personaAdjuntoData1.persona_id = item.id;
          uCrud_personaAdjunto.create(personaAdjuntoData1).then((item5:any) => {});

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