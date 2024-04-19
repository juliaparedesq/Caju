import VueRouter from 'vue-router';

import Navigation from "./components/Navigation";
import Login from "./components/pages/login/Login";
import NotFound from "./components/pages/NotFound";
import UsersManager from "./components/pages/UsersManager";
import EquipmentList from "./components/pages/EquipmentList";
import Equipment from "./components/pages/Equipment";
import Providers from "./components/pages/Providers";
import Agreements from "./components/pages/Agreements";
import Indicators from "./components/pages/Indicators";


const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/app/',
      component: Navigation,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'users',
          component: UsersManager,
        },
        {
          path: 'equipments',
          component: EquipmentList,
        },
        {
          path: 'providers',
          component: Providers,
        },
        {
          path: 'equipment/:id',
          component: Equipment,
        },
        {
          path: 'agreements',
          component: Agreements,
        },
        {
          path: 'indicators',
          component: Indicators,
        },
        {
          path: '*',
          component: NotFound,
        },

      ]
    },
    {
      path: '*',
      component: Login,
    },
  ]
});

export default router;
