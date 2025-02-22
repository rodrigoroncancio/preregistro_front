<template>
  <v-container>
    <h1 class="mb-4">{{ $t('modules.core.userspnis') }}</h1>
    <v-card>
      <v-card-text class="pa-0">
        <exp-data-table
          uuid="table-users_pnis"
          :endpoint="`${endpoint}/userpnis`"
          :drawRefresh="drawRefresh"
          :headers="headers"
          :extraMenuItems="[]"
          :menuItems="['edit', 'delete', 'password']"
          :labelNew="'modules.core.new_userspnis'"
          @onClickNew="clickNew"
          @onClickEdit="clickEdit"
          @onClickDelete="clickDelete"
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

</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import expDataTable from "@/components/expDataTable";


const endpoint = "/api/1.0/core";
const { t } = useI18n();
const router = useRouter();

const headers: any[] = [
  { key: 'id', title: t("commons.common.id"), width: "auto", align: "start", sortable: true },
  { key: 'identificationnumber', title: "Num. identificación", width: "auto", align: "start",  searchable: true, sortable: true, },
  { key: 'name', title: "Nombre", width: "auto", align: "start",  searchable: true, sortable: true, },
  { key: 'lastname', title: "Apellidos", width: "auto", align: "start", sortable: true, },
  { key: "actions", title: t("commons.common.actions"), width: "90px", type: "actions", sortable: false, },
];
const drawRefresh = ref("");
const staffId = ref();

const profileModal = ref(false);
const passwordModal = ref(false);

onMounted(async () => {});

const clickNew = () => {
  staffId.value = null;
  profileModal.value = true;
};

const clickEdit = async (item: any) => {
  router.push(`/pnis/fichaacuerdo/open/${item.id}`);
};


const clickAction = (item: any, action: string) => {
  staffId.value = item.id;
  passwordModal.value = true;
};

const clickDelete = (item: any) => {
  //console.log(item);
};

const onSaveProfile = (uuid: string) => {
  drawRefresh.value = uuid;
  profileModal.value = false;
}
</script>

<style lang="scss">

</style>