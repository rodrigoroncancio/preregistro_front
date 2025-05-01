<template>
  <v-app v-show="isAuthenticated">
    <v-main>
      <router-view />
    </v-main>
    <v-footer color="#3bc067">
      <expFooterBar />
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from "vue";

import { useRouter } from "vue-router";
import useAuth from "@/modules/auth/composables/useAuth";
import useGlobalState from "@/stores/global";

import expFooterBar from "@/components/expBars/footer.vue";

const sGlobalState = useGlobalState();
const router = useRouter();
const auth = useAuth();

const isAuthenticated = computed(() => {
  if (auth.isAuthenticated() && sGlobalState.value.auth) {
    return true;
  } else {
    sGlobalState.value.auth = false;
    return false;
  }
});

watch(isAuthenticated, (currentValue) => {
  if (currentValue)
    router.push({ name: "core-index" });
});
</script>

<style scoped>
.v-application {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-image: url("/src/assets/img/bg-backgound.jpg");
  background-size: contain;
}

.v-main {
  flex: 1;
  height: auto;
  position: relative;
}

.v-footer {
  flex-shrink: 0;
  max-height: 65px;
}
</style>