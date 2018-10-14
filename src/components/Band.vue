<template>
<div class="container">
  <a href="/" style="border: solid;padding: 1.5rem">Back</a>

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