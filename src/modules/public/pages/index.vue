<template>
  <v-main>
    <!-- Header -->
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

    <!-- Swiper Carousel -->
    <div class="carrusel-wrapper">
      <Swiper
          :modules="[Navigation, Pagination]"
          :slides-per-view="1"
          :space-between="20"
          :navigation="true"
          :pagination="{ clickable: true }"
          :breakpoints="{
          600: { slidesPerView: 1.2 },
          960: { slidesPerView: 2.2 },
          1264: { slidesPerView: 3.2 },
          1904: { slidesPerView: 4 }
        }"
          class="swiper-convocatorias"
      >
        <SwiperSlide v-for="conv in convocatorias" :key="conv.municipio">
          <v-card
              class="convocatoria-card"
          >
            <div class="card-content">
              <h1 :style="{ color: conv.colorTitulo }">{{ conv.municipio }}</h1>
              <h2 :style="{ color: conv.colorSub }">{{ conv.departamento }}</h2>
              <h3
                  v-if="conv.fecha"
                  v-html="conv.fecha"
                  :style="{
                    border: '1px solid ' + conv.colorBorderFecha,
                    color: conv.colorFecha}"
              ></h3>
              <div v-else style="height: 115px;"></div>

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

            <div class="card-footer" :style="{ backgroundImage: `url('${conv.img}')` }">

            </div>
          </v-card>
        </SwiperSlide>
      </Swiper>
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
    proximamente: false,
    img: "/src/assets/img/home/catatumbo.png",
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
    img: "/src/assets/img/home/argelia.png",
  },
  {
    municipio: "Tumaco",
    departamento: "Nariño",
    fecha: "",
    colorTitulo: "#009971",
    colorSub: "#009971",
    colorFecha: "#002f86",
    colorBorderFecha: "#1a8f1a",
    colorBtn: "#1349A0",
    link: "#",
    proximamente: true,
    img: "/src/assets/img/home/tumaco.png",
  },
  {
    municipio: "Roberto Payán",
    departamento: "Nariño",
    fecha: "",
    colorTitulo: "#223942",
    colorSub: "#223942",
    colorFecha: "#002f86",
    colorBorderFecha: "#1a8f1a",
    colorBtn: "#4FC58E",
    link: "#",
    proximamente: true,
    img: "/src/assets/img/home/roberto.png",
  },
  {
    municipio: "Samaniego",
    departamento: "Nariño",
    fecha: "",
    colorTitulo: "#009971",
    colorSub: "#009971",
    colorFecha: "#002f86",
    colorBorderFecha: "#1a8f1a",
    colorBtn: "#8BBD06",
    link: "#",
    proximamente: true,
    img: "/src/assets/img/home/samananiego.png",
  },
  {
    municipio: "Valle del Guamuez Villagarzón",
    departamento: "Putumayo",
    fecha: "",
    colorTitulo: "#566180",
    colorSub: "#566180",
    colorFecha: "#002f86",
    colorBorderFecha: "#1a8f1a",
    colorBtn: "#5696A6",
    link: "#",
    proximamente: true,
    img: "/src/assets/img/home/villagarzon.png",
  },
  {
    municipio: "Riosucio",
    departamento: "Choco",
    fecha: "",
    colorTitulo: "#911C09",
    colorSub: "#911C09",
    colorFecha: "#002f86",
    colorBorderFecha: "#1a8f1a",
    colorBtn: "#C07E26",
    link: "#",
    proximamente: true,
    img: "/src/assets/img/home/riosucio.png",
  },
  {
    municipio: "Ituango",
    departamento: "Antioquia",
    fecha: "",
    colorTitulo: "#004276",
    colorSub: "#004276",
    colorFecha: "#004276",
    colorBorderFecha: "#00B86D",
    colorBtn: "#00B86D",
    link: "#",
    proximamente: true,
    img: "/src/assets/img/home/ituango.png",
  },
  {
    municipio: "Buenaventura",
    departamento: "Valle del cauca",
    fecha: "",
    colorTitulo: "#1A3891",
    colorSub: "#1A3891",
    colorFecha: "#0076CE",
    colorBorderFecha: "#0076CE",
    colorBtn: "#0076CE",
    link: "#",
    proximamente: true,
    img: "/src/assets/img/home/buenaventura.png",
  },
  {
    municipio: "Cumaribo",
    departamento: "Vichada",
    fecha: "",
    colorTitulo: "#BB7918",
    colorSub: "#BB7918",
    colorFecha: "#BB7918",
    colorBorderFecha: "#DB6C5B",
    colorBtn: "#DB6C5B",
    link: "#",
    proximamente: true,
    img: "/src/assets/img/home/cumaribo.png",
  },
];
</script>


<style scoped lang="scss">
/* Sección de login */
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
/* Efecto hover en el login */
.login-section:hover {
  color: #106737; /* Cambia de color al pasar el mouse */
  .login-icon {
    color: #106737; /* Cambia el color del icono en hover */
  }
}

.title-convocatorias {
  font-weight: 800;
  font-size: 66px;
  text-align: center;
  color: #326cf3;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 38px;
  }
}

.carrusel-wrapper {
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;

  .swiper-convocatorias {
    padding-bottom: 40px;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: #326cf3;
    background: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .swiper-pagination-bullet-active {
    background: #326cf3;
  }
}

.convocatoria-card {
  width: 100%;
  max-width: 380px;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  background-color: transparent;
  transition: transform 0.3s ease;
  overflow: hidden;
  margin: auto;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    height: auto;
    padding-bottom: 20px;
  }

  .card-content {
    text-align: center;
    padding: 0 16px;

    h1 {
      font-size: 36px;
      font-weight: bold;
      Line-height: 40px;
      letter-spacing: 0%;

      @media (max-width: 768px) {
        font-size: 28px;
        max-height: 56px;
      }
    }

    h2 {
      font-size: 24px;
      font-weight: bold;

      @media (max-width: 768px) {
        font-size: 18px;
      }
    }

    h3 {
      width: 220px;
      margin: 10px auto;
      padding: 10px;
      font-size: 30px;
      Line-height: 35px;

      @media (max-width: 768px) {
        font-size: 18px;
        width: 96%;
      }
    }

    .btn-convocatoria {
      height: 80px;
      width: 220px;
      font-size: 16px;
      font-weight: bold;
      margin-top: 20px;
      margin-bottom: 20px;
      color: white !important;

      @media (max-width: 600px) {
        width: 100%;
        font-size: 14px;
        height: 60px;
      }
    }
  }

}

.card-footer {
  height: 98%;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: contain;

  @media (max-width: 600px) {
    display: none;
  }
}

</style>
