<template>
<div class="overlay" v-if="$auth.$state.busy">
  <img src="~/assets/loading.svg" alt="Loading..." />
</div>
</template>

<style scoped>
.overlay {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.5);
  color: grey;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
