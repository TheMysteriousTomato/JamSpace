<template>
<div>
  <dl v-for="infoItem in Object.keys(bandInfo)" :key="infoItem">
    <dd style="text-transform: capitalize">{{ infoItem }}:</dd>
    <dt>{{ bandInfo[infoItem] }}</dt>
  </dl>
</div>
</template>

<script>
export default {
  computed: {
    bandInfo() {
      return {
        name: this.$store.state.bandName,
        instrument: this.$store.state.instrument,
        user: this.$store.state.user,
      };
    },
  },
};
</script>