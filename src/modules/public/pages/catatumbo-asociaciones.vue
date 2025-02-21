<template>
  <v-main>
    <v-container class="flex-grow-1">
        <v-row>
            <v-col class="text-center mt-6">
            <v-img :src="'/src/assets/img/header-colombia.png'" :width="300" class="mx-auto" />
            </v-col>
        </v-row>
        <v-row>
            <v-col className="general-asociaciones-catatumbo">
          
                <div className="main-content-asociaciones-catatumbo">
                    <h1 className="title-asociaciones">
                        <span className="title-primary">Convocatoria abierta </span>
                        <span className="title-highlight">Catatumbo</span>
                    </h1>
                    <h2 className="subtitle-asociaciones">Convención, Tibú, Sardinata y El Tarra</h2>
                    <p className="date">Del <strong>13 de febrero</strong> <strong>al 27 de febrero</strong></p>
                </div>
                <div className="text-information">
                    <p className="subtitle-asociaciones-text">
                        <span className="subtitle-asociaciones-text red">Si te vas a registrar con tu </span>
                        <span className="subtitle-asociaciones-text grey">grupo de productores o asociación o JAC</span>
                        <span className="subtitle-asociaciones-text red"> estos son tus formularios</span>
                    </p>
                </div>
                <div className="buttons-container-asociaciones">
                    <div className="button-group">
                        <p className="step green">Paso 1</p>
                        <a className="btnCatAsoc green"
                           target="_blank"
                           href="https://pnis-odk.direccionsustitucion-pnis.gov.co/-/single/xWxTv0FddatZVoe12IMXDEj0qP78OBb?st=!mqBGwgIUx$UN2GQdtkG0CH0fuS8CvmriLczoie7kvVJMLgJ6IEswwHxZm00dZZ6"
                           rel="noreferrer"
                        >
                            Preinscripción grupo de productores, asociación o JAC
                        </a>
                        <p className="btnCatAsoc description green">
                            Genera el código para los núcleos familiares
                        </p>
                    </div>

                    <div className="button-group">
                        <p className="step red">Paso 2</p>
                        <a className="btnCatAsoc red" target="blank" href="https://pnis-odk.direccionsustitucion-pnis.gov.co/-/single/80DR7sXgD3a2dV7WKWvwdouV1I5uqn0?st=MHbrbE2N0MT$B7AgO6OKihInjoujJk8mrlep97e9C4uqwWJMGi9DMIZ9khTDxhzg">
                            Preinscripción núcleos familiares
                        </a>
                        <p className="btnCatAsoc description red">
                            Familias con código provisto por la asociación, grupo de productores o JAC
                        </p>
                    </div>

                    <div className="button-group">
                        <p className="step red">&nbsp;</p>
                        <a className="btnCatAsoc red2" target="blank" href="https://pnis-odk.direccionsustitucion-pnis.gov.co/-/single/MaFqYs3DATRosxbec3CX4wuxWBe6Nvr?st=Pzxfmg7j81qW7vB5D$BJgaczM5KDZjmScIgUvL379YQlYwZVc!gTgOHoVY3uanGR">
                            Preinscripción núcleos familiares que han sido víctimas de desplazamiento forzado
                        </a>
                        <p className="btnCatAsoc description red">
                            Familias con código provisto por la asociación, grupo de productores o JAC
                        </p>
                    </div>
                </div>
                <a className="ABC"
                   target="blank"
                   href="https://stpnis.blob.core.windows.net/testdsci/preregistroArgelia/_Abc_convocatoria%20argelia.pdf">
                    ABC de la convocatoria 
                </a>
                <div className="pdf-container-asociaciones-catatumbo">
                    <a className="pdf-asociaciones-catatumbo"
                       target="blank"
                       href="https://stpnis.blob.core.windows.net/testdsci/Terminos_catatumbo/13022025_ConvocatoriaFinal_v11.pdf" >
                        Ver términos de referencia de la convocatoria
                    </a>
                </div>

            </v-col>
        </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
    /* Reset básico para asegurar consistencia */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.title-primary {
    color: #566181;
}
.ABC {
    font-family: 'Nunito Sans', sans-serif;
    color: white;
    background: #979797F2;
    padding: 15px 30px;
    font-weight: 500;
    font-size: 18px;
    cursor: pointer;
    border: none;
    width: 25%;
    text-align: center;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
}

.title-highlight {
    color: #D6513E;
}

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
/* General */
.general-asociaciones-catatumbo {
    font-family: 'Nunito Sans', sans-serif;
    /*min-height: 100vh; /* Asegura que la página ocupe toda la pantalla */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    overflow: hidden;
}

