<template>
  <exp-dynamic-form
    v-model="formData"
    :schema="(formSchema as any)"
    variant="outlined"
    density="compact"
    hide-details="true"
    :readOnly="true"
    :header1Style="{
      fontSize: '40px',
      backgroundColor: '#41A581',
      color: 'white',
      borderRadius: '4px',
      width: '100%',
      textAlign: 'center',
      display: 'block'
    }"
    :header2Style="{
      backgroundColor: '#ffffff',
      fontSize: '32px',
      borderRadius: '4px',
      width: '100%',
      textAlign: 'left',
      display: 'block'
    }"
    :header3Style="{
      backgroundColor: '#ffffff',
      fontSize: '24px',
      borderRadius: '4px',
      width: '100%',
      textAlign: 'left',
      display: 'block'
    }"
  >
  </exp-dynamic-form>


  <!-- <v-btn @click="clickSave()">Guardar</v-btn> -->
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

const uCrud = useCrud(`${endpoint}/argeliagrupos`);
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

const itemsDepartments = ref<Array<{ id: number; label: string }>>([]);

const getDepartmentList = async () => {
  try {
    const response = await axios.get("/api/1.0/core/departments");
    itemsDepartments.value = response.data.map((dept: any) => ({
      id: dept.id,
      label: dept.nombre || dept.name || "Sin nombre" // Asegurar compatibilidad
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
      id: dept.id,
      label: dept.nombre || dept.name || "Sin nombre" // Asegurar compatibilidad
    }));
  } catch (error) {
    console.error("Error fetching municipality list:", error);
  }
};

const itemsTownships = ref<Array<{ id: number; label: string }>>([]);
const getTownshipList = async (municipalityId: number) => {
  try {
    const response = await axios.get(`/api/1.0/core/townships/by-municipality/${municipalityId}/`);
    itemsTownships.value = response.data.map((dept: any) => ({
      id: dept.id,
      label: dept.nombre || dept.name || "Sin nombre" // Asegurar compatibilidad
    }));
  } catch (error) {
    console.error("Error fetching township list:", error);
  }
};

const itemsVillages = ref<Array<{ id: number; label: string }>>([]);
const getVillageList = async (townshipId: number) => {
  try {
    const response = await axios.get(`/api/1.0/core/villages/by-township/${townshipId}/`);
    itemsVillages.value = response.data.map((dept: any) => ({
      id: dept.id,
      label: dept.nombre || dept.name || "Sin nombre" // Asegurar compatibilidad
    }));
  } catch (error) {
    console.error("Error fetching village list:", error);
  }
};

const itemsMunicipalityFarm = ref<Array<{ id: number; label: string }>>([]);
const getMunicipalityFarmList = async (departmentId: number) => {
  try {
    const response = await axios.get(`/api/1.0/core/municipalities/by-department/${departmentId}/`);
    itemsMunicipalityFarm.value = response.data.map((dept: any) => ({
      id: dept.id,
      label: dept.nombre || dept.name || "Sin nombre" // Asegurar compatibilidad
    }));
  } catch (error) {
    console.error("Error fetching municipality farm list:", error);
  }
};

const itemsTownshipFarm = ref<Array<{ id: number; label: string }>>([]);
const getTownshipFarmList = async (municipalityId: number) => {
  try {
    const response = await axios.get(`/api/1.0/core/townships/by-municipality/${municipalityId}/`);
    itemsTownshipFarm.value = response.data.map((dept: any) => ({
      id: dept.id,
      label: dept.nombre || dept.name || "Sin nombre" // Asegurar compatibilidad
    }));
  } catch (error) {
    console.error("Error fetching township farm list:", error);
  }
};

const itemsVillageFarm = ref<Array<{ id: number; label: string }>>([]);
const getVillageFarmList = async (townshipId: number) => {
  try {
    const response = await axios.get(`/api/1.0/core/villages/by-township/${townshipId}/`);
    itemsVillageFarm.value = response.data.map((dept: any) => ({
      id: dept.id,
      label: dept.nombre || dept.name || "Sin nombre" // Asegurar compatibilidad
    }));
  } catch (error) {
    console.error("Error fetching village farm list:", error);
  }
};

