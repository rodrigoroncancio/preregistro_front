<template>
  <v-container>
    <h1 class="mb-4">Ficha de acuerdo Catatumbo</h1>
    <v-card>
      <v-card-text class="pa-0">
        <exp-data-table
          uuid="table-ficha_acuerdo2"
          :showHeader="false"
          :endpoint="`${endpoint}/catatumbofichaacuerdo/filterbysurvey/9`"
          :drawRefresh="drawRefresh"
          :headers="headers"
          :extraMenuItems="[
            {
              title: $t('modules.core.validate'),
              icon: 'mdi-check-all',
              action: 'validate'
            },
            {
              title: 'Nucleo familiar',
              icon: 'mdi-account-group',
              action: 'nucleo'
            },
            { title: 'Ficha', action: 'ficha', icon: 'mdi-text-box-search-outline' },
          ]"
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
          :fomularioid="9"
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
    :width="950"
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
              <th class="py-3 px-4">&nbsp;</th>
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
              <td>{{ item.user_name }}</td>
              <td class="py-3 px-4" width="100%">
                <template v-if="item.attachment">
                  <v-btn @click="downloadDocument(item, 2)" variant="text" color="green" block>
                    Ver evidencia
                  </v-btn>
                </template>
                <template v-else> 
                  <v-btn variant="text" color="red" block disabled>Sin Evidencia</v-btn>
                </template>
              </td>
              <td>
                <v-icon 
                  v-if="item.id !== null" 
                  color="red" 
                  size="32" 
                  @click="confirmDelete(item.id)">
                  mdi-delete
                </v-icon>
                <v-icon 
                  v-else 
                  color="gray" 
                  size="32" 
                  disabled>
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
      </v-col>
    </v-row>          
  </exp-modal-form>
  <exp-modal-form
    title="Nucleo familiar"
    width="80%"
    v-model="forModalNucleo"
    :btnSave="false"
  >
    <v-row>
      <v-col cols="12" >
        <div v-if="itemsNucleo.length === 0">No tiene ingresado nucleo familiar</div>
        <v-table v-if="itemsNucleo.length >0" :options="{ responsive: true, autoWidth: false }" class="display">
          <thead>
            <tr>
              <th class="py-3 px-4">Identificación</th>
              <th class="py-3 px-4">Nombre</th>
              <th class="py-3 px-4">Parentesco</th>
              <th class="py-3 px-4">Fecha de Nacimiento</th>
              <th class="py-3 px-4">sexo</th>
              <th class="py-3 px-4">estado civil</th>
              <th class="py-3 px-4">Especial</th>
              <th class="py-3 px-4">Doc Frente</th>
              <th class="py-3 px-4">Doc Atras</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="persona in itemsNucleo" :key="persona.id">
              <td class="py-3 px-4">{{ persona.numero_identificacion }}</td>
              <td class="py-3 px-4">{{ persona.nombre }}</td>
              <td class="py-3 px-4">{{ persona.parentesco }}</td>
              <td class="py-3 px-4">{{ persona.fecha_nacimiento }}</td>
              <td class="py-3 px-4">{{ persona.sexo }}</td>
              <td class="py-3 px-4">{{ persona.estado_civil }}</td>
              <td class="py-3 px-4">{{ persona.grupo_especial }}</td>
              <td class="py-3 px-4">
                <template v-if="persona.foto_doc_frente">
                  <v-btn @click="downloadDocument(persona, 3, persona.foto_doc_frente)" color="green" block>
                    <v-icon>mdi-file-download</v-icon> Ver
                  </v-btn>
                </template>
                <template v-else>
                  <span class="text-gray-500">No disponible</span>
                </template>
              </td>
              <td class="py-3 px-4">
                <template v-if="persona.foto_doc_atras">
                  <v-btn @click="downloadDocument(persona.foto_doc_atras, 3)" color="green" block>
                    <v-icon>mdi-file-download</v-icon> Ver
                  </v-btn>
                </template>
                <template v-else>
                  <span class="text-gray-500">No disponible</span>
                </template>
              </td>
            </tr>
          </tbody>
        </v-table>
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
import Swal from "sweetalert2";

