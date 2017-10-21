import Vue from 'vue';
import Router from 'vue-router';
import Join from '@/components/Join';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Join',
      component: Join,
    },
  ],
});
