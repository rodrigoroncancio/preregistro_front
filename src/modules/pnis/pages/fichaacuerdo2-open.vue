<template>
  xxxx

  <!-- <v-btn @click="clickSave()">Guardar</v-btn> -->
</template>


<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { useRoute } from 'vue-router';
import axios from "axios";

const endpoint = "/api/1.0/core";
const route = useRoute();
const surveyId = route.params.id;

import useAuth from "@/modules/auth/composables/useAuth";
import useCrud from "@/composables/useCrud";
import useUtils from "@/composables/useUtils";
import expDynamicForm from "@/components/expDynamicForm";
import useAuthStore from "@/modules/auth/stores/auth";

const uCrud = useCrud(`${endpoint}/userpnis`);
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




const tab = ref(0);

const passwordData = ref();




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


onMounted(async () => {
});



</script>

<style lang="scss">

</style>