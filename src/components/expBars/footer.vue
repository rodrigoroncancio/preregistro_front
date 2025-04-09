<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faYoutube, faInstagram, faFacebookSquare, faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons';

// Agregar los íconos a la librería de FontAwesome
library.add(faMapMarkerAlt, faYoutube, faInstagram, faFacebookSquare, faLinkedinIn, faXTwitter);

export default {
  components: {
    FontAwesomeIcon,
  },
};
</script>

<template>
  <v-container class="px-0">
    <v-row :dense="true">
      <v-col cols="1" class="text-right">
        <font-awesome-icon icon="fa-solid fa-map-marker-alt" class="icon-marker" />
      </v-col>
      <v-col cols="6" class="text-left address">
        Carrera 7 No. 26-20, Edificio Tequendama (Pisos 32 - 33)
      </v-col>
      <v-col cols="5" class="text-right social">
        <font-awesome-icon icon="fa-brands fa-youtube" />
        <font-awesome-icon icon="fa-brands fa-facebook-square" />
        <font-awesome-icon icon="fa-brands fa-instagram" />
        <font-awesome-icon icon="fa-brands fa-linkedin-in" />
        <font-awesome-icon icon="fa-brands fa-x-twitter" />
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
    gap: 12px;
  }
}

.v-container {
  min-height: 65px;
}

/* Ajustes para los íconos */
.icon-marker {
  font-size: 22px;
}

.social {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px; /* Espaciado entre los iconos */
}

.social svg {
  font-size: 22px; /* Tamaño de los íconos */
  margin: 0 3px; /* Separación lateral */
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.social svg:hover {
  transform: scale(1.2);
}
</style>
