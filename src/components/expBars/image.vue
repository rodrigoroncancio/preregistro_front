<template>
  <Teleport to="body">
    <div
      class="image"
      :style="{ backgroundImage: `url(${image})` }"
    >&nbsp;</div>
  </Teleport>
</template>

<script setup lang="ts">

  defineProps<{
    image: string;
  }>();

</script>

<style scoped>
div.image {
  background-position: bottom;
  background-repeat: repeat-x;
  background-size: contain;
  z-index: 0;
  position: fixed;
  bottom: 65px;
  width: 100%;
  height: 150px;
}
</style>