<template>
  <form>
    <label for="username">Username</label>
    <input name="username" type="text">
    
    <br />

    <label for="join-band">Join</label>
    <input type="radio" name="join-band" />

    <label for="create-band">Create</label>
    <input type="radio" name="create-band" />

    <br />

    <label for="join-band">Join Band</label>
    <select name="join-band">
      <option value="null">No Bands Available</option>
    </select>

    <br />

    <label for="create-band">Create Band:</label>
    <input type="text" disabled />

    <br />

    <input type="submit" value="Join" />
  </form>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        band: '',
      };
    },
  };
</script>