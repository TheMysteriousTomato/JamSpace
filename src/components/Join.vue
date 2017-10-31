<template>
  <form @submit.prevent="registerUser">
    <span>Band:</span>
    <label for="join-band">Join</label>
    <input id="join-band" type="radio" name="join-or-create" v-model="select" value="join"/>

    <label for="create-band">Create</label>
    <input id="create-band" type="radio" name="join-or-create" v-model="select" value="create"/>

    <br />

    <label for="username">Username</label>
    <input id="username" name="username" type="text" v-model="username" />

    <br />
  
    <div v-if="select === 'join'">
      <label for="join-band-list">Join Band</label>
      <select id="join-band-list" name="join-band" v-model="joinBand">
        <option v-if="bands.length === 0" value="null" disabled>No Bands Available</option>
        <option v-if="bands.length !== 0" value="null" disabled>No Band Selected</option>
        <option v-for="band in bands">{{ band.name }}</option>
      </select>
    </div>

    <div v-if="select === 'create'">
      <label for="create-band-input">Create Band:</label>
      <input id="create-band-input" type="text" v-model="band" />
    </div>

    <br />

    <label for="instruments">Instrument</label>
    <select id="instruments" name="instrument" v-model="instrument">
      <option value="null" disabled>No Instrument Selected</option>
      <option v-for="instrument in instruments" :key="instrument" :value="instrument">
        {{ instrument }}
      </option>
    </select>
    
    <br />
    
    <input type="submit" value="Join" />
  </form>
</template>

<script>
  export default {
    data() {
      return {
        band: '',
        joinBand: 'null',
        bands: this.$store.state.bands,
        select: '',
        instrument: 'null',
        instruments: [
          'guitar',
          'drum',
          'other',
        ],
        username: '',
      };
    },
    methods: {
      registerUser() {
        const user = {
          bandName: this.band,
          instrument: this.instrument,
          username: this.username,
        };

        this.$store.dispatch('registerUser', {
          user,
          $socket: this.$socket,
          $router: this.$router,
        });
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.select = this.bands.length === 0 ? 'create' : 'join';
      });
    },
    computed: {
      bandsToJoin() {
        return this.bands.length === 0 ? 'create' : 'join';
      },
    },
  };
</script>