/* Main content */
.main-content-asociaciones-catatumbo {
    margin-top: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1200px;
}

/* Título Principal */
.title-asociaciones {
    font-weight: 900;
    font-size: 40px;
    text-align: center;
    max-width: 90%;
}

/* Subtítulo */
.subtitle-asociaciones {
    font-weight: 700;
    font-size: 25px;
    color: #009E95;
    text-align: center;
    margin-top: -2px;
}

/*text-information*/
.text-information {
    width: 50%;
    text-align: center;
    margin-top: 5px;
}

.subtitle-asociaciones-text {
    font-weight: 600;
    font-size: 20px;
    text-align: center;
    line-height: 1.5;
}

.subtitle-asociaciones-text.red {
    color: #D6513E;
}

.subtitle-asociaciones-text.grey {
    color: #676B69;
}

/* Botones */
/* Contenedor de los botones */
.buttons-container-asociaciones {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 columnas en escritorio */
    gap: 28px;
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

/* Estilo del "Paso 1" y "Paso 2" */
.step {
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 0px;
    text-align: left;
    width: 100%;
}

/* Colores de los pasos */
.step.green {
    color: #009E95;
}

.step.red {
    color: #D6513E;
}

/* Botones */
.btnCatAsoc {
    font-weight: 600;
    cursor: pointer;
    border: none;
    text-align: center;
    transition: 0.3s;
    width: 100%;
    min-width: 250px;
    border-radius: 0;
    padding: 5px;
    height: 100px;
}

/* Descripción (Texto debajo del botón principal) */
.description {
    font-size: 16px;
}

.btnCatAsoc.description.red {
    background: transparent;
    border: 1px solid;
    color: #676B69;
    font-size: 16px;
}

.btnCatAsoc.description.green {
    background: transparent;
    border: 1px solid;
    color: #676B69;
    font-size: 16px;
}

/* Colores */
.btnCatAsoc.green {
    background: #009E95;
    color: white;
    padding: 15px;
}

.btnCatAsoc.red {
    background: #D6513E;
    color: white;
    padding: 15px;
}

.btnCatAsoc.red2 {
    background: #D6513E;
    color: white;
    padding: 7px;
}

/* Efecto hover */
.btnCatAsoc:hover {
    opacity: 0.8;
}

/* Contenedor del PDF */
.pdf-container-asociaciones-catatumbo {
    width: 100%;
    display: flex;
    justify-content: center;
}

.pdf-asociaciones-catatumbo {
    font-family: 'Nunito Sans', sans-serif;
    color: white;
    background: #566181;
    padding: 10px 30px;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    border: none;
    width: 50%;
    text-align: center;
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
}

.pdf-asociaciones-catatumbo img {
    width: 35px;
    height: 35px;
    margin-right: 20px;
}

/* MEDIA QUERIES PARA RESPONSIVE */
@media screen and (min-width: 1920px) {
    body, html {
        overflow-y: hidden; /* Evita el scroll vertical */
    }

    .general-asociaciones-catatumbo {
        min-height: 66vh;
        overflow: hidden;
    }

    .pdf {
        width: 30%;
    }
}

/* Tablets */
@media screen and (max-width: 1024px) {
    .title-asociaciones {
        font-size: 35px;
    }

    .subtitle-asociaciones {
        font-size: 22px;
    }

    .pdf-asociaciones-catatumbo {
        width: 30%;
    }
}

/* Móviles */
@media screen and (max-width: 768px) {
    .title-asociaciones {
        font-size: 36px;
    }

    .subtitle-asociaciones {
        font-size: 28px;
    }

    .text-information {
        width: 80%;
    }

    .step {
        width: 80%;
    }

    .buttons-container-asociaciones {
        grid-template-columns: 1fr; /* 1 columna en dispositivos móviles */
    }

    .btnCatAsoc.green {
        width: 80%;
    }

    .btnCatAsoc.red {
        width: 80%;
    }

    .btnCatAsoc.red2 {
        width: 80%;
    }

    .pdf-asociaciones-catatumbo {
        width: 86%;
        font-size: 16px;
    }
}

/* Teléfonos pequeños */
@media screen and (max-width: 480px) {
    .title-asociaciones {
        font-size: 36px;
    }

    .subtitle-asociaciones {
        font-size: 28px;
    }

    .pdf-asociaciones-catatumbo {
        width: 90%;
        font-size: 18px;
    }
}


</style>
