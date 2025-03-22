<template>
  <v-container>
    <h1 class="mb-4">Ficha de acuerdo Fase 2</h1>
    <v-card>
      <v-card-text class="pa-0">
        <exp-data-table
          uuid="table-ficha_acuerdo2"
          :endpoint="`${endpoint}/fichaacuerdofase2`"
          :drawRefresh="drawRefresh"
          :headers="headers"
          :extraMenuItems="[{ title: 'Ficha', action: 'ficha', icon: 'mdi-text-box-search-outline' }]"
          :menuItems="menuItems"
          :labelNew="'modules.core.new_userspnis'"
          @onClickView="clickView"
          @onClickDocuments="clickDocuments"
          @onClickAction="clickAction"
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
          :fomularioid="2"
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
    :btnSave="false"
    @fnSave="clickSelectFormDocuments"
    :btnSaveText="$t('modules.core.select')"
  >
    <v-row>
      <v-col cols="12" v-for="(item, index) in itemsDocuments" :key="index">
        <v-btn @click="downloadDocument(item, 1)" color="green" block><v-icon>mdi-file-download</v-icon> {{ item.label }}</v-btn>
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
        <v-table class="w-">
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

const headers: any[] = [
  { key: 'id', title: t("commons.common.id"), width: "auto", align: "start", sortable: false },
  { key: 'numero_identificacion', title: "Num. identificación", width: "auto", align: "start",  searchable: true, sortable: false, },
  { key: 'nombre', title: "Nombre", width: "auto", align: "start",  searchable: true, sortable: false, },
  { key: 'linea_productiva', title: "Linea productiva", width: "auto", align: "start", searchable: true, sortable: false, },
  { key: "actions", title: t("commons.common.actions"), width: "90px", type: "actions", sortable: false, },
];
const drawRefresh = ref("");
const validationKey = ref("");
const formModal = ref(false);
const formModalValidate = ref(false);
const formModalDocumentos = ref(false);
const formModalValidados = ref(false);
const itemsValidation = ref<Array<{ id: number; label: string }>>([]);
const itemsDocuments = ref([]);
const itemsValidados = ref([]);
const itemsValidadosBase = ref([]);

const getItemsValidadosBase = async () => {
  try {
    const response = await axios.get(`/api/1.0/core/validationregister/items-validacion/3/`);
    itemsValidadosBase.value = response.data;
  } catch (error) {
    console.error("Error fetching validation items:", error);
  }
};

const getValidationItems = async () => {
    let loader = uLoading.show({});
    itemsValidation.value = [];
    try {
      const response = await axios.get(
        `/api/1.0/core/validationregister/missing-validation-items/${identificationnumber.value}/3`
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
    const response = await axios.get(`/api/1.0/core/validationregister/filterbydocumentnumber/${item.identificacion}/3/${tipo}`);
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

onMounted(async () => {
  getValidationKey();
  getItemsValidadosBase();
});

const fnReloadTable = () => {
  formModal.value = false;
  formModalValidate.value = false;
  drawRefresh.value = uUtils.createUUID();
}

const menuItems = computed(() => {
  if (uAuth.isAudit()) {
    return ['view', 'documents']
  } else if (uAuth.isAdmin()) {    
    return ['view', 'validate','documents', 'ficha']
  } else {
    return ['view', 'validate', 'documents', 'ficha']
  }
});

const isValidForm = computed(() => {
  return false
});

const clickView = async (item: any) => {
  router.push(`/pnis/fichaacuerdo2/open/${item.id}`);
};

const clickDocuments = (item: any) => {
  itemsDocuments.value = [];
  const ltsDocuments = [
    { field: 'foto_doc_frente', label: 'Foto de frente' },
    { field: 'foto_doc_atras', label: 'Foto de respaldo' },
    { field: 'tipo_documento_file', label: 'Documento de posecion' },
    { field: 'predio1_documento_arraigo', label: 'Documento de posecion Predio 1' },
    { field: 'predio2_documento_arraigo', label: 'Documento de posecion Predio 2' },
    { field: 'predio3_documento_arraigo', label: 'Documento de posecion Predio 3' },
    { field: 'predio4_documento_arraigo', label: 'Documento de posecion Predio 4' },
    { field: 'predio5_documento_arraigo', label: 'Documento de posecion Predio 5' },
    { field: 'predio6_documento_arraigo', label: 'Documento de posecion Predio 6' },
    { field: 'predio7_documento_arraigo', label: 'Documento de posecion Predio 7' },
    { field: 'predio8_documento_arraigo', label: 'Documento de posecion Predio 8' },
    { field: 'predio9_documento_arraigo', label: 'Documento de posecion Predio 9' },
    { field: 'predio10_documento_arraigo', label: 'Documento de posecion Predio 10' },
    { field: 'documento_pertenencia_etnica_file', label: 'Doc. Pertenencia' },
    { field: 'firma_file', label: 'Firma' }
  ];
  ltsDocuments.forEach(async (doc) => {
    if (doc.field in item && item[doc.field]) {
      itemsDocuments.value.push({
        document: item[doc.field],
        label: doc.label
      });
    }
  });
  formModalDocumentos.value = true;
};

const clickAction = (item: any, action: string) => {
  console.log(item, action);
  if (action === 'validate') {
    formModalValidate.value = true;
    console.log(item);
    identificationnumber.value = item.identificacion;
    getValidationItems();
  }
  if (action === 'ficha') {
    router.push(`/argelia/docfirmado/${item.id}`);
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

const clickSelectFormDocuments = (item: any) => {
  console.log('clickSelectFormDocuments');
  console.log(validationid.value);
  console.log(item);
}
</script>

<style lang="scss">
.observation-cell {
  /* Permite que el texto se envuelva y expanda la celda verticalmente */
  white-space: normal;
  word-wrap: break-word;
}
.container-documents  {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.button-documents {
    width: 100%;
    max-width: 400px;
    padding: 15px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #4CAF50, rgb(59, 192, 103));
    color: black;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.button-documents:hover {
    background: linear-gradient(135deg, #4CAF50, rgb(59, 192, 103));
}
</style>