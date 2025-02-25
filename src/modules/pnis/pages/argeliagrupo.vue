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
    title="Items validados"
    :width="850"
    v-model="formModalValidados"
    :btnSave="false"
    @fnSave="clickSelectFormDocuments"
    :btnSaveText="$t('modules.core.select')"
    >
    <v-row>
      <v-col cols="12">
        
      <v-card>

        <v-simple-table class="w-">
          <thead>
            <tr>
              <th class="text-left">Validación</th>
              <th class="text-left">Observación</th>
              <th class="text-left">Evidencia</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in itemsValidados"
              :key="index"
              :class="index % 2 === 0 ? 'shadow-md bg-gray-50' : ''"
            >
              <td class="py-3 px-4" width="30%">  
                  {{ itemsValidadosBase.find(option => option.id === item.validationitems_id)?.name || 'Sin nombre' }}
              </td>
              <td class="py-3 px-4 observation-cell" width="30%">
                {{ item.observation || 'Sin observación' }}
              </td>
              <td>{{item.user_name}}</td>
              <td class="py-3 px-4" width="100%">
                <template v-if="item.attachment">
                  <v-btn @click="downloadDocument(item, 2)" variant="text" color="green" block>
                    Ver evidencia
                  </v-btn>
                </template>
                <template v-else> <v-btn variant="text" color="red" block disabled>Sin Evidencia</v-btn></template>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
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
const itemsValidadosBase = ref([
    {
        "id": 2,
        "name": "Completitud de los datos",
    },
    {
        "id": 3,
        "name": "Representante núcleo familiar"
    },
    {
        "id": 4,
        "name": "Personas del núcleo familiar"
    },
    {
        "id": 5,
        "name": "Hetarea"
    },
    {
        "id": 6,
        "name": "Lugar de residencia"
    },
    {
        "id": 7,
        "name": "Georeferenciación"
    },
    {
        "id": 8,
        "name": "Usufructo"
    },
    {
        "id": 9,
        "name": "Acceso a tierras"
    },
    {
        "id": 10,
        "name": "Arraigo"
    },
    {
        "id": 11,
        "name": "Técnica"
    }]);



const options = ref([
  { id: 2, label: "Completitud de los datos" },
  { id: 3, label: "Representante núcleo familiar" },
  { id: 4, label: "Personas del núcleo familiar" },
  { id: 5, label: "Hectárea" },
  { id: 6, label: "Lugar de residencia" },
  { id: 7, label: "Georeferenciación" },
  { id: 8, label: "Usufructo" },
  { id: 9, label: "Acceso a tierras" },
  { id: 10, label: "Arraigo" },
  { id: 11, label: "Técnica" }
]);



const headers: any[] = [
  { key: 'id', title: t("commons.common.id"), width: "auto", align: "start", sortable: false },
  { key: 'identificacionorganizacion', title: "Num. identificación", width: "auto", align: "start",  searchable: true, sortable: false, },
  { key: 'cedularepresentante', title: "CC Representante", width: "auto", align: "start",  searchable: true, sortable: false, },
  { key: 'grupoproductores', title: "Nombre", width: "auto", align: "start",  searchable: true, sortable: false, },
  { key: 'departamentoinfluencia', title: "Dep. Influencia", width: "auto", align: "start", sortable: false, },
  { key: "municipioinfluencia", title: "Mun. Influencia", width: "auto", align: "start", sortable: false, },
  { key: 'number_completed', title: "Validados", width: "auto", align: "start", sortable: false, },
  { key: 'number_uncompleted', title: "No Validados", width: "auto", align: "start", sortable: false, },
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

      console.log(response.data);

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
});


const fnReloadTable = () => {
  formModal.value = false;
  formModalValidate.value = false;
  drawRefresh.value = uUtils.createUUID();
}

const getValidationKey = async () => {
  try {
    const response = await axios.get(`/api/1.0/core/media/generatekey/`);
    validationKey.value = response.data;
  } catch (error) {
    console.error("Error fetching validation items:", error);
  }
};

const modalValidados = async (item: any, tipo: string='si') => {
  try {
    let loader = uLoading.show({});
    const response = await axios.get(`/api/1.0/core/validationregister/filterbydocumentnumber/${item.cedularepresentante}/1/${tipo}`);
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
  console.log(enlace.href);
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
}

const isUserAdmin = computed(() => {
  try {
    return uAuth.getUserData().role == 1;
  } catch (error) {
    return false;
  }
  return false;
});

const menuItems = computed(() => {
  if (isUserAdmin.value) {
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
    identificationnumber.value = item.cedularepresentante;
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