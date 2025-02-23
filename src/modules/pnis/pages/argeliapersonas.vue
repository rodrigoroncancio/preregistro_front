<template>
  <v-container>
    <h1 class="mb-4">{{ $t('modules.pnis.argeliapersonas') }}</h1>
    <v-card>
      <v-card-text class="pa-0">
        <exp-data-table
          uuid="table-users_pnis"
          :endpoint="`${endpoint}/argeliapersonas/filterbysurvey/2`"
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
        >
          <template v-slot:item.is_superuser="{item}">
            <v-icon v-if="item.is_superuser" color="blue" class="mr-2">
              mdi-account-tie
            </v-icon>
            <v-icon v-else color="green" class="mr-2">
              mdi-account-hard-hat
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
            v-for="option in options" 
            :key="option.id" 
            :label="option.label" 
            :value="option.id"
          />
        </v-radio-group>
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

const endpoint = "/api/1.0/core";
const { t } = useI18n();
const router = useRouter();
const uAuth = useAuth();
const uUtils = useUtils();

const validationid = ref(null); // v-model para el radio group
const identificationnumber = ref(null);

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
  { key: 'id', title: t("commons.common.id"), width: "auto", align: "start", sortable: true },
  { key: 'identificacion', title: "Num. identificación", width: "auto", align: "start",  searchable: true, sortable: true, },
  { key: 'nombres', title: "Nombre", width: "auto", align: "start",  searchable: true, sortable: true, },
  { key: 'apellidos', title: "Apellidos", width: "auto", align: "start", sortable: true, },
  { key: 'number_completed', title: "Validados", width: "auto", align: "start", sortable: false, },
  { key: "actions", title: t("commons.common.actions"), width: "90px", type: "actions", sortable: false, },
];
const drawRefresh = ref("");

const formModal = ref(false);
const formModalValidate = ref(false);

onMounted(async () => {});

const fnReloadTable = () => {
  formModal.value = false;
  formModalValidate.value = false;
  drawRefresh.value = uUtils.createUUID();
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
    return ['view', 'validate']
  }
});

const isValidForm = computed(() => {
  return false
});

const clickView = async (item: any) => {
  router.push(`/pnis/argeliapersonas/open/${item.id}`);
};

const clickAction = (item: any, action: string) => {
  if (action === 'validate') {
    formModalValidate.value = true;
    console.log(item);
    identificationnumber.value = item.identificacion;
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
</script>

<style lang="scss">

</style>