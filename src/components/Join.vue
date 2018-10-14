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
        <option v-for="band in bands" :value="band">{{ band }} {{ bandsMap.get(band) }}</option>
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
        joinBand: null,
        bands: [], // for drop down
        bandsMap: new Map(), // for keeping track # ppl in room
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
          bandname: this.joinBand || this.band,
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
      if (this.bands !== undefined) {
        this.$nextTick(() => {
          this.select = this.bands.length === 0 ? 'create' : 'join';
        });
      }
    },
    sockets: {
      // eslint-disable-next-line
      'get bands': function (bandObj) { // arrow func has incorrect 'this' reference
        bandObj = JSON.parse(bandObj);

        // eslint-disable-next-line
        console.log(bandObj);

        bandObj[1].forEach((bandname, index) => {
          // eslint-disable-next-line
          console.log(bandname, index);
          this.bandsMap.set(bandname, bandObj[0][index]);
        });

        // add bandnames to list for drop down
        this.bands = bandObj[1];
        // update select model for default action on load
        this.select = this.bands.length === 0 ? 'create' : 'join';
      },
    },
  };
</script>