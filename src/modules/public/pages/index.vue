<template>
  <v-main class="page-home">
    <v-container>
      <v-row>
        <v-col class="text-center mt-6">
          <v-img src="/src/assets/img/header-colombia.png" width="250" class="mx-auto" />
        </v-col>
      </v-row>
      <router-link to="/auth" class="login-section">
        <font-awesome-icon icon="fa-user" class="login-icon" />
        <span class="login-text">Ingresar</span>
      </router-link>
      <div class="title-convocatorias">Convocatorias</div>
    </v-container>
    <v-row>
      <v-col md="12" cols="12" class="text-center div-argelia">
        <a 
          @click="openConsultaForm"
          style="color: black; background-color: rgba(255, 255, 255, 0.8); padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-flex; align-items: center; height: 60px; justify-content: center;"
        >
          <v-icon left>mdi-magnify</v-icon> <!-- Icono de lupa -->
          Consultar estado de Aspirante por Número documento
        </a>
      </v-col>
    </v-row>

    <div class="carrusel-wrapper">
      <Swiper
        :modules="[Navigation, Pagination]"
        :slides-per-view="1"
        :space-between="0"
        :loop="true"
        :navigation="true"
        :pagination="false"
        :breakpoints="{
          768: { slidesPerView: 1.2 },
          960: { slidesPerView: 2.2 },
          1264: { slidesPerView: 3.2 },
          1904: { slidesPerView: 4 }
        }"
      >
        <SwiperSlide v-for="conv in convocatorias" :key="conv.municipio">
          <div class="convocatoria-card" :style="{ backgroundImage: `url('${conv.img}')` }">
            <div class="card-content-top">
              <h1 :style="{ color: conv.colorTitulo }">{{ conv.municipio }}</h1>
              <h2 :style="{ color: conv.colorSub }">{{ conv.departamento }}</h2>
              <h3 v-if="conv.fecha" v-html="conv.fecha"
                :style="{
                  border: '1px solid ' + conv.colorBorderFecha,
                  color: conv.colorFecha
                }"
              ></h3>
            </div>
            <div class="card-content-bottom">
              <v-btn
                :color="conv.colorBtn"
                :to="conv.link"
                :disabled="conv.proximamente"
                class="btn-convocatoria"
              >
                <v-icon start size="35" color="white" class="me-2">
                  {{ conv.proximamente ? "mdi-clock-outline" : "mdi-play-circle-outline" }}
                </v-icon>
                {{ conv.proximamente ? "PRÓXIMAMENTE" : "INSCRÍBETE AQUÍ" }}
              </v-btn>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </v-main>
  <consultaForm
    v-if="consultaModal"
    v-model="consultaModal"
    @onFind="onFindDocument"
  />
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ref, onMounted } from "vue";
import consultaForm from "@/modules/public/pages/components/consultar.vue";

const consultaModal = ref(false);
const onFindDocument = (uuid: string) => {
  consultaModal.value = false;
}
const openConsultaForm = () => {
  consultaModal.value = true;
}

