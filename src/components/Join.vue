<template>
  <form @submit.prevent="registerUser">
    <span>Band:</span>
    <label for="join-band">Join</label>
    <input id="join-band" type="radio" value="join" v-model="select" />

    <label for="create-band">Create</label>
    <input id="create-band" type="radio" value="create" v-model="select" />

    <br />

    <label for="username">Username</label>
    <input id="username" name="username" type="text" v-model="username" />

    <br />
  
    <div v-if="select === 'join'">
      <label for="join-band-list">Join Band</label>
      <select id="join-band-list" name="join-band">
        <option v-if="bands.length === 0" value="null" :selected="bands.length === 0">No Bands Available</option>
        <option v-if="bands.length !== 0" v-for="(band, index) in bands" :selected="index === 0" >{{ band.name }}</option>
      </select>
    </div>

    <div v-if="select === 'create'">
      <label for="create-band-input">Create Band:</label>
      <input id="create-band-input" type="text" v-model="band" />
    </div>

    <br />

    <label for="instruments">Instrument</label>
    <select id="instruments" name="instrument" v-model="instrument">
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
        bands: this.$store.state.bands,
        select: '',
        instrument: '',
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
  };
</script>