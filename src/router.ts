import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory, RouterOptions } from 'vue-router'
import HomePage from './views/HomeView.vue'
import Test01View from './views/Test01View-Simple.vue'
import Test02View from './views/Test02View-Interactions.vue'
import Test03View from './views/Test03View-Transitions.vue'
import Test04View from './views/Test04View-Video.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/test1',
    name: 'Test1',
    component: Test01View,
  },
  {
    path: '/test2',
    name: 'Test2',
    component: Test02View,
  },
  {
    path: '/test3',
    name: 'Test3',
    component: Test03View,
  },
  {
    path: '/test4',
    name: 'Test4',
    component: Test04View,
  },
] as Array<RouteRecordRaw>

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
} as RouterOptions)

export default router
