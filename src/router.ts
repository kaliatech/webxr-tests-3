import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory, RouterOptions } from 'vue-router'
import HomePage from './views/HomeView.vue'
import Test01View from './views/Test01View.vue'
import Test02View from './views/Test02View.vue'
import Test003Transitions from './views/Test003Transitions.vue'

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
    component: Test003Transitions,
  },
] as Array<RouteRecordRaw>

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
} as RouterOptions)

export default router
