<template>
  <v-navigation-drawer v-model="value" class="wrap-menu">
    <img src="/src/assets/img/logo.png" class="imglogo" />
    <v-list density="compact" nav>
      <exp-item v-for="(item, index) in itemsMenuFiltered" :key="index" :item="item"></exp-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import useAuth from "@/modules/auth/composables/useAuth";
import expItem from "./expItem.vue";

const uAuth = useAuth();

const props = defineProps({
  modelValue: Boolean,
  modelModifiers: { default: () => ({}) },
});

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const userData = uAuth.getUserData()
const itemsMenuFiltered = computed({
  get() {
    let _itemsFiltered: any = []
    itemsMenu.forEach(item => {
      if ('roles' in item) {
        if ((item.roles as Array<number>).includes(userData.role)) {
          _itemsFiltered.push(item)
        }
      } else {
        _itemsFiltered.push(item)
      }
    });
    return _itemsFiltered;
  },
  set(value) {
    return value;
  }
});

const IS_ADMIN = 1;
const IS_STAFF = 2;

const itemsMenu = [
  {
    title: "commons.common.home",
    icon: "mdi-home",
    url: "/core",
  },
  {
    title: "modules.core.core",
    icon: "mdi-tools",
    roles: [IS_ADMIN],
    children: [{
      title: "modules.core.staff",
      icon: "mdi-account-hard-hat",
      url: "/core/staff",
    }]
  },
  {
    title: "modules.pnis.convocatoria_argelia",
    icon: "mdi-solar-panel",
    children: [{
      title: "modules.pnis.preregistroasociado",
      icon: "mdi-human-male-board-poll",
      url: "/pnis/argeliagrupo",
    },
    {
      title: "modules.pnis.preregistroindividual",
      icon: "mdi-human-male-board-poll",
      url: "/pnis/argeliapersonas",
    },
    {
      title: "modules.pnis.fichaacuerdo",
      icon: "mdi-human-male-board-poll",
      url: "/pnis/fichaacuerdo",
    },
    {
      title: "modules.pnis.fichaacuerdo2",
      icon: "mdi-human-male-board-poll",
      url: "/pnis/fichaacuerdo2",
    },
    {
      title: "modules.pnis.personasvalidadas",
      icon: "mdi-human-male-board-poll",
      url: "/pnis/personasvalidadas",
    }]
  },
];

const emit = defineEmits(["update:modelValue"]);
</script>

<style lang="scss">
.wrap-menu {
  background-color: #3bc067 !important;
  color: black !important;
}

.user-data {
  span {
    display: block;
    width: 100;
    text-align: center;
  }
}

.imglogo {
  width: 100%;
}
</style>
