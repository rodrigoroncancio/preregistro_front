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

  const uCrud = useCrud("forms/catatumbo/preinscripcionnucleosindividuales");
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

  onMounted(async () => {
    getDepartmentList();
  });

  const json = {
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
              "type": "boolean",
              "name": "ocupacion_beneficiario",
              "title": "¿Tiene, posee u ocupa usted un predio con presencia de cultivos de uso ilícito del cual depende su subsistencia?",
              "description": "Seleccione una opción.",
              "isRequired": true,
              "labelTrue": "Si"
            }
          ]
        },
        {
          "name": "page2",
          "visibleIf": "{ocupacion_beneficiario} = true",
          "elements": [
            {
              "type": "text",
              "name": "numero_documento",
              "title": "Ingrese el número de documento",
              "description": "Digite el número de documento sin puntos \".\" ni comas \",\""
            },
            {
              "type": "boolean",
              "name": "victimas_desplazamiento",
              "title": "¿Ha sido victima de desplazamiento forzado con fecha igual o posterior al 15 de enero de 2025?\n",
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
              "type": "radiogroup",
              "name": "actividad_transito",
              "title": "Actividad económica para el tránsito a economías lícitas",
              "description": "Seleccione una opción.",
              "choices": [
                "Agropecuaría",
                "No Agropecuaría"
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
              "visibleIf": "{actividad_transito} = 'Agropecuaría'",
              "html": "<h4>Actividades económicas agropecuarias</h4>\n"
            },
            {
              "type": "html",
              "name": "question3",
              "visibleIf": "{actividad_transito} = 'No Agropecuaría'",
              "html": "<h4>Actividades económicas no agropecuarias</h4>\n"
            },
            {
              "type": "radiogroup",
              "name": "actividad_etapa",
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
              "visibleIf": "{actividad_transito} = 'No Agropecuaría'",
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
              "inputType": "number",
              "max": 99
            },
            {
              "type": "boolean",
              "name": "tiene_formacion",
              "title": "¿Tiene formación en esta actividad económica?",
              "description": "No dejar en blanco.",
              "isRequired": true,
              "labelTrue": "Si"
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
                "Item 1",
                "Item 2",
                "Item 3"
              ]
            },
            {
              "type": "dropdown",
              "name": "municipio",
              "title": "Municipio",
              "description": "Seleccione una opción.",
              "isRequired": true,
              "choices": [
                "Sin municipio"
              ]
            },
            {
              "type": "text",
              "name": "cabecera_centropoblado",
              "title": "Cabecera municipal o centro poblado",
              "description": "No dejar en blanco.",
              "isRequired": true
            },
            {
              "type": "text",
              "name": "direccion",
              "title": "Dirección",
              "description": "Dirección o breve descripción de acceso",
              "isRequired": true
            }
          ]
        },
        {
          "name": "page6",
          "elements": [
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
                "Cédula de Ciudadanía",
                "Permiso Especial de Permanencia (PEP)"
              ]
            },
            {
              "type": "text",
              "name": "beneficiario_identificacion",
              "title": "Número de documento",
              "description": "Digite el número de documento sin puntos \".\" ni comas \",\"\n",
              "isRequired": true
            },
            {
              "type": "file",
              "name": "foto_frente",
              "title": "Foto del frente del documento.",
              "description": "Tomar la foto de manera que los datos sean legibles"
            },
            {
              "type": "file",
              "name": "foto_respaldo",
              "title": "Foto del respaldo del documento.",
              "description": "Tomar la foto de manera que los datos sean legibles"
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
              "type": "boolean",
              "name": "tiene_identidad_genero",
              "title": "¿Tiene identidad de género y/o orientación sexual diversa (OSIGD)?",
              "description": "Seleccione una opción.",
              "labelTrue": "Si"
            },
            {
              "type": "text",
              "name": "numero_celular",
              "title": "Número de teléfono celular"
            },
            {
              "type": "text",
              "name": "email",
              "title": "Correo electrónico",
              "inputType": "email"
            }
          ]
        },
        {
          "name": "page7",
          "elements": [
            {
              "type": "radiogroup",
              "name": "etnia_identificacion",
              "title": "¿Usted se identifica como miembro de una comunidad étnica o de alguna de las poblaciones que se describen a continuación? (Sujeto de especial protección)",
              "description": "Seleccione una opción. Va dirigida a todo el núcleo familiar.\n",
              "choices": [
                "Indígena",
                "Comunidad Negra o Afrocolombiano",
                "Raizal",
                "Palenquero",
                "Rrom (Gitano)",
                {
                  "value": "Campesino",
                  "text": "Campesino no perteneciente a las anteriores etnias"
                },
                "Ninguno"
              ]
            },
            {
              "type": "radiogroup",
              "name": "organizacion_pertenece",
              "title": "La organización a la cual pertenece corresponde a:",
              "description": "Seleccione una opción.\n",
              "choices": [
                "Comunidad indígena sin territorio formalmente constituido",
                "Asociación de comunidad negra sin territorio formalmente titulado",
                "Un Consejo Comunitario formalmente titulado",
                "Un resguardo",
                "Zona de Reserva Campesina",
                "Junta de Acción Comunal",
                "No Aplica"
              ]
            },
            {
              "type": "text",
              "name": "resguardo_nombre",
              "title": "¿Cuál es el nombre completo del resguardo, consejo comunitario, zona de reserva campesina o junta de acción comunal a la que pertenece?",
              "description": "No dejar en blanco. Si no se dispone del dato, escribir NA. Precisar el tipo de organización a la que pertenece (RI, CC, ZRC, JAC, Cabildo, Asociación)",
              "isRequired": true
            },
            {
              "type": "radiogroup",
              "name": "ubicado_territorio_etnico",
              "title": "¿El predio, lote o parcela en donde va implementar su actividad económica está ubicado en un territorio étnico formalmente constituido (titulado) o no formalmente constituido (pretendido)?",
              "isRequired": true,
              "choices": [
                "Si",
                "No",
                "No Sabe"
              ]
            },
            {
              "type": "radiogroup",
              "name": "condicion",
              "title": "Condición",
              "description": "Seleccione una opción. Va dirigida a todo el núcleo familiar.\n",
              "isRequired": true,
              "choices": [
                "Víctima",
                "Desplazado",
                "Ninguno"
              ]
            },
            {
              "type": "boolean",
              "name": "discapacidad",
              "title": "Persona con discapacidad",
              "description": "Seleccione una opción.\n",
              "isRequired": true,
              "labelTrue": "Si"
            },
            {
              "type": "radiogroup",
              "name": "educacion",
              "visibleIf": "{discapacidad} allof ['Otro']",
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
            }
          ]
        },
        {
          "name": "page8",
          "elements": [
            {
              "type": "text",
              "name": "num_personas_nucleo",
              "title": "¿Cuántas personas componen su núcleo familiar?",
              "description": "Digite el número de personas sin puntos \".\" ni comas \",\"\n",
              "isRequired": true,
              "inputType": "number"
            },
            {
              "type": "text",
              "name": "num_doc_personas_nucleo",
              "title": "Ingrese el número de documento de las personas que componen su núcleo familiar",
              "description": "Incluir todos los documentos separados por guion (-).\n"
            },
            {
              "type": "text",
              "name": "nombres_apellidos_nucleo",
              "title": "Ingrese los nombre y apellidos de las personas que componen su núcleo familiar",
              "description": "Incluir todos los nombre completos separados por guion (-).\n\n"
            }
          ]
        },
        {
          "name": "page9",
          "elements": [
            {
              "type": "html",
              "name": "question10",
              "html": "<h4>Predios a incribir con cultivo de uso ilícito</h4>\n"
            },
            {
              "type": "text",
              "name": "num_predios",
              "title": "¿Cuántos predios tiene, posee u ocupa con presencia de cultivos de uso ilícito?",
              "inputType": "number"
            },
            {
              "type": "radiogroup",
              "name": "num_predios_relevancia",
              "title": "Ubique hasta los 5 predios de mayor relevancia",
              "choices": [
                "1 Predio",
                "2 Predio",
                "3 Predio",
                "4 Predio",
                "5 Predio"
              ]
            }
          ]
        },
        {
          "name": "page10",
          "visibleIf": "{num_predios_relevancia} = '1 Predio' or {num_predios_relevancia} = '2 Predio' or {num_predios_relevancia} = '3 Predio' or {num_predios_relevancia} = '4 Predio' or {num_predios_relevancia} = '5 Predio'",
          "elements": [
            {
              "type": "html",
              "name": "question14",
              "html": "<h4>Identificación Predio 1</h4>\n"
            },
            {
              "type": "radiogroup",
              "name": "municipio_predio1",
              "title": "Municipio",
              "choices": [
                {
                  "value": "787",
                  "text": "CONVENCION"
                },
                {
                  "value": "791",
                  "text": "EL TARRA"
                },
                {
                  "value": "811",
                  "text": "SARDINATA"
                },
                {
                  "value": "814",
                  "text": "TIBÚ"
                }
              ]
            },
            {
              "type": "dropdown",
              "name": "vereda_predio1",
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
              "name": "vereda_otro_predio1",
              "visibleIf": "{vereda_predio1} = 'otro'",
              "title": "Si seleccionó en la respuesta anterior \"Otro\", mencione cual",
              "description": "No dejar en blanco.\n"
            },
            {
              "type": "text",
              "name": "descripcion_predio1",
              "title": "Descripción de acceso al predio o punto de referencia",
              "description": "Breve descripción de acceso. Tiempo desde la cabecera municipal hasta la finca.\nAcceso en vehículo cuanto tiempo, en animal o a pie cuanto tiempo.\n"
            },
            {
              "type": "text",
              "name": "nombre_predio1",
              "title": "Nombre del predio",
              "description": "Nombre de la finca que postula\n"
            },
            {
              "type": "text",
              "name": "area_predio1",
              "title": "Área total del predio en hectáreas",
              "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
              "inputType": "number"
            },
            {
              "type": "text",
              "name": "area_coca_predio1",
              "title": "¿Qué área en hectáreas de hoja de coca tiene en su predio?",
              "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
              "inputType": "number"
            },
            {
              "type": "radiogroup",
              "name": "relacion_tenencia_predio1",
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
              "type": "file",
              "name": "foto_relacion_predio1",
              "title": "Foto del documento que valide la relación de tenencia",
              "description": "Tomar la foto de manera que los datos sean legibles"
            },
            {
              "type": "text",
              "name": "longitud_predio1",
              "minWidth": "150px",
              "title": "Longitud"
            },
            {
              "type": "text",
              "name": "latitud_predio1",
              "minWidth": "150px",
              "title": "Latitud"
            },
            {
              "type": "text",
              "name": "altitud_predio1",
              "minWidth": "150px",
              "title": "Altitud"
            },
            {
              "type": "text",
              "name": "precision_predio1",
              "minWidth": "150px",
              "title": "Precisión"
            }
          ]
        },
        {
          "name": "page11",
          "visibleIf": "{num_predios_relevancia} = '2 Predio' or {num_predios_relevancia} = '3 Predio' or {num_predios_relevancia} = '4 Predio' or {num_predios_relevancia} = '5 Predio'",
          "elements": [
            {
              "type": "html",
              "name": "question9",
              "html": "<h4>Identificación Predio 2</h4>\n"
            },
            {
              "type": "radiogroup",
              "name": "municipio_predio2",
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
              "name": "vereda_predio2",
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
              "name": "vereda_otro__predio2",
              "visibleIf": "{vereda_predio2} = 'otro'",
              "title": "Si seleccionó en la respuesta anterior \"Otro\", mencione cual",
              "description": "No dejar en blanco.\n"
            },
            {
              "type": "text",
              "name": "descripcion_acceso__predio2",
              "title": "Descripción de acceso al predio o punto de referencia",
              "description": "Breve descripción de acceso. Tiempo desde la cabecera municipal hasta la finca.\nAcceso en vehículo cuanto tiempo, en animal o a pie cuanto tiempo.\n"
            },
            {
              "type": "text",
              "name": "nombre_predio2",
              "title": "Nombre del predio",
              "description": "Nombre de la finca que postula\n"
            },
            {
              "type": "text",
              "name": "area_total__predio2",
              "title": "Área total del predio en hectáreas",
              "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
              "inputType": "number"
            },
            {
              "type": "text",
              "name": "area_coca_predio2",
              "title": "¿Qué área en hectáreas de hoja de coca tiene en su predio?",
              "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
              "inputType": "number"
            },
            {
              "type": "radiogroup",
              "name": "relacion_tenencia_predio2",
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
              "type": "file",
              "name": "foto_relacion_predio2",
              "title": "Foto del documento que valide la relación de tenencia",
              "description": "Tomar la foto de manera que los datos sean legibles"
            },
            {
              "type": "text",
              "name": "longitud_predio2",
              "minWidth": "150px",
              "title": "Longitud"
            },
            {
              "type": "text",
              "name": "latitud_predio2",
              "minWidth": "150px",
              "title": "Latitud"
            },
            {
              "type": "text",
              "name": "altitud_predio2",
              "minWidth": "150px",
              "title": "Altitud"
            },
            {
              "type": "text",
              "name": "precision_predio2",
              "minWidth": "150px",
              "title": "Precisión"
            }
          ]
        },
        {
          "name": "page12",
          "visibleIf": "{num_predios_relevancia} = '3 Predio' or {num_predios_relevancia} = '4 Predio' or {num_predios_relevancia} = '5 Predio'",
          "elements": [
            {
              "type": "html",
              "name": "question11",
              "html": "<h4>Identificación Predio 3</h4>\n"
            },
            {
              "type": "radiogroup",
              "name": "municipio_predio3",
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
              "name": "vereda_predio3",
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
              "name": "vereda_otro_predio3",
              "visibleIf": "{vereda_predio3} = 'otro'",
              "title": "Si seleccionó en la respuesta anterior \"Otro\", mencione cual",
              "description": "No dejar en blanco.\n"
            },
            {
              "type": "text",
              "name": "acceso_predio3",
              "title": "Descripción de acceso al predio o punto de referencia",
              "description": "Breve descripción de acceso. Tiempo desde la cabecera municipal hasta la finca.\nAcceso en vehículo cuanto tiempo, en animal o a pie cuanto tiempo.\n"
            },
            {
              "type": "text",
              "name": "nombre_predio3",
              "title": "Nombre del predio",
              "description": "Nombre de la finca que postula\n"
            },
            {
              "type": "text",
              "name": "area_predio3",
              "title": "Área total del predio en hectáreas",
              "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
              "inputType": "number"
            },
            {
              "type": "text",
              "name": "area_coca_predio3",
              "title": "¿Qué área en hectáreas de hoja de coca tiene en su predio?",
              "description": "No dejar en blanco, utilizar punto (.) para separar decimales",
              "inputType": "number"
            },
            {
              "type": "radiogroup",
              "name": "relacion_tenencia_predio3",
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
              "type": "file",
              "name": "foto_relacion_predio3",
              "title": "Foto del documento que valide la relación de tenencia",
              "description": "Tomar la foto de manera que los datos sean legibles"
            },
            {
              "type": "text",
              "name": "longitud_predio3",
              "minWidth": "150px",
              "title": "Longitud"
            },
            {
              "type": "text",
              "name": "latitud_predio3",
              "minWidth": "150px",
              "title": "Latitud"
            },
            {
              "type": "text",
              "name": "altitud_predio3",
              "minWidth": "150px",
              "title": "Altitud"
            },
            {
              "type": "text",
              "name": "precision_predio3",
              "minWidth": "150px",
              "title": "Precisión"
            }
          ]
        },
        {
          "name": "page13",
          "visibleIf": "{num_predios_relevancia} = '4 Predio' or {num_predios_relevancia} = '5 Predio'",
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
              "type": "file",
              "name": "foto_relacion_predio4",
              "title": "Foto del documento que valide la relación de tenencia",
              "description": "Tomar la foto de manera que los datos sean legibles"
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
          "visibleIf": "{num_predios_relevancia} = '5 Predio'",
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
              "type": "file",
              "name": "foto_relacion__predio5",
              "title": "Foto del documento que valide la relación de tenencia",
              "description": "Tomar la foto de manera que los datos sean legibles"
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
              "type": "dropdown",
              "name": "departamento_nucleo_familiar",
              "title": "departamento",
              "choices": [
                "Item 1",
                "Item 2",
                "Item 3"
              ]
            },
            {
              "type": "dropdown",
              "name": "municipio_nucleo_familiar",
              "title": "Municipio",
              "choices": [
                "sin municipio"
              ]
            },
            {
              "type": "text",
              "name": "vereda_cabecera_nucleo_familiar",
              "title": "Vereda o Cabecera Municipal o Centro Poblado",
              "description": "No dejar en blanco."
            },
            {
              "type": "text",
              "name": "direccion_predio_ncleo_familiar",
              "title": "Dirección o descripción de acceso al predio o punto de referencia",
              "description": "Dirección o breve descripción de acceso. Tiempo desde la cabecera municipal hasta la finca.\nAcceso en vehículo cuanto tiempo, en animal o a pie cuanto tiempo."
            },
            {
              "type": "text",
              "name": "nombre_predio_nucleo_familiar",
              "title": "Nombre del predio",
              "description": "Nombre de la finca de residencia, si no aplica poner NA"
            },
            {
              "type": "boolean",
              "name": "question16",
              "title": "¿Su núcleo familiar usufructúa un predio distinto a donde vive o a los que registró con cultivos de uso ilícito?",
              "description": "Seleccione una opción.",
              "labelTrue": "Si"
            }
          ]
        },
        {
          "name": "page16",
          "elements": [
            {
              "type": "html",
              "name": "question17",
              "title": "q",
              "html": "<h4>Terminos y Condiciones</h4>"
            },
            {
              "type": "html",
              "name": "question18",
              "html": "<p>\n<a target=\"_blank\" href=\"https://stpnis.blob.core.windows.net/testdsci/Terminos_catatumbo/13022025_ConvocatoriaFinal_v11.pdf\">Ver Términos y Condiciones</a>\n</p>"
            },
            {
              "type": "radiogroup",
              "name": "question19",
              "title": "He leído y acepto los términos y condiciones",
              "isRequired": true,
              "choices": [
                "Si"
              ]
            },
            {
              "type": "html",
              "name": "question21",
              "html": "\n<a target=\"_blank\" href=\"https://stpnis.blob.core.windows.net/testdsci/Terminos/Normativa%20aplicable%20al%20registro.pdf\">Ver Tratamiento de Datos Personales</a>\n"
            },
            {
              "type": "radiogroup",
              "name": "question24",
              "title": "He leído y acepto el tratamiento de datos personales",
              "isRequired": true,
              "choices": [
                "Si"
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
      console.log('sender.data')
      console.log(sender.data)

      const senderData = {
        ...sender.data,
        foto_frente: Array.isArray(sender.data.foto_frente) && sender.data.foto_frente.length > 0 ? sender.data.foto_frente[0].content : null,
        foto_relacion_predio1: Array.isArray(sender.data.foto_relacion_predio1) && sender.data.foto_relacion_predio1.length > 0 ? sender.data.foto_relacion_predio1[0].content : null,
        foto_relacion_predio2: Array.isArray(sender.data.foto_relacion_predio2) && sender.data.foto_relacion_predio2.length > 0 ? sender.data.foto_relacion_predio2[0].content : null,
        foto_relacion_predio3: Array.isArray(sender.data.foto_relacion_predio3) && sender.data.foto_relacion_predio3.length > 0 ? sender.data.foto_relacion_predio3[0].content : null,
        foto_relacion_predio4: Array.isArray(sender.data.foto_relacion_predio4) && sender.data.foto_relacion_predio4.length > 0 ? sender.data.foto_relacion_predio4[0].content : null,
        foto_relacion_predio5: Array.isArray(sender.data.foto_relacion_predio5) && sender.data.foto_relacion_predio5.length > 0 ? sender.data.foto_relacion_predio5[0].content : null,
        foto_respaldo: Array.isArray(sender.data.foto_respaldo) && sender.data.foto_respaldo.length > 0 ? sender.data.foto_respaldo[0].content : null
      };
      console.log('senderData')
      console.log(senderData)

      uCrud.create(senderData)
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
    if (options.name === "ocupacion_beneficiario") {
      survey.showNavigationButtons = options.value;
    }

    const departamentoQuestion = survey.getQuestionByName("departamento");
    const departamentoNucleoQuestion = survey.getQuestionByName("departamento_nucleo_familiar");
    
    if (departamentoQuestion) {
      departamentoQuestion.choices = itemsDepartments.value;
      departamentoNucleoQuestion.choices = itemsDepartments.value;
    }
    const municipioQuestion = survey.getQuestionByName("municipio");
    const municipioNucleoQuestion = survey.getQuestionByName("municipio_nucleo_familiar");
    const veredapredio1Question = survey.getQuestionByName("vereda_predio1");

    if (options.name === "municipio_predio1") {
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

    if (options.name === "departamento_nucleo_familiar") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (municipioNucleoQuestion) {
              municipioNucleoQuestion.choices = itemsMunicipalities.value
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