const convocatorias = [
  {
    municipio: "Catatumbo",
    departamento: "Norte de Santander",
    fecha: "Del <strong>01 al <br> 30 de abril</strong>",
    colorTitulo: "#566180",
    colorSub: "#d6513e",
    colorFecha: "#566180",
    colorBorderFecha: "#d6513e",
    colorBtn: "#d6513e",
    link: "/catatumbo/inicio",
    proximamente: true,
    img: "https://expansionti.com/pnis/catatumbo.png",
  },
  {
    municipio: "Argelia",
    departamento: "Cauca",
    fecha: "Del <strong>1 al <br> 13 de abril</strong>",
    colorTitulo: "#20c069",
    colorSub: "#0d6efd",
    colorFecha: "#0d6efd",
    colorBorderFecha: "#20c069",
    colorBtn: "#0d6efd",
    link: "/argeliainicio",
    proximamente: false,
    img: "https://expansionti.com/pnis/argelia.png",
  },
  {
    municipio: "Tumaco",
    departamento: "Nariño",
    fecha: "---------- <br> --------------",
    colorTitulo: "#009971",
    colorSub: "#009971",
    colorFecha: "#009971",
    colorBorderFecha: "#1a8f1a",
    colorBtn: "#1349A0",
    link: "/narino/iniciotumaco",
    proximamente: true,
    img: "https://expansionti.com/pnis/tumaco.png",
  },
  {
    municipio: "Roberto Payán",
    departamento: "Nariño",
    fecha: "---------- <br> --------------",
    colorTitulo: "#223942",
    colorSub: "#223942",
    colorFecha: "#223942",
    colorBorderFecha: "#1a8f1a",
    colorBtn: "#4FC58E",
    link: "/narino/inicioroberto",
    proximamente: true,
    img: "https://expansionti.com/pnis/roberto.png",
  },
  {
    municipio: "Samaniego",
    departamento: "Nariño",
    fecha: "---------- <br> --------------",
    colorTitulo: "#009971",
    colorSub: "#009971",
    colorFecha: "#009971",
    colorBorderFecha: "#1a8f1a",
    colorBtn: "#8BBD06",
    link: "/narino/iniciosamaniego",
    proximamente: true,
    img: "https://expansionti.com/pnis/samananiego.png",
  },
  {
    municipio: "Valle del Guamuez Villagarzón",
    departamento: "Putumayo",
    fecha: "---------- <br> --------------",
    colorTitulo: "#566180",
    colorSub: "#566180",
    colorFecha: "#566180",
    colorBorderFecha: "#1a8f1a",
    colorBtn: "#5696A6",
    link: "#",
    proximamente: true,
    img: "https://expansionti.com/pnis/villagarzon.png",
  },
  {
    municipio: "Riosucio",
    departamento: "Choco",
    fecha: "---------- <br> --------------",
    colorTitulo: "#911C09",
    colorSub: "#911C09",
    colorFecha: "#911C09",
    colorBorderFecha: "#1a8f1a",
    colorBtn: "#C07E26",
    link: "#",
    proximamente: true,
    img: "https://expansionti.com/pnis/riosucio.png",
  },
  {
    municipio: "Ituango",
    departamento: "Antioquia",
    fecha: "---------- <br> --------------",
    colorTitulo: "#004276",
    colorSub: "#004276",
    colorFecha: "#004276",
    colorBorderFecha: "#00B86D",
    colorBtn: "#00B86D",
    link: "#",
    proximamente: true,
    img: "https://expansionti.com/pnis/ituango.png",
  },
  {
    municipio: "Buenaventura",
    departamento: "Valle del cauca",
    fecha: "---------- <br> --------------",
    colorTitulo: "#1A3891",
    colorSub: "#1A3891",
    colorFecha: "#0076CE",
    colorBorderFecha: "#0076CE",
    colorBtn: "#0076CE",
    link: "#",
    proximamente: true,
    img: "https://expansionti.com/pnis/buenaventura.png",
  },
  {
    municipio: "Cumaribo",
    departamento: "Vichada",
    fecha: "---------- <br> --------------",
    colorTitulo: "#BB7918",
    colorSub: "#BB7918",
    colorFecha: "#BB7918",
    colorBorderFecha: "#DB6C5B",
    colorBtn: "#DB6C5B",
    link: "#",
    proximamente: true,
    img: "https://expansionti.com/pnis/cumaribo.png",
  },
];
</script>

<style scoped lang="scss">
body {
  font-family: 'Nunito', sans-serif;
}

.page-home {
  .login-section {
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 14px;
    font-weight: bold;
    color: #585958;
    transition: color 0.3s ease;
    z-index: 99999;
    position: absolute;
    right: 20px;
    top: 20px;
  }
  .login-section:hover {
    color: #106737;
    .login-icon {
      color: #106737;
    }
  }

  .title-convocatorias {
    font-family: 'Nunito', sans-serif;
    font-weight: 800;
    font-size: 48px;
    text-align: center;
    color: #326cf3;
    @media (max-width: 768px) {
      font-size: 38px;
    }
  }

  .carrusel-wrapper {
    width: 100%;
  }

  .convocatoria-card {
    min-height: calc(100vh - 317px);
    width: 100%;
    max-height: 600px;
    box-sizing: border-box;
    background-position: bottom;
    background-size: contain;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
      min-height: calc(100vh - 282px);
    }

    .card-content-top {
      height: 260px;
      position: relative;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      @media (max-width: 768px) {
        height: 180px;
      }

      h1 {
        font-family: 'Nunito Sans', sans-serif;
        font-size: 34px;
        line-height: 34px;
        font-weight: 900;
      }

      h2 {
        font-size: 24px;
        font-weight: normal !important;
        margin-bottom: 10px;

        @media (max-width: 768px) {
          font-size: 18px;
        }
      }

      h3 {
        font-family: 'Nunito Sans', sans-serif;
        width: 220px;
        margin: 10px auto;
        padding: 10px;
        margin-top: 0;
        font-weight: normal !important;
        font-size: 28px;
        line-height: 28px;
        font-weight: 600;

        @media (max-width: 768px) {
          font-size: 18px;
        }
      }
    }

    .card-content-bottom {
      text-align: center;

      .btn-convocatoria {
        height: 50px;
        font-size: 16px;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
        color: white !important;

        @media (max-width: 768px) {
          width: 200px;
          font-size: 12px;
          height: 45px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.swiper-button-prev,
.swiper-button-next {
  border-radius: 50%;
  background-color: white;
  width: 55px;
  height: 55px;
}

.swiper-button-prev:after ,
.swiper-button-next:after {
  content: '';
  width: 0;
  height: 0;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
}
.swiper-button-prev:after {
  border-right: 25px solid #326cf3;
  margin-right: 10px;
}
.swiper-button-next:after {
  border-left: 25px solid #326cf3;
  margin-left: 10px;
}
</style>