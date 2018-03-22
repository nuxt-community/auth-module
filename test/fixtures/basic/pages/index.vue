<template>
  <div>
    {{ $auth.$state.loggedIn ? 'Logged In' : 'Guest' }}
  </div>
</template>