const itemsRole = [
  { id: true, label: t("modules.auth.admin") },
  { id: false, label: t("modules.auth.staff") },
];
const itemsTipoIdentificacion = [
  { id: "", label: "Seleccione..." },
  { id: "1", label: "Cédula de ciudadanía" },
  { id: "2", label: "PEP" }
];

const itemsGenero = [
  { id: "", label: "Seleccione..." },
  { id: "M", label: "Masculino" },
  { id: "F", label: "Femenino" }
];

const itemsSexualOrientation = [
  { id: "", label: "Seleccione..." },
  { id: "Si", label: "Si" },
  { id: "No", label: "No" },
  { id: "No informa", label: "No Informa" }
];

const itemsCivilStatus = [
  { id: "", label: "Seleccione..." },
  { id: "1", label: "Soltero(a)" },
  { id: "2", label: "Casado(a)" },
  { id: "3", label: "Separado(a)" },
  { id: "4", label: "Viudo(a)" },
  { id: "5", label: "Unión libre" },
  { id: "6", label: "Otro" },
  { id: "7", label: "No Reporta" }
];



const itemsMotherHeadOfHousehold = [
  { id: "", label: "Seleccione..." },
  { id: "1", label: "Sí" },
  { id: "0", label: "No" }
];

const itemsOccupation = [
  { id: "", label: "Seleccione..." },
  { id: "1", label: "Empleado" },
  { id: "2", label: "Independiente" },
  { id: "3", label: "Jubilado/Pensionado" },
  { id: "4", label: "Estudiante" },
  { id: "5", label: "Pago por jornal" },
  { id: "6", label: "Desempleado" }
];

const itemsEducation = [
  { id: "", label: "Seleccione..." },
  { id: 1, label: "Primaria" },
  { id: 2, label: "Bachillerato" },
  { id: 3, label: "Auxiliar" },
  { id: 4, label: "Técnico" },
  { id: 5, label: "Tecnólogo" },
  { id: 6, label: "Profesional" },
  { id: 7, label: "Especialista" },
  { id: 8, label: "Ninguna" }
];

const itemsHealthAffiliationType = [
  { id: "", label: "Seleccione..." },
  { id: "1", label: "Régimen contributivo" },
  { id: "2", label: "Régimen subsidiado" },
  { id: "3", label: "PPNA" }
];

const itemsSubjectOfSpecialProtection = [
  { id: "", label: "Seleccione..." },
  { id: 1, label: "Desplazados" },
  { id: 2, label: "Retornado" },
  { id: 3, label: "Reinsertado" },
  { id: 4, label: "Afrodescendiente" },
  { id: 5, label: "Indígenas" },
  { id: 6, label: "ROM/gitano" },
  { id: 7, label: "Palenquero y/o Raizal" },
  { id: 8, label: "Campesinado" },
  { id: 17, label: "LGTBI" },
  { id: 19, label: "No Reporta" }
];

const itemsYesNo = [
  { id: "", label: "Seleccione..." },
  { id: 1, label: "Sí" },
  { id: 0, label: "No" }
];

const itemsAcquisitionHome = [
  { id: "", label: "Seleccione..." },
  { id: 1, label: "Propietario" },
  { id: 2, label: "Ocupante" },
  { id: 3, label: "Poseedor" },
  { id: 4, label: "Arrendatario" },
  { id: 5, label: "Tenedor (prestada, cuidandero en posada)" },
  { id: 6, label: "Poseedor de posesión ilíquida (herencia sin tramitar derecho)" }
];

const itemsDocumentAcquisitionHome = [
  { id: "", label: "Seleccione..." },
  { id: "escritura", label: "Escritura" },
  { id: "sana_posesion", label: "Sana posesión" },
  { id: "certificado", label: "Certificado de tradición y libertad" },
  { id: "documento", label: "Documento o compraventa" }
];

const itemsLegalActivities = [
  { id: "", label: "Seleccione..." },
  { id: "pecuarias", label: "Pecuarias" },
  { id: "agrícolas", label: "Agrícolas" },
  { id: "artesanía", label: "Artesanía" },
  { id: "forestal", label: "Forestal" },
  { id: "ecoturismo", label: "Ecoturismo" }
];


