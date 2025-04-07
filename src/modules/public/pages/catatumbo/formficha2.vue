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

  const uCrud = useCrud("api/2.0/nucleo/persona");
  const uCrud2 = useCrud("api/2.0/nucleo/formpersona");
  const uCrud3 = useCrud("api/2.0/nucleo/personaadjunto");
  const uCrud4 = useCrud("api/2.0/nucleo/predio");
  const uCrud5 = useCrud("api/2.0/nucleo/personalinea");
  const uCrud6 = useCrud("api/2.0/nucleo/coordenada");

  const uToast = useToast();

  const itemsVillages = ref<Array<{ id: number; label: string }>>([]);
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
          "name": "titular_tipo_identificacion_cual",
          "visibleIf": "{titular_tipo_identificacion} = 'Item 2'",
          "title": "Cuál"
        },
        {
          "type": "text",
          "name": "titular_numero_identificacion",
          "title": "Número de identificación",
          "description": "No se permite tarjeta de identificación ni registro civil"
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
          "name": "titular_ocupacion",
          "title": "En la actualidad usted es",
          "choices": [
            {
              "value": "Item 1",
              "text": "Trabajador rural"
            },
            {
              "value": "Item 2",
              "text": "Jornalero"
            },
            {
              "value": "Item 3",
              "text": "Desempleado"
            },
            {
              "value": "Item 4",
              "text": "Amediero"
            },
            {
              "value": "Item 5",
              "text": "Trabajador independiente"
            },
            {
              "value": "Item 6",
              "text": "Estudiante"
            },
            {
              "value": "Item 7",
              "text": "Otro"
            }
          ]
        },
        {
          "type": "text",
          "name": "titular_ocupacion_cual",
          "visibleIf": "{titular_ocupacion} = 'Item 7'",
          "title": "Cual"
        },
        {
          "type": "radiogroup",
          "name": "titular_educacion",
          "title": "Cual es su nivel educativo actual?",
          "choices": [
            {
              "value": "Item 1",
              "text": "Ninguno"
            },
            {
              "value": "Item 2",
              "text": "Primaria Completa"
            },
            {
              "value": "Item 3",
              "text": "Primaria Incompleta"
            },
            {
              "value": "Item 4",
              "text": "Secundaria Incompleta"
            },
            {
              "value": "Item 5",
              "text": "Secundaria Completa"
            },
            {
              "value": "Item 6",
              "text": "Universitaria / POstgrado"
            },
            {
              "value": "Item 7",
              "text": "Técnica /Tecnología"
            },
            {
              "value": "Item 8",
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
              "value": "Item 1",
              "text": "Subsidiado"
            },
            {
              "value": "Item 2",
              "text": "Contributivo"
            },
            {
              "value": "Item 3",
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
              "value": "Item 1",
              "text": "Desplazados desde el 15 de enero"
            },
            {
              "value": "Item 2",
              "text": "Retornados"
            },
            {
              "value": "Item 3",
              "text": "Reinsertados"
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
          "type": "text",
          "name": "predios_agnos_pertenencia",
          "title": "Cuántos años hace que usted tiene el predio donde realizará el proyecto productivo?",
          "isRequired": true,
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "predios_num",
          "title": "En total cuántos predios con cultivos de coca tiene en la actualidad su nuúcleo familiar ?",
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
          "type": "matrixdynamic",
          "name": "nucleo_mayores",
          "title": "Si es estrictamente necesario",
          "description": "Por favor registre el número del documento de identidad de las personas del núcleo familiar mayores de 18 años",
          "columns": [
            {
              "name": "Nombres",
              "cellType": "text"
            },
            {
              "name": "Apellidos",
              "cellType": "text"
            },
            {
              "name": "Número",
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
          "type": "text",
          "name": "beneficiario_nombres",
          "title": "Registre el nombre del BENEFICIARIO del representante del Núcleo familiar",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "beneficiario_apellidos",
          "title": "Registre el documento de identidad del BENEFICIARIO del representante del Núcleo familiar",
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
            }
          ]
        },
        {
          "type": "signaturepad",
          "name": "question3",
          "visibleIf": "{tipo_firma} = 'Item 1'",
          "title": "Firma de aceptación",
          "isRequired": true,
          "signatureWidth": 500,
          "signatureHeight": 354,
          "placeholder": "Firmar aqui"
        },
        {
          "type": "file",
          "name": "question5",
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
      console.log('sender.data')
      console.log(sender.data)

     

      const personaData = {
        tipo_identificacion_id: sender.data.titular_tipo_identificacion,
        numero_documento: sender.data.titular_numero_documento,
        nombre: sender.data.titular_nombres,
        apellido: sender.data.titular_apellidos,
        fecha_expedicion: sender.data.titular_fecha_expedicion,
        fecha_nacimiento: sender.data.titular_fecha_nacimiento,
        sexo_id: sender.data.titular_sexo,
        email: sender.data.titular_email,
        telefono_celular: sender.data.titular_celular,
        whatsapp: sender.data.titular_whatsapp,
        tipo_comunidad_etnica_id: sender.data.tipo_comunidad_etnica,
        nombre_comunidad: sender.data.tipo_comunidad_etnica_nombre,
        pertenece_comunidad_etnica: sender.data.tipo_comunidad_etnica !== null ? 1 : 0, 
        desplazado_2025: sender.data.desplazado_2025,
        cabeza_flia: sender.data.titular_cabeza_familia,
        num_nucleo: sender.data.num_nucleo,
        bloqueado:0,
        vinculado_asociacion:0,
        estado_id: 1,
        fase:1,
        discapacidad:0,
        fcrea: new Date().toISOString(),
        fecha_estado: new Date().toISOString() 
    };
    console.log('personaData')
    console.log(personaData)

    const formularioPersonaData = {
        formulario_id: 1,
        tiene_coca: sender.data.tiene_coca?1:0,
        persona_id: 0,
        acepta_terminos: 1,
        acepta_tratamiento_datos: 1,
        fcrea: new Date().toISOString(),
        fecha_aceptacion: new Date().toISOString() 
    };
    // persona_id
    console.log('sender.data.titular_foto_cara')
    console.log(sender.data.titular_foto_cara)
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
    };
    if (Array.isArray(sender.data.titular_foto_contracara) && sender.data.titular_foto_contracara.length > 0) {
      resizeBase64Img(sender.data.titular_foto_contracara[0].content, (resizedImage:any) => {
        personaAdjuntoData2.ruta = resizedImage;
        console.log('transformado')
      });
    }
    console.log('sender.data.vive_vereda')
    console.log(sender.data.vive_vereda)
    console.log(sender.data.vive_municipio)
    console.log(sender.data.predio_coca_vive)
    console.log(sender.data.predio_coca_ubicacion)

    const predioLoteViveData = {
        persona_id: 0,
        ubicacion_id: sender.data.vive_vereda != null ? sender.data.vive_vereda : sender.data.vive_municipio,
        cabecera: sender.data.vive_lugar === "1" ? 1 : 0,
        centro_poblado: sender.data.viveLugar === "2" ? 1 : 0,
        corregimiento: sender.data.viveLugar === "3" ? 1 : 0,
        vereda: sender.data.viveLugar === "4" ? 1 : 0,
        direccion: sender.data.viveLugar === "4" ? sender.data.vive_vereda_otra : sender.data.vive_direccion,
        residencia: 1,
        lotecoca:sender.data.predio_coca_vive? 1 : 0,
        area_total_hectareas: sender.data.predio_coca_area_total,
        area_cultivo_hectareas: sender.data.predio_coca_area_cultivo,
        proyecto_productivo: 0,
        tipo_relacion_predio_id: parseInt(sender.data.predio_coca_tipo_residencia),
        documento_relacion_predio: "",
        origen: 'preregistro_catatumbo'
    };

    // Si hay un documento en Base64, lo redimensionamos
    if (Array.isArray(sender.data.predio_coca_tipo_documento) && sender.data.predio_coca_tipo_documento.length > 0) {
      resizeBase64Img(sender.data.predio_coca_tipo_documento[0].content, (resizedImage:any) => {
        predioLoteViveData.documento_relacion_predio = resizedImage;
        console.log('transformado')
      });
    }

    const coordenadaLoteCocaData = {
        predio_id: 0,
        latitud: sender.data.predio_coca_latitud,
        longitud: sender.data.predio_coca_longitud,
        altitud: sender.data.predio_coca_altitud,
        precision: sender.data.predio_coca_precision,
        origen: 'preregistro_catatumbo',
        fcrea: new Date().toISOString()
    };

    const predioLoteDesplazadoData = {
        persona_id: 0,
        ubicacion_id: sender.data.desplazado_vereda != null ? sender.data.desplazado_vereda : sender.data.desplazado_municipio,
        cabecera: sender.data.deplazado_lugar === "1" ? 1 : 0,
        centro_poblado: sender.data.deplazado_lugar === "2" ? 1 : 0,
        corregimiento: sender.data.deplazado_lugar === "3" ? 1 : 0,
        vereda: sender.data.deplazado_lugar === "4" ? 1 : 0,
        direccion: sender.data.deplazado_lugar === "4" ? sender.data.desplazado_otra_vereda : sender.data.desplazado_lugar_direccion,
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
        ubicacion_id: sender.data.predio_coca_vereda != null ? sender.data.predio_coca_vereda : sender.data.predio_coca_municipio,
        cabecera: sender.data.predio_coca_lugar === "1" ? 1 : 0,
        centro_poblado: sender.data.predio_coca_lugar === "2" ? 1 : 0,
        corregimiento: sender.data.predio_coca_lugar === "3" ? 1 : 0,
        vereda: sender.data.predio_coca_lugar === "4" ? 1 : 0,
        direccion: sender.data.predio_coca_lugar === "4" ? sender.data.predio_coca_vereda_otra : sender.data.predio_coca_lugar_direccion,
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

    console.log('predioLoteCocaData')
    console.log(predioLoteCocaData)

    const predioLoteCocaOtroData = {
        persona_id: 0,
        ubicacion_id: sender.data.predio_coca_otro_vereda != null ? sender.data.predio_coca_otro_vereda : sender.data.predio_coca_otro_municipio,
        cabecera: sender.data.predio_coca_otro_lugar === "1" ? 1 : 0,
        centro_poblado: sender.data.predio_coca_otro_lugar === "2" ? 1 : 0,
        corregimiento: sender.data.predio_coca_otro_lugar === "3" ? 1 : 0,
        vereda: sender.data.predio_coca_otro_lugar === "4" ? 1 : 0,
        direccion: sender.data.predio_coca_otro_lugar === "4" ? sender.data.predio_coca_otro_vereda_otra : sender.data.predio_coca_otro_direccion,
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
        console.log('transformado')
      });
    }

    const personaLineaProductivaData = {
        persona_id: sender.data.Persona_Id,
        linea_productiva_id: sender.data.linea_productiva,
        tipo_experiencia_id: sender.data.establece_fortalece,
        experiencia_linea_productiva: 0,
        vinculado_asociacion: 0,
        activa: 1,
        fcrea: new Date().toISOString(),
        origen: 'preregistro_catatumbo',
        fmodifica: new Date().toISOString()
    };
    console.log('personaData')
    console.log(personaData)


    uCrud.create(personaData)
        .then((item:any) => {
            formularioPersonaData.persona_id = item.id
            console.log(item)
            uCrud2.create(formularioPersonaData).then((item2:any) => {
              console.log(item2)
            })
            personaAdjuntoData1.persona_id = item.id
            uCrud3.create(personaAdjuntoData1).then((item3:any) => {
              console.log(item3)
            })
            personaAdjuntoData2.persona_id = item.id
            uCrud3.create(personaAdjuntoData2).then((item4:any) => {
              console.log(item4)
            })

            predioLoteViveData.persona_id = item.id
            console.log('predioLoteViveData')
            console.log(predioLoteViveData)
            uCrud4.create(predioLoteViveData).then((item6:any) => {
              console.log('entra al primero')
              console.log(item6)
              coordenadaLoteCocaData.predio_id = item6.id
              uCrud6.create(coordenadaLoteCocaData).then((item8:any) => {})
            })
            console.log('predioLoteDesplazadoData')
            console.log(sender.data.desplazado_2025)
            console.log(predioLoteDesplazadoData)
            if (sender.data.desplazado_2025) {
              predioLoteDesplazadoData.persona_id = item.id
              uCrud4.create(predioLoteDesplazadoData).then((item61:any) => {
                console.log(item61)
                coordenadaLoteCocaData.predio_id = item61.id
                uCrud6.create(coordenadaLoteCocaData).then((item8:any) => {})
              })

            }
            console.log('predioLoteCocaData')
            console.log(sender.data.predio_coca_vive)
            console.log(predioLoteCocaData)

            predioLoteCocaData.persona_id = item.id
            uCrud4.create(predioLoteCocaData).then((item6:any) => {
              console.log(item6)
              coordenadaLoteCocaData.predio_id = item6.id
              uCrud6.create(coordenadaLoteCocaData).then((item8:any) => {})
            })

            console.log('predioLoteCocaOtroData')
            console.log(sender.data.predio_coca_ubicacion)
            console.log(predioLoteCocaOtroData)

            if (sender.data.predio_coca_ubicacion==='2') {
              predioLoteCocaOtroData.persona_id = item.id
              uCrud4.create(predioLoteCocaOtroData).then((item7:any) => {
                console.log(item7)
                coordenadaLoteCocaData.predio_id = item7.id
                uCrud6.create(coordenadaLoteCocaData).then((item8:any) => {})
              })
            }


            personaLineaProductivaData.persona_id = item.id
            uCrud5.create(personaLineaProductivaData).then((item5:any) => {
              console.log(item5)
            })
            // const personas= []// Define personas como un objeto con claves dinámicas

            // for (let i = 1; i <= 10; i++) {
            //     if (senderData[`persona${i}_nombre`]) { // Verifica si existen datos
            //         personas.push({
            //             ficha: ( item as any).id,
            //             nombre: senderData[`persona${i}_nombre`],
            //             tipo_identificacion: senderData[`persona${i}_tipo_identificacion`],
            //             numero_identificacion: senderData[`persona${i}_num_identificación`],
            //             fecha_expedicion_identificacion: senderData[`persona${i}_fecha_expedicion_identificacion`],
            //             parentesco: senderData[`persona${i}_parentesco`],
            //             foto_doc_atras: Array.isArray(senderData[`persona${i}_foto_doc_atras`]) && senderData[`persona${i}_foto_doc_atras`].length > 0 ? senderData[`persona${i}_foto_doc_atras`][0].content : "",
            //             foto_doc_frente: Array.isArray(senderData[`persona${i}_foto_doc_frente`]) && senderData[`persona${i}_foto_doc_frente`].length > 0 ? senderData[`persona${i}_foto_doc_frente`][0].content : "",
            //             parentesco_otro: senderData[`persona${i}_parentesco_cual`],
            //             fecha_nacimiento: senderData[`persona${i}_fecha_nacimiento`],
            //             sexo: senderData[`persona${i}_sexo`],
            //             estado_civil: senderData[`persona${i}_estado_civil`],
            //             grupo_especial: senderData[`persona${i}_atencion_especial`]
            //         });
            //     }
            // }
            // personasNUcleo.value = personas;
            // console.log(personas)
            // enviarNucleoFamiliar();

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