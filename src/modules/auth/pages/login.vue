<template>
  <v-main v-if="showLogin">
    <v-container width="400" class="text-center">
      <v-row>
        <v-col class="text-center mb-6">
          <v-img :src="'/src/assets/img/header-colombia.png'" :width="360" class="mx-auto" />
        </v-col>
      </v-row>
      <v-form fast-fail @submit.prevent="true">
        <v-card class="elevation-12 card-login">
          <h2 class="text-center bg-primary text-white">
            <v-img class="mx-auto"src="/src/assets/img/logo.png"></v-img>
          </h2>
          <v-card-text class="pa-8">
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="formData.username"
              :label="$t('modules.auth.username')"
              type="text"
            ></v-text-field>
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="formData.password"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              :label="$t('modules.auth.password')"
              @click:append-inner="showPassword = !showPassword"
            />
            <div class="mt-2 text-center">
              <v-btn
                type="submit"
                color="#3bc067"
                size="large"
                block
                @click="onLogin"
                :disabled="!enableLogin"
                >{{ $t("modules.auth.sing_in") }}</v-btn
              >
            </div>
            <!-- <div class="mx-auto text-center mt-4">{{ $t('modules.auth.forgotten_password') }}</div> -->
          </v-card-text>
        </v-card>
      </v-form>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { toRefs, ref, reactive, computed, onMounted } from "vue";

import { useRouter } from "vue-router";
import useGlobal from "@/composables/useGobal";
import useGlobalState from "@/stores/global";
import useAuth from "@/modules/auth/composables/useAuth";

import { useLoading } from "vue-loading-overlay";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";

const loading = useLoading({
  /* options */
});
const auth = useAuth();
const router = useRouter();
const UseGlobal = useGlobal();

const sGlobalState = useGlobalState();
const toast = UseGlobal.useToast();
const errors = UseGlobal.useErrors();

const rules = {
  username: { required, minLength: minLength(2) },
  password: { required, minLength: minLength(5) },
};
const showPassword = ref(false);
const formData = reactive({
  username: "",
  password: "",
});
const showLogin = ref(false);

const validate = useVuelidate(rules, toRefs(formData));

const enableLogin = computed(() => {
  return validate.value != null && !validate.value.$invalid;
});

const isAuthenticated = computed(() => {
  if (auth.isAuthenticated() && sGlobalState.value.auth) {
    return true;
  } else {
    sGlobalState.value.auth = false;
    return false;
  }
});

onMounted(async () => {
  if (isAuthenticated.value) {
    router.push({ name: "core-index" });
  } else {
    showLogin.value = true;
  }
});

const onLogin = async () => {
  validate.value.$touch();
  if (!validate.value.$invalid) {
    let loader = loading.show({});
    auth.authLogIn(formData)
      .then(() => {
        router.push({ name: "core-index" });
      })
      .catch((err) => {
        toast.toastError(errors.byText(err.response.data.msg));
      })
      .finally(() => {
        loader.hide();
      });
  }
};
</script>

<style scoped lang="scss">
.v-main {
  min-height: calc(100vh - 65px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-container {
  height: 100%;
}
</style>