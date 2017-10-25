import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
  },
});
