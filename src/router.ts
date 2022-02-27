import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory, RouterOptions } from 'vue-router'
import HomePage from './views/HomeView.vue'

// https://router.vuejs.org/guide/advanced/lazy-loading.html

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/test1',
    name: 'Test1',
    component:() => import('./views/Test01View-Simple.vue'),
  },
  {
    path: '/test2',
    name: 'Test2',
    component: () => import('./views/Test02View-Interactions.vue'),
  },
  {
    path: '/test3',
    name: 'Test3',
    component:  () => import('./views/Test03View-Transitions.vue'),
  },
  {
    path: '/test4',
    name: 'Test4',
    component: () => import('./views/Test04View-Video.vue'),
  },
  {
    path: '/links',
    name: 'Links',
    component: () => import('./views/LinksView.vue'),
  },
] as Array<RouteRecordRaw>

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
} as RouterOptions)

export default router
