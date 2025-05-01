<template>
<v-main>
  <v-container class="flex-grow-1">
    <v-row>
      <v-col class="text-center mt-6">
        <v-img :src="'/src/assets/img/header-colombia.png'" :width="300" class="mx-auto" />
      </v-col>
    </v-row>
    <v-row>
      <v-col className="general">
          <router-link to="/" class="back-section">
              <font-awesome-icon icon="fa-arrow-left" class="login-icon" />
              <span class="login-text"> Regresar</span>
            </router-link>
        <div className="main-content">
          <h1 className="title">
            <span className="title-primary">Convocatoria abierta </span>
            <span className="title-highlight">Catatumbo</span>
          </h1>
          <!-- <h2 className="subtitle">Convención, Tibú, Sardinata y El Tarra</h2> -->
          <p className="date">Del <strong>01 de abril</strong> <strong>al 30 de abril</strong></p>
        </div>
        <div className="buttons-container">
          <div className="button-group">
            <a target="blank" href="/catatumbo/preregistro" class="btnCat red">
              Preregistro de núcleos familiares
            </a>
            <p className="btnCat description red">Para quienes no hacen parte de una asociación</p>
            <a target="blank" href="https://stpnis.blob.core.windows.net/testdsci/Terminos_catatumbo/Abc_convocatoria%20CATATUMBO_familias%20sin_asociacio%CC%81n_17032025.pptx.pdf" className="btnCat grey">ABC de la convocatoria</a>
          </div>
          <div className="button-group">
            <router-link :to="'/catatumbo/asociaciones'" class="btnCat blue">
              Preregistro de grupo de productores
            </router-link>
            <p className="btnCat description blue">Para quienes se registran a través de su asociación</p>
            <a target="blank" href="http://stpnis.blob.core.windows.net/testdsci/Terminos_catatumbo/Abc_convocatoria%20CATATUMBO_asociaciones_17032025.pptx.pdf" className="btnCat grey">ABC de la convocatoria</a>
          </div>
          <!-- href="https://pnis-odk.direccionsustitucion-pnis.gov.co/-/single/ScZ9D8KhyfMlrMpAohyxPqeUAWGGSyC?st=02FzOAJCo6zTYlaoOIdSGbobqMfnBvccipGw2m1C9o2SZKRdUWJR9ajHU9KK6jHe" -->
          <div className="button-group">
              <a className="btnCat red"
                  target="_blank"
                  href="/catatumbo/preregistro"
                  rel="noreferrer"
              >
                  Familias PNIS que renegociaron y recolectores
              </a>
              <p className="btnCat description red">Beneficiarios del programa</p>
              <a target="blank" href="https://stpnis.blob.core.windows.net/testdsci/Terminos_catatumbo/Abc_convocatoria%20CATATUMBO_familias%20pnis.pptx.pdf" className="btnCat grey">ABC de la convocatoria</a>
          </div>
        </div>
        <div className="pdf-container-catatumbo">
            <a className="pdf-catatumbo"
                target="blank"
                href="https://stpnis.blob.core.windows.net/testdsci/Terminos_catatumbo/13022025_ConvocatoriaFinal_v13%2027.2.25.pdf"
                rel="noreferrer"
            >
                Ver términos de referencia de la convocatoria
            </a>
          </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <a 
          target="_blank"
          href="/catatumbo/vercupos"
          style="color: black; background-color: rgba(255, 255, 255, 0.6); padding: 5px 10px; text-decoration: none; border-radius: 5px; display: inline-block; text-align: center;"
        >
          Ver cupos
        </a>
      </v-col>
    </v-row>
  </v-container>
</v-main>
</template>

