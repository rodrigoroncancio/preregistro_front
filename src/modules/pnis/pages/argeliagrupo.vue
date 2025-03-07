<template>
  <v-container>
    <h1 class="mb-4">{{ $t('modules.pnis.argeliagrupo') }}</h1>
    <v-card>
      <v-card-text class="pa-0">
        <exp-data-table
          uuid="table-users_pnis"
          :endpoint="`${endpoint}/argeliagrupos/filterbysurvey/1`"
          :drawRefresh="drawRefresh"
          :headers="headers"
          :extraMenuItems="[{
            title: $t('modules.core.validate'),
            icon: 'mdi-check',
            action: 'validate'
          }]"
          :menuItems="menuItems"
          :labelNew="'modules.core.new_userspnis'"
          @onClickView="clickView"
          @onClickAction="clickAction"
          @onClickDocuments="clickDocuments"
        >
          <template v-slot:item.is_superuser="{item}">
            <v-icon v-if="item.is_superuser" color="blue" class="mr-2">
              mdi-account-tie
            </v-icon>
            <v-icon v-else color="green" class="mr-2">
              mdi-account-hard-hat
            </v-icon>
          </template>
            <template v-slot:item.number_completed="{item}">
              <v-btn @click="modalValidados(item, 'si')"  variant="flat" color="green" block>{{ item.number_completed }}</v-btn>
            </template>
            <template v-slot:item.number_uncompleted="{item}">
              <v-btn @click="modalValidados(item, 'no')"  variant="flat" color="red" block>{{ item.number_uncompleted }}</v-btn>
            </template>
        </exp-data-table>
      </v-card-text>
    </v-card>
  </v-container>

  <exp-modal-form
    :title="$t('modules.pnis.modal_title_valodationform')"
    :width="850"
    v-model="formModal"
    :btnSave="isValidForm"
    @fnSave="clickSaveForm"
    class="validate-form"
  >
    <v-row>
      <v-col cols="12">
        <frm-valida 
          :identificationnumber="identificationnumber"
          :validationitem="validationid"
          :fomularioid="1"
          @onClickSave="fnReloadTable"
        />
      </v-col>
    </v-row>
  </exp-modal-form>

  <exp-modal-form
    :title="$t('modules.pnis.modal_title_validateitems')"
    :width="450"
    v-model="formModalValidate"
    :btnSaveEnabled="true"
    @fnSave="clickSelectForm"
    :btnSaveText="$t('modules.core.select')"
  >
    <v-row>
      <v-col cols="12">
        <v-radio-group v-model="validationid">
          <v-radio 
            v-for="option in itemsValidation" 
            :key="option.id" 
            :label="option.label" 
            :value="option.id"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row v-if="itemsValidation.length == 0">
      <v-col cols="12">No hay validaciones disponibles</v-col>
    </v-row>
  </exp-modal-form>

  <exp-modal-form
    :title="$t('modules.pnis.modal_title_validateitems')"
    :width="450"
    v-model="formModalDocumentos"
    :btnSaveEnabled="true"
    @fnSave="clickSelectFormDocuments"
    :btnSaveText="$t('modules.core.select')"
  >
    <v-row>
      <v-col cols="12">
        <v-radio-group v-model="validationid">
          <v-radio 
            v-for="item in itemsDocuments"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </v-radio-group>
      </v-col>
    </v-row>
  </exp-modal-form>

  <exp-modal-form
    :title="formModalValidadosTitulo"
    :width="850"
    v-model="formModalValidados"
    :btnSave="false"
    @fnSave="clickSelectFormDocuments"
    :btnSaveText="$t('modules.core.select')"
    >
    <v-row>
      <v-col cols="12">        
      <v-card>
        <v-table class="w-">
          <thead>
            <tr>
              <th class="py-3 px-4" width="10%">Area-Rol</th>
              <th class="py-3 px-4" width="30%">Validación</th>
              <th class="py-3 px-4" width="5%">Estado</th>
              <th class="py-3 px-4" width="30%">Observación</th>
              <th class="py-3 px-4" width="10%">Validador</th>
              <th class="py-3 px-4">Evidencia</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in itemsValidados"
              :key="index"
              :class="index % 2 === 0 ? 'shadow-md bg-gray-50' : ''"
            >
              <td class="py-3 px-4">
                {{ itemsValidadosBase.find(option => option.id === item.validationitems_id)?.rolname || '-' }}
              </td>
              <td class="py-3 px-4">  
                {{ itemsValidadosBase.find(option => option.id === item.validationitems_id)?.name || 'Sin nombre' }}
              </td>
              <td class="py-3 px-4">
                {{ item.status || 'Sin establecer' }}
              </td>
              <td class="py-3 px-4 observation-cell">
                {{ item.observation || 'Sin observación' }}
              </td>
              <td>{{item.user_name}}</td>
              <td class="py-3 px-4">
                <template v-if="item.attachment">
                  <v-btn @click="downloadDocument(item, 2)" variant="text" color="green" block>
                    Ver evidencia
                  </v-btn>
                </template>
                <template v-else> <v-btn variant="text" color="red" block disabled>Sin Evidencia</v-btn></template>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
      </v-col>
    </v-row>          
  </exp-modal-form>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import useAuth from "@/modules/auth/composables/useAuth";
import expDataTable from "@/components/expDataTable";
import expModalForm from "@/components/expModalForm";
import frmValida from "./forms/valida.vue";
import useUtils from "@/composables/useUtils";  
import axios from "axios";
import { useLoading } from "vue-loading-overlay";

const uLoading = useLoading();

const endpoint = "/api/1.0/core";
const { t } = useI18n();
const router = useRouter();
const uAuth = useAuth();
const uUtils = useUtils();

