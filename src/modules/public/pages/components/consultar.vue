<template>
  <exp-modal-form
    :title="$t('modules.public.consultaestado.titulo')"
    :width="600"
    v-model="modelValue"
    @fnSave="clickSave"
    :btnSaveText="$t('modules.public.consultaestado.consultar')"
    :btnCancelText="$t('modules.public.consultaestado.cerrar')"
  >
    <v-card-text>
      <exp-dynamic-form
        v-model="formData"
        :schema="(formSchema as any)"
        variant="outlined"
        density="compact"
        hide-details="true"
      >
      </exp-dynamic-form>
    </v-card-text>
    <v-card v-if="showFicha">
          <v-card-title>
            <v-row>
              <v-col>
                <h2>Ficha de Información</h2>
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-subtitle>
            <v-row>
              <v-col>
                <strong>Identificación:</strong> {{fichaData.identificacion}}
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <strong>Nombres:</strong> {{fichaData.nombres}}
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <strong>Apellidos:</strong> {{fichaData.apellidos}}
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <strong>Convocatoria:</strong> {{fichaData.convocatoria}}
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <strong>Estado actual:</strong> {{fichaData.estadoactual}}
              </v-col>
            </v-row>
          </v-card-subtitle>
    </v-card>
    <v-card v-if="showError">
      <v-card-title>
            <v-row>
              <v-col>
                <h2>Usuario no encontrado</h2>
              </v-col>
            </v-row>
          </v-card-title>
    </v-card>
  </exp-modal-form>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { useLoading } from "vue-loading-overlay";

const loading = useLoading();
const endpoint = "/api/1.0/core";
interface Item {
  id: number;
  label: string;
}

import useAuth from "@/modules/auth/composables/useAuth";
import useCrud from "@/composables/useCrud";
import useUtils from "@/composables/useUtils";
import expModalForm from "@/components/expModalForm";
import expDynamicForm from "@/components/expDynamicForm";
import axios from "axios";

const uCrud = useCrud(`${endpoint}/staff`);
const uUtils = useUtils();
const { t } = useI18n();
const uAuth = useAuth();

const modelValue = defineModel<boolean>();
const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
  roles: {
    type: Array as () => Item[],
  },
});

// const itemsRole = []
const tab = ref(0);
const formDataDefault = {
  numdocumento: "", 
  fechanacimiento: ""
};
const formData = ref({ ...formDataDefault });
const passwordData = ref();
const showFicha = ref(false);
const showError = ref(false);
const fichaData = ref({identificacion: '', 
nombres: '', 
apellidos: '', 
convocatoria: '',
estadoactual: '',
id_ficha: 0,
id_validado: 0,
id_validado_pre: ''});

let formSchema = [
  { key: "numdocumento", type: "number", col:"md-12", title: t("modules.public.consultaestado.numdocumento"), required: true },
  { key: "fechanacimiento", type: "date", col:"md-12", title: t("modules.public.consultaestado.fechanacimiento"), required: true }
];

const rules = {
  first_name: { required, minLength: minLength(2) },
  last_name: { required, minLength: minLength(2) },
  email: { required, email, minLength: minLength(2) },
};


onMounted(async () => {
  // getItemsRoles()
  tab.value = 0;
});

const clickSave = () => {
  console.log(formData.value);
  let loader = loading.show({});
  // Realiza la solicitud POST y maneja la respuesta con .then()
  axios.post('/public/consultar_documento/', formData.value, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((response) => {
    console.log('response');
    console.log(response);

    // Verificar si el status es 1 o 2
    if (response?.data?.status === 1 || response?.data?.status === 2) {
      console.log('Entra a 1');
      showFicha.value = true;
      showError.value = false;

      // Asignar los datos de la respuesta a fichaData
      fichaData.value = response.data.data[0];
      console.log('fichaData.value');
      console.log(fichaData.value);

      // Establecer el valor de convocatoria dependiendo del status
      fichaData.value.convocatoria = 'Argelia';
      if (response.data.status === 2) {
        fichaData.value.convocatoria = 'Catatumbo';
      }

      // Asignar estado actual dependiendo de los datos de la ficha
      if (fichaData.value.id_ficha !== null) {
        fichaData.value.estadoactual = 'Ficha de acuerdo firmada, pendiente de validación';
      } else if (fichaData.value.id_validado !== null) {
        fichaData.value.estadoactual = 'Preregistro validado, esperando ficha de acuerdo individual';
      } else if (fichaData.value.id_validado_pre !== null) {
        fichaData.value.estadoactual = 'Pendiente para revisión de datos de Preregistro';
      } else {
        // Si ninguno de los casos anteriores se cumple, se puede establecer un estado por defecto
        fichaData.value.estadoactual = 'Estado desconocido';
      }
    } else {
      console.log('Entra a 2');
      showFicha.value = false;
      showError.value = true;
    }
    loader.hide();
  })
  .catch((error) => {
    // Manejar errores si la solicitud falla
    console.error('Error al hacer la solicitud', error);
    showError.value = true;
    showFicha.value = false;
    loader.hide();
  });
};


const emit = defineEmits(["onSave"]);
</script>

<style lang="scss">

</style>