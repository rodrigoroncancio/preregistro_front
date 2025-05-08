<template>
  <v-main>
    <v-container class="flex-grow-1">
      <v-row>
        <v-col class="text-center mt-6">
          <v-img :src="'/src/assets/img/header-colombia.png'" :width="360" class="mx-auto" />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="general-argelia">
          <v-row>
            <v-col>
              <router-link to="/" class="back-section">
                <font-awesome-icon icon="fa-arrow-left" class="login-icon" />
                <span class="login-text"> Regresar</span>
              </router-link>
              <router-link to="/dashboard" class="login-section">
                <font-awesome-icon icon="fa-user" class="login-icon" />
                <span class="login-text">Ingresar</span>
              </router-link>
              <div className="main-content">
                <h1 >
                  <span className="title-primary-argelia">Convocatoria abierta </span>
                  <span className="title-highlight-argelia">Samaniego</span>
                </h1>
                <p className="date-argelia-page">Del <strong>07 de mayo</strong> al <br> <strong>05 de julio</strong></p>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div className="buttons-container-argelia-page">
                <div className="button-group-argelia-page">
                  <a href="#" className="btn-arge-page green disabled-btn">Preregistro de Asociaciones</a>
                </div>
                <div className="button-group-argelia-page">
                  <a href="/inscripcion/narino-samaniego/fase1" target="_blank" className="btn-arge-page blue">Preregistro de núcleos de familiares</a>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <a className="ABC"
                target="blank"
                href="https://stpnis.blob.core.windows.net/testdsci/samaniego/_Abc_convocatoria_abades.pptx.pdf">
                ABC de la convocatoria
              </a>
            </v-col>
          </v-row>
          <v-row>
            <v-col>

              <a className="pdf"
                target="blank"
                href="https://stpnis.blob.core.windows.net/testdsci/samaniego/2025_03_17_TdR_Abades_V5.pdf"
              >
                Ver términos de referencia de la convocatoria
              </a>

            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <a href="#"
                style="color: black; background-color: rgba(255, 255, 255, 0.6); padding: 5px 10px; text-decoration: none; border-radius: 5px;"
                @click="openModal()"
              >
                Ver cupos
              </a>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
  <expModalForm
    title="Ver cupos"
    v-model="showModal"
    width="500"
    :btn-save="false"
  >
    <v-card elevation="0">
      <v-card-text>
        <v-row>
          <v-col cols="7" class="ma-3">
            <v-text-field type="number" label="Código de la asociación" v-model="codigoAsociacion" variant="outlined"></v-text-field>
          </v-col>
          <v-col class="ma-3">
            <v-btn block color="green" style="height: 55px" @click="getCupos">Button</v-btn>
          </v-col>
        </v-row>

      </v-card-text>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cupo in listCupos" :key="cupo.id">
              <td>{{ cupo.codigo }}</td>
              <td>{{ cupo.estado }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </expModalForm>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import expModalForm from '@/components/expModalForm/expModalForm.vue';
import useCrud from '@/composables/useCrud';

const uCrud = useCrud("api/2.0/inscripciones");

const showModal = ref(false);
const codigoAsociacion = ref('');
const listCupos = ref([]);

const openModal = () => {
  showModal.value = true;
};

const getCupos = async () => {
  try {
    listCupos.value = await uCrud.custom(`asociacion/codigos/${codigoAsociacion.value}`, "GET");
  } catch {
    listCupos.value = []
  }
}
</script>

<style lang="scss" scoped>
.v-main {
  min-height: calc(100vh - 65px);
  flex-grow: 1;
  background-image: url("/src/assets/img/bg-argelia.png");
  background-position: bottom;
  background-size: contain;
}
/* Reset básico para asegurar consistencia */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


/* Main content */
.main-content {
    max-width: 2200px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.v-container {
  max-width: 2200px !important;
}

/* Sección de login */
.back-section {
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 14px;
    font-weight: bold;
    color: #585958;
    transition: color 0.3s ease;
    z-index: 99999;
    position: absolute;
    left: 20px;
    top: 20px;
}
/* Efecto hover en el login */
.back-section:hover {
color: #106737; /* Cambia de color al pasar el mouse */
}

.back-section:hover {
  .login-icon {
    color: #106737; /* Cambia el color del icono en hover */
  }
}
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


.v-row {
    margin-top: 3px !important;
}

.general-argelia {
    font-family: 'Nunito Sans', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    overflow: hidden;
}

/* Colores de títulos */
.title-primary-argelia {
    color: #8BBD06;
    font-weight: 900;
}

.title-highlight-argelia {
    color: #2148C0;
}

/* Estilos de la fecha */
.date-argelia-page {
    font-weight: 500;
    font-size: 18px;
    color: #2148C0;
    text-align: center;
    border: 1px solid #8BBD06;
    display: inline-block;
    padding: 3px 15px;
    margin: 8px auto;
}

/* Contenedor de los botones */
.buttons-container-argelia-page {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 columnas en escritorio */
    gap: 20px;
    justify-content: center;
    align-items: center;
    margin: 20px auto;
    width: 50%;
    max-width: 800px;
}

/* Grupo de botones */
.button-group-argelia-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
}

/* Botones */
.btn-arge-page {
    font-weight: 600;
    font-size: 17px;
    cursor: pointer;
    border: none;
    text-align: center;
    transition: 0.3s;
    width: 100%;
    min-width: 250px;
    border-radius: 0;
    padding: 20px;
}

/* Colores de botones */
.btn-arge-page.green {
    background: #8BBD06;
    color: white;
    font-size: 22px;
    padding: 10px;
}

.btn-arge-page.blue {
    background: #2148C0;
    color: white;
    font-size: 22px;
    padding: 10px;
}

/* Espacio entre botones */
.button-group-argelia-page .btn-arge-page.play {
    margin-top: 10px;
    text-align: center;
    justify-content: center;
}

/* Botones de ABC */
.btn-arge-page.play.green {
    background: transparent;
    color: #8BBD06;
}

.btn-arge-page.play.blue {
    background: transparent;
    color: #2148C0;
}

.ABC {
    font-family: 'Nunito Sans', sans-serif;
    color: white;
    background: #2148C0;
    padding: 15px 30px;
    font-weight: 500;
    font-size: 18px;
    cursor: pointer;
    border: none;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
}

/* Contenedor del PDF */
.pdf-container-argelia {
    width: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
}

.pdf {
    font-family: 'Nunito Sans', sans-serif;
    color: white;
    background: #8BBD06;
    padding: 15px 30px;
    font-weight: 500;
    font-size: 18px;
    cursor: pointer;
    border: none;
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
}

.pdf img {
    width: 35px;
    height: 35px;
    margin-right: 20px;
}

.disabled-btn {
  background-color: #ccc !important;
  cursor: not-allowed;
}

.disabled-text {
  color: #6c757d !important;
  cursor: not-allowed;
}

/* MEDIA QUERIES PARA RESPONSIVE */

/* Pantallas grandes (mayores a 1400px) */
@media screen and (min-width: 1400px) {
    .buttons-container-argelia-page {
        max-width: 700px;
        gap: 30px;
    }

    .btn-arge-page {
        font-size: 30px;
    }


}

/* Tablets y dispositivos medianos (menos de 1024px) */
@media screen and (max-width: 1024px) {
    .buttons-container-argelia-page {
        grid-template-columns: 1fr; /* Pasa a una sola columna */
        width: 80%;
    }

    .btn-arge-page {
        font-size: 22px;
        padding: 15px;
    }

}

/* Móviles (menos de 768px) */
@media screen and (max-width: 768px) {
    .buttons-container-argelia-page {
        width: 70%;
    }

    .btn-arge-page {
        font-size: 20px;
        padding: 12px;
    }

}

/* Móviles pequeños (menos de 480px) */
@media screen and (max-width: 480px) {
    .buttons-container-argelia-page {
        width: 80%;
    }

    .btn-arge-page {
        font-size: 18px;
        padding: 10px;
    }



    .pdf-container-argelia {
        margin-top: 10px;
    }


}


</style>
