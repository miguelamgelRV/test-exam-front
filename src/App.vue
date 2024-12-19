<template>
  <div id="app">
    <!-- <nav>
      <router-link to="/">Login</router-link> |
      <router-link to="/home">Home</router-link>
    </nav> -->

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
nav {
  margin-bottom: 20px;
}
</style>
