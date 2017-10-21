<template>
  <form>
    <label for="username">Username</label>
    <input name="username" type="text" v-model="username" />
    
    <br />

    <label for="join-band">Join</label>
    <input type="radio" value="join" v-model="bandOption" />

    <label for="create-band">Create</label>
    <input type="radio" value="create" v-model="bandOption" />

    <br />
  
    <div v-if="bandOption === 'join'">
      <label for="join-band">Join Band</label>
      <select name="join-band">
        <option value="null">No Bands Available</option>
      </select>
    </div>

    <br />
    
    <div v-if="bandOption === 'create'">
      <label for="create-band">Create Band:</label>
      <input type="text" v-model="band" disabled />
    </div>
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
        bandOption: '',
        username: '',
      };
    },
  };
</script>