<template>
  <div>
    <pre v-if="$auth.check" v-html="$auth.user"></pre>
    <div v-else>Please login</div>
  </div>
</template>
