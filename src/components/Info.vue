<template>
<div>
  <dl v-for="infoItem in Object.keys(bandInfo)" :key="infoItem">
    <dd>{{ infoItem | capitalize }}</dd>
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
        room: this.$store.state.connectedRoom,
        user: this.$store.state.user,
      };
    },
  },
  filters: {
    capitalize(value) {
      if (!value) return false;
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
};
</script>