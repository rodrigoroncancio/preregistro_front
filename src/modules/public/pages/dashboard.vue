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
              <router-link to="/argeliainicio" class="back-section">
                <font-awesome-icon icon="fa-arrow-left" class="login-icon" />
                <span class="login-text"> Regresar</span>
              </router-link>
              <div className="main-content">
                <h1 >
                  <span className="title-primary-argelia">Información adicional </span>
                  <span className="title-highlight-argelia">ConvocatoriaArgelia</span>
                </h1>
                
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div className="buttons-container-argelia-page">
                <div className="button-group-argelia-page">
                  <a href="/pnis/listafichas" target="blank" className="btn-arge-page green">
                    Lista detallada de inscritos
                  </a>

                </div>
                <div className="button-group-argelia-page">
                  <a href="/pnis/fichaacuerdo" target="blank" className="btn-arge-page green">Validación inscritos</a>

                </div>
                <div className="button-group-argelia-page">
                  <a href="/argelia/fichaacuerdo" target="blank" className="btn-arge-page green">Diligenciar ficha</a>

                </div>

              </div>
            </v-col>
          </v-row>

        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
.v-main {
  min-height: calc(100vh - 65px);
  flex-grow: 1;
  background-image: url("/src/assets/img/bg-argelia.png");
  background-position: bottom;
  background-size: contain;
}
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
    max-width: 2200px;
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
}

.login-section:hover .login-icon {
color: #106737; /* Cambia el color del icono en hover */
}
.v-row {
    margin-top: 1px !important;
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

/* Estilos de la fecha */
.date-argelia-page {
    font-weight: 500;
    font-size: 18px;
    color: #2148C0;
    text-align: center;
    border: 1px solid #21C069;
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
    background: #21C069;
    color: white;
    font-size: 26px;
    padding: 10px;
}

.btn-arge-page.blue {
    background: #2148C0;
    color: white;
    font-size: 26px;
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
    color: #21C069;
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
    background: #21C069;
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

    .pdf-container-argelia {
        width: 75%;
    }
}

@media (min-width: 1280px) {
    .v-container {
        max-width: 2400px;
    }
}
@media (min-width: 960px) {
    .v-container {
        max-width: 1900px;
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

    .ABC {
        width: 40%;
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

    .ABC {
        width: 50%;
    }

    .pdf {
        width: 70%;
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

    .ABC {
        width: 80%;
    }

    .pdf-container-argelia {
        margin-top: 10px;
    }

    .pdf {
        width: 80%;
    }
}


</style>
