<template>
  <v-main>
    <v-container class="flex-grow-1 d-flex flex-column align-center justify-center">
      <!-- Imagen de encabezado -->
      <v-img 
        :src="'/src/assets/img/header-colombia.png'" 
        :width="360" 
        class="mt-6"
      />

      <!-- Tarjeta con información del usuario -->
      <v-card class="mt-6 px-6 py-4" elevation="4" width="50%">
        <v-card-title class="text-h6 text-primary text-center">Información del Usuario</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-3">
          <v-row>
            <!-- Columna de títulos -->
            <v-col cols="6" class="text-right font-weight-bold">
              <p>Número de Documento:</p>
              <p>Nombre:</p>
            </v-col>
            <!-- Columna de valores -->
            <v-col cols="6" class="text-left">
              <p>{{ dataDocument?.numero_identificacion || 'N/A' }}</p>
              <p>{{ dataDocument?.nombre || 'N/A' }}</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Botón de descarga -->
      <v-btn 
        color="primary" 
        class="mt-6" 
        elevation="2"
        @click="generateWord"
      >
        <v-icon left>mdi-download</v-icon> Descargar documento
      </v-btn>
    </v-container>
  </v-main>
</template>


<script setup lang="ts">

import useCrud from "@/composables/useCrud";
import useToast from "@/composables/useToast";
import axios from "axios";
import { useLoading } from "vue-loading-overlay";
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import ImageModule from "docxtemplater-image-module-free";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

interface DataDocument {
  nombre: string;
  numero_identificacion: string;
  departamento: number;
  departamento_nombre: string;
  predio1_departamento: number;
  predio1_departamento_nombre: string;
  municipio: number;
  municipio_nombre: string;
  predio1_municipio: number;
  predio1_municipio_nombre: string;
  vereda: number;
  vereda_nombre: string;
  predio1_vereda: number;
  predio1_vereda_nombre: string;
  persona1_nombre: string;
  persona1_tipo_identificacion: string;
  persona1_numero_identificacion: string;
  persona1_fecha_nacimiento: string;
  persona1_parentesco: string;
  persona1_sexo: string;
  persona1_estado_civil: string;
  persona1_grupo_especial: string;
  persona2_nombre: string;
  persona2_tipo_identificacion: string;
  persona2_numero_identificacion: string;
  persona2_fecha_nacimiento: string;
  persona2_parentesco: string;
  persona2_sexo: string;
  persona2_estado_civil: string;
  persona2_grupo_especial: string;
  persona3_nombre: string;
  persona3_tipo_identificacion: string;
  persona3_numero_identificacion: string;
  persona3_fecha_nacimiento: string;
  persona3_parentesco: string;
  persona3_sexo: string;
  persona3_estado_civil: string;
  persona3_grupo_especial: string;
  persona4_nombre: string;
  persona4_tipo_identificacion: string;
  persona4_numero_identificacion: string;
  persona4_fecha_nacimiento: string;
  persona4_parentesco: string;
  persona4_sexo: string;
  persona4_estado_civil: string;
  persona4_grupo_especial: string;
  persona5_nombre: string;
  persona5_tipo_identificacion: string;
  persona5_numero_identificacion: string;
  persona5_fecha_nacimiento: string;
  persona5_parentesco: string;
  persona5_sexo: string;
  persona5_estado_civil: string;
  persona5_grupo_especial: string;
  persona6_nombre: string;
  persona6_tipo_identificacion: string;
  persona6_numero_identificacion: string;
  persona6_fecha_nacimiento: string;
  persona6_parentesco: string;
  persona6_sexo: string;
  persona6_estado_civil: string;
  persona6_grupo_especial: string;
  persona1_edad: string;
  persona2_edad: string;
  persona3_edad: string;
  persona4_edad: string;
  persona5_edad: string;
  persona6_edad: string;
  persona7_edad: string;

  [key: string]: string | number; // <-- Esto permite acceder con una clave dinámica
}
const route = useRoute();
const surveyId = route.params.id;
const dataDocument = ref<DataDocument | null>(null);
const itemsNucleo = ref([]);

