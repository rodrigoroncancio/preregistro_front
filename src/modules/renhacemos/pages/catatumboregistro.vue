<template>
  <v-container>
    <h1 class="mb-4">{{ $t('modules.pnis.catatumboindividual') }} {{ tipoTranslation }}</h1>
    <v-card>
      <v-card-text class="pa-0">
        <exp-data-table
          uuid="table-users_pnis"
          :endpoint="`${base_url2}/api/2.0/inscripciones/personavalidaciones/by-documento/0/${surveyId}`"
          :showHeader="false"
          :drawRefresh="drawRefresh"
          :headers="headers"
          apikey="gAAAAABoEqasTj16HrxYAWXiBUbdnPiY7PCa7z0m8Jd6pqDLxHNFiioBWptP-RCbId9JS2hr8DxR-QBXNeKNiy7aiqdb1iH3krEeG7KJA0imDbeUgdSjbLDFaQgfdWSX4I6hIHAhOS3A"
          :extraMenuItems="[{
            title: $t('modules.core.validate'),
            icon: 'mdi-check-all',
            action: 'validate'
          }]"
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
          <template v-slot:item.aprobados="{item}">
            <v-btn @click="modalValidados(item, 1)"  variant="flat" color="green" block>{{ item.aprobados }} / {{ numValidados }}</v-btn>
          </template>
          <template v-slot:item.noaprobados="{item}">
            <v-btn @click="modalValidados(item, 0)"  variant="flat" color="red" block>{{ item.noaprobados }}</v-btn>
          </template>
          <template v-slot:item.validado_final="{ item }">
            <v-icon 
              :color="item.validado_final === 'si' ? 'green' : 'red'" 
              size="32"
            >
              {{ item.validado_final === 'si' ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
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
          :fomularioid="formularioPersonaSelected"
          @onClickSave="fnReloadTable"
        />
      </v-col>
    </v-row>
  </exp-modal-form>

  <exp-modal-form
    :title="$t('modules.pnis.modal_title_validateitems')"
    :width="450"
    v-model="formModalValidate"
    :btnSaveEnabled="itemsValidation.length > 0"
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
              <th class="py-3 px-4">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in itemsValidados"
              :key="index"
              :class="index % 2 === 0 ? 'shadow-md bg-gray-50' : ''"
            >
              <td class="py-3 px-4">
                {{ itemsValidadosBase.find(option => option.id === item.validacion_item)?.rolname || '-' }}
              </td>
              <td class="py-3 px-4">  
                  {{ itemsValidadosBase.find(option => option.id === item.validacion_item)?.descripcion || 'Sin nombre' }}
              </td>
              <td class="py-3 px-4">
                {{ item.aprobado === true ? 'Cumple' : item.aprobado === false ? 'No Cumple' : 'Sin establecer' }}
              </td>
              <td class="py-3 px-4 observation-cell">
                {{ item.observacion || 'Sin observación' }}
              </td>
              <td>{{item.nombre_completo}}</td>
              <td class="py-3 px-4">
                <template v-if="item.attachment">
                  <v-btn @click="downloadDocument(item, 2)" variant="text" color="green" block>
                    Ver evidencia
                  </v-btn>
                </template>
                <template v-else> <v-btn variant="text" color="red" block disabled>Sin Evidencia</v-btn></template>
              </td>
              <td>
                <v-icon
                  :color="item.id ? 'red' : 'grey lighten-1'"
                  size="32"
                  @click="item.id ? confirmDelete(item.id) : null"
                  class="cursor-pointer"
                  :style="{ pointerEvents: item.id ? 'auto' : 'none', opacity: item.id ? 1 : 0.4 }"
                >
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
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import useAuth from "@/modules/auth/composables/useAuth";
import expDataTable from "@/components/expDataTable";
import expModalForm from "@/components/expModalForm";
import frmValida from "./forms/validaitems.vue";
import useUtils from "@/composables/useUtils";
import axios from "axios";
import { useLoading } from "vue-loading-overlay";
import Swal from "sweetalert2";
import { useRoute } from 'vue-router';
const route = useRoute();
import { getApiKey } from '@/helpers/apiKey';
import cleanAxios from '@/helpers/cleanAxios';

const apikey = getApiKey
const tipo = route.params.id;
const formularioPersonaSelected = ref(0)
const base_url2 = ''
const surveyId = route.params.id;

const apiGet = (url: string) => {
  return cleanAxios.get(url, {
    headers: {
      'Authorization': `Api-Key ${getApiKey()}`,
    }
  });
};

const apiDelete= (url: string) => {
  return cleanAxios.delete(url, {
    headers: {
      'Authorization': `Api-Key ${getApiKey()}`,
    }
  });
};


const apiUrl = ref<string>('')

const tipoTranslation = computed(() => {
  switch (tipo) {
    case '5':
      return 'propietario';
    case '2':
      return 'desplazados';
    case '6':
      return 'extranjeros';
    case '4':
      return'arrendatarios y amedieros';
    default:
      return ''; // Si 'tipo' no es ninguno de los valores especificados
  }
});

const uLoading = useLoading();
const endpoint = "/api/1.0/core";
const { t } = useI18n();
const router = useRouter();
const uAuth = useAuth();
const uUtils = useUtils();

const validationid = ref(null); // v-model para el radio group
const identificationnumber = ref(null);
const rolsActual = ref([]);

const headers: any[] = [
  { key: 'numero_documento', title: "Num. identificación", width: "auto", align: "start",  searchable: true, sortable: false, },
  { key: 'nombre', title: "Nombre", width: "auto", align: "start",  searchable: true, sortable: false, },
  { key: 'apellido', title: "Apellidos", width: "auto", align: "start", searchable: true, sortable: false, },
  { key: 'aprobados', title: "Validados", width: "auto", align: "start", sortable: false, },
  { key: 'noaprobados', title: "Alertas", width: "auto", align: "start", sortable: false, },
  // { key: 'validado_final', title: "Superv.", width: "auto", align: "start", sortable: false, },
  { key: "actions", title: t("commons.common.actions"), width: "90px", type: "actions", sortable: false, },
  { key: 'formulario_persona', title: 'Formulario Persona', visible: false },
  { key: 'formularioid', title: 'formularioid', visible: false },
  { key: 'id', title: 'id', visible: false },
];
const drawRefresh = ref("");
const validationKey = ref("");
const formModalValidadosTitulo = ref("");

const formModal = ref(false);
const formModalValidate = ref(false);
const formModalDocumentos = ref(false);
const formModalValidados = ref(false);
const itemsValidation = ref<Array<{ id: number; label: string }>>([]);
const itemsDocuments = ref([]);
const itemsValidados = ref([]);
const itemsValidadosBase = ref([]);
const numValidados = ref(0);

const deleteItem = async (itemid: any) => {
  console.log('itemid')
  console.log(itemid)
  await apiDelete(`/api/1.0/inscripciones/validacionesitems_persona/${itemid}/`);
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
    // const response = await axios.get(
    //   `/api/1.0/core/validationregister/missing-validation-items/${identificationnumber.value}/4`
    // );

    const response = await apiGet(`${base_url2}/api/2.0/validacion/item-persona/missing-validation-items/${identificationnumber.value}/${surveyId}`)
    // Verifica si response.data tiene la estructura esperada
    if (response.data.missing_items) {
      itemsValidation.value = response.data.missing_items.map((item: any) => ({
        id: item.id,
        label: item.nombre || item.descripcion || "Sin nombre",
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

const getItemsValidadosBase = async () => {
  try {
    // const response = await axios.get(`/api/1.0/core/validationregister/items-validacion/4/`);

    const response = await apiGet(`${base_url2}/api/2.0/validacion/item/by-form/${surveyId}`)
    itemsValidadosBase.value = response.data;
    numValidados.value = response.data.length
  } catch (error) {
    console.error("Error fetching validation items:", error);
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

const modalValidados = async (item: any, tipo: number) => {
  try {
    let loader = uLoading.show({});
    formModalValidadosTitulo.value = tipo == 1 ? 'Items validados' : 'Alertas';
    // const response = await axios.get(`/api/1.0/core/validationregister/filterbydocumentnumber/${item.numero_documento}/4/${tipo}`);
    // api/2.0/inscripciones/personavalidaciones/by-documento/0/18/
    const response = await apiGet(`${base_url2}/api/2.0/validacion/item-persona/filterbydocumentnumber/${item.numero_documento}/${surveyId}/${tipo}`)
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
  if (tipo == 1) {
    enlace.href = `${hostServer}/api/1.0/core/media/${validationKey.value}/${idUser}/?ruta=${item.document}`;
  } else {
    enlace.href = `${hostServer}/api/1.0/core/media/${validationKey.value}/${idUser}/?ruta=${item.attachment}`;
  }
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
}

onMounted(async () => {
  getValidationKey();
  getItemsValidadosBase();
  const role = uAuth.getUserRole();
  console.log('role')
  console.log(role)
  rolsActual.value = role
});

const fnReloadTable = () => {
  formModal.value = false;
  formModalValidate.value = false;
  drawRefresh.value = uUtils.createUUID();
}

const menuItems = computed(() => {
  if (uAuth.isAdmin()) {
    return ['view', 'validate', 'validate_super', 'documents'];
  } else if (rolsActual.value.includes(1) || rolsActual.value.includes(3)) {
    return ['view', 'validate', 'validate_super', 'documents'];
  } else if (uAuth.isAudit()) {
    return ['view', 'documents'];
  } else {
    return ['view'];
  }
});

const isValidForm = computed(() => {
  return false
});

const clickView = async (item: any) => {
  router.push(`/renhacemos/catatumbo/registro/open/${item.id}`);
};

const clickDocuments = (item: any) => {
  itemsDocuments.value = [];
  const ltsDocuments = [
    { field: 'foto_documento_frente', label: 'Foto de frente' },
    { field: 'foto_documento_respaldo', label: 'Foto de respaldo' },
    { field: 'fototenencia', label: 'Foto de tenencia' }
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
  console.log('item, action');
  console.log(item, action);
  if (action === 'validate') {
    formModalValidate.value = true;
    identificationnumber.value = item.numero_documento;
    getValidationItems();
    formularioPersonaSelected.value = item.formulario_persona
  }
  if (action === 'validate_super') {
    identificationnumber.value = item.numero_documento;
    clickSelectSuperForm();
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

const clickSelectSuperForm = () => {
  console.log('clickSelectSuperForm');
  validationid.value = 0;
  formModal.value = true;
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

/* Asegura que el SweetAlert2 esté por encima del modal */
.swal2-custom-zindex {
  z-index: 20000 !important;
}

/* Reducir z-index del modal de Vuetify */
.v-overlay.v-overlay--active {
  z-index: 1050 !important;
}

/* Asegurar que SweetAlert2 siempre esté encima */
.swal2-container {
  z-index: 1100 !important;
}
.swal2-container {
  z-index: 9999 !important;
}

</style>
