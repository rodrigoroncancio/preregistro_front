<template>
  <div class="container">
    <div class="convocatorias-banner">
        <h2>Bienvenidos, sistema de convocatorias del DSCI</h2>
    </div>
    <h1>Convocatorias abiertas</h1>
    <button class="button">Convocatoria Argelia</button>
    <button class="button">Convocatoria Catatumbo</button>
</div>
</template>

<script lang="ts" setup>

</script>

<style scoped>

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.convocatorias-banner {
    width: 100%;
    max-width: 600px;
    padding: 20px;
    border-radius: 12px;
    background: linear-gradient(135deg, #FDB235, #FFA500);
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.2);
}

h1 {
    font-size: 2rem;
    color: #333;
    margin-top: 10px;
}

.button {
    width: 100%;
    max-width: 400px;
    padding: 15px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, rgb(194, 222, 53), rgb(150, 180, 40));
    color: black;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.2);
}

.button:hover {
    background: linear-gradient(135deg, rgb(150, 180, 40), rgb(194, 222, 53));
}
</style>