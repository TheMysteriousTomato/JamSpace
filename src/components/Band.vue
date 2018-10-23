<template>
<div class="container">
  <a class="my-button" href="/">&larr;&nbsp;Back</a>

  <br />

  <band-info></band-info>
</div>
</template>

<script>
import BandInfo from './Info';

export default {
  components: {
    BandInfo,
  },
};
</script>
<style>
  .my-button {
    padding: 1.5rem;
    position: fixed;
    top: 0;
    left: 0;

    text-decoration: none;
    color: black;
    border: solid black;
    background: white;
  }
  .my-button:hover {
    color: white;
    background: black;
  }
</style>