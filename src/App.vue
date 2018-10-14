<template>
  <div id="app">
    <h1>Jam Space</h1>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
  @import './css/app.css';

  #app {
    background: url('./assets/bg.jpg') no-repeat center;
    background-size: cover;
    width: 100%;
    height: 100%;
  }
  dd, dt {
    display: inline-block;
  }
</style>
