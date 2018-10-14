<template>
<div class="container">
  <a href="/" style="border: solid;padding: 1.5rem">Back</a>
  <h1 class="title">Jam Space</h1>
  
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