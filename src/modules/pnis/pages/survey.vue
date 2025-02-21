<template>
  <exp-dynamic-form
    v-model="formData"
    :schema="(formSchema as any)"
    variant="outlined"
    density="compact"
    hide-details="true"
  >
  </exp-dynamic-form>

  <v-btn @click="clickSave()">Guardar</v-btn>
</template>


<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

const endpoint = "/api/1.0/core";

import useAuth from "@/modules/auth/composables/useAuth";
import useCrud from "@/composables/useCrud";
import useUtils from "@/composables/useUtils";
import expDynamicForm from "@/components/expDynamicForm";
import useAuthStore from "@/modules/auth/stores/auth";

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
});

const itemsRole = [
  { id: true, label: t("modules.auth.admin") },
  { id: false, label: t("modules.auth.staff") },
];
const tab = ref(0);
const formDataDefault = {
  first_name: "", last_name: "", email: "", phone: "", url_image: "",
  staff_info: {
    image: "",
    url_image: "",
    phone: ""
  }
};
const formData = ref({ ...formDataDefault });
const passwordData = ref();

let formSchema = [
  { key: "is_active", type: "switch", col:"md-12", title: t("modules.auth.active"), required: true },
  { key: "is_superuser", type: "select", col:"md-12", items: itemsRole, title: t("modules.auth.role"), required: true },
  { key: "first_name", type: "text", col:"md-6", title: t("modules.auth.first_name"), required: true },
  { key: "last_name", type: "text", col:"md-6", title: t("modules.auth.last_name"), required: true },
  { key: "email", type: "email", title: t("commons.common.email"), required: true },
  { key: "phone", type: "text", title: t("commons.common.phone"), required: true },
  { key: "phone1", type: "text", title: t("commons.common.phone"), required: true },
  { key: "phone2", type: "editor", col:"md-6", title: t("commons.common.phone"), required: true },
  { key: "cedula", type: "text", col:"md-6", title: "cedula", required: true },
  
  // { key: "switch1", type: "date", col:"md-6", title: t("commons.common.phone"), required: true },
];

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
const validate = useVuelidate(rules, formData);

onMounted(async () => {
  tab.value = 0;
  if (props.id != null) {
    await uCrud
      .retrieve(props.id)
      .then((item: any) => {
        if (item.staff_info == null) {
          item.staff_info = {};
        }
        Object.assign(formData.value, { ...item });
        if (uUtils.isset(item.staff_info.image)) {
          formData.value.staff_info.url_image = uUtils.getUrlImg(item.staff_info.image ?? '');
        }
        if (uUtils.isset(item.staff_info.phone)) {
          formData.value.phone = item.staff_info.phone;
        }
      });
  } else {
    Object.assign(formData.value, { id: null, ...formDataDefault });
  }
});

const clickSave = async () => {
  validate.value.$touch();
  if (!validate.value.$invalid) {
    let data = { ...formData.value };
    data.staff_info.phone = data.phone;

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
    alert('error')
  }
};

const emit = defineEmits(["onSave"]);
</script>

<style lang="scss">

</style>