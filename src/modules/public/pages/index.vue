<template>
  <v-main>
    <v-container class="flex-grow-1">
      <v-row>
        <v-col class="text-center mt-6">
          <v-img :src="'/src/assets/img/header-colombia.png'" :width="360" class="mx-auto" />
        </v-col>
      </v-row>
      <div class="main-container">
        <v-row>
          <v-col md="6" cols="12" class="text-center div-catatumbo">
            <h2>Convocatoria abierta</h2>
            <h1>Catatumbo</h1>
            <h3>Del <strong>13 de febrero al 28</strong> de febreo</h3>
            <v-btn color="#d6513e" to="/catatumbo/inicio">INSCRÍBETE AQUÍ</v-btn>
          </v-col>
          <v-col md="6" cols="12" class="text-center div-argelia">
            <h2>Convocatoria abierta</h2>
            <h1>Argelia</h1>
            <h3>Del <strong>de 5 al 25</strong> de febrero</h3>
            <v-btn color="#0d6efd" to="/argeliainicio">INSCRÍBETE AQUÍ</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-main>
</template>

<style lang="scss" scoped>
.v-main {
  min-height: calc(100vh - 65px);
  flex-grow: 1;
  background-image: url("/src/assets/img/bg-index.png");
  background-position: bottom;
  background-size: contain;
  font-family: "Nunito Sans", sans-serif;

  .main-container {
    max-width: 1200px;
    margin: auto;
    margin-top: 100px;
  }

  h1 {
    font-size: 65px;
    line-height: 65px;
    font-weight: bold;
    margin-bottom: 40px;
  }

  h2 {
    font-size: 40px;
    line-height: 40px;
    font-weight: bold;
  }

  h3 {
    border: 1px solid;
    width: 340px;
    margin: auto;
    padding: 10px;
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: normal;
    strong {
      font-weight: bolder;
    }
  }

  .v-btn {
    font-size: 22px;
    height: 80px;
    width: 340px;
    font-weight: bold;
  }

  .div-catatumbo {
    h1 {
      color: #566180;
    }
    h2 {
      color: #d6513e;
    }
    h3 {
      border-color: #d6513e;
      color: #566180;
    }
  }

  .div-argelia {
    h1 {
      color: #20c069;
    }
    h2 {
      color: #0d6efd;
    }
    h3 {
      border-color: #20c069;
      color: #0d6efd;
    }
  }

  @media screen and (max-width: 768px) {
    .main-container {
      margin-top: 20px;
    }
  }
}
</style>
