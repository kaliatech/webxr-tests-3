<template>
  <main-layout>
    <div class="container">
      <div class="row">
        <div class="col">
          <h1>Future Experiments (Maybe)</h1>
          <ul>
            <li>Physics</li>
            <li>Near Interactables (grabbables)</li>
            <li>Tree Maker (UI pedestal controls)</li>
            <li>Particle Systems</li>
            <li>Dynamic Coloring </li>
            <li><a href="https://mugen87.github.io/yuka/">Yuka</a> Integrations</li>
            <li>Hand Joints and Grabbing (similar to <a href="https://assetstore.unity.com/packages/tools/physics/auto-hand-vr-physics-interaction-165323">Auto Hand</a>)</li>
            <li><a href="https://readyplayer.me/">Ready Player Me Integration</a></li>
          </ul>
        </div>
      </div>
    </div>
  </main-layout>
</template>
<script setup lang="ts">
import MainLayout from './layouts/MainLayout.vue'
import { useTitle } from '@vueuse/core'
useTitle('Future Experiments - WebXR | Kaliatech')
</script>
