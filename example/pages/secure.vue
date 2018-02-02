<template>
  <div>
    <b-alert show>This is a secure page!</b-alert>
    <br>
    <b-btn variant="info" to="/profile">Profile</b-btn>
  </div>
</template>

<script>
export default {
  middleware: ['auth']
}
</script>
