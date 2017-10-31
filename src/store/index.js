import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bands: [],
    bandCount: 0,
    bandName: null,
    instrument: null,
    user: null,
  },
  getters: {
    isConnected: state => (state.bandName !== null && state.user !== null),
  },
  mutations: {
    register: (state, payload) => {
      state.bandName = payload.bandName;
      state.instrument = payload.instrument;
      state.user = payload.user;
    },
    addBand: (state, payload) => {
      const band = payload.band;
      if (state.bands.indexOf(band) === -1) {
        state.bands.push(band);
      }
    },
    updateBandCount: (state, payload) => {
      const count = payload.count;
      if (count > 0) {
        state.bandCount = count;
      }
    },
  },
  actions: {
    registerUser({ commit }, payload) {
      const user = payload.user;
      const $socket = payload.$socket;
      const $router = payload.$router;

      if (user && $socket) {
        $socket.emit('new user', user, (success) => {
          if (success) {
            commit('register', { user: user.username, bandName: user.bandName, instrument: user.instrument });
            $router.replace({ path: '/band' });
          }
        });
      }
    },
    updateBands({ commit }, payload) {
      const count = payload.band.count;
      const bands = payload.band.bands;

      bands.forEach(band => (commit('addBand', { band })));
      commit('updateBandCount', { count });
    },
  },
});
