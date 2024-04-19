import VueRouter from 'vue-router';

import Navigation from "./components/Navigation";
import Login from "./components/pages/login/Login";
import NotFound from "./components/pages/NotFound";
import Users from "./components/pages/Users";
import UsersManager from "./components/pages/UsersManager";
import SignUpPage from "./components/pages/login/SignUpPage";

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/signup',
      component: SignUpPage,
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
          component: Users,
        },
        {
          path: 'users2',
          component: UsersManager,
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
