<template>
  <exp-dynamic-form
    v-model="formData"
    :schema="(formSchema as any)"
    variant="outlined"
    density="compact"
    hide-details="true"
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

  <exp-dynamic-form
    v-model="formData"
    :schema="(formSchema2 as any)"
    variant="outlined"
    density="compact"
    hide-details="true"
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

const uCrud = useCrud(`${endpoint}/userpnis`);
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
  { id: true, label: "Sí" },
  { id: false, label: "No" }
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

const  itemsYesNoStr = [
  { id: "", label: "Seleccione..." },
  { id: "1", label: "Sí" },
  { id: "0", label: "No" }
];

const itemsYesNo2 = [
  { id: "", label: "Seleccione..." },
  { id: true, label: "Sí" },
  { id: false, label: "No" }
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
  { key: "", type: "header1", col:"md-12", title: "Ficha de acuerdo idividual", required: true },
  { key: "", type: "header2", col:"md-12", title: "1. DATOS GENERALES DEL NÚCLEO FAMILIAR", required: true },
  { key: "", type: "header2", col:"md-12", title: "1.1. Identificación del Núcleo Familiar", required: true },
  { key: "", type: "header3", col:"md-12", title: "1.1.1. Titular del núcleo familiar", required: true },
  { key: "name", type: "text", col:"md-6", title: "Nombres", required: true },
  { key: "lastname", type: "text", col:"md-6", title: "Apellidos", required: true },
  { key: "identificationtypeid", type: "select", items: itemsTipoIdentificacion, col:"md-6", title: "Tipo de Identificación", required: true },
  { key: "identificationnumber", type: "text", col:"md-6", title: "Número de Identificación", required: true },
  { key: "dateissuedocument", type: "date", col:"md-6", title: "Fecha de expedición", required: true },
  { key: "birthdate", type: "date", col:"md-6", title: "Fecha de nacimiento", required: true },
  { key: "gender", type: "select", col:"md-6", items: itemsGenero, title: "Sexo", required: true },
  { key: "sexualorientation", type: "select", col:"md-6", items: itemsSexualOrientation, title: "Tiene Identidad de Género y/o Orientación sexual diversa (OSIGD)?", required: true },
  { key: "civilstatusid", type: "select", col:"md-6", items: itemsCivilStatus, title: "Estado civil", required: true },
  { key: "headofhousehold", type: "select", col:"md-6", items: itemsYesNo2, title: "Jefatura de hogar", required: true },
  { key: "motherheadoffamily", type: "select", col:"md-6", items: itemsMotherHeadOfHousehold, title: "Madre cabeza de Familia", required: true },
  { key: "occupationid", type: "select", col:"md-6", items: itemsOccupation, title: "Ocupación", required: true },
  { key: "educationid", type: "select", col:"md-6", items: itemsEducation, title: "Nivel de escolaridad", required: true },
  { key: "healthaffiliationtypeid", type: "select", col:"md-6", items: itemsHealthAffiliationType, title: "Tipo de afiliación a salud", required: true },
  { key: "subjectofspecialprotectionid", type: "select", col:"md-6", items: itemsSubjectOfSpecialProtection, title: "Grupo de atención especial", required: true },
  { key: "disability", type: "select", col:"md-6", items: itemsYesNo, title: "¿Usted se identifica como miembro de una comunidad étnica o de alguna de las poblaciones que se describen a continuación: Indígena, Afrocolombiano, Palenquero, Raizal, Negro, Rrom (gitano) Campesino?", required: true },
  { key: "", type: "header2", col:"md-12", title: "Comunidad étnica", required: true },
  { key: "etniaid", type: "select", col:"md-6", items: itemsSubjectOfSpecialProtection, title: "¿Selccione con la que Usted se identifica como miembro de comunidad étnica o de alguna de las poblaciones que se describen a continuación?", required: true },
  { key: "monthlyincome", type: "text", col:"md-6", title: "Valor de ingresos mensuales", required: true },
  { key: "monthlyexpenses", type: "text", col:"md-6", title: "Valor de gastos mensuales", required: true },
  { key: "", type: "header2", col:"md-12", title: "Residencia nucleo familiar", required: true },
  { key: "department", type: "select", col:"md-6", items: itemsDepartments.value, title: "Departamento", required: true },
  { key: "municipalityid", type: "select", col:"md-6",items: itemsMunicipalities.value, title: "Municipio", required: true },
  { key: "townshipid", type: "select", col:"md-6", items: itemsTownships.value, title: "Corregimiento", required: true },
  { key: "villageid", type: "select", col:"md-6", items: itemsVillages.value, title: "Vereda", required: true },
  { key: "propertynamehome", type: "text", col:"md-6", title: "Nombre de predio", required: true },
  { key: "areahome", type: "text", col:"md-6", title: "Área total (Hectareas)", required: true },
  { key: "landcoordinates2", type: "text", col:"md-6", title: "Coordenadas de residencia", required: true },
  { key: "permanence", type: "text", col:"md-6", title: "Permanencia (Años)", required: true },
  { key: "acquisitionhomeidentificationtypeid", type: "select", col:"md-6", items: itemsAcquisitionHome, title: "Tipo de relación con el predio", required: true },
  { key: "documentacquisitionhome", type: "select", col:"md-6", items: itemsDocumentAcquisitionHome, title: "Tipo de documento que acredita la relación con el predio", required: true },
  { key: "last_name", type: "text", col:"md-6", title: "Documento de soporte", required: true },
  { key: "acquisitionhomeidentificationnumber", type: "text", col:"md-6", title: "Número de identificación del propietario del predio.", required: true },
  { key: "landownership", type: "select", col:"md-6", items: itemsYesNo, title: "El predio donde usted tiene el cultivo de uso ilícito es el mismo de su lugar de residencia", required: true },
  { key: "dependents", type: "number", col:"md-6", title: "¿Cuántas personas dependen económicamente del titular y/o habiten en el mismo lugar?", required: true },
  { key: "minorsinfamily", type: "number", col:"md-6", title: "¿Cuántas personas del núcleo familiar son menores de edad?", required: true },
  ]);


  const formSchema2 = computed(() => [
  { key: "", type: "header2", col:"md-12", title: "1.2. Predio objeto de intervención", required: true },
  { key: "", type: "header3", col:"md-12", title: "1.2.1. Ubicación del predio", required: true },
  { key: "departmentfarmid", type: "select", col:"md-6", items: itemsDepartments.value, title: "Departamento predio", required: true },
  { key: "municipalityfarmid", type: "select", col:"md-6", items: itemsMunicipalityFarm.value, title: "Municipio predio", required: true },
  { key: "townshipfarmid", type: "select", col:"md-6", items: itemsTownshipFarm.value,  title: "Corregimiento", required: true },
  { key: "villagefarmid", type: "select", col:"md-6", items: itemsVillageFarm.value, title: "Vereda", required: true },
  { key: "propertynamefarm", type: "text", col:"md-6", title: "Nombre del predio", required: true },
  { key: "areafarm", type: "number", col:"md-6", title: "Área total del predio en hectáreas", required: true },
  { key: "areacoca", type: "number", col:"md-6", title: "Área en cultivo de coca en hectáreas", required: true },
  { key: "landcoordinates", type: "text", col:"md-6", title: "Coordenadas del predio", required: true },
  { key: "rootedtomunicipality", type: "select", col:"md-6", items: itemsYesNo, title: "Arraigo al municipio", required: true },
  { key: "acquisitionfarmid", type: "select", col:"md-6", items: itemsAcquisitionHome, title: "Tipo de relación con el predio", required: true },
  { key: "documentacquisitionfarm", type: "select", col:"md-6", items: itemsDocumentAcquisitionHome, title: "Tipo de documento que acredita la relación con el predio", required: true },
  { key: "landownername", type: "text", col:"md-6", title: "Nombre propietario del predio", required: true },
  { key: "acquisitionfarmidentificationnumber", type: "text", col:"md-6", title: "Número de identificación del propietario del predio", required: true },
  { key: "residentsonland", type: "text", col:"md-6", title: "Cuantas personas habitan en el predio", required: true },
  { key: "", type: "header2", col:"md-12", title: "1.2.2. Caracterización productiva del predio", required: true },
  { key: "legalactivitiesid", type: "select", col:"md-6", items: itemsYesNo2, title: "Existen actividades productivas lícitas en el predio", required: true },
  { key: "legalactivitiesid", type: "select", col:"md-6", items: itemsLegalActivities, title: "¿Cuáles son las actividades productivas del predio?", required: true },
  { key: "familyexclusiveusage", type: "select", col:"md-12", items: itemsYesNo, title: "¿Su núcleo familiar es el único que usufructúa el predio?", required: true },
  { key: "familyotherlands", type: "select", col:"md-6", items: itemsYesNo, title: "Su núcleo familiar usufructúa otro predio distinto a dónde vive o al que es objeto de intervención", required: true },
  { key: "economicactivity", type: "select", col:"md-6", items: itemsLegalActivities, title: "¿Cuáles son las actividades productivas del predio?", required: true },
  { key: "strengthening", type: "header2", col:"md-12", title: "1.3. Economía de sustitución de cultivos de uso ilícito", required: true },
  { key: "establishment", type: "select", col:"md-6", items: itemsYesNoStr, title: "Establecimiento", required: true },
  { key: "strengthening", type: "select", col:"md-6", items: itemsYesNoStr, title: "Fortalecimiento", required: true },
  { key: "last_name", type: "header2", col:"md-12", title: "Línea productiva (Café)", required: true },
  { key: "experienceproductionline", type: "select", col:"md-6", items: itemsYesNo2, title: "¿Tiene experiencia en esta línea productiva?", required: true },
  { key: "yearsexperienceproductionline", type: "text", col:"md-6", title: "Hace cuántos años?", required: true },
  { key: "linkedtoanyassociationproductionline", type: "select", col:"md-6", items: itemsYesNo, title: "¿Está vinculado a alguna asociación de productores?", required: true },
  { key: "associationname", type: "text", col:"md-6", title: "¿Cuál?", required: true },

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