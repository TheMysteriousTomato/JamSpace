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
    register: (state, { bandName, instrument, user }) => {
      state.bandName = bandName;
      state.instrument = instrument;
      state.user = user;
    },
  },
  actions: {
    registerUser({ commit }, { $socket, $router, user }) {
      if (user && $socket) {
        $socket.emit('new user', user, (success) => {
          if (success) {
            commit('register', {
              user: user.username,
              bandName: user.bandName,
              instrument: user.instrument,
            });
            $router.replace({ path: '/band' });
          }
        });
      }
    },
  },
});
