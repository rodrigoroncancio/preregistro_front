<template>
  <v-main>
    <v-container class="flex-grow-1">
      <v-row>
        <v-col class="text-center mt-6">
          <v-img :src="'/src/assets/img/header-colombia.png'" :width="360" class="mx-auto" />
        </v-col>
      </v-row>
      <v-row justify="center" class="mt-4">
        <v-btn color="primary" @click="generateWord">Generar Word</v-btn>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";
import { SurveyComponent } from "survey-vue3-ui";
import useCrud from "@/composables/useCrud";
import useToast from "@/composables/useToast";
import axios from "axios";
import { useLoading } from "vue-loading-overlay";
import { ref, onMounted } from "vue";

import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

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
    const content = await loadFile(window.location.origin + "/plantilla.docx");
    console.log("Archivo cargado correctamente");

    const zip = new PizZip(content);
    console.log("Archivo PizZip cargado");

    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    doc.setData({
      nombre: "Juan Pérez",
      direccion: "Calle 123, Ciudad",
      fecha: new Date().toLocaleDateString(),
    });

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

onMounted(async () => {
  getDepartmentList();
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
