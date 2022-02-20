<template>
  <main-layout>
    <div class="container">
      <Scene002Interact />
    </div>
  </main-layout>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'

import MainLayout from './layouts/MainLayout.vue'
import Scene002Interact from '../components/Scene002Interact.vue'

import * as Core from '@babylonjs/core'

import '@babylonjs/core/Materials/Textures/Loaders'

onMounted(() => {
  window.BABYLON = { ...Core }
})
</script>
