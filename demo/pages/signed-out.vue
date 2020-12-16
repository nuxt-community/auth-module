<template>
  <div>
    <b-alert show variant="info"> You have been signed out! </b-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  middleware: ['auth'],
  auth: false
})
</script>
