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
              <router-link to="/dashboard" class="back-section">
                <font-awesome-icon icon="fa-arrow-left" class="login-icon" />
                <span class="login-text"> Regresar</span>
              </router-link>
              <div className="main-content">
                <h1 >
                  <span className="title-primary-argelia">Lista </span>
                  <span className="title-highlight-argelia">Inscritos</span>
                </h1>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
                <div class="general mt-[100px]">
                    <iframe title="Datos_Encuesta" width="1024" height="612" src="https://app.powerbi.com/view?r=eyJrIjoiNjM4Njk0MDctYjFlZC00ODRkLTg0MTAtYTMzNjA5ZjU5MjU5IiwidCI6IjhmZDEwMTNlLTJhMDgtNGM0Ny05M2Q0LTE2ZTkyOWEyY2E2MSIsImMiOjR9" frameborder="0" allowFullScreen="true"></iframe>
                </div>
            </v-col>
          </v-row>


        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
/* .v-main {
  min-height: calc(100vh - 65px);
  flex-grow: 1;
  background-image: url("/src/assets/img/bg-argelia.png");
  background-position: bottom;
  background-size: contain;
} */
</style>

<style lang="scss" scoped>
/* Reset básico para asegurar consistencia */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
/* Main content */
.main-content {
    margin-top: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1200px;
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

.back-section:hover .login-icon {
color: #106737; /* Cambia el color del icono en hover */
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
    color: #21C069;
    font-weight: 900;
}

.title-highlight-argelia {
    color: #2148C0;
}

/* Media Queries para iframe responsive */
@media screen and (min-width: 1200px) {
    .general {
        iframe {
            width: 1000px;
            height: 700px;
        }
    }
}

@media screen and (max-width: 1199px) and (min-width: 768px) {
    .general {
        iframe {
            width: 800px;
            height: 600px;
        }
    }
}

@media screen and (max-width: 767px) and (min-width: 480px) {
    .general {
        iframe {
            width: 600px;
            height: 500px;
        }
    }
}

@media screen and (max-width: 479px) {
    .general {
        iframe {
            width: 100%;
            height: 400px;
        }
    }
}

</style>
