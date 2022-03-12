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
    component: () => import('./views/Test01View-Simple.vue'),
  },
  {
    path: '/test2',
    name: 'Test2',
    component: () => import('./views/Test02View-PickingAndHighlights.vue'),
  },
  {
    path: '/test3',
    name: 'Test3',
    component: () => import('./views/Test03View-Transitions.vue'),
  },
  {
    path: '/test4',
    name: 'Test4',
    component: () => import('./views/Test04View-Video.vue'),
  },
  {
    path: '/test5',
    name: 'Test5',
    component: () => import('./views/Test05View-MenusAndUiPanels.vue'),
  },
  {
    path: '/test6',
    name: 'Test6',
    component: () => import('./views/Test06View-Pbr.vue'),
  },
  {
    path: '/tests-future',
    name: 'TestsFuture',
    component: () => import('./views/TestFutureView.vue'),
  },
  {
    path: '/experiment1',
    name: 'Experiment01Trees',
    component: () => import('./views/Experiment01View-Trees.vue'),
  },
  {
    path: '/experiments-future',
    name: 'ExperimentsFuture',
    component: () => import('./views/ExperimentFutureView.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('./views/AboutView.vue'),
  },
] as Array<RouteRecordRaw>

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
} as RouterOptions)

export default router
