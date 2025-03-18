<template>
  <div class="container">
    <!-- Banner Principal -->
    <div class="convocatorias-banner">
      <h2>Bienvenidos al <span class="convocatorias-banner-span">sistema de convocatorias</span> de la DSCI</h2>
    </div>

    <!-- Contenedor de contenido -->
    <div class="content-wrapper">
      <!-- Título en la parte superior izquierda -->
      <h1 class="custom-title">
        Convocatorias <span class="highlight">abiertas</span>
      </h1>

      <!-- Tarjetas de Secciones convertidas en Botones -->
      <div class="section-cards">
        <button class="section-card" @click="navigateTo('https://preregistro.direccionsustitucion-pnis.gov.co/?pagina=inicioargelia')">
          <p class="section-title">Convocatoria Argelia</p>
          <img src="/src/assets/img/colombia1.png" alt="Territorial" class="card-icon" />
        </button>
        <button class="section-card" @click="navigateTo('https://preregistro.direccionsustitucion-pnis.gov.co/?pagina=catatumbo')">
          <p class="section-title">Convocatoria Catatumbo</p>
          <img src="/src/assets/img/colombia1.png" alt="Técnico" class="card-icon" />
        </button>
      </div>
    </div>

    <!-- Footer Fijo -->
    <footer class="footer-bg">
      <img src="/src/assets/img/bg-argelia.png" alt="Footer" class="footer-image" />
    </footer>
  </div>
</template>

<script lang="ts" setup>
// Función para redirigir a una URL
const navigateTo = (url: string) => {
  window.location.href = url;
};
</script>

<style scoped>
/* Contenedor Principal */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  position: relative;
}

/* Banner de Convocatorias */
.convocatorias-banner {
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #41d5fd, #08272d);
  color: white;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.2);
}

.convocatorias-banner-span {
  color: #7dce27;
  font-weight: 900;
}

/* Contenedor para organizar contenido */
.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 20px;
  position: relative;
}

/* Título en la parte superior izquierda */
.custom-title {
  font-size: 40px;
  color: #333;
  margin-top: 10px;
  text-align: left;
  align-self: flex-start;
}

.highlight {
  color: #21C069;
  font-weight: 900;
}

/* Tarjetas de Secciones convertidas en Botones */
.section-cards {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-top: 20px;
  width: 100%;
}

.section-card {
  background: #a2d5f2;
  border-radius: 10px;
  padding: 15px;
  text-align: left;
  width: 250px;
  height: 160px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  align-items: flex-start;
}

/* Hover en Tarjetas */
.section-card:hover {
  transform: scale(1.05);
  background: #87c8eb;
}

/* Estilos del Texto */
.section-title {
  font-weight: bold;
  color: #2148C0;
  font-size: 1.2rem;
  margin-left: 10px;
}

/* Icono en la parte inferior derecha */
.card-icon {
  width: 50px;
  height: 50px;
  position: absolute;
  bottom: 10px;
  right: 10px;
}

/* Footer Fijo */
.footer-bg {
  width: 100%;
  text-align: center;
  background: white;
  padding: 10px;
  position: relative;
  margin-top: auto;
}

.footer-image {
  max-width: 100%;
  height: auto;
}

/* Dispositivos grandes (más de 1280px) */
@media screen and (min-width: 1280px) {
  .section-cards {
    justify-content: flex-start;
  }

  .section-card {
    width: 260px;
    height: 140px;
  }
}

/* Tablets y dispositivos medianos (hasta 1024px) */
@media screen and (max-width: 1024px) {
  .content-wrapper {
    align-items: center;
  }

  .section-cards {
    flex-direction: column;
    align-items: center;
  }

  .section-card {
    width: 90%;
    height: 150px;
  }
}

/* Celulares (hasta 768px) */
@media screen and (max-width: 768px) {
  .convocatorias-banner {
    font-size: 22px;
  }

  .custom-title {
    font-size: 1.5rem;
    text-align: center;
  }

  .section-cards {
    flex-direction: column;
    align-items: center;
  }

  .section-card {
    width: 90%;
    height: 140px;
  }

  .footer-bg {
    padding: 10px;
  }
}
</style>
