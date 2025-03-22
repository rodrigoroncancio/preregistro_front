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
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

interface DataDocument {
  nombre: string;
  numero_identificacion:string;
  // Agrega aquí más propiedades si las necesitas
}
const route = useRoute();
const surveyId = route.params.id;
const dataDocument = ref<DataDocument | null>(null);

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


const generateWord = async () => {
  try {
    console.log("Intentando cargar la plantilla...");
    const content = await loadFile(window.location.origin + "/ficha_argelia.docx");
    console.log("Archivo cargado correctamente");

    const zip = new PizZip(content);
    console.log("Archivo PizZip cargado");

    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    console.log("Datos obtenidos:", dataDocument.value);

    doc.setData(dataDocument.value); // Pasa toda la información de dataDocument

    console.log("Datos inyectados en la plantilla");

    doc.render();
    console.log("Documento generado correctamente");

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

// Ejecutar la carga de datos antes de intentar generar el Word
onMounted(async () => {
  await getDepartmentList();
  await getSurveyData();
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