// Función para cargar el archivo de la plantilla
async function loadFile(url: string): Promise<ArrayBuffer> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error al cargar el archivo: ${response.statusText}`);
    return await response.arrayBuffer();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Función para convertir Base64 a ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const base64Data = base64.split(",")[1]; // Extrae la parte de la imagen
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

const base64Regex =
    /^(?:data:)?image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;

const validBase64 =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

function base64Parser(tagValue:string) {
    if (
        typeof tagValue !== "string" ||
        !base64Regex.test(tagValue)
    ) {
        return false;
    }

    const stringBase64 = tagValue.replace(base64Regex, "");

    if (!validBase64.test(stringBase64)) {
        throw new Error(
            "Error parsing base64 data, your data contains invalid characters"
        );
    }

    // For nodejs, return a Buffer
    if (typeof Buffer !== "undefined" && Buffer.from) {
        return Buffer.from(stringBase64, "base64");
    }

    // For browsers, return a string (of binary content) :
    const binaryString = window.atob(stringBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes.buffer;
}

const generateWord = async () => {
  try {
 
    const content = await loadFile(window.location.origin + "/ficha_argelia.docx");

      const imageOptions = {
      getImage(tag:string) {
          return base64Parser(tag);
      },
      getSize(tag:string) {
          return [250, 100];
      },
  };
    
    const zip = new PizZip(content);


    const doc = new Docxtemplater(zip, {  modules: [new ImageModule(imageOptions)], paragraphLoop: true, linebreaks: true });




    doc.setData(dataDocument.value); // Pasa toda la información de dataDocument



    doc.render();


    const output = doc.getZip().generate({ type: "blob" });
    saveAs(output, "Documento_Generado.docx");

    console.log("Documento descargado");
  } catch (error) {
    console.error("Error al generar el documento:", error);
  }
};

const uLoading = useLoading();
const uCrud = useCrud("forms/catatumbo/preinscripcionnucleosindividuales");
const uToast = useToast();

const itemsDepartments = ref<Array<{ id: number; label: string }>>([]);

const getDepartmentList = async () => {
  try {
    const response = await axios.get("/api/1.0/core/departments");
    itemsDepartments.value = response.data.map((dept: any) => ({
      value: dept.id,
      text: dept.nombre || dept.name || "Sin nombre",
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
      text: dept.nombre || dept.name || "Sin nombre",
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
      text: dept.nombre || dept.name || "Sin nombre",
    }));
  } catch (error) {
    console.error("Error fetching municipality list:", error);
  }
};
const getSurveyData = async () => {
  try {
    let loader = uLoading.show({});
    const response = await axios.get(`/api/1.0/core/fichaacuerdofase2/${surveyId}/`);
    loader.hide()
    dataDocument.value = response.data;
    console.log("Datos de la encuesta cargados:", dataDocument.value);
  } catch (error) {
    console.error("Error fetching survey data:", error);
  }
};

const getDepartamento = async (departamentoId: number | undefined, nombrecampo: string) => {
  if (!departamentoId || !dataDocument.value) return; // Validación para evitar errores

  try {
    const response = await axios.get(`/api/1.0/core/departments/${departamentoId}/`);
    console.log(response.data);
    dataDocument.value![nombrecampo] = response.data.name;
  } catch (error) {
    console.error("Error fetching department data:", error);
  }
};

const getMunicipio = async (municipioId: number | undefined, nombrecampo: string) => {
  if (!municipioId || !dataDocument.value) return;

  try {
    const response = await axios.get(`/api/1.0/core/municipalities/${municipioId}/`);
    console.log(response.data);
    dataDocument.value![nombrecampo] = response.data.name;
  } catch (error) {
    console.error("Error fetching municipality data:", error);
  }
};

const getCorregimiento = async (corregimientoId: number | undefined, nombrecampo: string) => {
  if (!corregimientoId || !dataDocument.value) return;

  try {
    const response = await axios.get(`/api/1.0/core/townships/${corregimientoId}/`);
    console.log(response.data);
    dataDocument.value![nombrecampo] = response.data.name;
  } catch (error) {
    console.error("Error fetching corregimiento data:", error);
  }
};

const getVereda = async (corregimientoId: number | undefined, nombrecampo: string) => {
  if (!corregimientoId || !dataDocument.value) return;

  try {
    const response = await axios.get(`/api/1.0/core/villages/${corregimientoId}/`);
    console.log(response.data);
    dataDocument.value![nombrecampo] = response.data.name;
  } catch (error) {
    console.error("Error fetching corregimiento data:", error);
  }
};

const getNucleoFamiliar = async () => {
    let loader = uLoading.show({});
    itemsNucleo.value = []; 
    try {
        const response = await axios.get(`/api/1.0/core/fichaacuerdo2/getnucleo/${surveyId}/`);
        itemsNucleo.value = response.data.results;
        console.log('response.data.results:', response.data.results);

        if (!dataDocument.value) {
            dataDocument.value = {} as DataDocument; // Inicializar si es null
        }

        response.data.results.forEach((persona: { nombre: string; tipo_identificacion: string; numero_identificacion: string; fecha_nacimiento: string; parentesco: string; sexo: string; estado_civil: string; grupo_especial: string; }, index: number) => {
            if (index < 6) { // Solo hasta persona6_
                dataDocument.value[`persona${index + 1}_nombre`] = persona.nombre || "";
                dataDocument.value[`persona${index + 1}_tipo_identificacion`] = persona.tipo_identificacion || "";
                dataDocument.value[`persona${index + 1}_numero_identificacion`] = persona.numero_identificacion || "";
                dataDocument.value[`persona${index + 1}_fecha_nacimiento`] = persona.fecha_nacimiento || "";
                dataDocument.value[`persona${index + 1}_parentesco`] = persona.parentesco || "";
                dataDocument.value[`persona${index + 1}_sexo`] = persona.sexo || "";
                dataDocument.value[`persona${index + 1}_estado_civil`] = persona.estado_civil || "";
                dataDocument.value[`persona${index + 1}_grupo_especial`] = persona.grupo_especial || "";
                dataDocument.value[`persona${index + 1}edad`] = calcularEdad(persona.fecha_nacimiento) || "";
            }
        });

        console.log("dataDocument actualizado:", dataDocument.value);
        loader.hide();
    } catch (error) {
        console.error("Error fetching validation items:", error);
        loader.hide();
    }
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

  return `${edadAnios} años`;
};

// Ejecutar la carga de datos antes de intentar generar el Word
onMounted(async () => {
  await getDepartmentList();
  await getSurveyData();
  await getNucleoFamiliar();
  

  // if (dataDocument.value && dataDocument.value.predio1_departamento) {
  //   await getDepartamento(dataDocument.value.predio1_departamento, 'predio1_departamento'); // Luego, llama a getDepartamento si departamento está disponible
  // } else {
  //   console.error("No se encontró 'departamento' en DataDocument.");
  // }
  // if (dataDocument.value && dataDocument.value.predio1_municipio) {
  //   await getMunicipio(dataDocument.value.predio1_municipio, 'predio1_municipio'); // Luego, llama a getmunicipio si municipio está disponible
  // } else {
  //   console.error("No se encontró 'predio1_municipio' en DataDocument.");
  // }

  if (dataDocument.value && dataDocument.value.vereda_nombre) {
      await getVereda(dataDocument.value.vereda, 'vereda'); // Luego, llama a getDepartamento si departamento está disponible
    } else {
      console.error("No se encontró 'vereda' en dataDocument.");
    }

  if (dataDocument.value && dataDocument.value.predio1_vereda) {
    await getVereda(dataDocument.value.predio1_vereda, 'predio1_vereda_nombre'); // Luego, llama a getDepartamento si departamento está disponible
  } else {
    console.error("No se encontró 'predio1_vereda' en dataDocument.");
  }
  
  await generateWord();


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