const validationid = ref(null); // v-model para el radio group
const identificationnumber = ref(null);
const itemsDocuments = ref([]);
const itemsValidados = ref([]);
const itemsValidadosBase = ref([]);
const formModalValidadosTitulo = ref("");

const headers: any[] = [
  // { key: 'id', title: t("commons.common.id"), width: "auto", align: "start", sortable: false },
  { key: 'identificacion_organizacion', title: "Num. identificación", width: "auto", align: "start",  searchable: true, sortable: false, },
  { key: 'cedula_representante', title: "CC Representante", width: "auto", align: "start",  searchable: true, sortable: false, },
  { key: 'grupo_pruductores', title: "Nombre", width: "auto", align: "start",  searchable: true, sortable: false, },
  { key: 'departamento_influencia', title: "Dep. Influencia", width: "auto", align: "start", sortable: false, },
  { key: "municipio_influencia", title: "Mun. Influencia", width: "auto", align: "start", sortable: false, },
  { key: "num_personas_registradas", title: "Num. registrados", width: "auto", align: "start", sortable: false, },
  { key: 'number_completed', title: "Validados", width: "auto", align: "start", sortable: false, },
  { key: 'number_uncompleted', title: "Alertas", width: "auto", align: "start", sortable: false, },
  { key: "actions", title: t("commons.common.actions"), width: "90px", type: "actions", sortable: false, },
];
const drawRefresh = ref("");
const validationKey = ref("");
const formModal = ref(false);
const formModalValidate = ref(false);
const formModalDocumentos = ref(false);
const formModalValidados = ref(false);
const itemsValidation = ref<Array<{ id: number; label: string }>>([]);

const getValidationItems = async () => {
    let loader = uLoading.show({});
    itemsValidation.value = [];
    try {
      const response = await axios.get(
        `/api/1.0/core/validationregister/missing-validation-items/${identificationnumber.value}/1/`
      );
      // Verifica si response.data tiene la estructura esperada
      if (response.data.missing_items) {
        itemsValidation.value = response.data.missing_items.map((item: any) => ({
          id: item.id,
          label: item.nombre || item.name || "Sin nombre",
        }));
      } else {
        console.warn("Formato inesperado en la respuesta:", response.data);
      }
      loader.hide()
    } catch (error) {
      console.error("Error fetching validation items:", error);
      loader.hide()
    }
  };

onMounted(async () => {
  getValidationKey();
  getItemsValidadosBase();
});


const fnReloadTable = () => {
  formModal.value = false;
  formModalValidate.value = false;
  drawRefresh.value = uUtils.createUUID();
}

const getItemsValidadosBase = async () => {
  try {
    const response = await axios.get(`/api/1.0/core/validationregister/items-validacion/1/`);
    itemsValidadosBase.value = response.data;
  } catch (error) {
    console.error("Error fetching validation items:", error);
  }
};

const getValidationKey = async () => {
  try {
    const response = await axios.get(`/api/1.0/core/media/generatekey/`);
    validationKey.value = response.data;
  } catch (error) {
    console.error("Error fetching key:", error);
  }
};

const modalValidados = async (item: any, tipo: string='si') => {
  try {
    let loader = uLoading.show({});
    formModalValidadosTitulo.value = tipo == 'si' ? 'Items validados' : 'Alertas';
    const response = await axios.get(`/api/1.0/core/validationregister/filterbydocumentnumber/${item.cedula_representante}/1/${tipo}`);
    itemsValidados.value = response.data;
    loader.hide();
    formModalValidados.value = true;
  } catch (error) {
    console.error("Error fetching validation items:", error);
  }
}

const downloadDocument = (item: any, tipo: number=1) => {
  const hostServer = import.meta.env.VITE_BASE_MEDIA;
  const idUser = uAuth.getUserData().id;
  const enlace = document.createElement('a');
  console.log(item.attachment);
  if (tipo == 1) {
    enlace.href = `${hostServer}/api/1.0/core/media/${validationKey.value}/${idUser}/?ruta=${item.document}`;
  } else {
    enlace.href = `${hostServer}/api/1.0/core/media/${validationKey.value}/${idUser}/?ruta=${item.attachment}`;
  }
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
}

const menuItems = computed(() => {
  if (uAuth.isAudit()) {
    return ['view']
  } else if (uAuth.isAdmin()) {    
    return ['view', 'validate']
  } else {
    return ['validate']
  }
});

const isValidForm = computed(() => {
  return false
});

const clickView = async (item: any) => {
  router.push(`/pnis/argeliagrupo/open/${item.id}`);
};

const clickDocuments = (item: any) => {
  console.log(item);
  formModalDocumentos.value = true;
  itemsDocuments.value.push({
    id: 1,
    label: 'Foto documento delatera'
  });
  itemsDocuments.value.push({
    id: 2,
    label: 'Foto documento respaldo'
  });
  itemsDocuments.value.push({
    id: 3,
    label: 'Foto de tenencia'
  });
}

const clickAction = (item: any, action: string) => {
  if (action === 'validate') {
    formModalValidate.value = true;
    console.log(item);
    identificationnumber.value = item.cedula_representante;
    getValidationItems();
  }
};

const clickSaveForm = () => {
  console.log('clickSaveForm');
}

const clickSelectForm = () => {
  console.log('clickSelectForm');
  console.log(validationid.value);
  formModal.value = true;
}

const clickSelectFormDocuments = () => {
  console.log('clickSelectFormDocuments');
  console.log(validationid.value);
  formModalDocumentos.value = true;
}
</script>

<style lang="scss">

</style>