<style scoped>
.v-main {
min-height: calc(100vh - 65px);
flex-grow: 1;
background-image: url("/src/assets/img/bg-catatumbo.png");
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

@media (min-width: 1280px) {
    .v-container {
        max-width: 2200px;
    }
}

/* General */
.general {
  font-family: 'Nunito Sans', sans-serif;
  /*min-height: 100vh; /* Asegura que la página ocupe toda la pantalla */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  overflow: hidden;
}
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

/* Título Principal */
.title {
  font-weight: 900;
  font-size: 40px;
  text-align: center;
  max-width: 90%;
}

.title-primary {
  color: #566181;
}

.title-highlight {
  color: #D6513E;
}

/* Subtítulo */
.subtitle {
  font-weight: 700;
  font-size: 25px;
  color: #D6513E;
  text-align: center;
  margin-top: -2px;
}

/* Fecha */
.date {
  font-weight: 500;
  font-size: 18px;
  color: #D6513E;
  text-align: center;
  border: 1px solid #566181;
  display: inline-block;
  padding: 3px 15px;
  margin: 8px auto;
}

/* Botones */
/* Contenedor de los botones */
.buttons-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columnas en escritorio */
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
  width: 100%;
  max-width: 800px;
}

/* Grupo de botones (Mantiene cada pareja unida) */
.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
}

/* Botones */
.btnCat {
  font-weight: 400;
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

/* Descripción (Texto debajo del botón principal) */
.description {
  height: 80px;
  font-size: 16px;

}

.btnCat.description.red {
  background: transparent;
  border: 1px solid;
  color: #676B69;
}

.btnCat.description.blue {
  background: transparent;
  border: 1px solid;
  color: #676B69;
}

/* Colores */
.btnCat.red {
  background: #D6513E;
  color: white;
}

.btnCat.blue {
  background: #566181;
  color: white;
}

.btnCat.grey {
  background: #676B69;
  color: white;
}

/* Espacio entre el botón principal y el ABC */
.button-group .btnCat.grey {
  margin-top: 10px;
  text-align: center;
  justify-content: center;
}

/* Efecto hover */
.btnCat:hover {
  opacity: 0.8;
}

/* Contenedor del PDF */
.pdf-container-catatumbo {
  width: 100%;
  display: flex;
  justify-content: center;
}

.pdf-catatumbo {
  font-family: 'Nunito Sans', sans-serif;
  color: white;
  background: #D6513E;
  padding: 15px 30px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  border: none;
  width: 35%;
  text-align: center;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.pdf-catatumbo img {
  width: 35px;
  height: 35px;
  margin-right: 20px;
}

/* MEDIA QUERIES PARA RESPONSIVE */
@media screen and (min-width: 1920px) {
  body, html {
      overflow-y: hidden; /* Evita el scroll vertical */
  }

  .general {
      min-height: 66vh;
      overflow: hidden;
  }

  .pdf {
      width: 30%;
  }
}

/* Tablets */
@media screen and (max-width: 1024px) {
  .title {
      font-size: 35px;
  }

  .subtitle {
      font-size: 22px;
  }

  .date {
      font-size: 18px;
  }

  .pdf-catatumbo {
      width: 30%;
  }
}

/* Móviles */
@media screen and (max-width: 768px) {
  .title {
      font-size: 36px;
  }

  .subtitle {
      font-size: 28px;
  }

  .date {
      font-size: 20px;
      padding: 5px 15px;
  }

  .buttons-container {
      grid-template-columns: 1fr; /* 1 columna en dispositivos móviles */
  }

  .btnCat.red {
     width: 40%;
  }

  .btnCat.blue {
      width: 40%;
  }

  .btnCat.grey {
      width: 40%;
  }

  .pdf-catatumbo {
      width: 40%;
      font-size: 16px;
  }
}

/* Teléfonos pequeños */
@media screen and (max-width: 480px) {
  .title {
      font-size: 36px;
  }

  .subtitle {
      font-size: 28px;
  }

  .date {
      font-size: 18px;
  }

  .pdf-catatumbo {
      width: 90%;
      font-size: 18px;
  }
}
@media (min-width: 1280px) {
    .v-container {
        max-width: 2200px;
    }
}

</style>
