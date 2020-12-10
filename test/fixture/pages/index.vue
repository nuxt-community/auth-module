<template>
  <div>
    <pre v-if="$auth.loggedIn" v-text="$auth.user" />
    <div v-else>Please login</div>
  </div>
</template>
