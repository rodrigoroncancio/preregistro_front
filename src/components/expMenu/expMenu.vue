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
    
    let _itemsFiltered: any = [];
    
    itemsMenu.forEach(item => {

      if ('roles' in item) {
        // Extraer los IDs de los roles del usuario
        const userRoles = userData.roles.map((r: { id: any; }) => r.id); 
        
        // Verificar si al menos uno de los roles del usuario está en item.roles
        const hasRole = item.roles.some(role => userRoles.includes(role));

        if (hasRole) {
          _itemsFiltered.push(item);
        }
      } else {
        _itemsFiltered.push(item);
      }
    });

    return _itemsFiltered;
  },
  set(value) {
    return value;
  }
});
// const itemsMenuFiltered = computed({
//   get() {
//     console.log('userData')
//     console.log(userData)
//     console.log(userData.role)
//     let _itemsFiltered: any = []
//     itemsMenu.forEach(item => {
//       console.log(item)
//       if ('roles' in item) {
//         if ((item.roles as Array<number>).includes(userData.role)) {
//           _itemsFiltered.push(item)
//         }
//       } else {
//         _itemsFiltered.push(item)
//       }
//     });
//     return _itemsFiltered;
//   },
//   set(value) {
//     return value;
//   }
// });

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
    roles: [1,2,3,4,5,6],
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
  {
    title: "modules.pnis.convocatoria_catatumbo",
    icon: "mdi-solar-panel",
    roles: [1,2,3,4,5,6],
    children: [{
      title: "modules.pnis.preregistrocatatumboindividual",
      icon: "mdi-human-male-board-poll",
      url: "/pnis/catatumboindividual/0"
      // children: [
      //   {
      //     title: "modules.pnis.preregcataindividual_propietarios",
      //     icon: "mdi-human-male-board-poll",
      //     url: "/pnis/catatumboindividual/5",
      //   },
      //   {
      //     title: "modules.pnis.preregcataindividual_desplazados",
      //     icon: "mdi-human-male-board-poll",
      //     url: "/pnis/catatumboindividual/desplazados/2",
      //   },
      //   {
      //     title: "modules.pnis.preregcataindividual_extranjeros",
      //     icon: "mdi-human-male-board-poll",
      //     url: "/pnis/catatumboindividual/extranjeros/6",
      //   },
      //   {
      //     title: "modules.pnis.preregcataindividual_nopropietarios",
      //     icon: "mdi-human-male-board-poll",
      //     url: "/pnis/catatumboindividual/arrendatarios/4",
      //   }
      // ] 
    },
    {
      title: "modules.pnis.preregistrocatatumbogrupos",
      icon: "mdi-human-male-board-poll",
      url: "/pnis/catatumbogrupos",
    },
    {
      title: "modules.pnis.fichacatatumbo",
      icon: "mdi-human-male-board-poll",
      url: "/pnis/catatumboficha",
    }]
  },
  {
    title: "modules.pnis.fichas_acuerdos",
    icon: "mdi-solar-panel",
    roles: [1,7],
    children: [{
      title: "modules.pnis.ficha_catatumbo",
      icon: "mdi-human-male-board-poll",
      url: "/catatumbo/fichaacuerdo",
    },
    {
      title: "modules.pnis.fichacatatumbo3",
      icon: "mdi-human-male-board-poll",
      url: "/catatumbo/fichaacuerdofase2",
    },
    {
      title: "modules.pnis.ficha_argelia",
      icon: "mdi-human-male-board-poll",
      url: "/pnis/catatumbogrupos",
    }]
  },
  {
    title: "Form Preregistro",
    icon: "mdi-solar-panel",
    roles: [1,7],
    children: [{
      title: "modules.pnis.catatumbo_form_preregistro2",
      icon: "mdi-human-male-board-poll",
      url: "/catatumbo/preregistro",
    }]
  },
  {
    title: "Call Center",
    icon: "mdi-solar-panel",
    roles: [1,7],
    children: [{
      title: "Buscar Usuario",
      icon: "mdi-human-male-board-poll",
      url: "/search-user-call-center",
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
