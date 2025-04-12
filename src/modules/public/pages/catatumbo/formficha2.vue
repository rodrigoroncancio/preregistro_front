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

  const uCrud_persona = useCrud("api/2.0/nucleo/persona");
  const uCrud_edades= useCrud("api/2.0/nucleo/composicionedades");
  const uCrud_nucleo = useCrud("api/2.0/nucleo/composicionucleo");
  const uCrud_formpersona = useCrud("api/2.0/nucleo/formpersona");
  const uCrud_linea = useCrud("api/2.0/nucleo/personalinea");

  const uToast = useToast();

  const itemsVillages = ref<Array<{ id: number; label: string }>>([]);
  const dataLineaProductiva = ref({
    id: 0,
    linea_productiva_id: 0,
    tipo_experiencia_id: 0,
  })
  const dataFormularioPersona = ref({
    id: 0
  })
  const dataUser = ref({
    id: 0,
    tipo_identificacion_id: null,
    numero_documento: '',
    cub_asociacion: null,
    cub: 0,
    ha_total_predios: '0.00',
    ha_total_loteCoca: '0.00',
    beneficiario: false,
    cupo: null,
    vinculado_asociacion: false,
    id_registro: null,
    nombre: '',
    apellido: '',
    fecha_expedicion: '',
    fecha_nacimiento: '',
    sexo_id: null,
    genero_orientacion_sexual_id: null,
    estado_civil_id: null,
    nivel_escolaridad_id: null,
    tipo_afiliacion_salud_id: null,
    discapacidad: false,
    email: '',
    telefono_celular: '',
    whatsapp: '',
    pertenece_comunidad_etnica: false,
    desplazado_2025: false,
    ubicacion_ant2025_id: null,
    cabeza_flia: false,
    grupo_atencion_especial_dsci_id: null,
    tipo_comunidad_etnica_id: null,
    nombre_comunidad: null,
    ingresos_mensuales: '0.0000',
    gastos_mensuales: '0.0000',
    num_nucleo: 0,
    titular_id: null,
    parentesco_id: null,
    menor_edad: false,
    fase: '',
    estado_id: null,
    fecha_estado: '',
    fcrea: '',
    bloqueado: null,
    observacion: null,
    fmodifica: null
  })
  const getVillageList = async (ubicacionId: number) => {
    try {
      const response = await axios.get(`/api/2.0/nucleo/ubicacion/by-id/${ubicacionId}/`);
      itemsVillages.value = response.data.map((dept: any) => ({
        value: dept.id,
        text: dept.nombre // Asegurar compatibilidad
      }));
    } catch (error) {
      console.error("Error fetching village list:", error);
    }
  };

  const getLineaProductiva = async (personaId: number) => {
    try {
      const response = await axios.get(`/api/2.0/nucleo/lineaproductiva/by-id/${personaId}/`);
      dataLineaProductiva.value = response.data[0]
      survey.setValue('establece_fortalece', dataLineaProductiva.value.tipo_experiencia_id || 0);
      survey.setValue('linea_productiva', dataLineaProductiva.value.linea_productiva_id || 0);
    } catch (error) {
      console.error("Error fetching village list:", error);
    }
  };

  const getFormularioPersona = async (personaId: number) => {
    try {
      const response = await axios.get(`/api/2.0/nucleo/formulariopersona/by-id/${personaId}/`);
      dataFormularioPersona.value = response.data[0]
    } catch (error) {
      console.error("Error fetching village list:", error);
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

  });

  const json ={
  "title": "FICHA DE VINCULACIÓN DE NÚCLEOS FAMILIARES AL PROGRAMA DE SUSTITUCIÓN DE CULTIVOS DE USO ILÍCITO DE LA DIRECCIÓN DE SUSTITUCIÓN DE CULTIVOS DE USO ILICITO",
  "pages": [
    {
      "name": "numero_identificacion2",
      "elements": [
        {
          "type": "html",
          "name": "question1",
          "html": "<H4>\nA. Identificación\n</H4>"
        },
        {
          "type": "radiogroup",
          "name": "titular_tipo_identificacion",
          "title": "Tipo de identificación",
          "isRequired": true,
          "choices": [
            {
              "value": "12",
              "text": "Cédula de ciudadania"
            },
            {
              "value": "46",
              "text": "Otra"
            }
          ]
        },
        {
          "type": "text",
          "name": "titular_numero_identificacion",
          "isRequired": true,
          "title": "Número de identificación",
          "description": "No se permite tarjeta de identificación ni registro civil"
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
          "name": "titular_nombres",
          "title": "Nombres",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "titular_apellidos",
          "title": "Apellidos",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "titular_tipo_identificacion_cual",
          "visibleIf": "{titular_tipo_identificacion} = 'Item 2'",
          "title": "Cuál"
        },
        {
          "type": "text",
          "name": "telefono",
          "title": "Número de teléfono de contacto",
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "html",
          "name": "question4",
          "html": "<H4>\nB. Caracteristicas básicas del nucleo familiar del representante\n</H4>"
        },
        {
          "type": "radiogroup",
          "name": "composiscion_hogar",
          "title": "Cuál es la composición de su hogar actualmente ?",
          "choices": [
            {
              "value": "Item 1a/o",
              "text": "Jefe/a del núcleo familiar hombre"
            },
            {
              "value": "Item 2",
              "text": "Jefe/a del núcleo familiar mujer"
            },
            {
              "value": "Item 3",
              "text": "Esposa/o, pareja, cónyuge del fefe/a"
            }
          ]
        },
        {
          "type": "radiogroup",
          "name": "hijostiene",
          "title": "Hijos",
          "defaultValue": "Item 2",
          "isRequired": true,
          "choices": [
            {
              "value": "Item 1",
              "text": "Si"
            },
            {
              "value": "Item 2",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "hijostiene_cuantos",
          "visibleIf": "{hijostiene} = 'Item 1'",
          "title": "Cuántos?",
          "isRequired": true,
          "inputType": "number"
        },
        {
          "type": "radiogroup",
          "name": "hijastrostiene",
          "title": "Hijastros?",
          "defaultValue": "Item 2",
          "isRequired": true,
          "choices": [
            {
              "value": "Item 1",
              "text": "Si"
            },
            {
              "value": "Item 2",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "hijastrostiene_cuantos",
          "visibleIf": "{hijastrostiene} = 'Item 1'",
          "title": "Cuántos?",
          "isRequired": true,
          "inputType": "number"
        },
        {
          "type": "radiogroup",
          "name": "nietostiene",
          "title": "Nietos?",
          "defaultValue": "Item 2",
          "isRequired": true,
          "choices": [
            {
              "value": "Item 1",
              "text": "Si"
            },
            {
              "value": "Item 2",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "nietostiene_cuantos",
          "visibleIf": "{nietostiene} = 'Item 1'",
          "title": "Cuántos?",
          "isRequired": true,
          "inputType": "number"
        },
        {
          "type": "radiogroup",
          "name": "otrosparientestiene",
          "title": "Otros parientes?",
          "defaultValue": "Item 2",
          "isRequired": true,
          "choices": [
            {
              "value": "Item 1",
              "text": "Si"
            },
            {
              "value": "Item 2",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "otrosparientestiene_cuantos",
          "visibleIf": "{otrosparientestiene} = 'Item 1'",
          "title": "Cuántos?",
          "isRequired": true,
          "inputType": "number"
        },
        {
          "type": "radiogroup",
          "name": "noparientestiene",
          "title": "No parientes?",
          "defaultValue": "Item 2",
          "isRequired": true,
          "choices": [
            {
              "value": "Item 1",
              "text": "Si"
            },
            {
              "value": "Item 2",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "noparientestiene_cuantos",
          "visibleIf": "{noparientestiene} = 'Item 1'",
          "title": "Cuántos?",
          "isRequired": true,
          "inputType": "number"
        },
        {
          "type": "radiogroup",
          "name": "titular_ocupacion",
          "title": "En la actualidad usted es",
          "choices": [
            {
              "value": "56",
              "text": "Trabajador rural"
            },
            {
              "value": "57",
              "text": "Jornalero"
            },
            {
              "value": "58",
              "text": "Desempleado"
            },
            {
              "value": "59",
              "text": "Amediero"
            },
            {
              "value": "61",
              "text": "Trabajador independiente"
            },
            {
              "value": "62",
              "text": "Estudiante"
            },
            {
              "value": "63",
              "text": "Otro"
            }
          ]
        },
        {
          "type": "text",
          "name": "titular_ocupacion_cual",
          "visibleIf": "{titular_ocupacion} = '63'",
          "title": "Cual"
        },
        {
          "type": "radiogroup",
          "name": "titular_educacion",
          "title": "Cual es su nivel educativo actual?",
          "choices": [
            {
              "value": "64",
              "text": "Ninguno"
            },
            {
              "value": "65",
              "text": "Primaria Completa"
            },
            {
              "value": "66",
              "text": "Primaria Incompleta"
            },
            {
              "value": "67",
              "text": "Secundaria Incompleta"
            },
            {
              "value": "68",
              "text": "Secundaria Completa"
            },
            {
              "value": "69",
              "text": "Universitaria / POstgrado"
            },
            {
              "value": "70",
              "text": "Técnica /Tecnología"
            },
            {
              "value": "71",
              "text": "Otra"
            }
          ]
        },
        {
          "type": "radiogroup",
          "name": "titular_salud",
          "title": "A cual regimén de salud pertenece usted",
          "choices": [
            {
              "value": "72",
              "text": "Subsidiado"
            },
            {
              "value": "75",
              "text": "Contributivo"
            },
            {
              "value": "76",
              "text": "Ninguno"
            }
          ]
        },
        {
          "type": "radiogroup",
          "name": "titular_desplazado",
          "title": "En la actualidad usted y/o su núcleo familiar son:",
          "choices": [
            {
              "value": "77",
              "text": "Desplazados desde el 15 de enero"
            },
            {
              "value": "78",
              "text": "Retornados"
            },
            {
              "value": "79",
              "text": "Reinsertados"
            },
            {
              "value": "80",
              "text": "Ninguna"
            }
          ]
        }
      ]
    },
    {
      "name": "page12",
      "elements": [
        {
          "type": "html",
          "name": "question27",
          "title": "De los  siguientes grupos de edad, por favor digame cuantos miembros del hoga hay, hombres y mujeres",
          "html": "<strong>\nDe los  siguientes grupos de edad, por favor digame cuantos miembros del hogar hay, hombres y mujeres\n</strong>"
        },
        {
          "type": "text",
          "name": "mujeres_menosde5",
          "title": "Mujeres  de menos de 5 años",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "hombres_menosde5",
          "startWithNewLine": false,
          "title": "Hombres  de menos de 5 años",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "mujeres_de6a15",
          "title": "Mujeres de 6 a 15 años"
        },
        {
          "type": "text",
          "name": "hombres_de6a15",
          "startWithNewLine": false,
          "title": "Hombres de 6 a 15 años"
        },
        {
          "type": "text",
          "name": "mujeres_de16a25",
          "title": "Mujeres de 16 a 25 años"
        },
        {
          "type": "text",
          "name": "hombres_de16a25",
          "startWithNewLine": false,
          "title": "Hombres de 16 a 25 años"
        },
        {
          "type": "text",
          "name": "mujeres_de26a60",
          "title": "Mujeres de 26 a 60 años",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "hombres_de26a60",
          "startWithNewLine": false,
          "title": "Hombres de 26 a 60 años",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "mujeres_de61a70",
          "title": "Mujeres de 61 a 70"
        },
        {
          "type": "text",
          "name": "hombres_de61a70",
          "startWithNewLine": false,
          "title": "Hombres de 61 a 70"
        },
        {
          "type": "text",
          "name": "mujeres_de70",
          "title": "Mujeres mayores de 70 años"
        },
        {
          "type": "text",
          "name": "hombres_de70",
          "startWithNewLine": false,
          "title": "Hombres mayores de 70 años"
        }
      ]
    },
    {
      "name": "page3",
      "elements": [
        {
          "type": "html",
          "name": "question28",
          "html": "<H4>\nC. Los predios del núcleo familiar\n</H4>"
        },
        {
          "type": "radiogroup",
          "name": "establece_fortalece",
          "title": "¿La línea productiva seleccionada es para establecimiento o fortalecimiento del proyecto productivo?",
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
          "title": "Seleccione una de las siguientes líneas productivas lícitas",
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
          "type": "text",
          "name": "predios_agnos_pertenencia",
          "title": "Cuántos años hace que usted tiene el predio donde realizará el proyecto productivo?",
          "isRequired": true,
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predios_num",
          "title": "En total cuántos predios con cultivos de coca tiene en la actualidad su núcleo familiar ?",
          "isRequired": true,
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predios_hectareas_total",
          "title": "Cuántas hectareas en total tiene esos predios? ",
          "description": "Ingresar número de hectareas",
          "isRequired": true,
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predios_hectareas_coca",
          "title": "Cuántas hectareas en total tiene tiene sembradas en coca?",
          "description": "Ingresar número de hectareas",
          "isRequired": true,
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page4",
      "elements": [
        {
          "type": "radiogroup",
          "name": "interesado_becas",
          "title": "¿Usted o alguien de su núcleo familiar está interesado en acceder a una beca para estudio de carrera técnica o profesional? ",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Si"
            },
            {
              "value": "0",
              "text": "No"
            }
          ]
        },
        {
          "type": "text",
          "name": "interesado_becas_numero",
          "visibleIf": "{interesado_becas} = 1",
          "title": "¿CUANTAS PERSONAS?",
          "isRequired": true
        },
        {
          "type": "matrixdynamic",
          "name": "interesado_becas_carreras",
          "visibleIf": "{interesado_becas} = 1",
          "title": "¿Cuál sería la carrera profesional o técnica que desea estudiar?",
          "isRequired": true,
          "columns": [
            {
              "name": "tipo_carrerera",
              "title": "Tipo",
              "cellType": "dropdown",
              "choices": [
                {
                  "value": "1",
                  "text": "Profesional"
                },
                {
                  "value": "2",
                  "text": "Técnico"
                }
              ]
            },
            {
              "name": "Column 2",
              "title": "Carrera",
              "cellType": "text"
            }
          ],
          "choices": [
            1,
            2,
            3,
            4,
            5
          ]
        },
        {
          "type": "matrixdynamic",
          "name": "nucleo_mayores",
          "title": "Si es estrictamente necesario",
          "description": "Relacione las personas del núcleo familiar e identifique cual de ellas es el beneficiario",
          "columns": [
            {
              "name": "nombres",
              "title": "Nombres",
              "cellType": "text",
              "isRequired": true,
            },
            {
              "name": "apellidos",
              "title": "Apellidos",
              "cellType": "text",
              "isRequired": true,
            },
            {
              "name": "numero_documento",
              "title": "Núm. documento",
              "cellType": "text",
              "isRequired": true,
            },
            {
              "name": "fecha_exp",
              "title": "Fecha exp. cédula",
              "cellType": "text",
              "inputType": "date",
              "isRequired": true,
            },
            {
              "name": "beneficiario",
              "title": "Beneficiario",
              "cellType": "boolean"
            }
          ],
          "choices": [
            1,
            2,
            3,
            4,
            5
          ],
          "rowCount": 0,
          "minRowCount": 0,
          "addRowButtonLocation": "bottom",
          "addRowText": "Agregar nuevo familiar",
          "removeRowText": "Eliminar"
        },
        {
          "type": "radiogroup",
          "name": "interesado_mejora",
          "title": "¿Usted está interesado en ser candidato a mejoramiento de vivienda en el predio donde se encuentra la coca?",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Si"
            },
            {
              "value": "0",
              "text": "No"
            }
          ]
        },
        {
          "type": "file",
          "name": "interesado_mejora_foto",
          "visibleIf": "{interesado_mejora} = 1",
          "title": "Foto de la vivienda a mejorar\n",
          "isRequired": true
        },
        {
          "type": "html",
          "name": "question36",
          "html": "<H4>\n2. Términos y Condiciones para Procesos de Sustitución de Cultivos Ilicitos\n</H4>"
        },
        {
          "type": "html",
          "name": "question38",
          "html": "<strong>\n2.1. Compromisos del núcleo familiar participante\n</strong>\n<p>\nYo en nombre propio y en nombre y representación de las personas incluidas en este formularioque hacen parte de mi núcleo familiar declaro que:\n</p>\n<ul>\n<li>\n- Pertenecemos al mismo núcleo familiar\n</li>\n<li>\n- Entendemos que salvo entre los miembros del núcleo familiar , las prerrogativas y obligaciones surgidas del proceso de sustitución no son transmisibles a ningún título.\n</li>\n</ul>\n<br>\n<p>\nNos comprometemos a:\n</p>"
        },
        {
          "type": "radiogroup",
          "name": "tipo_firma",
          "title": "Firma de aceptación",
          "isRequired": true,
          "choices": [
            {
              "value": "Item 1",
              "text": "Firma manual"
            },
            {
              "value": "Item 2",
              "text": "Subir documento de Firma"
            },
            {
              "value": "Item 3",
              "text": "Contact Center"
            }
          ]
        },
        {
          "type": "signaturepad",
          "name": "firma_manual",
          "visibleIf": "{tipo_firma} = 'Item 1'",
          "title": "Firma de aceptación",
          "isRequired": true,
          "signatureWidth": 500,
          "signatureHeight": 354,
          "placeholder": "Firmar aqui"
        },
        {
          "type": "file",
          "name": "firma_file",
          "visibleIf": "{tipo_firma} = 'Item 2'",
          "title": "Documento de firma",
          "isRequired": true
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

    const personaData = {
      id: dataUser.value.id,
      tipo_identificacion_id: sender.data.titular_tipo_identificacion,
      numero_documento: sender.data.titular_numero_identificacion,
      nombre: sender.data.titular_nombres,
      apellido: sender.data.titular_apellidos,
      fecha_expedicion: sender.data.fecha_expedicion,
      fecha_nacimiento: sender.data.fecha_nacimiento,
      telefono_celular: sender.data.telefono,
      actividad_laboral: sender.data.titular_ocupacion,
      nivel_escolaridad_id: sender.data.titular_educacion,
      tipo_afiliacion_salud_id: sender.data.titular_salud,
      grupo_atencion_especial_dsci_id: sender.data.titular_desplazado,
      num_predios: sender.data.predios_num,
      ha_total_predios: sender.data.predios_hectareas_total,
      ha_total_loteCoca: sender.data.predios_hectareas_coca
    };
    console.log('personaData')
    console.log(personaData)

    const crearComposicionEdad = (tipo_grupo_etario: number, sexo_id: number, valor: any) => {
    const numero = Number(valor);
    if (!isNaN(numero) && numero > 0) {
      uCrud_edades.create({
        persona_id: dataUser.value.id,
        tipo_grupo_etario,
        sexo_id,
        numero,
        fcrea: new Date().toISOString()
      });
    }
  };

  // Menores de 5 años
  crearComposicionEdad(81, 15, sender.data.mujeres_menosde5);
  crearComposicionEdad(81, 16, sender.data.hombres_menosde5);

  // De 6 a 15 años
  crearComposicionEdad(82, 15, sender.data.mujeres_de6a15);
  crearComposicionEdad(82, 16, sender.data.hombres_de6a15);

  // De 16 a 25 años
  crearComposicionEdad(83, 15, sender.data.mujeres_de16a25);
  crearComposicionEdad(83, 16, sender.data.hombres_de16a25);

  // De 26 a 60 años
  crearComposicionEdad(84, 15, sender.data.mujeres_de26a60);
  crearComposicionEdad(84, 16, sender.data.hombres_de26a60);

  // De 61 a 70 años
  crearComposicionEdad(85, 15, sender.data.mujeres_de61a70);
  crearComposicionEdad(85, 16, sender.data.hombres_de61a70);

  // Mayores de 70 años
  crearComposicionEdad(86, 15, sender.data.mujeres_de70);
  crearComposicionEdad(86, 16, sender.data.hombres_de70);
    
  const crearComposicionNucleo = (tipo_composicion_id: number, valor: number) => {
    const numero = Number(valor);
    if (!isNaN(numero) && numero > 0) {
      uCrud_nucleo.create({
        persona_id: dataUser.value.id,
        tipo_composicion_id,
        numero,
        fcrea: new Date().toISOString()
      });
    }
  };

  crearComposicionNucleo(50, sender.data.hijostiene_cuantos);
  crearComposicionNucleo(115, sender.data.hijastrostiene_cuantos);
  crearComposicionNucleo(51, sender.data.nietostiene_cuantos);
  crearComposicionNucleo(54, sender.data.otrosparientestiene_cuantos);
  crearComposicionNucleo(55, sender.data.noparientestiene_cuantos);

  let personaLineaProductivaData;

  if (dataLineaProductiva?.value?.id && dataLineaProductiva.value.id > 0) {
    personaLineaProductivaData = {
      id: dataLineaProductiva.value.id,
      linea_productiva_id: sender.data.linea_productiva,
      tipo_experiencia_id: sender.data.establece_fortalece,
      fmodifica: new Date().toISOString()
    };
    uCrud_linea.update(personaLineaProductivaData);
  } else {
    personaLineaProductivaData = {
      persona_id: dataUser.value.id,
      linea_productiva_id: sender.data.linea_productiva,
      tipo_experiencia_id: sender.data.establece_fortalece,
      experiencia_linea_productiva: 0,
      tiempo_experiencia_linea: 0,
      vinculado_asociacion: 0,
      activa: 1,
      fcrea: new Date().toISOString(),
      origen: 'ficha_catatumbo',
      fmodifica: new Date().toISOString()
    };
    uCrud_linea.create(personaLineaProductivaData);
  }

  


    function resizeBase64ImgAsync(base64: string): Promise<string> {
      return new Promise((resolve) => {
        resizeBase64Img(base64, (resizedImage: string) => {
          resolve(resizedImage);
        });
      });
    }

    async function enviarFormularioPersona() {
      let vivienda_imagen = "";
      let firma = "";

      if (Array.isArray(sender.data.interesado_mejora_foto) && sender.data.interesado_mejora_foto.length > 0) {
        vivienda_imagen = await resizeBase64ImgAsync(sender.data.interesado_mejora_foto[0].content);
      }

      console.log('sender.data.firma_manual')
      console.log(sender.data.firma_manual)

      if (Array.isArray(sender.data.firma_file) && sender.data.firma_file.length > 0) {
        firma = await resizeBase64ImgAsync(sender.data.firma_file[0].content);
      } else if (sender.data.firma_manual && typeof sender.data.firma_manual === 'string') {
        firma = sender.data.firma_manual;
      }

      // if (sender.data.firma_file && sender.data.firma_file.content) {
      //   firma = await resizeBase64ImgAsync(sender.data.firma_file.content);
      // }

      const formularioPersonaData = {
        id: dataFormularioPersona.value.id,
        beca_desea: sender.data.interesado_becas,
        beca_num: sender.data.interesado_becas_numero,
        beca_descrip: sender.data.interesado_becas_carreras != null ? JSON.stringify(sender.data.interesado_becas_carreras) : '',
        vivienda: sender.data.interesado_mejora,
        vivienda_imagen,
        firma
      };

      uCrud_formpersona.update(formularioPersonaData);
      console.log('Datos enviados:', formularioPersonaData);
    }

    enviarFormularioPersona();

    // if (Array.isArray(sender.data.interesado_mejora_foto) && sender.data.interesado_mejora_foto.length > 0) {
    //   resizeBase64Img(sender.data.interesado_mejora_foto[0].content, (resizedImage: any) => {
    //     const formularioPersonaData = {
    //       id: dataFormularioPersona.value.id,
    //       beca_desea: sender.data.interesado_becas,
    //       beca_num: sender.data.interesado_becas_numero,
    //       beca_descrip: sender.data.interesado_becas_carreras != null ? JSON.stringify(sender.data.interesado_becas_carreras) : '',
    //       vivienda: sender.data.interesado_mejora,
    //       vivienda_imagen: resizedImage,
    //       firma: ""
    //     };

    //     // Aquí haces el envío al backend
    //     uCrud_formpersona.update(formularioPersonaData);
    //     console.log('Datos enviados con imagen:', formularioPersonaData);
    //   });
    // } else {
    //   // Si no hay imagen, lo envías directamente
    //   const formularioPersonaData = {
    //     id: dataFormularioPersona.value.id,
    //     beca_desea: sender.data.interesado_becas,
    //     beca_num: sender.data.interesado_becas_numero,
    //     beca_descrip: sender.data.interesado_becas_carreras != null ? JSON.stringify(sender.data.interesado_becas_carreras) : '',
    //     vivienda: sender.data.interesado_mejora,
    //     vivienda_imagen: "",
    //     firma: ""
    //   };

    //   uCrud_formpersona.update(formularioPersonaData);
    //   console.log('Datos enviados sin imagen:', formularioPersonaData);
    // }

    if (Array.isArray(sender.data.nucleo_mayores)) {
      sender.data.nucleo_mayores.forEach((usuariodata: { numero_documento: any; nombres: any; apellidos: any; fecha_exp: any; beneficiario: any; }) => {
        const personaDataVarios = {
          titular_id: dataUser.value.id,
          vinculado_asociacion: 0,
          fecha_nacimiento: "1900-01-01",
          sexo_id: 15,
          discapacidad: 0,
          email: "no email",
          tipo_identificacion_id: 12,
          telefono_celular: "3000000000",
          whatsapp: "3000000000",
          pertenece_comunidad_etnica: 0,
          desplazado_2025: 0,
          cabeza_flia: 0,
          tipo_comunidad_etnica_id: 28,
          numero_documento: usuariodata.numero_documento,
          nombre: usuariodata.nombres,
          apellido: usuariodata.apellidos,
          fecha_expedicion: usuariodata.fecha_exp,
          beneficiario: usuariodata.beneficiario || false,
          num_predios: 0,
          num_nucleo: 0,
          ha_total_predios: 0,
          ha_total_loteCoca: 0,
          menor_edad: 0,
          bloqueado: 0,
          fase: "FASE3",
          estado_id: 1,
          fcrea: dataUser.value.fcrea,
          fecha_estado: dataUser.value.fecha_estado,
          origen: 'ficha_catatumbo',
        };

        uCrud_persona.create(personaDataVarios);
        console.log(personaDataVarios);
      });
    }


    uCrud_persona.update(personaData)
        .then((item:any) => {
            

            uToast.toastSuccess("Su formulario ha sido guardado correctamente.");
            sender.clear(true);
            // survey.showNavigationButtons = false;
        })
        .catch((error) => {
              uToast.toastError("Ocurrió un error al guardar su formulario. Por favor, inténtelo de nuevo.");
        });

      return false;
  });


  survey.onValueChanged.add(async (sender, options) => {
    if (options.name === "interesado_mejora_foto") {
      console.log('options.value')
      console.log(options.value)
    }
    if (options.name === "titular_numero_identificacion") {
      if (options.value === null || options.value === "")
        return;
        const loading = uLoading.show({});
        axios.get(`/api/2.0/nucleo/ficha/catatumbo/validar_documento/?documento=${options.value}`)
        .then((resp: any) => {
          console.log(resp)
          getLineaProductiva(resp.data.data.id)
          getFormularioPersona(resp.data.data.id)
          if (resp.data && resp.data.status===1 ) {
            console.log('resp.data')
            console.log(resp.data.data.nombre)
            dataUser.value = resp.data.data
            console.log(dataUser.value.id)
            // titular_nombres
            survey.setValue('titular_nombres', resp.data.data.nombre || "");
            survey.setValue('titular_apellidos', resp.data.data.apellido || "");
            survey.setValue('fecha_nacimiento', resp.data.data.fecha_nacimiento || "");
            survey.setValue('fecha_expedicion', resp.data.data.fecha_expedicion || "");
            survey.setValue('telefono', resp.data.data.telefono_celular || "");
            survey.setValue('titular_tipo_identificacion', resp.data.data.tipo_identificacion_id || "");
          }else{
            survey.setValue('titular_nombres', "");
            uToast.toastError("Número de cedula no se encuentra en Pre- Registro");
            survey.setValue('titular_numero_identificacion', "");
          }
          loading.hide();
        })   
        // const response = await axios.get(`/api/2.0/nucleo/ubicacion/by-id/${ubicacionId}/`);
    }

    // const match = options.name.match(/^persona(\d+)_num_identificación$/);
  
    // if (match) {
    //   const personaIndex = match[1]; // Extrae el número de persona (1-10)

    //   if (!options.value) return;

    //   try {
    //     let loader = uLoading.show({});
    //     if (parseInt(options.value) < 2000000000) {
    //       const response = await axios.get(`forms/catatumbo/ficha/validar_nucleo/?documento=${options.value}`);
    //       console.log(response);

    //       const status = response.data.status;
    //       const mostrarKey = `mostrar_persona${personaIndex}`; // Genera la clave correcta

    //       if (status > 1) {
    //         survey.setVariable(mostrarKey, false);
    //         survey.setValue(options.name, ""); // Borra el número de identificación

    //         let mensajeError = "";
    //         switch (status) {
    //           case 2:
    //             mensajeError = "Usuario con ficha de acuerdo diligenciada. No se puede ingresar como núcleo familiar.";
    //             break;
    //           case 3:
    //             mensajeError = "Usuario se encuentra entre los validados para firma de ficha de acuerdo Catatumbo. No se puede ingresar como núcleo familiar.";
    //             break;
    //           case 4:
    //             mensajeError = "El usuario ha sido titular en el proyecto PNIS. No se puede ingresar como núcleo familiar.";
    //             break;
    //           case 5:
    //             mensajeError = "El usuario ya aparece como nucleo familiar de otro titular. No se puede ingresar como núcleo familiar.";
    //             break;
    //         }

    //         if (mensajeError) uToast.toastError(mensajeError);
    //       } else {
    //         survey.setVariable(mostrarKey, true);
    //       }
    //     } else {
    //       const mostrarKey = `mostrar_persona${personaIndex}`;
    //       survey.setVariable(mostrarKey, false)
    //       survey.setValue(options.name, "");
    //       uToast.toastError("Digite un número de cedula valido");
    //     }
    //     loader.hide();
    //   } catch (error) {
    //     console.error("Error al consultar el endpoint:", error);
    //   }
    // }

    // if (options.name === "titular_numero_documento") {
    //   if (options.value === null || options.value === "")
    //     return;
    //     axios.get(`/api/2.0/nucleo/forms/catatumbo/validar_documento/?documento=${options.value}`)
    //     .then((resp: any) => {
    //       console.log(resp)
    //       if (resp.data) {
    //           survey.setValue("titular_numero_identificacion", "");
    //          uToast.toastError("Número de cedula no se encuentra en preregistro");
    //       }

    //     })   
    //     // const response = await axios.get(`/api/2.0/nucleo/ubicacion/by-id/${ubicacionId}/`);
    // }

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




    
    const municipioNucleoQuestion = survey.getQuestionByName("municipio_nucleo_familiar");
    const corregimientoQuestion = survey.getQuestionByName("corregimiento");
    const veredaQuestion = survey.getQuestionByName("vive_vereda");
    const desplazadoveredaQuestion = survey.getQuestionByName("desplazado_vereda");
    const prediococaveredaQuestion = survey.getQuestionByName("predio_coca_vereda");
    const prediococaotroveredaQuestion = survey.getQuestionByName("predio_coca_otro_vereda");

    if (options.name === "vive_municipio") {
        const municipio_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(municipio_id);
          if (veredaQuestion) {
            veredaQuestion.choices = itemsVillages.value
          }
        loading.hide()
    }

    if (options.name === "desplazado_municipio") {
        const municipio_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(municipio_id);
          if (desplazadoveredaQuestion) {
            desplazadoveredaQuestion.choices = itemsVillages.value
          }
        loading.hide()
    }

    if (options.name === "predio_coca_municipio") {
        const municipio_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(municipio_id);
          if (prediococaveredaQuestion) {
            prediococaveredaQuestion.choices = itemsVillages.value
          }
        loading.hide()
    }

    if (options.name === "predio_coca_otro_municipio") {
        const municipio_id = options.value;
        let loading = uLoading.show({});
        await getVillageList(municipio_id);
          if (prediococaotroveredaQuestion) {
            prediococaotroveredaQuestion.choices = itemsVillages.value
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