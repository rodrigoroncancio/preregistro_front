<template>
  <v-container class="px-0">
    <v-row :dense="true">
      <v-col cols="1" class="text-right">
        <v-icon>mdi-map-marker</v-icon>
      </v-col>
      <v-col cols="6" class="text-left address">
        Carrera 7 No. 26-20, Edificio Tequendama (Pisos 32 - 33)
      </v-col>
      <v-col cols="5" class="text-right social mt-1">
        <v-icon>mdi-youtube</v-icon>
        <v-icon>mdi-instagram</v-icon>
        <v-icon>mdi-facebook</v-icon>
        <v-icon>mdi-linkedin</v-icon>
        <v-icon>mdi-twitter</v-icon>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
@media screen and (max-width: 600px) {
  .address {
    font-size: 11px;
  }
  .social {
    font-size: 15px;
  }
}

.v-container {
  min-height: 65px;
}
</style>