const itemsNucleo = ref([]);
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
  { key: 'number_completed', title: "Validados", width: "auto", align: "start", sortable: false, },
  { key: 'number_uncompleted', title: "Alertas", width: "auto", align: "start", sortable: false, },
  { key: 'fecha_creacion', title: "Fecha Creación", width: "auto", align: "start", sortable: false, },
  { key: "actions", title: t("commons.common.actions"), width: "90px", type: "actions", sortable: false, },
];
const drawRefresh = ref("");
const validationKey = ref("");
const formModal = ref(false);
const formModalValidate = ref(false);
const formModalDocumentos = ref(false);
const formModalValidados = ref(false);
const forModalNucleo = ref(false);
const itemsValidation = ref<Array<{ id: number; label: string }>>([]);
const itemsDocuments = ref([]);
const itemsValidados = ref([]);
const itemsValidadosBase = ref([]);

const getItemsValidadosBase = async () => {
  try {
    const response = await axios.get(`/api/1.0/core/validationregister/items-validacion/9/`);
    itemsValidadosBase.value = response.data;
  } catch (error) {
    console.error("Error fetching validation items:", error);
  }
};

const deleteItem = async (itemid: any) => {
  console.log('itemid')
  console.log(itemid)
  await axios.delete(`/api/1.0/core/validationregister/${itemid}/delete/`);
  Swal.fire("Eliminado", "El registro ha sido eliminado", "success");
  formModalValidados.value = false;  
  fnReloadTable()
}


const confirmDelete = (itemid: any) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esta acción. Se guardará los Datos del Usuario quien Eliminó y fecha de elimincación",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    customClass: {
      popup: "swal2-custom-zindex",
    }
  }).then((result) => {
    if (result.isConfirmed) {
      deleteItem(itemid);
      Swal.fire("¡Eliminado!", "El ítem ha sido eliminado.", "success");
    }
  });
};

const getValidationItems = async () => {
    let loader = uLoading.show({});
    itemsValidation.value = [];
    try {
      const response = await axios.get(
        `/api/1.0/core/validationregister/missing-validation-items/${identificationnumber.value}/9`
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
    const response = await axios.get(`/api/1.0/core/validationregister/filterbydocumentnumber/${item.numero_identificacion}/9/${tipo}`);
    itemsValidados.value = response.data;
    loader.hide();
    formModalValidados.value = true;
  } catch (error) {
    console.error("Error fetching validation items:", error);
  }
}

const downloadDocument = (item: any, tipo: number=1, ruta3: string='') => {
  const hostServer = import.meta.env.VITE_BASE_MEDIA;
  const idUser = uAuth.getUserData().id;
  const enlace = document.createElement('a');
  console.log('item');
  console.log(item.document , tipo);
  
  switch (tipo) {
    case 1:
      enlace.href = `${hostServer}/api/1.0/core/media/${validationKey.value}/${idUser}/?ruta=${item.document}`;
      break;
    case 2:
      enlace.href = `${hostServer}/api/1.0/core/media/${validationKey.value}/${idUser}/?ruta=${item.attachment}`;
      break;
    case 3:
      enlace.href = `${hostServer}/api/1.0/core/media/${validationKey.value}/${idUser}/?ruta=${ruta3}`;
      break;
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
    return ['view', 'validate','documents', 'nucleo', 'ficha']
  } else {
    return ['view', 'validate', 'documents', 'nucleo',  'ficha']
  }
});

const isValidForm = computed(() => {
  return false
});

const clickView = async (item: any) => {
  router.push(`/pnis/catatumboficha/open/${item.id}`);
};

const clickDocuments = (item: any) => {
  itemsDocuments.value = [];
  const ltsDocuments = [
    { field: 'foto_doc_frente', label: 'Foto de frente' },
    { field: 'foto_doc_atras', label: 'Foto de respaldo' },
    { field: 'tipo_documento_file', label: 'Documento de posesión' },
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
    identificationnumber.value = item.numero_identificacion;
    getValidationItems();
  }
  if (action === 'ficha') {
    router.push(`/catatumbo/docfirmado/${item.id}`);
  }
  if (action === 'nucleo') {
    getNucleoFamiliar(item.id)
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

const getNucleoFamiliar = async (fichaid: any) => {
    let loader = uLoading.show({});
    itemsNucleo.value = []; 
    try {
      const response = await axios.get(
        `/api/1.0/core/catatumbofichaacuerdo/getnucleo/${fichaid}/`
      );
      itemsNucleo.value = response.data.results
      console.log('response.data.results');
      console.log(response.data.results);
      forModalNucleo.value = true
    
      loader.hide()
    } catch (error) {
      console.error("Error fetching validation items:", error);
      loader.hide()
    }
  };
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