const tab = ref(0);
const formDataDefault = {
  Name: "",
  LastName: "",
  email: "",
  departmentid: 0,
  municipalityid: 0,
  townshipid: 0,
  departmentfarmid: 0,
  municipalityfarmid: 0,
  townshipfarmid: 0
};
const formData = ref({ ...formDataDefault });
const passwordData = ref();


const formSchema = computed(() => [
  { key: "actividadeconomicaotropredio", type: "text", col: "md-6", title: "Actividad Económica Otra Predio" },
  { key: "apellidos", type: "text", col: "md-6", title: "Apellidos", required: true },
  { key: "attachmentspresent", type: "text", col: "md-6", title: "attachmentspresent", required: true },
  { key: "attachmentsexpected", type: "text", col: "md-6", title: "attachmentsexpected", required: true },
  { key: "areacoca", type: "number", col: "md-6", title: "Área Coca" },
  { key: "areapredio", type: "number", col: "md-6", title: "Área del Predio" },
  { key: "codigofamiliasencuesta", type: "text", col: "md-6", title: "Código de Familia de Encuesta" },
  { key: "codigofamiliasencuestavalida1", type: "text", col: "md-6", title: "Código de Familia de Encuesta Válida 1" },
  { key: "codigofamiliasencuestavalida", type: "text", col: "md-6", title: "Código de Familia de Encuesta Válida 2" },
  { key: "condicion", type: "text", col: "md-6", title: "Condición" },
  { key: "coordenadas", type: "text", col: "md-6", title: "Coordenadas" },
  { key: "correo", type: "email", col: "md-6", title: "Correo Electrónico" },
  { key: "departamento", type: "text", col: "md-6", title: "Departamento" },
  { key: "descripcionacceso", type: "textarea", col: "md-12", title: "Descripción del Acceso" },
  { key: "deviceid", type: "text", col: "md-6", title: "ID del dispositivo" },
  { key: "discapacidad", type: "select", items: itemsYesNo, col: "md-6", title: "Discapacidad" },
  { key: "documentovalido", type: "text", col: "md-6", title: "Documento Válido" },
  { key: "edad", type: "number", col: "md-6", title: "Edad" },
  { key: "educacion", type: "select", items: itemsEducation, col: "md-6", title: "Nivel Educativo", required: true },
  { key: "edits", type: "text", col: "md-6", title: "Ediciones" },
  { key: "experiencialineaproductiva", type: "text", col: "md-6", title: "Experiencia Linea Productiva" },
  { key: "experiencialineaproductivaanos", type: "number", col: "md-6", title: "Experiencia Linea Productiva Años" },
  { key: "fecha", type: "date", col: "md-6", title: "Fecha de Registro" },
  { key: "fechanacimiento", type: "date", col: "md-6", title: "Fecha de Nacimiento", required: true },
  { key: "fotodocumentofrente", type: "file", col: "md-6", title: "Foto Documento Frente" },
  { key: "fotodocumentorespaldo", type: "file", col: "md-6", title: "Foto Documento Respaldo" },
  { key: "fototenencia", type: "file", col: "md-6", title: "Foto de Tenencia" },
  { key: "formversion", type: "text", col: "md-6", title: "Versión del formulario" },
  { key: "identificacion", type: "text", col: "md-6", title: "Identificación" },
  { key: "identificacionvalida", type: "text", col: "md-6", title: "Identificación Válida" },
  { key: "lineaproductiva", type: "text", col: "md-6", title: "Línea Productiva" },
  { key: "madrecabezafamilia", type: "select", items: itemsYesNo, col: "md-6", title: "Madre Cabeza de Familia", required: true },
  { key: "municipio", type: "text", col: "md-6", title: "Municipio" },
  { key: "nombres", type: "text", col: "md-6", title: "Nombres", required: true },
  { key: "nota1", type: "textarea", col: "md-12", title: "Nota 1" },
  { key: "nota2", type: "textarea", col: "md-12", title: "Nota 2" },
  { key: "nota7", type: "textarea", col: "md-12", title: "Nota 7" },
  { key: "numerodocumento", type: "text", col: "md-6", title: "Número de Documento", required: true },
  { key: "numeropersonas", type: "number", col: "md-6", title: "Número de Personas en el Hogar" },
  { key: "orientacion", type: "select", items: itemsSexualOrientation, col: "md-6", title: "Identidad de Género / Orientación Sexual", required: true },
  { key: "predio", type: "text", col: "md-6", title: "Predio" },
  { key: "residencia", type: "text", col: "md-6", title: "Residencia" },
  { key: "reviewstate", type: "text", col: "md-6", title: "Estado de revisión" },
  { key: "sexo", type: "select", items: itemsGenero, col: "md-6", title: "Sexo", required: true },
  { key: "status", type: "text", col: "md-6", title: "Estado" },
  { key: "submissiondate", type: "text", col: "md-6", title: "Fecha de envío" },
  { key: "submitterid", type: "text", col: "md-6", title: "ID del remitente" },
  { key: "submittername", type: "text", col: "md-6", title: "Nombre del remitente" },
  { key: "telefono", type: "text", col: "md-6", title: "Teléfono" },
  { key: "tenencia", type: "text", col: "md-6", title: "Tenencia" },
  { key: "tipociudadano", type: "text", col: "md-6", title: "Tipo de Ciudadano" },
  { key: "tipodocumento", type: "select", items: itemsTipoIdentificacion, col: "md-6", title: "Tipo de Documento", required: true },
  { key: "updatedat", type: "text", col: "md-6", title: "Última actualización" },
  { key: "usufructuaotropredio", type: "text", col: "md-6", title: "Usufructo Otra Predio" },
  { key: "validacionidentificacion", type: "text", col: "md-6", title: "Validación de Identificación" },
  { key: "validacioncodigofamiliasencuesta", type: "text", col: "md-6", title: "Validación de Código de Familia de Encuesta" },

]);


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
const validate = useVuelidate(rules, (formData as any));

