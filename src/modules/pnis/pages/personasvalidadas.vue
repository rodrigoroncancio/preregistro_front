<template>
  <v-container>
    <h1 class="mb-4">{{ $t('modules.pnis.personasvalidadas_title') }}</h1>
    <v-card>
      <v-card-text class="pa-0">
        <exp-data-table
          uuid="table-users_validated"
          :endpoint="`${endpoint}/validationregister/personas-validadas/argelia`"
          :drawRefresh="drawRefresh"
          :headers="headers"
          :menuItems="menuItems"
          @onClickEdit="clickEdit"
          @onClickView="clickView"
          @onClickAction="clickAction"
        >
        </exp-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import useAuth from "@/modules/auth/composables/useAuth";
import expDataTable from "@/components/expDataTable";
import { useLoading } from "vue-loading-overlay";

const uLoading = useLoading();
const endpoint = "/api/1.0/core";
const { t } = useI18n();
const router = useRouter();
const uAuth = useAuth();

const headers: any[] = [
  { key: 'cupo', title: "Cupo", width: "auto", align: "start", sortable: true },
  { key: 'numero_documento', title: "Num. identificación", width: "auto", align: "start",  searchable: true, sortable: false, },
  { key: 'nombres', title: "Nombre", width: "auto", align: "start",  searchable: false, sortable: false, },
  { key: 'apellidos', title: "Apellidos", width: "auto", align: "start", sortable: false, },
  { key: "telefono", title: "Telefono", width: "auto", align: "start", sortable: false, },
  { key: "departamento", title: "Departamento", width: "auto", align: "start", sortable: false, },
  { key: "municipio", title: "Municipio", width: "auto", align: "start", sortable: false, },
  { key: "corregimiento", title: "Corregimiento", width: "auto", align: "start", sortable: false, },
  { key: "vereda", title: "Vereda", width: "auto", align: "start", sortable: false, },
];
const drawRefresh = ref("");


onMounted(async () => {});

const menuItems = computed(() => {
  if (uAuth.isAudit()) {
    return ['view']
  } else if (uAuth.isAdmin()) {    
    return ['view', 'edit', 'validate']
  } else {
    return ['view', 'validate']
  }
});

const clickEdit = async (item: any) => {
  // router.push(`/pnis/fichaacuerdo/open/${item.id}`);
};

const clickAction = (item: any, action: string) => {
  // if (action === 'validate') {
  //   formModalValidate.value = true;
  //   console.log(item);
  //   identificationnumber.value = item.identificationnumber || item.identificacionorganizacion;
  //   getValidationItems();
  // }
};

const clickView = (item: any) => {
  // router.push(`/pnis/fichaacuerdo/open/${item.id}`);
};
</script>

<style lang="scss">

</style>