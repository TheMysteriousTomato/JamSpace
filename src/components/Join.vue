<template>
  <form @submit.prevent="registerUser">
    <span>Band:</span>
    <input type="radio" value="join" v-model="select" />
    <label for="join-band">Join</label>

    <input type="radio" value="create" v-model="select" />
    <label for="create-band">Create</label>

    <br />

    <label for="username">Username</label>
    <input name="username" type="text" v-model="username" />
    
    <br />
  
    <div v-if="select === 'join'">
      <label for="join-band">Join Band</label>
      <select name="join-band" v-model="band">
        <option value="null">No Bands Available</option>
      </select>
    </div>
    
    <div v-if="select === 'create'">
      <label for="create-band">Create Band:</label>
      <input type="text" v-model="band" />
    </div>

    <br />

    <label for="instrument">Instrument</label>
    <select name="instrument" v-model="instrument">
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
        bands: [],
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