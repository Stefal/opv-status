<template>
  <div id="app">
    <router-link to="/">List </router-link><router-link to="/spark">Spark </router-link><router-link to="/import">Import</router-link>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
