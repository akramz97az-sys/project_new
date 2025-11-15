// frontend-ionic/src/router/index.ts

import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '@/views/TabsPage.vue';

const LoginPage = () => import('@/views/LoginPage.vue'); 
const RegisterPage = () => import('@/views/RegisterPage.vue');
const EditProfilePage = () => import('@/views/EditProfilePage.vue');

const isAuthenticated = (to: any, from: any, next: any) => {
  const token = localStorage.getItem('userToken'); 
  if (token) {
    next();
  } else {
    next('/login');
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },

  // Menerima ID pengguna yang akan diedit
  {
    path: '/edit-profile/:id',
    name: 'EditProfile',
    component: EditProfilePage
  },

  {
    path: '/tabs/',
    component: TabsPage,
    beforeEnter: isAuthenticated, 
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;