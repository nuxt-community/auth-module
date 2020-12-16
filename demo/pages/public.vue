<template>
  <div>
    <b-alert show variant="success">
      You should see this page without need to authentication!
    </b-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  middleware: ['auth'],
  auth: false
})
</script>
