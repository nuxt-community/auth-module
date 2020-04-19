<template>
  <div>
    <b-alert show variant="info">
      You have been signed out!
    </b-alert>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  options: {
    auth: false
  }
}
</script>
