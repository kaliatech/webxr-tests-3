<template>
  <main-layout>
    <div class="container">
      <div class="row">
        <div class="col">
          <h1>Future Tests (Maybe)</h1>
          <ul>
            <li>PBR Models and Scenes</li>
            <li>WebXR Layers - UI</li>
            <li>WebXR Media Layers</li>
            <li>WebXR Multiview</li>
            <li>Hands Tracking</li>
          </ul>
        </div>
      </div>
    </div>
  </main-layout>
</template>
<script setup lang="ts">
import MainLayout from './layouts/MainLayout.vue'
import { useTitle } from '@vueuse/core'

useTitle('Future Tests - WebXR | Kaliatech')

</script>
