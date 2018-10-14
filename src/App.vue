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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: fixed;
  top: 0;
  left: 0;
  background: url('./assets/bg.jpg') no-repeat center;
  background-size: cover;
  width: 100%;
  height: 100%;

}
dd, dt {
  display: inline-block;
}
</style>