onMounted(async () => {
  console.log('route.params.id:', route.params.id);
  tab.value = 0;
  if (surveyId != null) {
    await uCrud
      .retrieve(Number(surveyId))
      .then((item: any) => {
        if (item.staff_info == null) {
          item.staff_info = {};
        }
        Object.assign(formData.value, { ...item });
      });
  } else {
    Object.assign(formData.value, { id: null, ...formDataDefault });
  }
  getDepartmentList();
});
watch(
  () => formData.value.departmentid,
  (newVal, oldVal) => {
    if (newVal !== undefined) {
      getMunicipalityList(newVal);
    }
  }
);
watch(
  () => formData.value.municipalityid,
  (newVal) => {
    if (newVal !== undefined) {
      getTownshipList(newVal);
      formData.value.townshipid = null; // Reiniciar corregimiento seleccionado
    }
  }
);

watch(
  () => formData.value.townshipid,
  (newVal) => {
    if (newVal !== undefined) {
      getVillageList(newVal);
    }
  }
);
watch(
  () => formData.value.departmentfarmid,
  (newVal) => {
    if (newVal !== undefined) {
      getMunicipalityFarmList(newVal);
    }
  }
  );
watch(
  () => formData.value.municipalityfarmid,
  (newVal) => {
    if (newVal !== undefined) {
      getTownshipFarmList(newVal);
    }
  }
);
watch(
  () => formData.value.townshipfarmid,
  (newVal) => {
    if (newVal !== undefined) {
      getVillageFarmList(newVal);
    }
  }
);

const clickSave = async () => {
  validate.value.$touch();
  if (!validate.value.$invalid) {
    let data = { ...formData.value };

    await uCrud
      .save(data)
      .then((resp: any) => {
        const authStore = useAuthStore();
        const userData = authStore.userData;
        if ((userData as any).id == resp.id) {
          authStore.setAuthData({
            accessToken: authStore.accessToken,
            refreshToken: authStore.refreshToken,
            userData: {
              ...(authStore.userData as any),
              first_name: resp.first_name,
              last_name: resp.last_name,
              email: resp.email,
              role: resp.is_superuser ? 1 : 2,
              image: resp.staff_info.image,
              phone:  resp.staff_info.phone
            }
          });
        }

        emit("onSave", `${uUtils.createUUID()}`);
        modelValue.value = false;
      });
  } else {
    alert('error datos incompletos')
  }
};

const emit = defineEmits(["onSave"]);
</script>

<style lang="scss">

</style>