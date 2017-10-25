import Vue from 'vue';
import Router from 'vue-router';

import store from '@/store';

import Join from '@/components/Join';
import Band from '@/components/Band';

Vue.use(Router);

const isConnected = store.getters.isConnected;

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Join',
      component: Join,
      beforeEnter: (to, from, next) => {
        const fromPath = from.path;
        if (!isConnected && fromPath !== '/') {
          next({
            path: '/',
          });
        }

        next();
      },
    },
    {
      path: '/band',
      name: 'Band',
      component: Band,
    },
  ],
});
