<template>
  <div>
    <b-alert show variant="success">You should see this page without need to authentication!</b-alert>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({
  middleware: ['auth'],
  auth: false
})
export default class Public extends Vue {
  // Do whatever you want in this class.
}
</script>
