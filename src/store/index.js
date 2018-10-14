import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bandName: null,
    instrument: null,
    user: null,
    storeBands: [],
  },
  getters: {
    isConnected: state => (state.bandName !== null && state.user !== null),
  },
  mutations: {
    register: (state, payload) => {
      state.bandName = payload.bandname;
      state.instrument = payload.instrument;
      state.user = payload.user;
    },
    addBand: (state, payload) => {
      const band = payload.band;
      if (band && state.storeBands.indexOf(band) === -1) {
        state.storeBands.push(band);
      }
    },
  },
  actions: {
    registerUser({ commit }, payload) {
      const user = payload.user;
      const $socket = payload.$socket;
      const $router = payload.$router;

      const band = user.bandname;
      commit('addBand', { band });
      if (user && $socket) {
        $socket.emit('new user', user, (success) => {
          if (success) {
            commit('register', { user: user.username, bandname: user.bandName, instrument: user.instrument });
            $router.replace({ path: '/band' });
          }
        });
      }
    },
  },
});
