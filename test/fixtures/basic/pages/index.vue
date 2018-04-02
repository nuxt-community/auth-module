<template>
  <div>
    <pre v-if="$auth.loggedIn" v-html="$auth.user"></pre>
    <div v-else>Please login</div>
  </div>
</template>
